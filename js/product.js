"use strict";
import {
  loadingSpinner,
  stopLoadingSpinner,
  displayMessage,
  cartMessage,
} from "./utils.js";

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
    document.querySelector(".breadcrumb-inactive").textContent =
      result.data.title;
  } catch (error) {
    displayMessage(error, "error");
  }
}
if (!ID) {
  displayMessage("No id found", "error");
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

  const addToCartBtn = document.createElement("a");
  addToCartBtn.classList.add("add-to-cart-btn");
  addToCartBtn.textContent = "Add to cart";
  // Product
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
  // Review
  document.querySelector(".reviews h2").textContent =
    `Reviews (${data.reviews.length})`;
  data.reviews.forEach((review) => {
    const reviewDiv = document.createElement("div");
    reviewDiv.classList.add("review");

    const reviewHeading = document.createElement("div");
    reviewHeading.classList.add("review-heading");

    const name = document.createElement("h3");
    name.classList.add("name");
    name.textContent = review.username;

    const reviewRating = document.createElement("div");
    reviewRating.classList.add("rating");

    const reviewText = document.createElement("p");
    reviewText.classList.add("review-text");
    reviewText.textContent = review.description;

    reviewsContainer.appendChild(reviewDiv);
    reviewDiv.appendChild(reviewHeading);
    reviewHeading.appendChild(name);
    reviewHeading.appendChild(reviewRating);
    for (let r = 0; r < review.rating; r++) {
      const reviewStar = document.createElement("i");
      reviewStar.classList.add("fa-solid", "fa-star");
      reviewRating.appendChild(reviewStar);
    }
    reviewDiv.appendChild(reviewText);
  });
}
// Add product to cart
/*
const addToCartBtn = document.querySelector("#add-to-cart");
addToCartBtn.addEventListener("click", () => {});
*/
