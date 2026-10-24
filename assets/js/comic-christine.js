/* Christine slideshow soundtrack. This file is loaded only from the
   Christine modal include. It does not touch the other strips or main.js.
   The loop starts only after the toggle is pressed. Scene 6 plays the
   cliffhanger sting once per visit while the soundtrack is on, then the
   loop continues. Closing the modal, or hiding this strip, stops playback. */
(function () {
  var root = document.querySelector("[data-comic-book='christine'] .cn-strip");
  if (!root || root.getAttribute("data-cn-sound") === "ready") {
    return;
  }
  root.setAttribute("data-cn-sound", "ready");

  var loop = root.querySelector(".cn-loop");
  var sting = root.querySelector(".cn-sting");
  var button = root.querySelector(".cn-sound-toggle");
  var slides = root.querySelectorAll(".mySlides");
  var book = root.closest("[data-comic-book]");
  var modal = document.getElementById("comicModal");
  var on = false;
  var stingPlayed = false;

  if (!loop || !button) {
    return;
  }

  function paint() {
    button.setAttribute("aria-pressed", on ? "true" : "false");
    button.textContent = on ? "Soundtrack on" : "Soundtrack off";
  }

  function halt(audio, reset) {
    if (!audio) {
      return;
    }
    audio.pause();
    if (reset) {
      try {
        audio.currentTime = 0;
      } catch (err) {
        /* not seekable yet */
      }
    }
  }

  function stripVisible() {
    if (book && book.hidden) {
      return false;
    }
    if (modal && !modal.classList.contains("is-open")) {
      return false;
    }
    return true;
  }

  function currentScene() {
    var i;
    for (i = 0; i < slides.length; i++) {
      if (slides[i].style.display === "block") {
        return slides[i].getAttribute("data-scene");
      }
    }
    return "";
  }

  function stingActive() {
    return !!(sting && !sting.paused && !sting.ended);
  }

  function playLoop() {
    if (!on || !stripVisible() || stingActive()) {
      return;
    }
    var pending = loop.play();
    if (pending && pending.catch) {
      pending.catch(function () {});
    }
  }

  function maybeSting() {
    if (!on || currentScene() !== "6" || stingPlayed) {
      return;
    }
    if (!sting) {
      playLoop();
      return;
    }
    stingPlayed = true;
    halt(loop, false);
    try {
      sting.currentTime = 0;
    } catch (err) {
      /* not seekable yet */
    }
    var pending = sting.play();
    if (pending && pending.then) {
      pending.then(function () {}).catch(function () {
        stingPlayed = false;
        if (on && stripVisible()) {
          playLoop();
        }
      });
    }
  }

  function silence() {
    on = false;
    stingPlayed = false;
    paint();
    halt(loop, true);
    halt(sting, true);
  }

  function onSlidesMutated() {
    var scene = currentScene();
    if (!scene) {
      return;
    }
    if (scene === "6") {
      if (on) {
        maybeSting();
      }
      return;
    }
    if (stingPlayed || stingActive()) {
      halt(sting, true);
      stingPlayed = false;
      if (on) {
        playLoop();
      }
    }
  }

  button.addEventListener("click", function () {
    if (!stripVisible()) {
      return;
    }
    on = !on;
    paint();
    if (!on) {
      halt(loop, false);
      halt(sting, true);
      return;
    }
    if (currentScene() === "6" && !stingPlayed) {
      maybeSting();
      return;
    }
    playLoop();
  });

  if (sting) {
    sting.addEventListener("ended", function () {
      if (on && stripVisible()) {
        playLoop();
      }
    });
  }

  if (slides.length && window.MutationObserver) {
    var slideObserver = new MutationObserver(onSlidesMutated);
    Array.prototype.forEach.call(slides, function (slide) {
      slideObserver.observe(slide, { attributes: true, attributeFilter: ["style"] });
    });
  }

  if (modal && window.MutationObserver) {
    new MutationObserver(function () {
      if (!stripVisible() && (on || (loop && !loop.paused) || stingActive())) {
        silence();
      }
    }).observe(modal, { attributes: true, attributeFilter: ["class", "aria-hidden"] });
  }

  if (book && window.MutationObserver) {
    new MutationObserver(function () {
      if (book.hidden && (on || (loop && !loop.paused) || stingActive())) {
        silence();
      }
    }).observe(book, { attributes: true, attributeFilter: ["hidden"] });
  }

  window.addEventListener("pagehide", silence);
})();
