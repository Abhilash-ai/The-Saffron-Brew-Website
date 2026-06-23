import './style.css';
import { menuCategories, menuItems } from './menuData.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// STATE MANAGEMENT
// ==========================================
let cart = [];
let favorites = new Set(JSON.parse(localStorage.getItem('saffron_favorites') || '[]'));
let loyaltyStamps = parseInt(localStorage.getItem('saffron_stamps') || '0');
let selectedTable = null;
let activeWizardStep = 1;

// Mascot Dialogue Prompts
const mascotDialogues = [
  "Hello friend! Welcome to The Saffron Brew. I'm Saffy! 🐻🍊",
  "Did you know? Saffron is the world's most luxurious spice, harvested entirely by hand! 🌸✨",
  "Mmm, the sweet smell of roasted beans... Try our Signature Saffron Latte today, it has real saffron strings! ☕",
  "Feeling hungry? The Japanese Soufflé Berry Pancakes are incredibly light and fluffy! 🥞🍓",
  "Psst! Click the Loyalty tab. Collect 6 stamps and your next coffee is on me! 🎟️",
  "You can book a cozy corner table in advance using our interactive map. Try it out! 🛋️🗺️",
  "Use the code COZYFRIEND at checkout for a secret complimentary saffron cookie! 🍪"
];
let dialogueIndex = 0;

// ==========================================
// PWA SERVICE WORKER REGISTRATION
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('Saffron SW registered successfully!', reg.scope);
    }).catch(err => {
      console.warn('SW registration failed:', err);
    });
  });
}

// ==========================================
// WEB AUDIO SYNTHESIZER (LO-FI SOUND EFFECTS)
// ==========================================
function playClickSound(type = 'blip') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    if (type === 'blip') {
      // Mascot click blip sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.12);
      
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } 
    else if (type === 'stamp') {
      // Stamp ink press thud sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.16);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } 
    else if (type === 'chime') {
      // Checkout/Confetti golden chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      osc1.frequency.setValueAtTime(1100, ctx.currentTime + 0.08);
      osc1.frequency.setValueAtTime(1320, ctx.currentTime + 0.16);
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(440, ctx.currentTime);
      osc2.frequency.setValueAtTime(550, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.4);
      osc2.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {
    // Audio context was blocked by browser autoplay policy
  }
}

// ==========================================
// APP INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initLiveHours();
  initNavbarScroll();
  initMascotBehavior();
  initMenuTabs();
  renderMenuItems('all');
  initCartSystem();
  initLoyaltyCard();
  initReservationWizard();
  initReviewsCarousel();
  initGalleryLightbox();
  initFAQAccordion();
  initNewsletterForm();
  initScrollAnimations();
  initCustomizeModalClose();
});

// ==========================================
// LIVE HOURS STATUS
// ==========================================
function initLiveHours() {
  const statusBar = document.getElementById('live-status-bar');
  const statusText = document.getElementById('status-text');
  const indicator = statusBar.querySelector('.status-pulse');
  const closeBtn = document.getElementById('close-banner-btn');
  
  closeBtn.addEventListener('click', () => {
    statusBar.classList.add('hide');
  });

  const now = new Date();
  const currentHour = now.getHours();
  
  // Open 8:00 AM (8) to 10:00 PM (22)
  if (currentHour >= 8 && currentHour < 22) {
    indicator.className = 'status-pulse green';
    statusText.textContent = 'Open Now — Brewing happiness till 10:00 PM';
  } else {
    indicator.className = 'status-pulse red';
    statusText.textContent = 'Closed Now — We open at 08:00 AM tomorrow! ☕';
  }
}

// ==========================================
// NAV BAR SCROLL INTERACTION
// ==========================================
function initNavbarScroll() {
  const header = document.querySelector('.main-header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Highlight Nav Links on Scroll
    const scrollPosition = window.scrollY + 120;
    const sections = ['home', 'specials', 'menu', 'experience', 'loyalty', 'reviews', 'about'];
    
    sections.forEach(secId => {
      const el = document.getElementById(secId);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(link => {
            if (link.getAttribute('data-sec') === secId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      }
    });
  });

  // Mobile hamburger menu toggle
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const menuOverlay = document.getElementById('mobile-menu-overlay');
  
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    menuOverlay.classList.toggle('open');
    playClickSound('blip');
  });

  // Close overlay on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      menuOverlay.classList.remove('open');
    });
  });
}

// ==========================================
// MASCOT INTERACTIVE BEHAVIOR ("Saffy")
// ==========================================
function initMascotBehavior() {
  const trigger = document.getElementById('mascot-trigger');
  const bubble = document.getElementById('mascot-speech-bubble');
  const textContainer = document.getElementById('mascot-text');
  const rightHand = document.querySelector('.mascot-hand-right');

  // Trigger speech on click
  trigger.addEventListener('click', () => {
    playClickSound('blip');
    
    // Wave animation
    rightHand.classList.add('wave');
    setTimeout(() => rightHand.classList.remove('wave'), 1200);

    // Swap text bubble content
    dialogueIndex = (dialogueIndex + 1) % mascotDialogues.length;
    textContainer.textContent = mascotDialogues[dialogueIndex];
    
    bubble.classList.add('show');
    
    // Auto hide bubble after 8 seconds
    clearTimeout(trigger.dataset.timer);
    trigger.dataset.timer = setTimeout(() => {
      bubble.classList.remove('show');
    }, 8000);
  });

  // Initial welcome bubble after 3 seconds
  setTimeout(() => {
    bubble.classList.add('show');
    setTimeout(() => bubble.classList.remove('show'), 7000);
  }, 3000);
}

