import { db } from './firebase-config.js';
import { collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const productContainer = document.getElementById('productContainer');
const categoryFilter = document.getElementById('categoryFilter');
let allProducts = [];

// Fetch products in realtime
const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
    allProducts = [];
    snapshot.forEach((doc) => {
        allProducts.push({ id: doc.id, ...doc.data() });
    });
    renderProducts(allProducts);
});

// Render cards logic
function renderProducts(productsToRender) {
    productContainer.innerHTML = ''; // Clear container

    if(productsToRender.length === 0) {
        productContainer.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No products found.</p>';
        return;
    }

    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-price">₹${product.price}</div>
            </div>
        `;
        productContainer.appendChild(card);
    });
}

// Category Filter logic
categoryFilter.addEventListener('change', (e) => {
    const selectedCategory = e.target.value;
    
    if (selectedCategory === "All") {
        renderProducts(allProducts);
    } else {
        const filteredProducts = allProducts.filter(p => p.category === selectedCategory);
        renderProducts(filteredProducts);
    }
});
