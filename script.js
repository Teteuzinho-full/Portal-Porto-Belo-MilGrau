const searchButton = document.querySelector(".search-button");
const searchPanel = document.querySelector("#search-panel");
const searchInput = document.querySelector("#search-input");
const strip = document.querySelector(".headline-strip");
const stripButtons = document.querySelectorAll(".strip-controls button");
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");

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

  if (!shouldCompact && window.innerWidth > 900) {
    siteHeader.classList.remove("is-menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
};

setScrolledHeader();
window.addEventListener("scroll", setScrolledHeader, { passive: true });
window.addEventListener("resize", setScrolledHeader);

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
  stripButtons[0].addEventListener("click", () => {
    strip.scrollBy({ left: -260, behavior: "smooth" });
  });

  stripButtons[1].addEventListener("click", () => {
    strip.scrollBy({ left: 260, behavior: "smooth" });
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