// ==========================================
// MENU POPULATION & TABS
// ==========================================
function initMenuTabs() {
  const container = document.getElementById('menu-tabs-container');
  
  menuCategories.forEach((cat, index) => {
    const btn = document.createElement('button');
    btn.className = `menu-tab ${index === 0 ? 'active' : ''}`;
    btn.dataset.category = cat.id;
    btn.textContent = cat.name;
    
    btn.addEventListener('click', () => {
      playClickSound('blip');
      document.querySelectorAll('.menu-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMenuItems(cat.id);
    });
    
    container.appendChild(btn);
  });

  // Connect live search bar
  const searchInput = document.getElementById('menu-search-input');
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const activeTab = document.querySelector('.menu-tab.active');
    const catId = activeTab ? activeTab.dataset.category : 'all';
    
    renderMenuItems(catId, query);
  });
}

function renderMenuItems(categoryId, searchQuery = '') {
  const grid = document.getElementById('menu-items-grid');
  grid.innerHTML = '';
  
  let items = menuItems;
  
  // Filter by category
  if (categoryId !== 'all') {
    items = items.filter(item => item.category === categoryId);
  }
  
  // Filter by search query
  if (searchQuery.trim() !== '') {
    items = items.filter(item => 
      item.name.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery))
    );
  }

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="text-center w-full" style="grid-column: 1/-1; padding: 40px 0; color: var(--color-muted);">
        <p style="font-size: 1.2rem;">No cozy coffees or snacks matched your search. 🔍</p>
        <p>Try searching "Saffron" or choose another tab!</p>
      </div>
    `;
    return;
  }

  items.forEach(item => {
    const isFav = favorites.has(item.id);
    const card = document.createElement('div');
    card.className = 'menu-card reveal-up';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="menu-card-img" loading="lazy" />
      <div class="menu-card-info">
        <div class="menu-card-header">
          <h3 class="menu-card-title">${item.name}</h3>
          <span class="menu-card-price">$${item.price.toFixed(2)}</span>
        </div>
        <p class="menu-card-desc">${item.description}</p>
        
        <div class="menu-card-tags">
          ${item.tags.map(tag => `<span class="menu-tag">${tag}</span>`).join('')}
        </div>

        <div class="special-interactive-footer mt-auto">
          <button class="btn btn-outline btn-sm quick-add-btn" data-id="${item.id}">Add to Cart</button>
          <button class="favorite-heart-btn ${isFav ? 'liked' : ''}" data-id="${item.id}" aria-label="Favorite">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
      </div>
    `;

    // Hook Heart click
    const heartBtn = card.querySelector('.favorite-heart-btn');
    heartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(item.id, heartBtn);
    });

    // Hook Add to Cart click (opens customization modal)
    const addBtn = card.querySelector('.quick-add-btn');
    addBtn.addEventListener('click', (e) => {
      openCustomizeModal(item.id);
    });

    grid.appendChild(card);
  });
  
  // Hook specials button clicks as well
  document.querySelectorAll('.specials-section .quick-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      openCustomizeModal(id);
    });
  });

  document.querySelectorAll('.specials-section .favorite-heart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const parentCard = btn.closest('.special-card');
      const id = parentCard.querySelector('.quick-add-btn').getAttribute('data-id');
      toggleFavorite(id, btn);
    });
  });
}

function toggleFavorite(itemId, buttonEl) {
  playClickSound('blip');
  if (favorites.has(itemId)) {
    favorites.delete(itemId);
    buttonEl.classList.remove('liked');
  } else {
    favorites.add(itemId);
    buttonEl.classList.add('liked');
    // Mini bounce animation
    gsap.fromTo(buttonEl.querySelector('svg'), 
      { scale: 0.8 }, 
      { scale: 1.25, duration: 0.3, ease: "back.out(2)", onComplete: () => {
        gsap.to(buttonEl.querySelector('svg'), { scale: 1, duration: 0.1 });
      }}
    );
  }
  localStorage.setItem('saffron_favorites', JSON.stringify(Array.from(favorites)));
}

// Micro-interaction: Flying cup to cart
function triggerFlyToCartAnimation(buttonEl) {
  const cartBtn = document.getElementById('cart-toggle-btn');
  const cartRect = cartBtn.getBoundingClientRect();
  const btnRect = buttonEl.getBoundingClientRect();
  
  // Create flying element
  const flyer = document.createElement('div');
  flyer.textContent = '☕';
  flyer.style.position = 'fixed';
  flyer.style.left = `${btnRect.left + btnRect.width / 2}px`;
  flyer.style.top = `${btnRect.top}px`;
  flyer.style.zIndex = '9999';
  flyer.style.fontSize = '1.5rem';
  flyer.style.pointerEvents = 'none';
  document.body.appendChild(flyer);
  
  // Animate with GSAP
  gsap.to(flyer, {
    x: cartRect.left - btnRect.left,
    y: cartRect.top - btnRect.top,
    scale: 0.3,
    opacity: 0.8,
    duration: 0.8,
    ease: "power2.inOut",
    onComplete: () => {
      flyer.remove();
      // Bounce cart bag
      gsap.fromTo([cartBtn, document.getElementById('mobile-cart-btn')],
        { scale: 0.9 },
        { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }
      );
    }
  });
}

