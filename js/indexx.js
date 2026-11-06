/* =========================================================
   MAGHIC CENTRO HIDRÁULICO - FUNCIONALIDADES PRINCIPALES
   Menú móvil, navbar, filtros, búsqueda, animaciones y contacto
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const backToTop = document.getElementById("backToTop");
  const yearElement = document.getElementById("year");

  const searchInput = document.getElementById("productSearch");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");
  const noResults = document.getElementById("noResults");

  /* ---------- Año dinámico en el footer ---------- */
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ---------- Navbar con sombra al desplazar ---------- */
  function handleScroll() {
    const scrollY = window.scrollY;

    navbar.classList.toggle("scrolled", scrollY > 40);
    backToTop.classList.toggle("visible", scrollY > 500);

    updateActiveLink();
  }

  /* ---------- Menú móvil ---------- */
  hamburger.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen.toString());
  });

  /* ---------- Cerrar menú al seleccionar enlace ---------- */
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Enlace activo según sección visible ---------- */
  const sections = document.querySelectorAll("section[id]");

  function updateActiveLink() {
    let currentSection = "inicio";

    sections.forEach((section) => {
      const top = section.offsetTop - 130;

      if (window.scrollY >= top) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentSection}`;
      link.classList.toggle("active", isActive);
    });
  }

  /* ---------- Botón regresar al inicio ---------- */
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  /* ---------- Filtros del catálogo ---------- */
  let activeFilter = "todos";

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      activeFilter = button.dataset.filter;
      applyProductFilters();
    });
  });

  /* ---------- Búsqueda de productos ---------- */
  searchInput.addEventListener("input", applyProductFilters);

  function applyProductFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    productCards.forEach((card) => {
      const category = card.dataset.category;
      const searchableText = `${card.dataset.name} ${card.textContent}`.toLowerCase();

      const matchesFilter = activeFilter === "todos" || category === activeFilter;
      const matchesSearch = searchableText.includes(query);

      const shouldShow = matchesFilter && matchesSearch;

      card.classList.toggle("hidden", !shouldShow);

      if (shouldShow) {
        visibleCount++;
        card.classList.add("visible");
      }
    });

    noResults.classList.toggle("hidden", visibleCount > 0);
  }

  /* ---------- Animaciones al aparecer con scroll ---------- */
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  /* ---------- Consultar producto: prepara el correo ---------- */
  const consultButtons = document.querySelectorAll("[data-product]");
  const serviceButtons = document.querySelectorAll("[data-service]");

  function buildConsultEmail(subject, body) {
    const email = "maghicautorepuestos@gmail.com";
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  consultButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const product = button.dataset.product;
      const subject = `Consulta sobre: ${product}`;
      const body = `Hola MAGHIC,\n\nQuisiera consultar sobre: ${product}.\n\nNombre:\nTeléfono / WhatsApp:\nMensaje:\n`;

      window.location.href = buildConsultEmail(subject, body);
    });
  });

  serviceButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const service = button.dataset.service;
      const subject = `Solicitud de información: ${service}`;
      const body = `Hola MAGHIC,\n\nQuisiera solicitar información sobre: ${service}.\n\nNombre:\nTeléfono / WhatsApp:\nDetalle de la necesidad:\n`;

      window.location.href = buildConsultEmail(subject, body);
    });
  });

  /* ---------- Eventos iniciales ---------- */
  window.addEventListener("scroll", handleScroll);
  handleScroll();
});