const socket = io();

const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const productIdInput = document.getElementById('product-id');
const productNameInput = document.getElementById('product-name');
const productDescriptionInput = document.getElementById('product-description');
const productCodeInput = document.getElementById('product-code');
const productStockInput = document.getElementById('product-stock');
const productPriceInput = document.getElementById('product-price');
const productCategoryInput = document.getElementById('product-category');
const productThumbnailsInput = document.getElementById('product-thumbnails');

function renderProducts(products) {
  productList.innerHTML = '';
  products.forEach(product => {
    const li = document.createElement('li');
    const productName = product.title;
    const productDescription = product.description;
    const productCode = product.code || '';
    const productStock = product.stock || '';
    const productPrice = product.price;
    const productCategory = product.category;
    const productThumbnails = product.thumbnails ? product.thumbnails.join(', ') : '';

    li.textContent = `${productName} - ${productDescription} - Código: ${productCode} - Stock: ${productStock} - $${productPrice} - Categoría: ${productCategory} - Imágenes: ${productThumbnails}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => {
      socket.emit('removeProduct', product._id);
    });

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Actualizar';
    updateButton.classList.add('update-button');
    updateButton.addEventListener('click', () => {
      productIdInput.value = product._id;
      productNameInput.value = product.title;
      productDescriptionInput.value = product.description;
      productCodeInput.value = product.code || '';
      productStockInput.value = product.stock || '';
      productPriceInput.value = product.price;
      productCategoryInput.value = product.category;
      productThumbnailsInput.value = product.thumbnails ? product.thumbnails.join(', ') : '';
      productForm.querySelector('button[type="submit"]').textContent = 'Actualizar producto';
      productForm.scrollIntoView({ behavior: 'smooth' });
    });

    li.appendChild(deleteButton);
    li.appendChild(updateButton);
    productList.appendChild(li);
  });
}

socket.on('chargeProducts', (products) => {
  renderProducts(products);
});

socket.on('updateProducts', (products) => {
  renderProducts(products);
});

socket.on('error', (error) => {
  alert(`Error: producto duplicado`);
});

productForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const productId = productIdInput.value.trim(); 
  const productName = productNameInput.value;
  const productDescription = productDescriptionInput.value;
  const productCode = productCodeInput.value;
  const productStock = productStockInput.value;
  const productPrice = productPriceInput.value;
  const productCategory = productCategoryInput.value;
  const productThumbnails = productThumbnailsInput.value.split(',').map(url => url.trim());

  if (productName && productDescription && productCode && productStock && productPrice && productCategory && productThumbnails) {
    const productData = { title: productName, description: productDescription, code: productCode, stock: productStock, price: productPrice, category: productCategory, thumbnails: productThumbnails };
    if (productId) {
      productData.id = productId; // Include ID for update
      socket.emit('updateProduct', productData);
      productForm.querySelector('button[type="submit"]').textContent = 'Agregar producto';
    } else {
      socket.emit('addProduct', productData);
    }
    productForm.reset();
  }
});

async function addToCart(event) {
  event.preventDefault(); // Previene que se recargue la página
  
  const productId = event.target.getAttribute('data-product-id'); // Obtener el ID del producto
  const cartId = "{{user.cart}}"; // Asegúrate de que user.cart esté disponible en la vista

  try {
    const response = await fetch(`/${cartId}/product/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Actualizar el contador del carrito si la solicitud fue exitosa
      const data = await response.json();
      const cartCount = document.getElementById('cart-count');
      cartCount.textContent = data.totalQuantity; // Actualizar el número de productos en el carrito
    } else {
      console.error('Error al añadir el producto al carrito');
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}