// ==========================================
// SHOPPING CART DRAWER SYSTEM
// ==========================================
function initCartSystem() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  const toggleBtn = document.getElementById('cart-toggle-btn');
  const mobileCartBtn = document.getElementById('mobile-cart-btn');
  const closeBtn = document.getElementById('cart-close-btn');
  const checkoutBtn = document.getElementById('checkout-submit-btn');

  // Toggle drawer open/close
  const openDrawer = () => {
    playClickSound('blip');
    drawer.classList.add('show');
    overlay.classList.add('show');
  };

  const closeDrawer = () => {
    playClickSound('blip');
    drawer.classList.remove('show');
    overlay.classList.remove('show');
  };

  toggleBtn.addEventListener('click', openDrawer);
  mobileCartBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Dine-in vs Takeaway toggle inputs
  const dineInRadio = document.querySelector('input[value="dine-in"]');
  const takeawayRadio = document.querySelector('input[value="takeaway"]');
  const tableInput = document.getElementById('checkout-table-num');
  const timeInput = document.getElementById('checkout-time-val');

  dineInRadio.addEventListener('change', () => {
    playClickSound('blip');
    tableInput.style.display = 'block';
    tableInput.setAttribute('required', 'true');
    timeInput.style.display = 'none';
    timeInput.removeAttribute('required');
    validateCheckoutForm();
  });

  takeawayRadio.addEventListener('change', () => {
    playClickSound('blip');
    tableInput.style.display = 'none';
    tableInput.removeAttribute('required');
    timeInput.style.display = 'block';
    timeInput.setAttribute('required', 'true');
    validateCheckoutForm();
  });

  // Table value inputs listener
  tableInput.addEventListener('input', validateCheckoutForm);
  timeInput.addEventListener('input', validateCheckoutForm);

  // Submit Order / Simulated Checkout
  checkoutBtn.addEventListener('click', () => {
    closeDrawer();
    simulateOrderCheckout();
  });

  // Success modals close click
  document.getElementById('close-success-modal-btn').addEventListener('click', () => {
    playClickSound('blip');
    document.getElementById('checkout-success-modal').style.display = 'none';
  });
}

function updateCartUI() {
  const container = document.getElementById('cart-items-container');
  container.innerHTML = '';

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-badge-count').textContent = totalCount;
  document.getElementById('mobile-cart-badge').textContent = totalCount;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-message">
        <span class="empty-cart-icon">🧺</span>
        <p>Your basket is empty.</p>
        <p style="font-size: 0.85rem; color: var(--color-muted);">Add custom lattes or snacks to fill it up!</p>
      </div>
    `;
    
    document.getElementById('cart-subtotal').textContent = '$0.00';
    document.getElementById('cart-tax').textContent = '$0.00';
    document.getElementById('cart-total').textContent = '$0.00';
    document.getElementById('checkout-submit-btn').setAttribute('disabled', 'true');
    document.getElementById('cart-discount-row').style.display = 'none';
    return;
  }

  // Calculate pricing
  let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;

  // Loyalty Card Discount Check: If stamps collected is 6, the next coffee/specials in cart is free!
  const hasFreeCoffeeReward = loyaltyStamps >= 6;
  const coffeeIndex = cart.findIndex(item => item.category === 'coffee' || item.category === 'specialties');
  
  if (hasFreeCoffeeReward && coffeeIndex > -1) {
    discount = cart[coffeeIndex].price;
    document.getElementById('cart-discount-row').style.display = 'flex';
    document.getElementById('cart-discount').textContent = `-$${discount.toFixed(2)}`;
  } else {
    document.getElementById('cart-discount-row').style.display = 'none';
  }

  const activeSubtotal = subtotal - discount;
  const tax = activeSubtotal * 0.08;
  const total = activeSubtotal + tax;

  // Render items
  cart.forEach(item => {
    const itemRow = document.createElement('div');
    itemRow.className = 'cart-item';
    
    // Create text describing the options configured
    let customText = `Size: ${item.size}`;
    if (item.milk) customText += ` / ${item.milk}`;
    if (item.sweetener) customText += ` / ${item.sweetener}`;
    if (item.extras && item.extras.length > 0) {
      customText += ` / +${item.extras.map(e => e.split(' ')[0]).join(', ')}`;
    }

    itemRow.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        
        <div class="cart-item-modifiers">
          ${customText}
        </div>

        <div class="cart-item-actions">
          <div class="quantity-controller">
            <button class="quantity-btn dec-qty" data-id="${item.id}">&minus;</button>
            <span class="quantity-count">${item.quantity}</span>
            <button class="quantity-btn inc-qty" data-id="${item.id}">&plus;</button>
          </div>
          <button class="cart-item-remove-btn remove-item" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `;

    // Hook quantity actions
    itemRow.querySelector('.dec-qty').addEventListener('click', () => {
      playClickSound('blip');
      adjustQuantity(item.id, -1);
    });
    itemRow.querySelector('.inc-qty').addEventListener('click', () => {
      playClickSound('blip');
      adjustQuantity(item.id, 1);
    });
    itemRow.querySelector('.remove-item').addEventListener('click', () => {
      playClickSound('blip');
      removeFromCart(item.id);
    });

    container.appendChild(itemRow);
  });

  document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
  
  validateCheckoutForm();
}

function adjustQuantity(itemId, amount) {
  const index = cart.findIndex(item => item.id === itemId);
  if (index === -1) return;

  cart[index].quantity += amount;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  updateCartUI();
}

function validateCheckoutForm() {
  const checkoutBtn = document.getElementById('checkout-submit-btn');
  if (cart.length === 0) {
    checkoutBtn.setAttribute('disabled', 'true');
    return;
  }

  const checkoutType = document.querySelector('input[name="checkout-type"]:checked').value;
  if (checkoutType === 'dine-in') {
    const tableNum = parseInt(document.getElementById('checkout-table-num').value);
    if (tableNum >= 1 && tableNum <= 15) {
      checkoutBtn.removeAttribute('disabled');
    } else {
      checkoutBtn.setAttribute('disabled', 'true');
    }
  } else {
    const pickupTime = document.getElementById('checkout-time-val').value;
    if (pickupTime) {
      checkoutBtn.removeAttribute('disabled');
    } else {
      checkoutBtn.setAttribute('disabled', 'true');
    }
  }
}

