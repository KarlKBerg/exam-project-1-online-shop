`use strict`;
const API_BASE = "https://v2.api.noroff.dev/";
const API_PATH = "online-shop";
const API = API_BASE + API_PATH;

let productsToShow = 10;

async function fetchProducts() {
  try {
    const response = await fetch(API);
    if (!response.ok) {
      throw new Error("Error loading products");
    }
    const result = await response.json();
    const allProducts = result.data;
    console.log(allProducts);
    displayProducts(allProducts);
  } catch (error) {
    console.log(error);
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
