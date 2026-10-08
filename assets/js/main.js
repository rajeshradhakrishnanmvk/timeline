(function () {
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  var slideIndex = 1;

  function showSlides(n) {
    var i;
    if (!slides.length) {
      return;
    }
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].classList.remove("active");
      dots[i].removeAttribute("aria-current");
    }
    slides[slideIndex - 1].style.display = "block";
    if (dots[slideIndex - 1]) {
      dots[slideIndex - 1].classList.add("active");
      dots[slideIndex - 1].setAttribute("aria-current", "true");
    }
  }

  var prev = document.querySelector(".slideshow-container .prev");
  var next = document.querySelector(".slideshow-container .next");
  if (prev) {
    prev.addEventListener("click", function () {
      showSlides(slideIndex += 1 * -1);
    });
  }
  if (next) {
    next.addEventListener("click", function () {
      showSlides(slideIndex += 1);
    });
  }
  Array.prototype.forEach.call(dots, function (dot, index) {
    dot.addEventListener("click", function () {
      showSlides(slideIndex = index + 1);
    });
  });
  showSlides(slideIndex);

  var modal = document.getElementById("comicModal");
  var openButton = document.getElementById("btnComicBook");
  var closeButton = document.getElementById("comicModalClose");
  var lastFocus = null;

  function focusableIn(container) {
    return Array.prototype.filter.call(
      container.querySelectorAll("a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex='-1'])"),
      function (el) {
        return el.offsetParent !== null || el === document.activeElement;
      }
    );
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

  function openModal() {
    if (!modal) {
      return;
    }
    lastFocus = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
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

  if (openButton && modal) {
    openButton.addEventListener("click", openModal);
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
