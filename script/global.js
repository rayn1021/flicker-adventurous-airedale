fetch("/page/header.html")
  .then((response) => response.text())
  .then((data) => {
    const headerElement = document.querySelector("#header");
    if (headerElement) {
      headerElement.innerHTML = data;
    }
  });

fetch("/page/history.html")
  .then((response) => response.text())
  .then((data) => {
    const historyElement = document.querySelector("#history");
    if (historyElement) {
      historyElement.innerHTML = data;
    }
  });

fetch("/page/footer.html")
  .then((response) => response.text())
  .then((data) => {
    const footerElement = document.querySelector("#footer");
    if (footerElement) {
      footerElement.innerHTML = data;
    }
  });

fetch("/page/policy.html")
  .then((response) => response.text())
  .then((data) => {
    const policyElement = document.querySelector("#policy");
    if (policyElement) {
      policyElement.innerHTML = data;
    }
  });