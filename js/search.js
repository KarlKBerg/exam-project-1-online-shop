"use strict";
import {
  loadingSpinner,
  stopLoadingSpinner,
  similarProducts,
  displayMessage,
} from "./utils.js";
const API_BASE = "https://v2.api.noroff.dev/";
const API_PATH = "online-shop";
const API = API_BASE + API_PATH;
let allProducts = [];
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
    stopLoadingSpinner();
  }
}
// Search
let searchInputContainer = document.querySelector(".search-i input");

searchInputContainer.addEventListener("input", (event) => {
  const searchTerm = event.target.value;
  if (searchTerm === "") {
    document.querySelector(".search-result").classList.add("hidden");
  } else {
    document.querySelector(".search-result").classList.remove("hidden");
    const filteredProducts = filterProducts(searchTerm);
    displaySearch(filteredProducts);
  }
});

function filterProducts(search) {
  let searchString = search.toLowerCase().trim();
  if (!searchString) {
    return;
  }
  const filtered = allProducts.filter((searchProduct) => {
    const nameMatch = searchProduct.title.toLowerCase().includes(searchString);
    const descriptionMatch = searchProduct.description
      .toLowerCase()
      .includes(searchString);

    return nameMatch || descriptionMatch;
  });
  return filtered;
}

function displaySearch(products) {
  const container = document.querySelector(".search-result");
  if (container) {
    container.innerHTML = "";
    if (products.length === 0) {
      const noProducts = document.createElement("p");
      noProducts.textContent = "No products matching search";
    } else {
      products.forEach((p) => {
        const product = document.createElement("a");
        product.classList.add("search-product");
        product.setAttribute(`href`, `../product/index.html?id=${p.id}`);

        const img = document.createElement("img");
        img.src = p.image.url;

        const titlePriceDiv = document.createElement("div");
        titlePriceDiv.classList.add("title-price-search");

        const title = document.createElement("h2");
        title.classList.add("section-heading");
        title.textContent = p.title;

        const price = document.createElement("h2");
        price.classList.add("section-heading");
        price.textContent = p.price;

        container.appendChild(product);
        product.appendChild(img);
        product.appendChild(titlePriceDiv);
        titlePriceDiv.appendChild(title);
        titlePriceDiv.appendChild(price);
      });
    }
  }
}
fetchProducts();
