`use strict`;
const API_BASE = "https://v2.api.noroff.dev/";
const API_PATH = "online-shop";
const API = API_BASE + API_PATH;

let allProducts = [];
let carouselProducts = [];

async function fetchProducts() {
  try {
    const response = await fetch(API);
    if (!response.ok) {
      throw new Error("Error loading products");
    }
    const result = await response.json();
    allProducts = result.data;
  } catch (error) {
    console.log(error);
  } finally {
    displayProducts(allProducts);
    getCarouselProducts();
    renderCarousel(carouselProducts);
    showSlides(slideIndex);
    initDotListeners();
    console.log(allProducts);
    console.log(carouselProducts);
  }
}

function displayProducts(products) {
  const container = document.querySelector(".products-container");
  container.innerHTML = "";
  products.forEach((product) => {
    const div = document.createElement("div");
    div.classList.add("product-card");

    const img = document.createElement("img");
    img.src = product.image.url;

    const descDiv = document.createElement("div");
    descDiv.classList.add("card-description");

    const title = document.createElement("h3");
    title.classList.add("product-title");
    title.textContent = `${product.title}`;

    const price = document.createElement("h3");
    price.classList.add("product-price");
    price.textContent = `$${product.price}`;

    container.appendChild(div);
    div.appendChild(img);
    div.appendChild(descDiv);
    descDiv.appendChild(title);
    descDiv.appendChild(price);
  });
}
fetchProducts();

function getCarouselProducts() {
  // Randomize products for carousel
  const sortedProducts = [...allProducts];
  const shuffled = sortedProducts.sort(() => 0.5 - Math.random());
  carouselProducts = shuffled.slice(0, 3);
}

function renderCarousel(products) {
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
    cartBtn.href = "../product/index.html";
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
let slideIndex = 1;
function initDotListeners() {
  const dotButtons = Array.from(
    document.querySelectorAll(".carousel-indicators i"),
  );
  dotButtons.forEach((dot) => {
    dot.addEventListener("click", (event) => {
      slideIndex = dotButtons.indexOf(event.target) + 1;
      console.log(slideIndex);
      showSlides(slideIndex);
    });
  });
}

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
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
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace("active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}
