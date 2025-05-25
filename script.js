
const products = [
    {
        id: 1,
        title: "Oppo Enco Buds 2",
        category: "electronics",
        price: 1799.00,
        oldPrice: 3999.00,
        image: "oppo.webp",
        badge: "Sale",
        rating: 4.5
    },
    {
        id: 2,
        title: "Crossbeats Nexus",
        category: "electronics",
        price: 3999.00,
        oldPrice: 11999.00,
        image: "Nexus_Black.webp",
        badge: "New",
        rating: 4.2
    },
    {
        id: 3,
        title: "BASIC DENIM JACKET",
        category: "fashion",
        price: 3550.00,
        oldPrice: 9999.00,
        image: "denim.jpg",
        rating: 4.0
    },
    {
        id: 4,
        title: "FLYING MACHINE 2.0 Solid Sneaker",
        category: "fashion",
        price: 1759.00,
        oldPrice: 3199.00,
        image: "fying.webp",
        badge: "Sale",
        rating: 4.7
    },
    {
        id: 5,
        title: "Morphy Richards Europa Drip Coffee Maker",
        category: "home",
        price: 1599.00,
        oldPrice: 3199.00,
        image: "coffee.webp",
        rating: 4.3
    },
    {
        id: 6,
        title: "Marshall Emberton",
        category: "electronics",
        price: 13499.00,
        oldPrice: 19999.00,
        image: "marshal.jpg",
        badge: "Sale",
        rating: 4.1
    },
    {
        id: 7,
        title: "H&M LOOSE FIT PRINTED T-SHIRT",
        category: "fashion",
        price: 699.00,
        oldPrice: 1999.00,
        image: "hm.avif",
        rating: 3.9
    },
    {
        id: 8,
        title: "ExclusiveLane Decorative Lamp",
        category: "home",
        price: 1924.00,
        oldPrice: 3849.00,
        image: "dec.avif",
        badge: "New",
        rating: 4.4
    }
];


const cardStyle = document.createElement('style');
cardStyle.textContent = `
    .product-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }
    .product-info {
        margin-top: auto;
    }
`;
document.head.appendChild(cardStyle);


function formatPrice(price) {
    return `₹${price.toFixed(2)}`;
}


const style = document.createElement('style');
style.textContent = `
    .product-img {
        width: 100%;
        height: auto;
        object-fit: cover;
    }
`;
document.head.appendChild(style);

const productGrid = document.querySelector('.product-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total h4 span');
const checkoutBtn = document.querySelector('.checkout-btn');


let cart = JSON.parse(localStorage.getItem('cart')) || [];


function displayProducts(filter = 'all') {
    productGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        let badge = '';
        if (product.badge) {
            badge = `<span class="product-badge">${product.badge}</span>`;
        }
        
        let oldPrice = '';
        if (product.oldPrice) {
            oldPrice = `<span class="old-price">${formatPrice(product.oldPrice)}</span>`;
        }
        
        productCard.innerHTML = `
            ${badge}
            <img src="${product.image}" alt="${product.title}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <span class="product-category">${product.category}</span>
                <div class="product-price">
                    <div>
                        ${oldPrice}
                        <span class="price">${formatPrice(product.price)}</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
   
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
}


filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
       
        filterBtns.forEach(btn => btn.classList.remove('active'));
       
        btn.classList.add('active');
  
        displayProducts(btn.dataset.filter);
    });
});


function addToCart(e) {
    const id = parseInt(e.target.dataset.id);
    const product = products.find(product => product.id === id);
    
   
    const cartItem = cart.find(item => item.id === id);
    
    if (cartItem) {
    
        cartItem.quantity += 1;
    } else {
   
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    
    updateCartCount();
    

    showAlert(`${product.title} added to cart`);
    

    displayCartItems();
}


function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}


function displayCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = '₹0.00';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">${formatPrice(item.price)}</p>
                <p class="cart-item-remove" data-id="${item.id}">Remove</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
  
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `${formatPrice(total)}`;
    
  
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', removeFromCart);
    });
    
    
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', updateQuantity);
    });
    
   
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', updateQuantity);
    });
}


function removeFromCart(e) {
    const id = parseInt(e.target.dataset.id);
    cart = cart.filter(item => item.id !== id);
    

    localStorage.setItem('cart', JSON.stringify(cart));
    
 
    updateCartCount();
    
   
    displayCartItems();
    
   
    showAlert('Item removed from cart');
}


function updateQuantity(e) {
    const id = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === id);
    
    if (e.target.classList.contains('minus')) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
           
            cart = cart.filter(item => item.id !== id);
        }
    } else if (e.target.classList.contains('plus')) {
        item.quantity += 1;
    } else if (e.target.classList.contains('quantity-input')) {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
           
            cart = cart.filter(item => item.id !== id);
        }
    }
    
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
   
    updateCartCount();
    
   
    displayCartItems();
}


function showAlert(message) {
    const alert = document.createElement('div');
    alert.classList.add('alert');
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.classList.add('fade-out');
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 2000);
}


cartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
});

cartOverlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showAlert('Your cart is empty');
        return;
    }
    
    
    showAlert('Proceeding to checkout');
    setTimeout(() => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }, 1000);
});


document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
  
    displayProducts();
    
    
    updateCartCount();
    
    
    displayCartItems();
});


window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    
    if (scrollPosition > 50) {
        document.querySelector('header').style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    } else {
        document.querySelector('header').style.boxShadow = 'none';
    }
});