// Simulated Order Success Receipt Flow
function simulateOrderCheckout() {
  playClickSound('chime');
  
  const successModal = document.getElementById('checkout-success-modal');
  const itemsList = document.getElementById('receipt-items-list');
  const dateField = document.getElementById('receipt-date');
  const subtotalField = document.getElementById('receipt-subtotal');
  const totalField = document.getElementById('receipt-total');
  const serviceField = document.getElementById('receipt-service-type');

  // Populate date
  const now = new Date();
  dateField.textContent = `Date: ${now.toLocaleDateString()} ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

  // Build items lists
  itemsList.innerHTML = '';
  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'receipt-item-row';
    row.innerHTML = `
      <span>${item.quantity}x ${item.name} (${item.size})</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    `;
    itemsList.appendChild(row);
  });

  // Calculate pricing values
  let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;
  
  // Apply reward discount
  const hasFreeCoffeeReward = loyaltyStamps >= 6;
  const coffeeIndex = cart.findIndex(item => item.category === 'coffee' || item.category === 'specialties');
  if (hasFreeCoffeeReward && coffeeIndex > -1) {
    discount = cart[coffeeIndex].price;
    const discountRow = document.createElement('div');
    discountRow.className = 'receipt-item-row loyalty-discount-line';
    discountRow.innerHTML = `
      <span>Loyalty Stamp Free Reward</span>
      <span>-$${discount.toFixed(2)}</span>
    `;
    itemsList.appendChild(discountRow);
  }

  const activeSubtotal = subtotal - discount;
  const tax = activeSubtotal * 0.08;
  const total = activeSubtotal + tax;

  subtotalField.textContent = `$${subtotal.toFixed(2)}`;
  totalField.textContent = `$${total.toFixed(2)}`;

  // Service Details
  const checkoutType = document.querySelector('input[name="checkout-type"]:checked').value;
  if (checkoutType === 'dine-in') {
    const tNum = document.getElementById('checkout-table-num').value;
    serviceField.textContent = `Service: Table Dine-In #${tNum}`;
  } else {
    const tVal = document.getElementById('checkout-time-val').value;
    serviceField.textContent = `Service: Takeaway Pick-Up at ${tVal}`;
  }

  // Stamp Rewards Update
  const coffeesPurchased = cart
    .filter(item => item.category === 'coffee' || item.category === 'specialties')
    .reduce((sum, item) => sum + item.quantity, 0);

  if (coffeesPurchased > 0) {
    const initialStamps = loyaltyStamps;
    if (loyaltyStamps >= 6) {
      // Used the free cup. Reset stamps and add remaining
      loyaltyStamps = Math.max(0, loyaltyStamps - 6) + coffeesPurchased;
    } else {
      loyaltyStamps += coffeesPurchased;
    }
    localStorage.setItem('saffron_stamps', loyaltyStamps.toString());
    
    // Animate stamps one by one with stamp thud sound
    setTimeout(() => {
      animateStampsIncrement(initialStamps, loyaltyStamps);
    }, 800);
  }

  // Clear Cart
  cart = [];
  updateCartUI();

  // Show Success Receipt modal
  successModal.style.display = 'block';
}

function animateStampsIncrement(start, end) {
  const container = document.getElementById('stamp-grid-container');
  const progressText = document.getElementById('stamp-progress-text');
  
  // Set temporary progress tracker
  const clampedStart = Math.min(start, 6);
  const clampedEnd = Math.min(end, 6);
  
  if (clampedStart === clampedEnd) {
    initLoyaltyCard();
    return;
  }

  let current = clampedStart;
  const interval = setInterval(() => {
    current++;
    const slot = container.querySelector(`.stamp-slot[data-index="${current}"]`);
    if (slot) {
      slot.classList.add('stamped');
      playClickSound('stamp');
      progressText.textContent = `${current} of 6 STAMPS`;
    }
    
    if (current >= clampedEnd) {
      clearInterval(interval);
      setTimeout(() => {
        initLoyaltyCard();
        if (end >= 6) {
          playClickSound('chime');
        }
      }, 500);
    }
  }, 400);
}

// ==========================================
// LOYALTY CARD MANAGEMENT
// ==========================================
function initLoyaltyCard() {
  const container = document.getElementById('stamp-grid-container');
  const progressText = document.getElementById('stamp-progress-text');
  const msgField = document.getElementById('loyalty-message');

  // Redraw stamp slots
  container.innerHTML = '';
  for (let i = 1; i <= 6; i++) {
    const slot = document.createElement('div');
    slot.className = 'stamp-slot';
    slot.dataset.index = i;
    slot.innerHTML = '<span class="stamp-cup">☕</span>';
    
    // Add stamped state
    if (i <= loyaltyStamps) {
      slot.classList.add('stamped');
    }
    
    container.appendChild(slot);
  }

  // Progress labels
  const clampedStamps = Math.min(loyaltyStamps, 6);
  progressText.textContent = `${clampedStamps} of 6 STAMPS`;

  if (loyaltyStamps >= 6) {
    msgField.innerHTML = '🎉 **REWARD UNLOCKED!** Your next artisan coffee in basket is 100% free! ☕🎁';
    msgField.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
    msgField.style.borderColor = '#10B981';
  } else {
    const diff = 6 - loyaltyStamps;
    msgField.innerHTML = `Collect stamps with coffee orders! **${diff} more** to earn a free signature brew. 🎟️`;
    msgField.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
    msgField.style.borderColor = 'rgba(255, 255, 255, 0.15)';
  }

  // Card Tilt 3D Interaction on Mouse Movement
  const card = document.querySelector('.brew-card');
  if (card) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (centerY - y) / 10;
      const rotateY = (x - centerX) / 10;
      
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }
}

