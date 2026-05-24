`use strict`;
import {
  loadingSpinner,
  stopLoadingSpinner,
  renderSlider,
  slideButtons,
  onSaleProducts,
  topRatedProducts,
  onSale,
  topRated,
  dontMissOut,
  similarProducts,
  displayMessage,
  cartMessage,
  openCloseMenu,
  checkUserLoggedin,
  logOut,
} from "./utils.js";
const API_BASE = "https://v2.api.noroff.dev/";
const API_PATH = "online-shop";
const API = API_BASE + API_PATH;

const PARAMS = new URLSearchParams(window.location.search);
const ID = PARAMS.get("id");

let allProducts = [];
let favourites = [];
// Carousel
let carouselProducts = [];
let slideIndex = 1;
// Show all products
let productsToShow = 10;

async function fetchProducts() {
  try {
    const response = await fetch(API);
    if (!response.ok) {
      throw new Error("Error loading products");
    }
    const result = await response.json();
    allProducts = result.data;
  } catch (error) {
    displayMessage(error, "error");
  } finally {
    displayProducts(allProducts.slice(0, productsToShow));
    getCarouselProducts();
    renderCarousel(carouselProducts);
    initCarousel();
    initDotListeners();

    // Slider
    topRatedProducts(allProducts);
    onSaleProducts(allProducts);
    renderSlider(topRated, "top-rated");
    renderSlider(onSale, "on-sale");
    slideButtons();
  }
}

// Render products
function displayProducts(products) {
  stopLoadingSpinner();
  const container = document.querySelector(".products-container");
  const btnContainer = document.querySelector(".all-products");
  container.innerHTML = "";
  products.forEach((product) => {
    const div = document.createElement("div");
    div.classList.add("container");

    const img = document.createElement("img");
    img.src = product.image.url;

    const descDiv = document.createElement("div");
    descDiv.classList.add("card-description");

    const titleFav = document.createElement("div");
    titleFav.classList.add("title-fav");

    const favIcon = document.createElement("i");
    favIcon.classList.add("fa-solid", "fa-heart");

    const title = document.createElement("h3");
    title.classList.add("product-title");
    title.textContent = `${product.title}`;

    const price = document.createElement("h3");
    price.classList.add("product-price");
    price.textContent = `$${product.price}`;

    const productTag = document.createElement("a");
    productTag.setAttribute(`href`, `product/index.html?id=${product.id}`);
    productTag.classList.add("product-card");

    container.appendChild(productTag);
    productTag.appendChild(div);
    div.appendChild(img);
    div.appendChild(descDiv);
    descDiv.appendChild(titleFav);
    titleFav.appendChild(title);
    titleFav.appendChild(favIcon);
    descDiv.appendChild(price);
  });
  // Show more/less button
  const showMoreBtn = document.querySelector(".show-more-btn");
  if (showMoreBtn) {
    showMoreBtn.remove();
  }

  const showBtn = document.createElement("button");
  showBtn.classList.add("show-more-btn");
  if (productsToShow >= allProducts.length) {
    showBtn.textContent = "Show less";
  } else {
    showBtn.textContent = "Show more";
  }

  showBtn.addEventListener("click", () => {
    if (productsToShow === allProducts.length) {
      showLessProducts();
    } else {
      showMoreProducts();
    }
  });
  btnContainer.appendChild(showBtn);
}
fetchProducts();

/* ==== CAROUSEL ==== */
function getCarouselProducts() {
  // Randomize products for carousel
  const sortedProducts = [...allProducts];
  const shuffled = sortedProducts.sort(() => 0.5 - Math.random());
  carouselProducts = shuffled.slice(0, 3);
}

function renderCarousel() {
  const container = document.querySelector(".product-carousel");
  container.innerHTML = "";
  carouselProducts.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("carousel-product");

    const containerDiv = document.createElement("div");
    containerDiv.classList.add("product-container");

    const img = document.createElement("img");
    img.src = p.image.url;

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("carousel-product-info");

    const title = document.createElement("h1");
    title.textContent = p.title;

    const desc = document.createElement("p");
    desc.textContent = p.description;

    const cartBtn = document.createElement("a");
    cartBtn.classList.add("add-to-cart-btn");
    cartBtn.setAttribute(`href`, `product/index.html?id=${p.id}`);
    cartBtn.textContent = "View product";

    container.appendChild(div);
    div.appendChild(containerDiv);
    containerDiv.appendChild(img);
    containerDiv.appendChild(infoDiv);
    infoDiv.appendChild(title);
    infoDiv.appendChild(desc);
    infoDiv.appendChild(cartBtn);
  });
  const indicators = document.createElement("div");
  indicators.classList.add("carousel-indicators");

  const dot = document.createElement("i");
  dot.classList.add("fa-solid", "fa-circle");
  const dot2 = document.createElement("i");
  dot2.classList.add("fa-solid", "fa-circle");
  const dot3 = document.createElement("i");
  dot3.classList.add("fa-solid", "fa-circle");

  container.appendChild(indicators);
  indicators.appendChild(dot);
  indicators.appendChild(dot2);
  indicators.appendChild(dot3);
}

function initDotListeners() {
  const dotButtons = Array.from(
    document.querySelectorAll(".carousel-indicators i"),
  );
  dotButtons.forEach((dot) => {
    dot.addEventListener("click", (event) => {
      slideIndex = dotButtons.indexOf(event.target) + 1;
      showSlides(slideIndex);
    });
  });
}

// Automatic slide
setInterval(() => {
  updateIndex();
}, 8000);
function updateIndex() {
  slideIndex++;
  showSlides(slideIndex);
}

function initCarousel() {
  let slides = document.getElementsByClassName("carousel-product");
  let dots = document.querySelectorAll(".carousel-indicators i");
  slides[0].style.display = "block";
  dots[0].className += " active";
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("carousel-product");
  let dots = document.querySelectorAll(".carousel-indicators i");

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    slides[i].classList.remove("slide-animation");
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace("active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  slides[slideIndex - 1].classList.add("slide-animation");
  dots[slideIndex - 1].className += " active";
}

/* ==== SHOW MORE/LESS BUTTON ==== */
function showMoreProducts() {
  productsToShow += 10;
  if (productsToShow > allProducts.length) {
    productsToShow = allProducts.length;
  }
  displayProducts(allProducts.slice(0, productsToShow));
}
function showLessProducts() {
  productsToShow = 10;
  displayProducts(allProducts.slice(0, productsToShow));
}

loadingSpinner();
checkUserLoggedin();
