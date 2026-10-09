(function () {
  // Each .slideshow-container is its own strip. Direct-child .mySlides,
  // .prev/.next inside the container, and a following .slide-dots sibling
  // (Carrie, Never Flinch, or a later strip such as The Stand) do not share
  // an index. Adopt the same markup and this loop picks the new strip up.
  function initSlideshow(container) {
    var slides = container.querySelectorAll(":scope > .mySlides");
    var dotHost = container.nextElementSibling;
    var dots = dotHost && dotHost.classList.contains("slide-dots")
      ? dotHost.querySelectorAll(".dot")
      : container.querySelectorAll(":scope > .dot");
    var status = container.querySelector("[data-slide-status]");
    var index = 0;

    function show(n) {
      var i;
      if (!slides.length) {
        return;
      }
      index = (n % slides.length + slides.length) % slides.length;
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = i === index ? "block" : "none";
        slides[i].setAttribute("aria-hidden", i === index ? "false" : "true");
      }
      for (i = 0; i < dots.length; i++) {
        if (i === index) {
          dots[i].classList.add("active");
          dots[i].setAttribute("aria-current", "true");
        } else {
          dots[i].classList.remove("active");
          dots[i].removeAttribute("aria-current");
        }
      }
      if (status) {
        status.textContent = "Scene " + (index + 1) + " of " + slides.length;
      }
    }

    function onKey(event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return;
      }
      if (event.target && event.target.closest && event.target.closest("input, textarea, select")) {
        return;
      }
      event.preventDefault();
      show(event.key === "ArrowLeft" ? index - 1 : index + 1);
    }

    var prev = container.querySelector(":scope > .prev");
    var next = container.querySelector(":scope > .next");
    if (prev) {
      prev.addEventListener("click", function () { show(index - 1); });
    }
    if (next) {
      next.addEventListener("click", function () { show(index + 1); });
    }
    Array.prototype.forEach.call(dots, function (dot, dotIndex) {
      dot.addEventListener("click", function () { show(dotIndex); });
    });
    container.addEventListener("keydown", onKey);
    if (dotHost && dotHost.classList.contains("slide-dots")) {
      dotHost.addEventListener("keydown", onKey);
    }

    var startX = null;
    container.addEventListener("touchstart", function (event) {
      if (event.changedTouches && event.changedTouches[0]) {
        startX = event.changedTouches[0].clientX;
      }
    }, { passive: true });
    container.addEventListener("touchend", function (event) {
      if (startX === null || !event.changedTouches || !event.changedTouches[0]) {
        return;
      }
      var delta = event.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 40) {
        show(delta < 0 ? index + 1 : index - 1);
      }
      startX = null;
    }, { passive: true });

    show(0);
  }

  Array.prototype.forEach.call(document.querySelectorAll(".slideshow-container"), initSlideshow);

  var modal = document.getElementById("comicModal");
  var openButtons = document.querySelectorAll("[data-open-comic]");
  var closeButton = document.getElementById("comicModalClose");
  var comicBooks = modal ? modal.querySelectorAll("[data-comic-book]") : [];
  var lastFocus = null;

  function focusableIn(container) {
    return Array.prototype.filter.call(
      container.querySelectorAll("a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex='-1'])"),
      function (el) {
        return el.offsetParent !== null || el === document.activeElement;
      }
    );
  }

  function setComicBook(comicId) {
    if (!comicBooks.length) {
      return;
    }
    Array.prototype.forEach.call(comicBooks, function (comicBook) {
      comicBook.hidden = comicBook.getAttribute("data-comic-book") !== comicId;
    });
  }

  function onModalKeydown(event) {
    if (!modal || !modal.classList.contains("is-open")) {
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key !== "Tab") {
      return;
    }
    var focusable = focusableIn(modal);
    if (!focusable.length) {
      event.preventDefault();
      return;
    }
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openModal(trigger) {
    if (!modal) {
      return;
    }
    lastFocus = trigger || document.activeElement;
    modal.classList.add("is-open");
    modal.removeAttribute("aria-hidden");
    if (closeButton) {
      closeButton.focus();
    }
  }

  function closeModal() {
    if (!modal) {
      return;
    }
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  if (openButtons.length && modal) {
    Array.prototype.forEach.call(openButtons, function (openButton) {
      openButton.addEventListener("click", function () {
        setComicBook(openButton.getAttribute("data-open-comic") || "carrie");
        openModal(openButton);
      });
    });
  }
  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }
  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });
    document.addEventListener("keydown", onModalKeydown);
  }
})();
