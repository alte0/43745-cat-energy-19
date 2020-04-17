function ready() {
  var header = document.querySelector(".header");
  var toggle = document.querySelector(".header__toggle-menu");

  function handerClick() {
    header.classList.toggle("header_open");
  }

  header.classList.remove("header_open");
  toggle.addEventListener("click", handerClick);
  svg4everybody();
}

document.addEventListener("DOMContentLoaded", ready);
