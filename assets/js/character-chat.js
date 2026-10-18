/* Reusable character chat. One [data-character-chat] panel per character.
   data-character, data-endpoint, data-health-endpoint configure it.
   History stays in memory for the page lifetime. No storage and no system prompt.
   The include loads this file; slideshow setup in main.js is untouched. */
(function () {
  "use strict";

  if (window.CharacterChat && window.CharacterChat._booted) {
    return;
  }

  var HEALTH_TIMEOUT_MS = 5000;
  /* Cold start can take about 12s and a full reply about 9s.
     Stay well above 30s so a slow first answer is not cut off. */
  var CHAT_TIMEOUT_MS = 60000;
  var HISTORY_LIMIT = 8;
  var TEXT_LIMIT = 500;

  function boot() {
    var panels = document.querySelectorAll("[data-character-chat]");
    Array.prototype.forEach.call(panels, bindPanel);
  }

  function bindPanel(root) {
    if (!root || root.getAttribute("data-chat-bound") === "true") {
      return;
    }
    if (!window.fetch || !window.AbortController || !window.TextDecoder) {
      return;
    }

    var character = root.getAttribute("data-character") || "";
    var endpoint = root.getAttribute("data-endpoint") || "";
    var healthUrl = root.getAttribute("data-health-endpoint") || "";
    if (!character || !endpoint || !healthUrl) {
      return;
    }

    var toggle = root.querySelector("[data-chat-toggle]");
    var panel = root.querySelector("[data-chat-panel]");
    var form = root.querySelector("[data-chat-form]");
    var input = root.querySelector("[data-chat-input]");
    var sendBtn = root.querySelector("[data-chat-send]");
    var log = root.querySelector("[data-chat-log]");
    var status = root.querySelector("[data-chat-status]");
    var announce = root.querySelector("[data-chat-announce]");
    var thinking = root.querySelector("[data-chat-thinking]");
    var thinkingLabel = root.querySelector("[data-chat-thinking-label]");
    var countEl = root.querySelector("[data-chat-count]");
    var emptyHint = root.querySelector("[data-chat-empty]");
    if (!toggle || !panel || !form || !input || !sendBtn || !log || !status || !announce) {
      return;
    }

    root.setAttribute("data-chat-bound", "true");

    var history = [];
    var streaming = false;
    var momentMessage = character + " needs a moment, try again shortly";
    var busyMessage = character + " is talking to someone else, try again in a few seconds";
    var badMessage = character + " couldn't read that. Try a shorter note.";
    var genericMessage = "Something went wrong talking to " + character + ". Please try again.";
    var interruptedMessage = "That reply was cut off. Please try again.";
    var emptyReplyMessage = character + " didn't say anything. Please try again.";
    var thinkingMessage = character + " is thinking\u2026";

    function setStatus(message, isError) {
      status.textContent = message || "";
      status.className = isError ? "character-chat-status is-error" : "character-chat-status";
    }

    function showThinking() {
      if (!thinking) {
        return;
      }
      thinking.hidden = false;
      if (thinkingLabel) {
        thinkingLabel.textContent = thinkingMessage;
      }
    }

    function hideThinking() {
      if (thinking) {
        thinking.hidden = true;
      }
    }

    function updateSend() {
      var blank = input.value.replace(/\s/g, "") === "";
      sendBtn.disabled = streaming || blank;
      if (countEl) {
        countEl.textContent = String(input.value.length) + "/" + String(TEXT_LIMIT);
      }
    }

    function appendTurn(role, text) {
      if (emptyHint && emptyHint.parentNode) {
        emptyHint.parentNode.removeChild(emptyHint);
        emptyHint = null;
      }
      var turn = document.createElement("div");
      turn.className = "character-chat-turn character-chat-turn-" + (role === "user" ? "user" : "assistant");
      var who = document.createElement("span");
      who.className = "character-chat-who";
      who.textContent = role === "user" ? "You" : character;
      var body = document.createElement("p");
      body.className = "character-chat-text";
      body.textContent = text;
      turn.appendChild(who);
      turn.appendChild(body);
      log.appendChild(turn);
      log.scrollTop = log.scrollHeight;
      return body;
    }

    function removeTurn(body) {
      if (!body || !body.parentNode || !body.parentNode.parentNode) {
        return;
      }
      body.parentNode.parentNode.removeChild(body.parentNode);
    }

    function outgoingMessages() {
      var recent = history.slice(-HISTORY_LIMIT);
      var payload = [];
      var i;
      for (i = 0; i < recent.length; i++) {
        var msg = recent[i];
        if (!msg || (msg.role !== "user" && msg.role !== "assistant")) {
          continue;
        }
        payload.push({
          role: msg.role,
          content: String(msg.content || "").slice(0, TEXT_LIMIT)
        });
      }
      return payload;
    }

    function checkHealth() {
      var timedOut = false;
      var controller = new AbortController();
      var timer = setTimeout(function () {
        timedOut = true;
        controller.abort();
      }, HEALTH_TIMEOUT_MS);

      fetch(healthUrl, {
        method: "GET",
        cache: "no-store",
        credentials: "omit",
        mode: "cors",
        headers: { "Accept": "application/json" },
        signal: controller.signal
      }).then(function (response) {
        clearTimeout(timer);
        if (timedOut || !response.ok) {
          return false;
        }
        return response.json().then(function (data) {
          return !!(data && data.ok === true);
        }, function () {
          return false;
        });
      }, function () {
        clearTimeout(timer);
        return false;
      }).then(function (ok) {
        if (ok) {
          root.hidden = false;
        }
      }, function () {
        /* Health failures stay hidden and quiet. */
      });
    }

      function sendMessage() {
      var assistantBody = null;
      var assistantText = "";
      var streamFailed = false;
      var settled = false;
      var controller = new AbortController();
      var timer = setTimeout(function () {
        controller.abort();
      }, CHAT_TIMEOUT_MS);

      streaming = true;
      root.setAttribute("aria-busy", "true");
      setStatus("", false);
      showThinking();
      updateSend();

      function settle() {
        if (settled) {
          return false;
        }
        settled = true;
        clearTimeout(timer);
        hideThinking();
        streaming = false;
        root.setAttribute("aria-busy", "false");
        updateSend();
        return true;
      }

      function keepPartial() {
        var textKept = assistantText.replace(/\s+$/g, "");
        if (textKept && assistantBody) {
          assistantBody.textContent = textKept;
          history.push({ role: "assistant", content: textKept });
          announce.textContent = character + " said: " + textKept;
          log.scrollTop = log.scrollHeight;
          return textKept;
        }
        removeTurn(assistantBody);
        assistantBody = null;
        return "";
      }

      function finishOk() {
        if (!settle()) {
          return;
        }
        var textKept = assistantText.replace(/\s+$/g, "");
        if (textKept && assistantBody) {
          assistantBody.textContent = textKept;
          history.push({ role: "assistant", content: textKept });
          announce.textContent = character + " said: " + textKept;
          log.scrollTop = log.scrollHeight;
          return;
        }
        removeTurn(assistantBody);
        setStatus(emptyReplyMessage, false);
      }

      function finishInterrupted() {
        if (!settle()) {
          return;
        }
        keepPartial();
        setStatus(interruptedMessage, true);
      }

      function finishNetwork() {
        if (!settle()) {
          return;
        }
        keepPartial();
        setStatus(momentMessage, true);
      }

      function finishHttp(code) {
        if (!settle()) {
          return;
        }
        removeTurn(assistantBody);
        if (code === 429) {
          setStatus(momentMessage, true);
        } else if (code === 503) {
          setStatus(busyMessage, true);
        } else if (code === 400) {
          setStatus(badMessage, true);
        } else {
          setStatus(genericMessage, true);
        }
      }

      function addPiece(piece) {
        hideThinking();
        if (!assistantBody) {
          assistantBody = appendTurn("assistant", piece);
          assistantText = piece;
        } else {
          assistantText += piece;
          assistantBody.textContent = assistantText;
        }
        log.scrollTop = log.scrollHeight;
      }

      function processLine(line) {
        var trimmed = line.replace(/^\s+|\s+$/g, "");
        if (!trimmed || trimmed.charAt(0) === ":") {
          return false;
        }
        if (trimmed.indexOf("data:") !== 0) {
          return false;
        }
        var payload = trimmed.slice(5).replace(/^\s+|\s+$/g, "");
        if (payload === "[DONE]") {
          return true;
        }
        var json;
        try {
          json = JSON.parse(payload);
        } catch (err) {
          return false;
        }
        if (!json || typeof json !== "object") {
          return false;
        }
        /* Mid-stream failure: data: {"error":"..."} then [DONE]. */
        if (Object.prototype.hasOwnProperty.call(json, "error") && json.error) {
          streamFailed = true;
          return false;
        }
        if (streamFailed) {
          return false;
        }
        var choices = json.choices;
        var delta = choices && choices[0] && choices[0].delta;
        if (!delta) {
          return false;
        }
        var piece = delta.content;
        /* The first chunk is often {"role":"assistant","content":""}. Ignore it.
           A normal length cap ends with "..." and is ordinary text, not an error. */
        if (typeof piece !== "string" || piece === "") {
          return false;
        }
        addPiece(piece);
        return false;
      }

      function readSse(response) {
        if (!response.body || !response.body.getReader) {
          finishHttp(0);
          return Promise.resolve();
        }
        var reader = response.body.getReader();
        var decoder = new TextDecoder();
        var buffer = "";

        function pump() {
          return reader.read().then(function (result) {
            var lines;
            var i;
            var stop = false;
            if (result.done) {
              buffer += decoder.decode();
              if (buffer) {
                processLine(buffer);
              }
              /* [DONE] is a normal end. "..." from a length cap is ordinary
                 text. Only an {"error": ...} payload marks a broken reply. */
              if (streamFailed) {
                finishInterrupted();
              } else {
                finishOk();
              }
              return;
            }
            buffer += decoder.decode(result.value, { stream: true });
            lines = buffer.split(/\r?\n/);
            buffer = lines.pop();
            for (i = 0; i < lines.length; i++) {
              if (processLine(lines[i])) {
                stop = true;
                break;
              }
            }
            if (stop) {
              if (reader.cancel) {
                reader.cancel().then(function () {}, function () {});
              }
              if (streamFailed) {
                finishInterrupted();
              } else {
                finishOk();
              }
              return;
            }
            return pump();
          });
        }

        return pump().then(function () {}, function () {
          finishNetwork();
        });
      }

      function discard(response) {
        if (response.body && response.body.cancel) {
          return response.body.cancel().then(function () {}, function () {});
        }
        return Promise.resolve();
      }

      fetch(endpoint, {
        method: "POST",
        cache: "no-store",
        credentials: "omit",
        mode: "cors",
        headers: {
          "Accept": "text/event-stream",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: outgoingMessages() }),
        signal: controller.signal
      }).then(function (response) {
        if (!response.ok) {
          return discard(response).then(function () {
            finishHttp(response.status);
          });
        }
        return readSse(response);
      }).then(function () {}, function () {
        /* CORS-hidden 429s and other network failures reject here. */
        finishNetwork();
      });
    }

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      if (open) {
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        return;
      }
      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      input.focus();
    });

    input.addEventListener("input", updateSend);

    input.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" || event.shiftKey || event.isComposing) {
        return;
      }
      event.preventDefault();
      if (!sendBtn.disabled) {
        if (typeof form.requestSubmit === "function") {
          form.requestSubmit();
        } else {
          form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (streaming) {
        return;
      }
      var text = input.value.slice(0, TEXT_LIMIT).replace(/^\s+|\s+$/g, "");
      if (!text) {
        updateSend();
        return;
      }
      input.value = "";
      history.push({ role: "user", content: text });
      appendTurn("user", text);
      updateSend();
      sendMessage();
    });

    if (thinkingLabel) {
      thinkingLabel.textContent = thinkingMessage;
    }
    updateSend();
    checkHealth();
  }

  window.CharacterChat = { init: boot, _booted: true };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
