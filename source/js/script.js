function ready() {
  var header = document.querySelector(".header");
  var toggle = document.querySelector(".header__toggle-menu");
  var catalogLists = document.querySelector(".catalog__list");
  var additionalList = document.querySelector(".additional-items__list");

  function handerClickToggle() {
    header.classList.toggle("header_open");
  }

  function handerClickOrder(evt) {
    var target = evt.target;
    console.log(target);
    if (target.tagName === "A") {
      console.log("preventDefault");
      evt.preventDefault();
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

  svg4everybody();
}

document.addEventListener("DOMContentLoaded", ready);
