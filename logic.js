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

  // 1️⃣ EXACT MATCH FIRST
  for (const item of routes) {
    for (const key of item.keys) {
      if (normalize(key) === q) {
        input.value = "";
        window.location.href = base + item.page;
        return;
      }
    }
  }

  // 2️⃣ FALLBACK PARTIAL MATCH
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

// ========== SMOOTH SCROLL FOR # LINKS ==========
document.addEventListener("click", function (e) {
  const link = e.target.closest("a[href^='#']");
  if (!link) return;

  const targetId = link.getAttribute("href").substring(1); // remove #
  if (!targetId) return;

  const section = document.getElementById(targetId);
  if (!section) return;

  e.preventDefault();
  section.scrollIntoView({ behavior: "smooth" });
});

// ========== DARK / LIGHT MODE WITH MEMORY ==========
const body = document.body;
const modeBtn = document.getElementById("modeBtn");
const moon = document.getElementById("moon");
const sun = document.getElementById("sun");

// 1) On load, apply saved theme if any
(function initTheme() {
  const savedMode = localStorage.getItem("theme"); // "light" or "dark"

  if (savedMode === "dark") {
    body.classList.remove("light");
    body.classList.add("dark");
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
  }
})();

// 2) Toggle & save to localStorage
if (modeBtn) {
  modeBtn.addEventListener("click", () => {
    if (body.classList.contains("light")) {
      body.classList.replace("light", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.replace("dark", "light");
      localStorage.setItem("theme", "light");
    }
  });
}

// ========== FULLSCREEN LIGHTBOX (CUSTOM OVERLAY) ==========
document.addEventListener("DOMContentLoaded", () => {
  const overlay   = document.getElementById("lightboxOverlay");
  const imgEl     = document.getElementById("lightboxImage");
  const closeBtn  = document.querySelector(".lightbox-close");
  const prevBtn   = document.querySelector(".lightbox-prev");
  const nextBtn   = document.querySelector(".lightbox-next");
  const counterEl = document.getElementById("lightboxCounter");

  if (!overlay || !imgEl) return; // page without lightbox

  const images = Array.from(document.querySelectorAll(".card-img-top"));
  if (!images.length) return;

  let currentIndex = -1;

  function updateCounter() {
    if (!counterEl) return;
    counterEl.textContent = `${currentIndex + 1} / ${images.length}`;
  }

  function showImage(index) {
    if (!images.length) return;

    // wrap around
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;

    currentIndex = index;
    const img = images[currentIndex];
    imgEl.src = img.src;
    imgEl.alt = img.alt || "preview";

    overlay.classList.add("show");
    updateCounter();
  }

  // Open on card click
  images.forEach((img, idx) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => showImage(idx));
  });

  // Close handlers
  function closeLightbox() {
    overlay.classList.remove("show");
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  // Prev / Next buttons
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });
  }

  // Click outside image to close
  overlay.addEventListener("click", (e) => {
    // only if click on overlay background itself
    if (e.target === overlay) {
      closeLightbox();
    }
  });

  // ESC key
  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("show")) return;

    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      showImage(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
      showImage(currentIndex + 1);
    }
  });
});

