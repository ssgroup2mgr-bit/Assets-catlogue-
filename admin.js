import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// YAHAN APNI IMGBB API KEY DAALEIN 👇
const IMGBB_API_KEY = "7f3b143fbfa5a5491369ad6884a1c407"; 

const form = document.getElementById('addProductForm');
const submitBtn = document.getElementById('submitBtn');
const formTitle = document.getElementById('formTitle');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const editProductId = document.getElementById('editProductId');
const existingImageUrl = document.getElementById('existingImageUrl');
const totalProductsEl = document.getElementById('totalProducts');
const adminProductContainer = document.getElementById('adminProductContainer');
const adminCategoryFilter = document.getElementById('adminCategoryFilter');

let allProducts = [];

// Fetch and Render Products
const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
    allProducts = [];
    snapshot.forEach((doc) => {
        allProducts.push({ id: doc.id, ...doc.data() });
    });
    renderAdminProducts(allProducts);
});

function renderAdminProducts(productsToRender) {
    adminProductContainer.innerHTML = '';
    totalProductsEl.innerText = productsToRender.length; 

    if(productsToRender.length === 0) {
        adminProductContainer.innerHTML = '<tr><td colspan="5" style="text-align:center;">No products found.</td></tr>';
        return;
    }

    productsToRender.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${product.image}" class="admin-img-preview" onerror="this.src='https://via.placeholder.com/50'"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${product.id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${product.id}">Delete</button>
            </td>
        `;
        adminProductContainer.appendChild(tr);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', handleDelete));
    document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', handleEdit));
}

adminCategoryFilter.addEventListener('change', (e) => {
    const selected = e.target.value;
    if (selected === "All") {
        renderAdminProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === selected);
        renderAdminProducts(filtered);
    }
});

// Form Submit logic
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const category = document.getElementById('category').value;
    const id = editProductId.value; 
    
    const imageFile = document.getElementById('imageFile').files[0];
    let finalImageUrl = existingImageUrl.value; 

    // Validation
    if (!id && !imageFile) {
        alert("Please select an image to upload!");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = imageFile ? "Uploading Image..." : "Saving Data...";

    try {
        // NAYA TARIQA: Mobile browser support ke liye image ko Base64 me convert karna
        if (imageFile) {
            const base64String = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(imageFile);
                reader.onload = () => resolve(reader.result.split(',')[1]); // Base64 data nikalna
                reader.onerror = error => reject(error);
            });

            const formData = new FormData();
            formData.append("image", base64String); // Ab hum text form me bhej rahe hain

            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                finalImageUrl = data.data.url; 
            } else {
                throw new Error(data.error.message || "ImgBB Server Error");
            }
        }

        submitBtn.innerText = "Saving to Database...";

        if (id) {
            const productRef = doc(db, "products", id);
            await updateDoc(productRef, { name, description, image: finalImageUrl, price, category });
            alert("Product updated successfully!");
        } else {
            await addDoc(collection(db, "products"), {
                name, description, image: finalImageUrl, price, category, createdAt: serverTimestamp()
            });
            alert("Product added successfully!");
        }
        resetForm();
    } catch (error) {
        console.error("Exact Error: ", error);
        alert("Error: " + error.message + " (Check karein ki aapne sahi API Key daali hai ya nahi)");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = id ? "Update Product" : "Add Product";
    }
});


async function handleDelete(e) {
    const id = e.target.getAttribute('data-id');
    if(confirm("Kyun? Sach mein delete karna hai ye product?")) {
        try {
            await deleteDoc(doc(db, "products", id));
        } catch (error) {
            console.error("Error deleting: ", error);
            alert("Error deleting product.");
        }
    }
}

function handleEdit(e) {
    const id = e.target.getAttribute('data-id');
    const product = allProducts.find(p => p.id === id);
    
    if(product) {
        document.getElementById('name').value = product.name;
        document.getElementById('description').value = product.description;
        document.getElementById('price').value = product.price;
        document.getElementById('category').value = product.category;
        
        // Image input ko blank chhod dete hain, lekin purana URL hidden input me save rakhte hain
        existingImageUrl.value = product.image; 
        
        editProductId.value = product.id;
        formTitle.innerText = "Edit Product";
        submitBtn.innerText = "Update Product";
        cancelEditBtn.style.display = "block";
        window.scrollTo(0, 0);
    }
}

cancelEditBtn.addEventListener('click', resetForm);

function resetForm() {
    form.reset();
    editProductId.value = "";
    existingImageUrl.value = "";
    formTitle.innerText = "Add New Product";
    submitBtn.innerText = "Add Product";
    cancelEditBtn.style.display = "none";
}