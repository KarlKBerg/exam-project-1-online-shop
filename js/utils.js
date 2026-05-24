// Loading spinner
export function loadingSpinner() {
  const loadingContainer = document.querySelector(".loading-main");
  const mainContainer = document.querySelector(".main");
  loadingContainer.classList.remove("hidden");
  mainContainer.classList.add("hidden");
}

// Stop loading spinner
export function stopLoadingSpinner() {
  const loadingContainer = document.querySelector(".loading-main");
  const mainContainer = document.querySelector(".main");
  loadingContainer.classList.add("hidden");
  mainContainer.classList.remove("hidden");
}

// Success/Error message
export function displayMessage(text, type) {
  const messageContainer = document.querySelector("main .message-container");
  messageContainer.innerHTML = "";
  messageContainer.classList.remove("hidden");
  if (type === "success") {
    messageContainer.classList.add("success");
  } else {
    messageContainer.classList.add("error");
  }
  const message = document.createElement("h3");
  message.textContent = text;
  messageContainer.appendChild(message);
  setTimeout(() => {
    messageContainer.classList.add("hidden");
  }, 4000);
}

// Added/Removed from cart message
export function cartMessage(id, text, type) {
  const messageContainer = document.querySelector("main .message-container");
  messageContainer.innerHTML = "";
  messageContainer.classList.remove("hidden");

  if (type === "added") {
    messageContainer.classList.add("success");
  } else {
    messageContainer.classList.add("error");
  }
  const message = document.createElement("h3");
  message.textContent = `${id} ${text}`;
  messageContainer.appendChild(message);
  setTimeout(() => {
    messageContainer.classList.add("hidden");
  }, 4000);
}

/* ==== PRODUCT SLIDES ==== */
export const sliderPositions = {
  "on-sale": 0,
  "top-rated": 0,
  "dont-miss-out": 0,
  "similar-products": 0,
};
export const onSale = [];
export const topRated = [];

export function renderSlider(type, id) {
  const container = document.querySelector(`#${id} .slider-track`);
  container.innerHTML = "";

  type.forEach((p) => {
    const card = document.createElement("div");
    card.classList.add("container");

    const img = document.createElement("img");
    img.src = p.image.url;

    const cardDesc = document.createElement("div");
    cardDesc.classList.add("card-description");

    const titleFav = document.createElement("div");
    titleFav.classList.add("title-fav");

    const title = document.createElement("h3");
    title.classList.add("product-title");
    title.textContent = p.title;

    const favIcon = document.createElement("i");
    favIcon.classList.add("fa-solid", "fa-heart");

    const price = document.createElement("h3");
    price.classList.add("product-price");
    price.textContent = p.price;

    const priceDiv = document.createElement("div");
    priceDiv.classList.add("on-sale-price");

    const discountedPrice = document.createElement("h3");
    discountedPrice.classList.add("discounted-price");
    discountedPrice.textContent = p.discountedPrice;

    const originalPrice = document.createElement("h3");
    originalPrice.classList.add("original-price");
    originalPrice.textContent = p.price;

    const saleTag = document.createElement("h4");
    saleTag.classList.add("sale-tag");
    saleTag.textContent = `Sale`;

    const productTag = document.createElement("a");
    productTag.setAttribute(`href`, `product/index.html?id=${p.id}`);
    productTag.classList.add("product-card");

    if (p.price > p.discountedPrice) {
      container.appendChild(productTag);
      productTag.appendChild(card);
      card.appendChild(img);
      card.appendChild(cardDesc);
      cardDesc.appendChild(titleFav);
      titleFav.appendChild(title);
      titleFav.appendChild(favIcon);
      cardDesc.appendChild(saleTag);
      cardDesc.appendChild(priceDiv);
      priceDiv.appendChild(discountedPrice);
      priceDiv.appendChild(originalPrice);
    } else {
      container.appendChild(productTag);
      productTag.appendChild(card);
      card.appendChild(img);
      card.appendChild(cardDesc);
      cardDesc.appendChild(titleFav);
      titleFav.appendChild(title);
      titleFav.appendChild(favIcon);
      cardDesc.appendChild(price);
    }
  });
}

// Next/Prev buttons
export function slideButtons() {
  const buttons = document.querySelectorAll(".slide-buttons i");
  buttons.forEach((b) => {
    b.addEventListener("click", (event) => {
      let div = event.target.closest(".slide-buttons");
      let btn = div.dataset.slider;
      let track = document.querySelector(`#${btn} .slider-track`);

      let containerWidth = track.scrollWidth;

      let trackWidth = document.querySelector(
        `#${btn} .slider-container`,
      ).offsetWidth;

      if (event.target.classList.contains("fa-square-chevron-right")) {
        if (sliderPositions[btn] === -(containerWidth - trackWidth)) {
          sliderPositions[btn] = 0;
        } else {
          sliderPositions[btn] -= 282;
        }
        if (sliderPositions[btn] < -(containerWidth - trackWidth)) {
          sliderPositions[btn] = -(containerWidth - trackWidth);
        }
      } else if (event.target.classList.contains("fa-square-chevron-left")) {
        sliderPositions[btn] += 282;
        if (sliderPositions[btn] > 0) {
          sliderPositions[btn] = -(containerWidth - trackWidth);
        }
      }
      track.style.transform = `translateX(${sliderPositions[btn]}px)`;
    });
  });
}
// On sale - All products on sale
export function onSaleProducts(allProducts) {
  allProducts.forEach((p) => {
    if (p.price > p.discountedPrice) {
      onSale.push(p);
    }
  });
}
// Top rated - over 4.5 rated
export function topRatedProducts(allProducts) {
  allProducts.forEach((p) => {
    if (p.rating >= 4) {
      topRated.push(p);
    }
  });
}

export function openCloseMenu() {
  const menu = document.querySelector(".mobile-icons a");
  menu.addEventListener("click", () => {
    const button = document.querySelector(".mobile-menu-container");
    button.classList.toggle("hidden");
  });
}

export function checkUserLoggedin() {
  if (localStorage.userToken) {
    const loginBtn = document.querySelector(".login-nav-btn");
    const mobileLoginBtn = document.querySelector(".mobile-login-nav-btn");
    const addToCartBtn = document.querySelector(".info-div");
    if (loginBtn) {
      loginBtn.innerHTML = "";
      const icon = document.createElement("i");
      icon.classList.add("fa-solid", "fa-arrow-right-from-bracket");
      const text = document.createElement("p");
      text.textContent = "Log out";

      loginBtn.appendChild(icon);
      loginBtn.appendChild(text);
      loginBtn.addEventListener("click", logOut);
    }
    if (mobileLoginBtn) {
      mobileLoginBtn.innerHTML = "";
      const mobileText = document.createElement("p");
      mobileText.textContent = "Log out";

      mobileLoginBtn.appendChild(mobileText);
      mobileLoginBtn.addEventListener("click", logOut);
    }
  }
}

export function logOut() {
  localStorage.removeItem("userToken");
  window.location.href = "/account/login.html";
}

export async function copyUrl(btn) {
  try {
    await navigator.clipboard.writeText(window.location.href);
    btn.classList.remove("fa-share");
    btn.classList.add("fa-check");
    setTimeout(() => {
      btn.classList.remove("fa-check");
      btn.classList.add("fa-share");
    }, 2000);
  } catch (error) {
    displayMessage("Error copying link", "error");
  }
}
