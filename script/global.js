fetch("page/header.html")
  .then((response) => response.text())
  .then((data) => document.querySelector("#header").innerHTML = data);

fetch("page/history.html")
  .then((response) => response.text())
  .then((data) => document.querySelector("#history").innerHTML = data);