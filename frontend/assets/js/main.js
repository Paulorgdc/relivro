/**
 * @fileoverview Main Store Module
 * Handles session protection, catalog rendering, shopping cart, and favorites.
 */

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = sessionStorage.getItem("currentUser");

  // Route Guard: Redirect unauthenticated users
  if (!currentUser) {
    const loginPath = window.location.pathname.includes("/templates/") 
      ? "login.html" 
      : "templates/login.html";
    window.location.href = loginPath;
    return;
  }

  // Navbar user profile configuration
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link) => {
    const linkText = link.textContent || "";
    const hrefAttr = link.getAttribute("href") || "";
    if (linkText.includes("Login") || hrefAttr.includes("login.html")) {
      link.replaceChildren();

      const icon = document.createElement("i");
      icon.className = "fa fa-user";
      icon.style.marginRight = "5px";

      link.append(icon, document.createTextNode(` Olá, ${currentUser}`));
      link.href = "#";
      link.title = "Clique para sair da conta";

      link.addEventListener("click", (event) => {
        event.preventDefault();
        if (confirm("Deseja sair da sua conta?")) {
          sessionStorage.removeItem("currentUser");
          const logoutRedirect = window.location.pathname.includes("/templates/")
            ? "login.html"
            : "templates/login.html";
          window.location.href = logoutRedirect;
        }
      });
    }
  });

  // Base Path Helper for images
  const isInsideTemplates = window.location.pathname.includes("/templates/");
  const imagePrefix = isInsideTemplates ? "../assets/images/" : "assets/images/";

  // Mocked Book Catalog
  const bookCatalog = [
    { id: 1, title: "1984", price: 29.9, image: `${imagePrefix}1984.jpg` },
    { id: 2, title: "Capitães da Areia", price: 22.5, image: `${imagePrefix}captains-of-the-sands.jpg` },
    { id: 3, title: "Moby Dick", price: 37.5, image: `${imagePrefix}moby-dick.jpg` },
    { id: 4, title: "As 38 Leis do Poder", price: 45.5, image: `${imagePrefix}48-laws-of-power.jpg` },
    { id: 5, title: "O Pequeno Príncipe", price: 25.0, image: `${imagePrefix}the-little-prince.jpg` },
  ];

  function getSafeStorage(key) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key));
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  // 1. HOME CATALOG RENDERER
  const catalogContainer = document.getElementById("books-container");
  if (catalogContainer && !window.location.pathname.includes("cart.html") && !window.location.pathname.includes("favorites.html")) {
    renderCatalog();
  }

  function renderCatalog() {
    const favoritesList = getSafeStorage("favorites");
    catalogContainer.replaceChildren();

    bookCatalog.forEach((book, index) => {
      const isFavorite = favoritesList.some((fav) => fav && fav.title === book.title);

      const card = document.createElement("div");
      card.className = "book-card";

      const img = document.createElement("img");
      img.src = book.image;
      img.alt = book.title;

      const title = document.createElement("h3");
      title.textContent = book.title;

      const price = document.createElement("p");
      price.textContent = `R$ ${book.price.toFixed(2)}`;

      const btn = document.createElement("button");
      btn.className = "btn";
      btn.textContent = "Comprar";
      btn.onclick = () => window.addToCart(index);

      const favIcon = document.createElement("div");
      favIcon.className = `favorite-icon ${isFavorite ? "active" : ""}`;
      favIcon.textContent = "❤";
      favIcon.onclick = function() { window.toggleFavorite(this, index); };

      card.append(img, title, price, btn, favIcon);
      catalogContainer.appendChild(card);
    });
  }

  // 2. CART RENDERER
  const cartContainer = document.getElementById("cart-container");
  if (cartContainer) {
    renderCart();
  }

  function renderCart() {
    const currentCart = getSafeStorage("cart");
    const totalPriceElement = document.getElementById("total-price");
    const checkoutSection = document.querySelector(".checkout-section");

    cartContainer.replaceChildren();
    let totalSum = 0;

    if (currentCart.length === 0) {
      const emptyDiv = document.createElement("div");
      emptyDiv.className = "empty-state";

      const icon = document.createElement("i");
      icon.className = "fa fa-shopping-cart";
      icon.style.cssText = "font-size: 4rem; color: #4caf50; margin-bottom: 15px;";

      const msg = document.createElement("p");
      msg.style.cssText = "font-size: 1.2rem; color: #333; font-weight: 500; margin-bottom: 20px;";
      msg.textContent = "Seu carrinho está vazio.";

      const backLink = document.createElement("a");
      backLink.href = "../index.html";
      backLink.className = "btn";
      backLink.style.cssText = "text-decoration: none; display: inline-block; width: auto;";
      backLink.textContent = "Voltar para a Loja";

      emptyDiv.append(icon, msg, backLink);
      cartContainer.appendChild(emptyDiv);

      if (checkoutSection) checkoutSection.style.display = "none";
      return;
    }

    if (checkoutSection) checkoutSection.style.display = "flex";

    currentCart.forEach((book, index) => {
      const numPrice = Number(book.price) || 0;
      totalSum += numPrice;

      let imgPath = String(book.image || "");
      if (!imgPath.startsWith("../") && isInsideTemplates) {
        imgPath = "../" + imgPath;
      }

      const card = document.createElement("div");
      card.className = "book-card";

      const img = document.createElement("img");
      img.src = imgPath;
      img.alt = String(book.title || "");

      const title = document.createElement("h3");
      title.textContent = String(book.title || "");

      const price = document.createElement("p");
      price.textContent = `R$ ${numPrice.toFixed(2)}`;

      const removeBtn = document.createElement("button");
      removeBtn.className = "btn";
      removeBtn.style.backgroundColor = "#e53935";
      removeBtn.textContent = "Remover";
      removeBtn.onclick = () => window.removeFromCart(index);

      card.append(img, title, price, removeBtn);
      cartContainer.appendChild(card);
    });

    if (totalPriceElement) {
      totalPriceElement.textContent = `R$ ${totalSum.toFixed(2)}`;
    }
  }

  // 3. FAVORITES RENDERER
  const favoritesContainer = document.getElementById("favorites-container");
  if (favoritesContainer) {
    renderFavorites();
  }

  function renderFavorites() {
    const favoritesList = getSafeStorage("favorites");
    favoritesContainer.replaceChildren();

    const validFavorites = favoritesList.filter((book) => book && book.title);

    if (validFavorites.length === 0) {
      const emptyDiv = document.createElement("div");
      emptyDiv.className = "empty-state";

      const icon = document.createElement("i");
      icon.className = "fa fa-heart";
      icon.style.cssText = "font-size: 4rem; color: #4caf50; margin-bottom: 15px;";

      const msg = document.createElement("p");
      msg.style.cssText = "font-size: 1.2rem; color: #333; font-weight: 500; margin-bottom: 20px;";
      msg.textContent = "Você ainda não favoritou nenhum livro.";

      const backLink = document.createElement("a");
      backLink.href = "../index.html";
      backLink.className = "btn";
      backLink.style.cssText = "text-decoration: none; display: inline-block; width: auto;";
      backLink.textContent = "Explorar Livros";

      emptyDiv.append(icon, msg, backLink);
      favoritesContainer.appendChild(emptyDiv);
      return;
    }

    validFavorites.forEach((book, index) => {
      let imgPath = String(book.image || "");
      if (!imgPath.startsWith("../") && isInsideTemplates) {
        imgPath = "../" + imgPath;
      }

      const card = document.createElement("div");
      card.className = "book-card";

      const favIcon = document.createElement("div");
      favIcon.className = "favorite-icon active";
      favIcon.textContent = "❤";
      favIcon.onclick = () => window.removeFavorite(index);

      const img = document.createElement("img");
      img.src = imgPath;
      img.alt = String(book.title || "");

      const title = document.createElement("h3");
      title.textContent = String(book.title || "");

      const price = document.createElement("p");
      price.textContent = `R$ ${(Number(book.price) || 0).toFixed(2)}`;

      const buyBtn = document.createElement("button");
      buyBtn.className = "btn";
      buyBtn.textContent = "Comprar";
      buyBtn.onclick = () => window.addToCartFromFavs(index);

      card.append(favIcon, img, title, price, buyBtn);
      favoritesContainer.appendChild(card);
    });
  }

  // GLOBAL ACTIONS
  window.addToCart = (index) => {
    const currentCart = getSafeStorage("cart");
    currentCart.push(bookCatalog[index]);
    localStorage.setItem("cart", JSON.stringify(currentCart));

    const actionButtons = document.querySelectorAll(".btn");
    const targetButton = actionButtons[index];
    if (targetButton) {
      const defaultLabel = targetButton.textContent;
      targetButton.textContent = "Adicionado!";
      targetButton.style.backgroundColor = "#2e7d32";

      setTimeout(() => {
        targetButton.textContent = defaultLabel;
        targetButton.style.backgroundColor = "";
      }, 1000);
    }
  };

  window.toggleFavorite = (element, index) => {
    const favoritesList = getSafeStorage("favorites");
    const selectedBook = bookCatalog[index];

    const targetIndex = favoritesList.findIndex((item) => item && item.title === selectedBook.title);

    if (targetIndex === -1) {
      favoritesList.push(selectedBook);
      element.classList.add("active");
    } else {
      favoritesList.splice(targetIndex, 1);
      element.classList.remove("active");
    }

    localStorage.setItem("favorites", JSON.stringify(favoritesList));
  };

  window.removeFromCart = (index) => {
    const currentCart = getSafeStorage("cart");
    currentCart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(currentCart));
    renderCart();
  };

  window.removeFavorite = (index) => {
    const favoritesList = getSafeStorage("favorites");
    favoritesList.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favoritesList));
    renderFavorites();
  };

  window.addToCartFromFavs = (index) => {
    const favoritesList = getSafeStorage("favorites");
    const currentCart = getSafeStorage("cart");
    
    if (favoritesList[index]) {
      currentCart.push(favoritesList[index]);
      localStorage.setItem("cart", JSON.stringify(currentCart));

      const btns = document.querySelectorAll("#favorites-container .btn");
      if (btns[index]) {
        btns[index].textContent = "Adicionado!";
        btns[index].style.backgroundColor = "#2e7d32";
        setTimeout(() => {
          btns[index].textContent = "Comprar";
          btns[index].style.backgroundColor = "";
        }, 1000);
      }
    }
  };
});