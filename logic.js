// ✅ GLOBAL SEARCH SUPPORT FUNCTIONS
function normalize(str) {
  return str.toLowerCase().replace(/[\s-]+/g, "");
}

function getBasePath() {
  const path = window.location.pathname;
  if (path.includes("ExtraFiles")) {
    return "./"; 
  } else {
    return "./ExtraFiles/";
  }
}

// ✅ FINAL SEARCH FUNCTION (FIXED + CLEAR AFTER SEARCH)
function searchGallery(event) {
  event.preventDefault();

  const input = document.getElementById("search");
  if (!input) return;

  let searchValue = input.value.trim();
  if (!searchValue) {
    alert("Please type something to search.");
    return;
  }

  const q = normalize(searchValue);
  const base = getBasePath();

  const routes = [
    { keys: ["prewedding", "pre wedding", "pre wedding shoots"], page: "pre-wedding.html" },
    { keys: ["wedding", "wedding photography"], page: "wedding.html" },
    { keys: ["candid", "candid moments"], page: "candid.html" },
    { keys: ["couple", "couple portraits"], page: "couple.html" },
    { keys: ["family", "family portraits"], page: "family.html" },
    { keys: ["kids", "baby", "baby kids"], page: "kids.html" },
    { keys: ["fashion", "model", "fashion shoots"], page: "fashion.html" },
    { keys: ["event", "event photography", "birthday"], page: "event.html" },
    { keys: ["travel", "travel nature", "nature"], page: "travel.html" },
    { keys: ["product", "product photography"], page: "product.html" },
    { keys: ["studio", "studio portraits", "studio photography"], page: "studio.html" },
    { keys: ["custom", "concept", "custom concept"], page: "custom.html" },
    { keys: ["portrait", "portraits"], page: "portraits.html" }
  ];

  // ✅ 1️⃣ EXACT MATCH FIRST
  for (const item of routes) {
    for (const key of item.keys) {
      if (normalize(key) === q) {
        input.value = "";
        window.location.href = base + item.page;
        return;
      }
    }
  }

  // ✅ 2️⃣ FALLBACK PARTIAL MATCH
  let fallbackPage = null;

  outer:
  for (const item of routes) {
    for (const key of item.keys) {
      const nk = normalize(key);
      if (
        nk.startsWith(q) ||
        q.startsWith(nk) ||
        nk.includes(q) ||
        q.includes(nk)
      ) {
        fallbackPage = base + item.page;
        break outer;
      }
    }
  }

  if (fallbackPage) {
    input.value = "";
    window.location.href = fallbackPage;
  } else {
    alert("No matching gallery found!");
  }
}


// DARK / LIGHT MODE TOGGLE


const body = document.body;
const modeBtn = document.getElementById("modeBtn");
const moon = document.getElementById("moon");
const sun = document.getElementById("sun");

if (modeBtn) {
  modeBtn.addEventListener("click", () => {
    if (body.classList.contains("light")) {
      body.classList.replace("light", "dark");
    } else {
      body.classList.replace("dark", "light");
    }
  });
}