// ==========================================
// RESERVATION WIZARD MANAGEMENT
// ==========================================
function initReservationWizard() {
  const wizardForm = document.getElementById('reservation-wizard-form');
  const nextBtns = document.querySelectorAll('.next-step-btn');
  const prevBtns = document.querySelectorAll('.prev-step-btn');
  const seats = document.querySelectorAll('.seating-table');
  const finalSummary = document.getElementById('booking-final-summary');
  const nextToDetailsBtn = document.getElementById('next-to-details-btn');
  const bookingSuccessModal = document.getElementById('booking-success-modal');

  // Pre-load some "booked" tables randomly
  const predefinedBooked = ['P2', 'L2', 'W1'];
  seats.forEach(seat => {
    const id = seat.getAttribute('data-id');
    if (predefinedBooked.includes(id)) {
      seat.classList.add('booked');
    }
  });

  // Step pane shifts
  const showPane = (stepNum) => {
    playClickSound('blip');
    document.querySelectorAll('.wizard-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    
    document.getElementById(`pane-step-${stepNum}`).classList.add('active');
    document.querySelector(`.step[data-step="${stepNum}"]`).classList.add('active');
    activeWizardStep = stepNum;
  };

  // Next triggers
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validatePaneInputs(activeWizardStep)) {
        if (activeWizardStep === 2) {
          generateFinalBookingSummary();
        }
        showPane(activeWizardStep + 1);
      }
    });
  });

  // Prev triggers
  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showPane(activeWizardStep - 1);
    });
  });

  // Table selection logic
  seats.forEach(seat => {
    seat.addEventListener('click', () => {
      if (seat.classList.contains('booked')) return;
      playClickSound('blip');
      
      // Toggle selection
      seats.forEach(s => s.classList.remove('selected'));
      seat.classList.add('selected');
      selectedTable = seat.getAttribute('data-id');
      
      let zoneName = "Cozy Lounge";
      if (selectedTable.startsWith('P')) zoneName = "Sunny Patio 🌸";
      if (selectedTable.startsWith('W')) zoneName = "Window Bar Counter 🪟";
      
      document.getElementById('table-selection-callout').innerHTML = `
        <strong>Table ${selectedTable} Selected!</strong> (${zoneName})
      `;
      
      nextToDetailsBtn.removeAttribute('disabled');
    });
  });

  // Submission confirm details
  wizardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validatePaneInputs(3)) return;

    const spinner = document.getElementById('booking-spinner');
    const submitBtn = document.getElementById('booking-submit-btn');

    spinner.style.display = 'inline-block';
    submitBtn.setAttribute('disabled', 'true');
    playClickSound('blip');

    // Simulate server write delay
    setTimeout(() => {
      playClickSound('chime');
      spinner.style.display = 'none';
      submitBtn.removeAttribute('disabled');
      
      // Populate booking success card
      const guests = document.getElementById('booking-guests').value;
      const date = document.getElementById('booking-date').value;
      const time = document.getElementById('booking-time').value;
      const name = document.getElementById('booking-name').value;
      
      document.getElementById('booking-card-receipt').innerHTML = `
        <p><strong>Reservation Name:</strong> ${name}</p>
        <p><strong>Guests:</strong> ${guests} seats</p>
        <p><strong>Time Slot:</strong> ${date} at ${time}</p>
        <p><strong>Table Spot:</strong> Table #${selectedTable} (${selectedTable.startsWith('P') ? 'Patio' : selectedTable.startsWith('W') ? 'Window' : 'Lounge'})</p>
      `;

      bookingSuccessModal.style.display = 'block';
    }, 1500);
  });

  // Close booking success modal
  document.getElementById('close-booking-success-btn').addEventListener('click', () => {
    playClickSound('blip');
    bookingSuccessModal.style.display = 'none';
    
    // Reset wizard
    wizardForm.reset();
    selectedTable = null;
    seats.forEach(s => s.classList.remove('selected'));
    document.getElementById('table-selection-callout').textContent = "No Table Selected. Please click a circle/rectangle table above.";
    nextToDetailsBtn.setAttribute('disabled', 'true');
    showPane(1);
  });
}

function validatePaneInputs(step) {
  let isValid = true;
  
  if (step === 1) {
    const guests = document.getElementById('booking-guests');
    const dateInput = document.getElementById('booking-date');
    const time = document.getElementById('booking-time');
    
    if (!guests.value) {
      guests.parentElement.classList.add('invalid');
      isValid = false;
    } else {
      guests.parentElement.classList.remove('invalid');
    }
    
    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    if (!dateInput.value || selectedDate < today) {
      dateInput.parentElement.classList.add('invalid');
      isValid = false;
    } else {
      dateInput.parentElement.classList.remove('invalid');
    }
    
    if (!time.value) {
      time.parentElement.classList.add('invalid');
      isValid = false;
    } else {
      time.parentElement.classList.remove('invalid');
    }
  } 
  else if (step === 2) {
    if (!selectedTable) {
      isValid = false;
    }
  } 
  else if (step === 3) {
    const name = document.getElementById('booking-name');
    const email = document.getElementById('booking-email');
    const phone = document.getElementById('booking-phone');
    
    if (!name.value.trim()) {
      name.parentElement.classList.add('invalid');
      isValid = false;
    } else {
      name.parentElement.classList.remove('invalid');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      email.parentElement.classList.add('invalid');
      isValid = false;
    } else {
      email.parentElement.classList.remove('invalid');
    }
    
    if (!phone.value.trim()) {
      phone.parentElement.classList.add('invalid');
      isValid = false;
    } else {
      phone.parentElement.classList.remove('invalid');
    }
  }
  
  return isValid;
}

