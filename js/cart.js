`use strict`;
import { cartMessage, openCloseMenu } from "./utils.js";

export let cart = JSON.parse(localStorage.getItem("cart")) || [];

export function calculateCart() {
  let subtotal = 0;
  cart.forEach((product) => {
    let priceToUse = 0;
    if (product.price > product.discountedPrice) {
      priceToUse = product.discountedPrice;
    } else {
      priceToUse = product.price;
    }
    subtotal += Number(priceToUse);
  });
  subtotal = Number(subtotal.toFixed(2));
  let tax = subtotal * 0.25;
  tax = parseFloat(tax.toFixed(2));
  const total = subtotal + tax;
  const formattedTotal = parseFloat(total.toFixed(2));
  displayCartPrices(subtotal, tax, formattedTotal);
  renderDetails(subtotal, tax, formattedTotal);
  renderOrderSummary(subtotal, tax, formattedTotal);
}

export function displayCartPrices(sub, tax, total) {
  const subtotalPrice = document.querySelector("#subtotal");
  const taxPrice = document.querySelector("#tax");
  const totalPrice = document.querySelector("#total");
  if (!subtotalPrice || !taxPrice || !totalPrice) return;
  subtotalPrice.textContent = `$${sub.toFixed(2)}`;
  taxPrice.textContent = `$${tax.toFixed(2)}`;
  totalPrice.textContent = `$${total}`;
}

export function addToCart(product) {
  cart.push(product);
  cartMessage(`${product.title}`, `was added to the cart`, "added");
  displayCartItems();
  calculateCart();
  saveCart();
}

export function displayCartItems() {
  const container = document.querySelector(".cart-container");
  if (!container) return;
  container.innerHTML = "";
  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.dataset.id = item.id;

    const imgTitleDiv = document.createElement("div");
    imgTitleDiv.classList.add("img-title-amount");

    const img = document.createElement("img");
    img.src = item.image.url;

    const titleAmountDiv = document.createElement("div");
    titleAmountDiv.classList.add("title-amount");

    const title = document.createElement("h2");
    title.classList.add("section-heading");
    title.textContent = item.title;

    const amountSelectDiv = document.createElement("div");
    amountSelectDiv.classList.add("amount-select");

    const minus = document.createElement("i");
    minus.classList.add("fa-regular", "fa-circle-minus");

    const amount = document.createElement("p");
    amount.textContent = 1;

    const plus = document.createElement("i");
    plus.classList.add("fa-regular", "fa-circle-plus");

    const deletePriceDiv = document.createElement("div");
    deletePriceDiv.classList.add("delete-price");

    const deleteItem = document.createElement("p");
    deleteItem.textContent = "Delete";
    deleteItem.classList.add("delete-btn");

    const priceDiv = document.createElement("div");
    priceDiv.classList.add("price-container");

    const price = document.createElement("h2");
    price.classList.add("original-price");
    price.textContent = `$${item.price}`;

    const noSalePrice = document.createElement("h2");
    noSalePrice.textContent = item.price;

    const discountedPrice = document.createElement("h2");
    discountedPrice.classList.add("discounted-price");
    discountedPrice.textContent = item.discountedPrice;

    container.appendChild(cartItem);
    cartItem.appendChild(imgTitleDiv);
    imgTitleDiv.appendChild(img);
    imgTitleDiv.appendChild(titleAmountDiv);
    titleAmountDiv.appendChild(title);
    titleAmountDiv.appendChild(amountSelectDiv);
    amountSelectDiv.appendChild(minus);
    amountSelectDiv.appendChild(amount);
    amountSelectDiv.appendChild(plus);
    cartItem.appendChild(deletePriceDiv);
    deletePriceDiv.appendChild(deleteItem);
    deletePriceDiv.appendChild(priceDiv);
    if (item.price > item.discountedPrice) {
      priceDiv.appendChild(discountedPrice);
      priceDiv.appendChild(price);
    } else {
      priceDiv.appendChild(noSalePrice);
    }
  });
  const totalPrice = document.querySelector(".total-price .price");
  let subPrice = 0;
  cart.forEach((p) => {
    if (p.price > p.discountedPrice) {
      subPrice += p.discountedPrice;
    } else {
      subPrice += p.price;
    }
  });
  if (totalPrice) {
    totalPrice.textContent = `$${subPrice.toFixed(2)}`;
  }
}
export function deleteCartItem(event) {
  if (!event.target.classList.contains("delete-btn")) return;
  const product = event.target.closest(".cart-item");
  const productId = product.dataset.id;
  const productName = cart.find((item) => item.id === productId);
  cart = cart.filter((item) => item.id !== productId);

  isCartEmpty();
  saveCart();
  displayCartItems();
  calculateCart();
  cartMessage(productName.title, " Removed from cart", "removed");
}

// Check if cart is empty and display empty text
export function isCartEmpty() {
  const cartContainer = document.querySelector(".cart-container");
  if (cart.length === 0) {
    const emptyMessage = document.createElement("h2");
    emptyMessage.textContent = "No items in cart";

    cartContainer.appendChild(emptyMessage);
  }
}
// Save cart array to localStorage
export function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderDetails(sub, tax, total) {
  const subtotalDetail = document.getElementById("subtotal-price");
  const taxDetail = document.getElementById("tax-price");
  const totalDetail = document.getElementById("total-price");

  if (subtotalDetail && taxDetail && totalDetail) {
    subtotalDetail.textContent = `$${sub}`;
    taxDetail.textContent = `$${tax}`;
    totalDetail.textContent = `$${total}`;
  }
}

function renderOrderSummary(sub, tax, total) {
  const subtotalDetail = document.getElementById("order-sub-price");
  const taxDetail = document.getElementById("order-tax-price");
  const totalDetail = document.getElementById("order-total-price");
  const container = document.querySelector(".product-summary");
  if (container) {
    container.innerHTML = "";
    cart.forEach((p) => {
      const div = document.createElement("div");
      div.classList.add("name-qty");

      const img = document.createElement("img");
      img.src = p.image.url;

      const columnDiv = document.createElement("div");
      columnDiv.classList.add("column");

      const title = document.createElement("h2");
      title.innerHTML = p.title;
      const qty = document.createElement("p");
      qty.textContent = "QTY: 1";
      const price = document.createElement("p");
      if (p.price > p.discountedPrice) {
        price.textContent = p.discountedPrice;
      } else {
        price.textContent = p.price;
      }

      container.appendChild(div);
      div.appendChild(img);
      div.appendChild(columnDiv);
      columnDiv.appendChild(title);
      columnDiv.appendChild(qty);
      container.appendChild(price);
    });

    if (subtotalDetail && taxDetail && totalDetail) {
      subtotalDetail.textContent = `$${sub}`;
      taxDetail.textContent = `$${tax}`;
      totalDetail.textContent = `$${total}`;
    }
  }
}

function clearCart() {
  cart.length = 0;
  saveCart();
}

displayCartItems();
calculateCart();
document.addEventListener("click", (event) => {
  if (document.getElementById("success-page")) {
    if (event.target.tagName === "A") {
      clearCart();
    }
  }
});

const deleteBtn = document.querySelector(".cart-container");
if (deleteBtn) {
  deleteBtn.addEventListener("click", deleteCartItem);
}
openCloseMenu();
