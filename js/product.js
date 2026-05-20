"use strict";
import { loadingSpinner, stopLoadingSpinner } from "./utils.js";

const API_BASE = "https://v2.api.noroff.dev/";
const API_PATH = "online-shop";
const API = API_BASE + API_PATH;

const PARAMS = new URLSearchParams(window.location.search);
const ID = PARAMS.get("id");

let cart = [];

// Fetch product from id
async function fetchProduct(id) {
  try {
    const response = await fetch(`${API}/${id}`);
    if (!response.ok) {
      throw new Error("Product id not found");
    }
    const result = await response.json();
    stopLoadingSpinner();
    displayProduct(result.data);
  } catch (error) {
    console.log(error);
  }
}
if (!ID) {
  console.log("No id found");
} else {
  loadingSpinner();
  fetchProduct(ID);
}

// Render product page
function displayProduct(data) {
  const productContainer = document.querySelector(".product-container");
  const reviewsContainer = document.querySelector(".reviews-container");
  productContainer.innerHTML = "";
  reviewsContainer.innerHTML = "";

  const img = document.createElement("img");
  img.src = data.image.url;

  const infoDiv = document.createElement("div");
  infoDiv.classList.add("product-info");

  const title = document.createElement("h1");
  title.classList.add("section-heading");
  title.textContent = data.title;

  const rating = document.createElement("div");
  rating.classList.add("rating");

  const description = document.createElement("p");
  description.classList.add("product-description");
  description.textContent = data.description;

  const amountDiv = document.createElement("div");
  amountDiv.classList.add("amount-select");

  const minus = document.createElement("i");
  minus.classList.add("fa-regular", "fa-circle-minus");

  const amount = document.createElement("p");
  amount.textContent = 1;

  const pluss = document.createElement("i");
  pluss.classList.add("fa-regular", "fa-circle-plus");

  const priceDiv = document.createElement("div");
  priceDiv.classList.add("price-container");

  const price = document.createElement("h2");
  price.classList.add("original-price");
  price.textContent = data.price;

  const noSalePrice = document.createElement("h2");
  noSalePrice.textContent = data.price;

  const discountedPrice = document.createElement("h2");
  discountedPrice.classList.add("discounted-price");
  discountedPrice.textContent = data.discountedPrice;

  productContainer.appendChild(img);
  productContainer.appendChild(infoDiv);
  infoDiv.appendChild(title);
  infoDiv.appendChild(rating);
  if (data.rating < 1) {
    const noRating = document.createElement("p");
    noRating.textContent = "No rating yet";
    rating.appendChild(noRating);
  }
  for (let i = 0; i < data.rating; i++) {
    const star = document.createElement("i");
    star.classList.add("fa-solid", "fa-star");
    rating.appendChild(star);
  }

  infoDiv.appendChild(description);
  infoDiv.appendChild(amountDiv);
  amountDiv.appendChild(minus);
  amountDiv.appendChild(amount);
  amountDiv.appendChild(pluss);
  infoDiv.appendChild(priceDiv);
  if (data.price > data.discountedPrice) {
    priceDiv.appendChild(discountedPrice);
    priceDiv.appendChild(price);
  } else {
    priceDiv.appendChild(noSalePrice);
  }
  infoDiv.appendChild(addToCartBtn);
}
// Add product to cart
/*
const addToCartBtn = document.querySelector("#add-to-cart");
addToCartBtn.addEventListener("click", () => {});
*/
