function ready() {
  var header = document.querySelector(".header");
  var toggle = document.querySelector(".header__toggle-menu");
  var catalogLists = document.querySelector(".catalog__list");
  var additionalList = document.querySelector(".additional-items__list");
  var graphic = document.querySelector(".graphic-example");
  var wrapGraphicBtn = document.querySelector(".graphic-example__wrap");
  var sideBtnMobile = "left";
  var sideBtnTablet = null;
  var widthWindow = null || window.screen.width;
  var TABLET = 768;

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
        console.log(dataSide);
        sideBtnMobile = "left";
        switch (dataSide) {
          case "left":
            if (sideBtnTablet !== "left") {
              sideBtnTablet = dataSide;
              graphic.classList.remove("graphic-example_after");
              graphic.classList.toggle("graphic-example_before");
              sideBtn = dataSide;
              break;
            }
            break;
          case "right":
            if (sideBtnTablet !== "right") {
              sideBtnTablet = dataSide;
              graphic.classList.remove("graphic-example_before");
              graphic.classList.toggle("graphic-example_after");
              sideBtn = dataSide;
              break;
            }
            break;
          default:
            break;
        }
      }
    }
  }

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
    wrapGraphicBtn.addEventListener("click", handerClickbtns)
  }

  svg4everybody();
  window.onresize = function () {
    widthWindow = window.screen.width;
  }
}

document.addEventListener("DOMContentLoaded", ready);
