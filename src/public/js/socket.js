const socket = io();
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

productForm.addEventListener('submit', e => {
  e.preventDefault();
  const productData = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    code: document.getElementById('code').value,
    price: parseFloat(document.getElementById('price').value),
    status: true,
    stock: parseInt(document.getElementById('stock').value),
    category: document.getElementById('category').value,
    thumbnails: []
  };
  socket.emit('newProduct', productData);
  productForm.reset();
});

function deleteProduct(id) {
  socket.emit('deleteProduct', id);
}

socket.on('productListUpdate', (products) => {
  productList.innerHTML = '';
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `${product.title} - $${product.price} <button onclick="deleteProduct(${product.id})">Eliminar</button>`;
    productList.appendChild(li);
  });
});