function generateFinalBookingSummary() {
  const guests = document.getElementById('booking-guests').value;
  const date = document.getElementById('booking-date').value;
  const time = document.getElementById('booking-time').value;
  const container = document.getElementById('booking-final-summary');

  let zoneName = "Cozy Lounge Couch";
  if (selectedTable.startsWith('P')) zoneName = "Sunny Patio Deck";
  if (selectedTable.startsWith('W')) zoneName = "Window Bar Counter";

  container.innerHTML = `
    <h4>Reservation Summary</h4>
    <div class="booking-summary-line"><span>Party Size:</span><span>${guests} guests</span></div>
    <div class="booking-summary-line"><span>Date Selected:</span><span>${date}</span></div>
    <div class="booking-summary-line"><span>Time Slot:</span><span>${time}</span></div>
    <div class="booking-summary-line"><span>Table Spot:</span><span>Table ${selectedTable} (${zoneName})</span></div>
    <div class="booking-summary-line" style="color: var(--color-saffron); font-weight: 600;">
      <span>Complementary Cookie:</span><span>1x Saffron Spark Cookie 🍪</span>
    </div>
  `;
}

// ==========================================
// CUSTOMER REVIEWS SLIDER CAROUSEL
// ==========================================
function initReviewsCarousel() {
  const track = document.getElementById('reviews-carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const wrapper = document.getElementById('reviews-carousel-wrapper');
  
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let scrollIndex = 0;
  
  const slideNext = () => {
    const cardWidth = track.firstElementChild.offsetWidth + 30;
    const maxScroll = track.scrollWidth - wrapper.offsetWidth;
    let nextScroll = (scrollIndex + 1) * cardWidth;
    
    if (nextScroll > maxScroll) {
      nextScroll = maxScroll;
      scrollIndex = Math.ceil(maxScroll / cardWidth);
    } else {
      scrollIndex++;
    }
    
    track.style.transform = `translateX(-${nextScroll}px)`;
  };

  const slidePrev = () => {
    const cardWidth = track.firstElementChild.offsetWidth + 30;
    let prevScroll = (scrollIndex - 1) * cardWidth;
    
    if (prevScroll < 0) {
      prevScroll = 0;
      scrollIndex = 0;
    } else {
      scrollIndex--;
    }
    
    track.style.transform = `translateX(-${prevScroll}px)`;
  };

  nextBtn.addEventListener('click', () => {
    playClickSound('blip');
    slideNext();
  });
  prevBtn.addEventListener('click', () => {
    playClickSound('blip');
    slidePrev();
  });

  // Swipe / Drag controls
  wrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.style.transform ? parseInt(track.style.transform.replace(/[^\d-]/g, '')) : 0;
  });

  wrapper.addEventListener('mouseleave', () => isDragging = false);
  wrapper.addEventListener('mouseup', () => isDragging = false);
  
  wrapper.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    let newScroll = scrollLeft + walk;
    
    const maxScroll = track.scrollWidth - wrapper.offsetWidth;
    if (newScroll > 0) newScroll = 0;
    if (newScroll < -maxScroll) newScroll = -maxScroll;
    
    track.style.transform = `translateX(${newScroll}px)`;
  });

  // Touch Swipe
  wrapper.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - track.offsetLeft;
    scrollLeft = track.style.transform ? parseInt(track.style.transform.replace(/[^\d-]/g, '')) : 0;
  });

  wrapper.addEventListener('touchend', () => isDragging = false);
  
  wrapper.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    let newScroll = scrollLeft + walk;
    
    const maxScroll = track.scrollWidth - wrapper.offsetWidth;
    if (newScroll > 0) newScroll = 0;
    if (newScroll < -maxScroll) newScroll = -maxScroll;
    
    track.style.transform = `translateX(${newScroll}px)`;
  });

  // Auto-scrolling loops
  let autoScrollTimer = setInterval(slideNext, 6000);
  
  wrapper.addEventListener('mouseenter', () => clearInterval(autoScrollTimer));
  wrapper.addEventListener('mouseleave', () => {
    autoScrollTimer = setInterval(slideNext, 6000);
  });
}

// ==========================================
// GALLERY MASONRY LIGHTBOX POPUP
// ==========================================
function initGalleryLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const captionText = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  const galleryItems = document.querySelectorAll('.gallery-item-wrapper');
  
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      playClickSound('blip');
      const img = item.querySelector('img');
      modal.style.display = 'block';
      modalImg.src = img.src;
      captionText.textContent = img.alt;
      
      gsap.fromTo(modalImg, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 });
    });
  });

  const closeModal = () => {
    playClickSound('blip');
    modal.style.display = 'none';
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === closeBtn) {
      closeModal();
    }
  });
}

// ==========================================
// FAQ ACCORDION MANAGEMENT
// ==========================================
function initFAQAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');
  
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      playClickSound('blip');
      const parent = trigger.parentElement;
      const content = parent.querySelector('.faq-content');
      const isActive = parent.classList.contains('active');
      
      // Close other active FAQs
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-content').style.maxHeight = null;
      });
      
      if (!isActive) {
        parent.classList.add('active');
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });
}

// ==========================================
// NEWSLETTER NEWS FEEDBACK
// ==========================================
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  const emailInput = document.getElementById('newsletter-email');
  const statusMsg = document.getElementById('newsletter-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      playClickSound('blip');
      statusMsg.className = 'newsletter-status error';
      statusMsg.textContent = 'Please supply a correct email address.';
      return;
    }

    playClickSound('chime');
    statusMsg.className = 'newsletter-status success';
    statusMsg.textContent = 'Welcome to the club! Check your inbox for cookies. 🍪✨';
    emailInput.value = '';
    
    setTimeout(() => {
      statusMsg.textContent = '';
    }, 5000);
  });
}

