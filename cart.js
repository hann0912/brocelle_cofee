const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let cartItems = storedCartItems;

const addToCartButtons = document.querySelectorAll('.btn-p');
const cartIcon = document.querySelector('.icon-cart');
const cartCount = document.querySelector('.icon-cart span');

addToCartButtons.forEach(button => {
  const quantityContainer = button.parentElement.querySelector('.quantity-container');
  const quantityDisplay = quantityContainer.querySelector('.quantity');
  const minusBtn = quantityContainer.querySelector('.minus-btn');
  const plusBtn = quantityContainer.querySelector('.plus-btn');
  let quantity = 1;

  minusBtn.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      quantityDisplay.textContent = quantity;
    }
  });

  plusBtn.addEventListener('click', () => {
    quantity++;
    quantityDisplay.textContent = quantity;
  });

  button.addEventListener('click', () => {
    const productDetails = {
      name: button.parentElement.querySelector('.p-title').textContent,
      price: button.parentElement.querySelector('.price').textContent,
      image: button.parentElement.querySelector('img').src,
      quantity: quantity
    };

    const existingItem = cartItems.find(item => item.name === productDetails.name);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.push(productDetails);
    }

    // Store the cartItems array in localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    updateCartCount();
  });
});

function updateCartCount() {
  let totalQuantity = 0;
  cartItems.forEach(item => {
    totalQuantity += item.quantity;
  });
  cartCount.textContent = totalQuantity;
}

// Render the cart items on the "addtocart.html" page
const cartItemsContainer = document.getElementById('cart-items-container');
const totalPriceElement = document.getElementById('total-price');

function renderCartItems() {
  cartItemsContainer.innerHTML = '';
  let totalPrice = 0;

  cartItems.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <img src="${item.image}" alt="${item.name}" width="50">
        ${item.name}
      </td>
      <td>${item.price}</td>
      <td>
        <div class="quantity-container d-flex align-items-center">
          <button class="quantity-btn minus-btn">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn plus-btn">+</button>
        </div>
      </td>
      <td>${(item.quantity * parseFloat(item.price.replace('RM', ''))).toFixed(2)}</td>
      <td>
        <button class="btn btn-danger btn-sm remove-btn">Remove</button>
      </td>
    `;
    cartItemsContainer.appendChild(row);
    totalPrice += item.quantity * parseFloat(item.price.replace('RM', ''));

    const minusBtn = row.querySelector('.minus-btn');
    const plusBtn = row.querySelector('.plus-btn');
    const quantityDisplay = row.querySelector('.quantity');
    const removeBtn = row.querySelector('.remove-btn');

    minusBtn.addEventListener('click', () => {
      if (item.quantity > 1) {
        item.quantity--;
        quantityDisplay.textContent = item.quantity;
        renderCartItems();
        updateCartCount();
      }
    });

    plusBtn.addEventListener('click', () => {
      item.quantity++;
      quantityDisplay.textContent = item.quantity;
      renderCartItems();
      updateCartCount();
    });

    removeBtn.addEventListener('click', () => {
      cartItems.splice(index, 1);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      renderCartItems();
      updateCartCount();
    });
  });

  totalPriceElement.textContent = `RM${totalPrice.toFixed(2)}`;
}

// Call the renderCartItems function when the "addtocart.html" page loads
if (window.location.href.includes('addtocart.html')) {
  renderCartItems();
  updateCartCount();
}

cartIcon.addEventListener('click', () => {
  const cartItemsContainer = document.getElementById('cart-items-container');
  cartItemsContainer.innerHTML = '';
  cartItems.forEach(item => {
    const cartItemElement = document.createElement('div');
    cartItemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}" width="50">
      <span>${item.name}</span>
      <span>${item.price}</span>
      <span>Quantity: ${item.quantity}</span>
    `;
    cartItemsContainer.appendChild(cartItemElement);
  });
});