const searchButton = document.querySelector(".search-button");
const searchPanel = document.querySelector("#search-panel");
const searchInput = document.querySelector("#search-input");
const strip = document.querySelector(".headline-strip");
const stripButtons = document.querySelectorAll(".strip-controls button");
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const backToTop = document.createElement("button");

backToTop.className = "back-to-top";
backToTop.type = "button";
backToTop.setAttribute("aria-label", "Voltar ao topo");
backToTop.textContent = "↑";
document.body.appendChild(backToTop);

const setScrolledHeader = () => {
  if (!siteHeader) {
    return;
  }

  const heroBanner = siteHeader.querySelector(".hero-banner");
  const categoryNav = siteHeader.querySelector(".category-nav");
  const compactAt = window.innerWidth <= 900
    ? 1
    : (heroBanner?.offsetHeight || 0) + (categoryNav?.offsetHeight || 0) - 8;
  const shouldCompact = window.scrollY > compactAt;
  siteHeader.classList.toggle("is-scrolled", shouldCompact);
  backToTop.classList.toggle("is-visible", window.scrollY > 420);

  if (!shouldCompact && window.innerWidth > 900) {
    siteHeader.classList.remove("is-menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
};

setScrolledHeader();
window.addEventListener("scroll", setScrolledHeader, { passive: true });
window.addEventListener("resize", setScrolledHeader);

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

if (siteHeader && menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("is-menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (searchButton && searchPanel && searchInput) {
  searchButton.addEventListener("click", () => {
    const isOpen = searchPanel.classList.toggle("is-open");
    searchButton.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
      searchInput.focus();
    }
  });

  searchPanel.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();

    if (query) {
      searchInput.value = "";
      searchInput.placeholder = `Busca por "${query}"`;
    }
  });
}

if (strip && stripButtons.length === 2) {
  const items = Array.from(strip.querySelectorAll(".mini-news"));
  let current = 0;

  const showItem = (index) => {
    items.forEach((item, i) => {
      item.classList.toggle("is-active", i === index);
      item.setAttribute("aria-hidden", i !== index ? "true" : "false");
    });
    stripButtons[0].disabled = index === 0;
    stripButtons[1].disabled = index === items.length - 1;
  };

  // Estado inicial
  items.forEach((item) => {
    item.style.display = "none";
    item.setAttribute("aria-hidden", "true");
  });

  const styleTag = document.createElement("style");
  styleTag.textContent = `
    .mini-news { display: none !important; }
    .mini-news.is-active {
      display: grid !important;
      animation: fadeSlide 220ms ease both;
    }
    @keyframes fadeSlide {
      from { opacity: 0; transform: translateX(18px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .strip-controls button:disabled {
      opacity: 0.35;
      cursor: default;
    }
  `;
  document.head.appendChild(styleTag);

  showItem(current);

  stripButtons[0].addEventListener("click", () => {
    if (current > 0) {
      current--;
      // Anima para a esquerda
      styleTag.textContent = styleTag.textContent.replace(
        /translateX\([^)]+\)/g, "translateX(-18px)"
      );
      showItem(current);
    }
  });

  stripButtons[1].addEventListener("click", () => {
    if (current < items.length - 1) {
      current++;
      styleTag.textContent = styleTag.textContent.replace(
        /translateX\([^)]+\)/g, "translateX(18px)"
      );
      showItem(current);
    }
  });
}

const getPrivacyAccepted = () => {
  try {
    return localStorage.getItem("pbmg-privacy-accepted") === "true";
  } catch (error) {
    return false;
  }
};

const setPrivacyAccepted = () => {
  try {
    localStorage.setItem("pbmg-privacy-accepted", "true");
  } catch (error) {
    // The banner still closes if browser storage is unavailable.
  }
};

const initPrivacyCard = () => {
  const privacyCard = document.querySelector(".privacy-card");
  const privacyAccept = document.querySelector(".privacy-accept");

  if (!privacyCard || !privacyAccept) {
    return;
  }

  if (getPrivacyAccepted()) {
    privacyCard.classList.add("is-hidden");
  }

  privacyAccept.addEventListener("click", () => {
    privacyCard.classList.add("is-hidden");
    setPrivacyAccepted();
  });
};

initPrivacyCard();