// ==========================================
// ITEM CUSTOMIZATION MODAL WIZARD ACTIONS
// ==========================================
function initCustomizeModalClose() {
  const modal = document.getElementById('customize-modal');
  const closeBtn = document.getElementById('customize-close-btn');
  
  const closeModal = () => {
    playClickSound('blip');
    modal.style.display = 'none';
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-close-x')) {
      closeModal();
    }
  });
}

function openCustomizeModal(itemId) {
  const itemData = menuItems.find(item => item.id === itemId);
  if (!itemData) return;
  
  playClickSound('blip');

  const modal = document.getElementById('customize-modal');
  const img = document.getElementById('customize-img');
  const title = document.getElementById('customize-title');
  const desc = document.getElementById('customize-desc');
  const unitPrice = document.getElementById('customize-unit-price');
  const container = document.getElementById('customize-options-container');
  
  img.src = itemData.image;
  title.textContent = itemData.name;
  desc.textContent = itemData.description;
  unitPrice.textContent = `$${itemData.price.toFixed(2)}`;
  
  // Populating custom choices grid
  container.innerHTML = '';
  
  // 1. Size choices
  const sizeGroup = document.createElement('div');
  sizeGroup.className = 'option-group';
  sizeGroup.innerHTML = `
    <h4>Select Size</h4>
    <div class="choices-grid">
      <label class="choice-label active">
        <input type="radio" name="opt-size" value="Medium" data-add="0" checked />
        <span>Medium</span>
        <span class="choice-price">+$0.00</span>
      </label>
      <label class="choice-label">
        <input type="radio" name="opt-size" value="Large" data-add="0.75" />
        <span>Large</span>
        <span class="choice-price">+$0.75</span>
      </label>
    </div>
  `;
  container.appendChild(sizeGroup);
  
  // 2. Milk & Sweetness (beverages only)
  if (itemData.category === 'coffee' || itemData.category === 'specialties') {
    const milkGroup = document.createElement('div');
    milkGroup.className = 'option-group';
    milkGroup.innerHTML = `
      <h4>Milk Selection</h4>
      <div class="choices-grid">
        <label class="choice-label active">
          <input type="radio" name="opt-milk" value="Oat Milk" data-add="0.50" checked />
          <span>Oat Milk</span>
          <span class="choice-price">+$0.50</span>
        </label>
        <label class="choice-label">
          <input type="radio" name="opt-milk" value="Whole Milk" data-add="0" />
          <span>Whole Milk</span>
          <span class="choice-price">+$0.00</span>
        </label>
        <label class="choice-label">
          <input type="radio" name="opt-milk" value="Almond Milk" data-add="0.50" />
          <span>Almond Milk</span>
          <span class="choice-price">+$0.50</span>
        </label>
      </div>
    `;
    container.appendChild(milkGroup);
    
    const sweetGroup = document.createElement('div');
    sweetGroup.className = 'option-group';
    sweetGroup.innerHTML = `
      <h4>Sweetness Level</h4>
      <div class="choices-grid">
        <label class="choice-label active">
          <input type="radio" name="opt-sweet" value="Normal Sweetness" data-add="0" checked />
          <span>Normal</span>
          <span class="choice-price">+$0.00</span>
        </label>
        <label class="choice-label">
          <input type="radio" name="opt-sweet" value="Less Sweet" data-add="0" />
          <span>Less Sweet</span>
          <span class="choice-price">+$0.00</span>
        </label>
        <label class="choice-label">
          <input type="radio" name="opt-sweet" value="Organic Honey" data-add="0.30" />
          <span>Honey</span>
          <span class="choice-price">+$0.30</span>
        </label>
      </div>
    `;
    container.appendChild(sweetGroup);
  }
  
  // 3. Extras Selection
  const extrasGroup = document.createElement('div');
  extrasGroup.className = 'option-group';
  
  let extrasHTML = `
    <h4>Select Add-Ons</h4>
    <div class="choices-grid two-cols">
  `;
  if (itemData.category === 'coffee' || itemData.category === 'specialties') {
    extrasHTML += `
      <label class="choice-label">
        <input type="checkbox" name="opt-extra" value="Extra Espresso Shot" data-add="1.00" />
        <span>Double Shot</span>
        <span class="choice-price">+$1.00</span>
      </label>
      <label class="choice-label">
        <input type="checkbox" name="opt-extra" value="Saffron Sprinkle" data-add="0.50" />
        <span>Saffron Dust</span>
        <span class="choice-price">+$0.50</span>
      </label>
    `;
  } else {
    extrasHTML += `
      <label class="choice-label">
        <input type="checkbox" name="opt-extra" value="Serve Warm" data-add="0" />
        <span>Serve Warm</span>
        <span class="choice-price">+$0.00</span>
      </label>
      <label class="choice-label">
        <input type="checkbox" name="opt-extra" value="Vanilla Ice Cream Scooper" data-add="1.50" />
        <span>Ice Cream Scoop</span>
        <span class="choice-price">+$1.50</span>
      </label>
    `;
  }
  extrasHTML += `</div>`;
  extrasGroup.innerHTML = extrasHTML;
  container.appendChild(extrasGroup);
  
  // Register click changes
  const labels = container.querySelectorAll('.choice-label');
  labels.forEach(label => {
    label.addEventListener('click', (e) => {
      const input = label.querySelector('input');
      if (!input) return;
      playClickSound('blip');
      
      if (input.type === 'radio') {
        const name = input.name;
        container.querySelectorAll(`input[name="${name}"]`).forEach(sib => {
          sib.parentElement.classList.remove('active');
        });
        label.classList.add('active');
      } else {
        label.classList.toggle('active');
      }
      
      calculateModalTotal(itemData.price);
    });
  });

  // Hook submit action
  const form = document.getElementById('customize-form');
  form.onsubmit = (e) => {
    e.preventDefault();
    
    const sizeVal = form.querySelector('input[name="opt-size"]:checked').value;
    const milkInput = form.querySelector('input[name="opt-milk"]:checked');
    const milkVal = milkInput ? milkInput.value : '';
    const sweetInput = form.querySelector('input[name="opt-sweet"]:checked');
    const sweetVal = sweetInput ? sweetInput.value : '';
    
    const extras = [];
    form.querySelectorAll('input[name="opt-extra"]:checked').forEach(chk => {
      extras.push(chk.value);
    });
    
    // Calculates accumulated cost
    let extraCharge = 0;
    extraCharge += parseFloat(form.querySelector('input[name="opt-size"]:checked').dataset.add);
    if (milkInput) extraCharge += parseFloat(milkInput.dataset.add);
    if (sweetInput) extraCharge += parseFloat(sweetInput.dataset.add);
    form.querySelectorAll('input[name="opt-extra"]:checked').forEach(chk => {
      extraCharge += parseFloat(chk.dataset.add);
    });
    
    const configItem = {
      id: itemData.id + '-' + Date.now(),
      baseId: itemData.id,
      name: itemData.name,
      image: itemData.image,
      price: itemData.price + extraCharge,
      quantity: 1,
      size: sizeVal,
      milk: milkVal,
      sweetener: sweetVal,
      extras: extras,
      category: itemData.category
    };
    
    cart.push(configItem);
    updateCartUI();
    
    modal.style.display = 'none';
    
    // Trigger animated flying cup
    const gridBtn = document.querySelector(`.menu-card .quick-add-btn[data-id="${itemData.id}"]`) || 
                    document.querySelector(`.specials-section .quick-add-btn[data-id="${itemData.id}"]`);
    if (gridBtn) {
      triggerFlyToCartAnimation(gridBtn);
    }
  };

  calculateModalTotal(itemData.price);
  modal.style.display = 'block';
}

