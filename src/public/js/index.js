const socket = io();

const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const productNameInput = document.getElementById('product-name');
const productDescriptionInput = document.getElementById('product-description');
const productPriceInput = document.getElementById('product-price');
const productCategoryInput = document.getElementById('product-category');

socket.on('chargeProducts', (products) => {
  productList.innerHTML = '';
  products.forEach(product => {
    const li = document.createElement('li');
    const productName = product.title;
    const productDescription = product.description;
    const productPrice = product.price;
    const productCategory = product.category;

    li.textContent = `${productName} - ${productDescription} - $${productPrice} - ${productCategory}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => {
      socket.emit('removeProduct', product.id);
    });

    li.appendChild(deleteButton);
    productList.appendChild(li);
  });
});


productForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const productName = productNameInput.value;
  const productDescription = productDescriptionInput.value;
  const productPrice = productPriceInput.value;
  const productCategory = productCategoryInput.value;
  if (productName) {
    socket.emit('addProduct', { title: productName, description: productDescription, price: productPrice, category: productCategory });
    productForm.reset();
  }
});