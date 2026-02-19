import { targetCss, targetCssIntegrity } from "@params";

let loadStarted = false;

function loadCss() {
  if(!targetCss || loadStarted) return;

  loadStarted = true;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = targetCss;
  link.crossOrigin = "anonymous";

  if(targetCssIntegrity) {
    link.integrity = targetCssIntegrity;
  }

  document.head.appendChild(link);
}

document.addEventListener("DOMContentLoaded", loadCss);
window.addEventListener("load", loadCss);