function calculateModalTotal(basePrice) {
  const form = document.getElementById('customize-form');
  let total = basePrice;
  
  // Sum checked options charges
  const sizeSelected = form.querySelector('input[name="opt-size"]:checked');
  if (sizeSelected) total += parseFloat(sizeSelected.dataset.add);
  
  const milkSelected = form.querySelector('input[name="opt-milk"]:checked');
  if (milkSelected) total += parseFloat(milkSelected.dataset.add);
  
  const sweetSelected = form.querySelector('input[name="opt-sweet"]:checked');
  if (sweetSelected) total += parseFloat(sweetSelected.dataset.add);
  
  form.querySelectorAll('input[name="opt-extra"]:checked').forEach(chk => {
    total += parseFloat(chk.dataset.add);
  });
  
  document.getElementById('customize-total-price').textContent = `$${total.toFixed(2)}`;
}

// ==========================================
// GSAP SCROLL SCROLLTRIGGER ANIMATIONS
// ==========================================
function initScrollAnimations() {
  const tl = gsap.timeline();
  tl.fromTo('.hero-badge', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
    .fromTo('.hero-title .line-1', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
    .fromTo('.hero-title .line-2', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
    .fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
    .fromTo('.hero-ctas', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.5)" }, "-=0.5");

  gsap.to('.hero-bg', {
    yPercent: 30,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  // Reveal elements on scroll
  gsap.utils.toArray('.reveal-up').forEach(item => {
    gsap.fromTo(item, 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // Parallax Story Rows entry
  gsap.utils.toArray('.reveal-row').forEach(row => {
    const text = row.querySelector('.experience-text');
    const imgContainer = row.querySelector('.experience-img-container');
    const isReverse = row.classList.contains('reverse');

    gsap.fromTo(text, 
      { opacity: 0, x: isReverse ? 50 : -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: row,
          start: "top 80%"
        }
      }
    );

    gsap.fromTo(imgContainer, 
      { opacity: 0, scale: 0.9, rotate: isReverse ? -2 : 2 },
      {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 1,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: row,
          start: "top 80%"
        }
      }
    );
  });

  // Parallax loyalty card entry
  gsap.fromTo('.reveal-right',
    { opacity: 0, x: 80, rotateY: -30 },
    {
      opacity: 1,
      x: 0,
      rotateY: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".loyalty-section",
        start: "top 80%"
      }
    }
  );

  // Floating particles mouse parallax
  const particles = document.getElementById('hero-particles');
  if (particles) {
    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = i % 2 === 0 ? '☕' : '✨';
      p.style.fontSize = `${Math.random() * 1.5 + 0.8}rem`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 85}%`;
      p.dataset.speedX = (Math.random() * 40 - 20).toString();
      p.dataset.speedY = (Math.random() * 40 - 20).toString();
      particles.appendChild(p);
    }

    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX - window.innerWidth / 2) / window.innerWidth;
      const y = (e.clientY - window.innerHeight / 2) / window.innerHeight;
      
      document.querySelectorAll('.particle').forEach(p => {
        const speedX = parseFloat(p.dataset.speedX);
        const speedY = parseFloat(p.dataset.speedY);
        gsap.to(p, {
          x: x * speedX,
          y: y * speedY,
          duration: 0.6,
          ease: "power1.out"
        });
      });
    });
  }
}
