/**
 * @fileoverview Main Store Module
 * Handles session protection, catalog rendering, shopping cart, and favorites.
 */

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = sessionStorage.getItem("currentUser");

  // Route Guard: Redirect unauthenticated users
  if (!currentUser) {
    // Detect if we are inside templates/ directory or root
    const loginPath = window.location.pathname.includes("/templates/") 
      ? "login.html" 
      : "templates/login.html";
    window.location.href = loginPath;
    return;
  }

  // Navbar user profile configuration
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link) => {
    if (link.innerHTML.includes("Login") || link.getAttribute("href")?.includes("login.html")) {
      link.innerHTML = `<i class="fa fa-user" style="margin-right: 5px;"></i> Olá, ${currentUser}`;
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

  // 1. HOME CATALOG RENDERER
  const catalogContainer = document.getElementById("books-container");
  if (catalogContainer && !window.location.pathname.includes("cart.html") && !window.location.pathname.includes("favorites.html")) {
    renderCatalog();
  }

  function renderCatalog() {
    const favoritesList = JSON.parse(localStorage.getItem("favorites")) || [];
    catalogContainer.innerHTML = "";

    bookCatalog.forEach((book, index) => {
      const isFavorite = favoritesList.some((fav) => fav.title === book.title);

      const cardElement = document.createElement("div");
      cardElement.className = "book-card";

      cardElement.innerHTML = `
        <img src="${book.image}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p>R$ ${book.price.toFixed(2)}</p> 
        <button class="btn" onclick="addToCart(${index})">Comprar</button>
        <div class="favorite-icon ${isFavorite ? "active" : ""}" 
             onclick="toggleFavorite(this, ${index})">
          &#10084;
        </div>
      `;
      catalogContainer.appendChild(cardElement);
    });
  }

  // 2. CART RENDERER
  const cartContainer = document.getElementById("cart-container");
  if (cartContainer) {
    renderCart();
  }

  function renderCart() {
    let currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalPriceElement = document.getElementById("total-price");
    const checkoutSection = document.querySelector(".checkout-section");

    cartContainer.innerHTML = "";
    let totalSum = 0;

    if (currentCart.length === 0) {
      cartContainer.innerHTML = `
        <div class="empty-state">
          <i class="fa fa-shopping-cart" style="font-size: 4rem; color: #4caf50; margin-bottom: 15px;"></i>
          <p style="font-size: 1.2rem; color: #333; font-weight: 500; margin-bottom: 20px;">Seu carrinho está vazio.</p>
          <a href="../index.html" class="btn" style="text-decoration: none; display: inline-block; width: auto;">Voltar para a Loja</a>
        </div>
      `;
      if (checkoutSection) checkoutSection.style.display = "none";
      return;
    }

    if (checkoutSection) checkoutSection.style.display = "flex";

    currentCart.forEach((book, index) => {
      totalSum += Number(book.price);
      
      // Fix image path if navigating between pages
      let imgPath = book.image;
      if (!imgPath.startsWith("../") && isInsideTemplates) {
        imgPath = "../" + imgPath;
      }

      const cardElement = document.createElement("div");
      cardElement.className = "book-card";
      cardElement.innerHTML = `
        <img src="${imgPath}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p>R$ ${Number(book.price).toFixed(2)}</p>
        <button class="btn" style="background-color: #e53935;" onclick="removeFromCart(${index})">Remover</button>
      `;
      cartContainer.appendChild(cardElement);
    });

    if (totalPriceElement) {
      totalPriceElement.innerText = `R$ ${totalSum.toFixed(2)}`;
    }
  }

  // 3. FAVORITES RENDERER
  const favoritesContainer = document.getElementById("favorites-container");
  if (favoritesContainer) {
    renderFavorites();
  }

  function renderFavorites() {
    let favoritesList = JSON.parse(localStorage.getItem("favorites")) || [];
    favoritesContainer.innerHTML = "";

    const validFavorites = favoritesList.filter((book) => book && book.title);

    if (validFavorites.length === 0) {
      favoritesContainer.innerHTML = `
        <div class="empty-state">
          <i class="fa fa-heart" style="font-size: 4rem; color: #4caf50; margin-bottom: 15px;"></i>
          <p style="font-size: 1.2rem; color: #333; font-weight: 500; margin-bottom: 20px;">Você ainda não favoritou nenhum livro.</p>
          <a href="../index.html" class="btn" style="text-decoration: none; display: inline-block; width: auto;">Explorar Livros</a>
        </div>
      `;
      return;
    }

    validFavorites.forEach((book, index) => {
      let imgPath = book.image;
      if (!imgPath.startsWith("../") && isInsideTemplates) {
        imgPath = "../" + imgPath;
      }

      const cardElement = document.createElement("div");
      cardElement.className = "book-card";
      cardElement.innerHTML = `
        <div class="favorite-icon active" onclick="removeFavorite(${index})">&#10084;</div>
        <img src="${imgPath}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p>R$ ${Number(book.price).toFixed(2)}</p>
        <button class="btn" onclick="addToCartFromFavs(${index})">Comprar</button>
      `;
      favoritesContainer.appendChild(cardElement);
    });
  }

  // GLOBAL ACTIONS
  window.addToCart = (index) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    currentCart.push(bookCatalog[index]);
    localStorage.setItem("cart", JSON.stringify(currentCart));

    const actionButtons = document.querySelectorAll(".btn");
    const targetButton = actionButtons[index];
    if (targetButton) {
      const defaultLabel = targetButton.innerText;
      targetButton.innerText = "Adicionado!";
      targetButton.style.backgroundColor = "#2e7d32";

      setTimeout(() => {
        targetButton.innerText = defaultLabel;
        targetButton.style.backgroundColor = "";
      }, 1000);
    }
  };

  window.toggleFavorite = (element, index) => {
    let favoritesList = JSON.parse(localStorage.getItem("favorites")) || [];
    const selectedBook = bookCatalog[index];

    const targetIndex = favoritesList.findIndex((item) => item.title === selectedBook.title);

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
    let currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    currentCart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(currentCart));
    renderCart();
  };

  window.removeFavorite = (index) => {
    let favoritesList = JSON.parse(localStorage.getItem("favorites")) || [];
    favoritesList.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favoritesList));
    renderFavorites();
  };

  window.addToCartFromFavs = (index) => {
    let favoritesList = JSON.parse(localStorage.getItem("favorites")) || [];
    let currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (favoritesList[index]) {
      currentCart.push(favoritesList[index]);
      localStorage.setItem("cart", JSON.stringify(currentCart));

      const btns = document.querySelectorAll("#favorites-container .btn");
      if (btns[index]) {
        btns[index].innerText = "Adicionado!";
        btns[index].style.backgroundColor = "#2e7d32";
        setTimeout(() => {
          btns[index].innerText = "Comprar";
          btns[index].style.backgroundColor = "";
        }, 1000);
      }
    }
  };
});