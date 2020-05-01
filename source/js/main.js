

//=require ../../node_modules/svg4everybody/dist/svg4everybody.js
//=require ../../node_modules/picturefill/dist/picturefill.js

function ready() {
  var header = document.querySelector(".header");
  var toggle = document.querySelector(".header__toggle-menu");
  var catalogLists = document.querySelector(".catalog__list");
  var additionalList = document.querySelector(".additional-items__list");
  var graphic = document.querySelector(".graphic-example");
  var wrapGraphicBtn = document.querySelector(".graphic-example__wrap");
  var imgAfter = document.querySelector(".graphic-example__after-photo-cat");
  var imgBefore = document.querySelector(".graphic-example__before-photo-cat");
  var slider = document.querySelector(".graphic-example__slider");
  var sideBtnMobile = "left";
  var widthWindow = null || getWindowInnerWidth();
  var TABLET = 768;
  var store = {
    init: true,
    clicked: 0,
    slider: null,
    photoBefore: null,
    photoAfter: null,
    w: null,
    bar: null
  }

  function getWindowInnerWidth() {
    return window.innerWidth;
  }

  function handerClickToggle() {
    header.classList.toggle("header_open");
  }

  function handerClickOrder(evt) {
    var target = evt.target;
    if (target.tagName === "A") {
      evt.preventDefault();
    }
  }

  function handerClickbtns(evt) {
    var target = evt.target;
    var dataSide = target.dataset.side;
    if (target.tagName === "BUTTON") {
      if ((sideBtnMobile !== dataSide) && (widthWindow < TABLET)) {
        sideBtnMobile = dataSide;
        sideBtnTablet = null;
        graphic.classList.toggle("graphic-example_after");
      } else {
        sideBtnMobile = "left";
        slider.removeAttribute("style");
        imgAfter.removeAttribute("style");
        imgBefore.removeAttribute("style");

        switch (dataSide) {
          case "left":
            graphic.classList.remove("graphic-example_after");
            graphic.classList.add("graphic-example_before");
            sideBtn = dataSide;
            break;
          case "right":
            graphic.classList.remove("graphic-example_before");
            graphic.classList.add("graphic-example_after");
            sideBtn = dataSide;
            break;
          default:
            break;
        }
      }
    }
  }

  function removeClassGraphic() {
    graphic.classList.remove("graphic-example_after");
    graphic.classList.remove("graphic-example_before");
  }

  function slideReady(e) {
    e.preventDefault();
    store.clicked = 1;
    removeClassGraphic();
    window.addEventListener("mousemove", slideMove);
    window.addEventListener("touchmove", slideMove);
  }

  function slideFinish() {
    store.clicked = 0;
  }

  function slideMove(e) {
    var pos;
    if (store.clicked == 0) return false;
    pos = getCursorPos(e)

    if (pos < 0) pos = 0;
    if (pos > store.w) pos = store.w;
    slide(pos);
  }

  function getCursorPos(e) {
    var a, x = 0;
    e = e || window.event;
    a = store.bar.getBoundingClientRect();
    x = e.pageX - a.left;
    x = x - window.pageXOffset;
    return x;
  }

  function slide(x) {
    var percent = (x / store.w * 100);
    store.slider.style.left = percent + "%";
    store.photoBefore.style.clip = "rect(0, " + (685 - (685 / 100 * percent) - correctPhotoBefore(widthWindow)) + "px, 685px, 0)";
    store.photoAfter.style.clip = "rect(0, 710px, 518px, " + (710 - (710 / 100 * percent) - correctPhotoAfter(widthWindow)) + "px)";

  }

  function correctPhotoBefore(widthWindow) {
    if (widthWindow >= 1300) {
      return -24;
    }
    return 5;
  }

  function correctPhotoAfter(widthWindow) {
    if (widthWindow >= 1300) {
      return -21;
    }
    return 6;
  }

  function initApp(store) {
    var mobile = widthWindow < 768;
    var tablet = widthWindow >= 768;
    removeClassGraphic();

    function setInit() {
      store.init = !store.init;
    }

    function initTablet() {
      setInit();
      store.bar = document.querySelector(".graphic-example__bar");
      store.w = store.bar.offsetWidth;
      var percent = (store.w / 2 / store.w * 100);
      store.photoAfter = imgAfter;
      store.photoBefore = imgBefore;
      store.photoBefore.style.clip = "rect(0, " + Math.floor(685 / 2 - correctPhotoBefore(widthWindow)) + "px, 685px, 0)";
      store.photoAfter.style.clip = "rect(0, 710px, 518px, " + Math.floor(710 / 2 - correctPhotoAfter(widthWindow)) + "px)";
      store.slider = slider;
      store.slider.style.left = percent + "%";
      store.slider.addEventListener("mousedown", slideReady);
      window.addEventListener("mouseup", slideFinish);
      store.slider.addEventListener("touchstart", slideReady);
      window.addEventListener("touchstop", slideFinish);
    }

    function destroyMobile() {
      setInit();
      store.slider.removeAttribute("style");
      store.photoBefore.removeAttribute("style");
      store.photoAfter.removeAttribute("style");

      store.slider.removeEventListener("mousedown", slideReady);
      store.slider.removeEventListener("touchstart", slideReady);
      window.removeEventListener("mouseup", slideFinish);
      window.removeEventListener("touchstop", slideFinish);
    }

    if (tablet && store.init) {
      initTablet();
    }

    if (mobile && !store.init) {
      destroyMobile();
    }
  };

  if (header) {
    header.classList.remove("header_open");
  }

  if (toggle) {
    toggle.addEventListener("click", handerClickToggle);
  }

  if (catalogLists) {
    catalogLists.addEventListener("click", handerClickOrder);
  }

  if (additionalList) {
    additionalList.addEventListener("click", handerClickOrder);
  }

  if (wrapGraphicBtn) {
    wrapGraphicBtn.addEventListener("click", handerClickbtns);
  }

  if (graphic) {
    initApp(store);
  }

  svg4everybody();

  window.onresize = function () {
    widthWindow = getWindowInnerWidth();

    if (graphic) {
      initApp(store);
    }
  }
}

document.addEventListener("DOMContentLoaded", ready);