// ========== PORTRAIT FILTER BUTTONS + COUNTS ==========
document.addEventListener("DOMContentLoaded", () => {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".portrait-item");

  if (!filterBtns.length || !items.length) return;

  // Count items per category
  const counts = {};
  items.forEach(item => {
    const cat = item.getAttribute("data-category");
    counts[cat] = (counts[cat] || 0) + 1;
    counts["all"] = (counts["all"] || 0) + 1;
  });

  // Update button labels with counts: "Kids (8)"
  filterBtns.forEach(btn => {
    const filter = btn.getAttribute("data-filter");
    const baseLabel = btn.dataset.label || btn.textContent.trim();
    btn.dataset.label = baseLabel; // store original label

    if (counts[filter] != null) {
      btn.textContent = `${baseLabel} (${counts[filter]})`;
    } else {
      btn.textContent = baseLabel;
    }
  });

  // Filtering logic
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      items.forEach(item => {
        const cat = item.getAttribute("data-category");
        if (filter === "all" || filter === cat) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
});

// ========== SIMPLE CONTACT FORM VALIDATION (INLINE MESSAGE) ==========
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const msgBox = document.getElementById("formMessage");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const shootType = document.getElementById("shootType").value;

    // clear previous message
    if (msgBox) {
      msgBox.className = "alert d-none"; // reset classes
      msgBox.textContent = "";
    }

    if (!name || !email || !phone || !shootType) {
      if (msgBox) {
        msgBox.textContent = "Please fill all required fields (*)";
        msgBox.className = "alert alert-danger mt-2";
      }
      return;
    }

    // basic email check
    const emailOk = /\S+@\S+\.\S+/.test(email);
    if (!emailOk) {
      if (msgBox) {
        msgBox.textContent = "Please enter a valid email address.";
        msgBox.className = "alert alert-danger mt-2";
      }
      return;
    }

    // success
    if (msgBox) {
      msgBox.textContent = "Thank you! Your details have been submitted successfully (demo only).";
      msgBox.className = "alert alert-success mt-2";
    }

    form.reset();
  });
});

// ========== SEARCH SUGGESTIONS (DROPDOWN) ==========
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const suggestionBox = document.getElementById("searchSuggestions");

  if (!searchInput || !suggestionBox) return; // safety for other pages

  // Keywords to suggest
  const SUGGESTIONS = [
    "wedding photography",
    "pre wedding",
    "candid moments",
    "couple portraits",
    "family portraits",
    "baby kids photography",
    "fashion shoots",
    "event photography",
    "travel nature",
    "product photography",
    "studio portraits",
    "custom concept shoots"
  ];

  let debounceTimer;

  function updateSuggestions(query) {
    const q = query.trim().toLowerCase();

    if (!q) {
      suggestionBox.style.display = "none";
      suggestionBox.innerHTML = "";
      return;
    }

    // filter suggestions that contain the query
    const matches = SUGGESTIONS.filter(item =>
      item.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      suggestionBox.style.display = "none";
      suggestionBox.innerHTML = "";
      return;
    }

    // build list items
    suggestionBox.innerHTML = "";
    matches.forEach(text => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = text;

      li.addEventListener("click", () => {
        searchInput.value = text;
        suggestionBox.style.display = "none";
        suggestionBox.innerHTML = "";
        // trigger search immediately
        const form = searchInput.closest("form");
        if (form) {
          form.dispatchEvent(new Event("submit", { cancelable: true }));
        }
      });

      suggestionBox.appendChild(li);
    });

    suggestionBox.style.display = "block";
  }

  // Debounced input handler
  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      updateSuggestions(e.target.value);
    }, 250);
  });

  // Hide suggestions when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#searchdiv")) {
      suggestionBox.style.display = "none";
    }
  });
});

// ========== BACK TO TOP BUTTON ==========
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backToTop");
  if (!backBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backBtn.classList.add("show");
    } else {
      backBtn.classList.remove("show");
    }
  });

  backBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// ========== BASIC IMAGE PROTECTION (RIGHT-CLICK + DRAG) ==========
document.addEventListener("DOMContentLoaded", () => {
  // Prevent drag of all images
  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("dragstart", (e) => e.preventDefault());
  });
});

// Block right-click menu on images only
document.addEventListener("contextmenu", (e) => {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
});


// ========== HIGHLIGHT ACTIVE NAV LINK ==========
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".navbar .nav-link");
  const current = window.location.pathname.replace(/\\/g, "/");

  links.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;

    // handle relative paths like "./index.html" or "index.html"
    const normalizedHref = href.replace("./", "/");
    if (current.endsWith(normalizedHref) || current === normalizedHref) {
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    }
  });
});
