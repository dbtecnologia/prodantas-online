const products = [
  { id: 1, name: 'Kit torneira monocomando Black', category: 'Hidráulica', price: 129.90, oldPrice: 159.90, image: '🚰', photo: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80', tone: 'steel', badge: 'OFERTA' },
  { id: 2, name: 'Tinta acrílica fosca 18L branca', category: 'Tintas', price: 189.90, oldPrice: 229.90, image: '🪣', photo: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80', tone: 'red', badge: 'MAIS VENDIDO' },
  { id: 3, name: 'Furadeira de impacto 650W', category: 'Ferramentas', price: 219.90, oldPrice: 269.90, image: '🔩', photo: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80', tone: 'yellow', badge: 'OFERTA' },
  { id: 4, name: 'Lâmpada LED bulbo 12W — 3 un.', category: 'Elétrica', price: 24.90, oldPrice: 34.90, image: '💡', photo: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80', tone: 'blue', badge: 'OFERTA' },
  { id: 5, name: 'Argamassa AC-II interna e externa 20kg', category: 'Materiais', price: 18.90, oldPrice: 22.90, image: '🧱', photo: 'https://images.unsplash.com/photo-1516216628859-9bccecab13ca?auto=format&fit=crop&w=800&q=80', tone: 'sand', badge: 'PREÇO DE OBRA' },
  { id: 6, name: 'Jogo de ferramentas 100 peças', category: 'Ferramentas', price: 159.90, oldPrice: 199.90, image: '🛠️', photo: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?auto=format&fit=crop&w=800&q=80', tone: 'purple', badge: 'OFERTA' },
  { id: 7, name: 'Cabo flexível 2,5mm 100 metros', category: 'Elétrica', price: 119.90, oldPrice: 139.90, image: '🔌', photo: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43f?auto=format&fit=crop&w=800&q=80', tone: 'blue', badge: '' },
  { id: 8, name: 'Impermeabilizante parede 4kg', category: 'Materiais', price: 79.90, oldPrice: 99.90, image: '🧴', photo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', tone: 'sand', badge: 'OFERTA' },
  { id: 9, name: 'Rolo de pintura antigota 23cm', category: 'Tintas', price: 29.90, oldPrice: 39.90, image: '🖌️', photo: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80', tone: 'yellow', badge: '' },
];

const state = { query: '', categories: [], price: 'all', sort: 'featured', cart: JSON.parse(localStorage.getItem('prodantas-cart') || '[]') };
const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const $ = selector => document.querySelector(selector);

function filteredProducts() {
  let result = products.filter(product => {
    const matchesQuery = `${product.name} ${product.category}`.toLowerCase().includes(state.query.toLowerCase());
    const matchesCategory = !state.categories.length || state.categories.includes(product.category);
    const matchesPrice = state.price === 'all' || (state.price === 'under50' && product.price < 50) || (state.price === '50to150' && product.price >= 50 && product.price <= 150) || (state.price === 'over150' && product.price > 150);
    return matchesQuery && matchesCategory && matchesPrice;
  });
  if (state.sort === 'priceAsc') result.sort((a, b) => a.price - b.price);
  if (state.sort === 'priceDesc') result.sort((a, b) => b.price - a.price);
  return result;
}

function renderProducts() {
  const grid = $('#productGrid');
  const result = filteredProducts();
  grid.innerHTML = result.map(product => `<article class="product-card"><div class="product-image ${product.tone}">${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}<img class="product-photo" src="${product.photo}" alt="${product.name}" loading="lazy" /><span class="product-fallback" aria-hidden="true">${product.image}</span></div><div class="product-info"><span class="product-category">${product.category}</span><p class="product-name">${product.name}</p><div class="product-price"><div><s>${money(product.oldPrice)}</s><strong>${money(product.price)}</strong><small> no Pix</small></div><button class="add-product" data-add="${product.id}" aria-label="Adicionar ${product.name}">+</button></div></div></article>`).join('');
  $('#noResults').hidden = result.length > 0;
}

function saveCart() { localStorage.setItem('prodantas-cart', JSON.stringify(state.cart)); renderCart(); }
function addToCart(id) { const existing = state.cart.find(item => item.id === id); if (existing) existing.qty += 1; else state.cart.push({ id, qty: 1 }); saveCart(); const product = products.find(item => item.id === id); showToast(`${product.name} foi adicionado ao carrinho`); }
function cartDetails() { return state.cart.map(item => ({ ...item, product: products.find(product => product.id === item.id) })).filter(item => item.product); }
function renderCart() {
  const details = cartDetails(); const count = details.reduce((total, item) => total + item.qty, 0); $('#cartCount').textContent = count;
  $('#cartItems').innerHTML = details.map(item => `<div class="cart-item"><div class="cart-item-visual">${item.product.image}</div><div><strong>${item.product.name}</strong><small>${item.product.category}</small><div class="qty-controls"><button data-qty="${item.id}" data-change="-1">−</button><span>${item.qty}</span><button data-qty="${item.id}" data-change="1">+</button></div></div><span class="cart-item-price">${money(item.product.price * item.qty)}</span></div>`).join('');
  $('#cartEmpty').hidden = details.length > 0; $('#cartSummary').hidden = details.length === 0; $('#cartSubtotal').textContent = money(details.reduce((total, item) => total + item.product.price * item.qty, 0));
}
function toggleDrawer(open) { $('#cartDrawer').classList.toggle('open', open); $('#drawerBackdrop').classList.toggle('open', open); $('#cartDrawer').setAttribute('aria-hidden', String(!open)); }
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2800); }
function applyCategory(category) { state.categories = [category]; document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(input => { input.checked = input.value === category; }); document.querySelector('#catalogo').scrollIntoView({ behavior: 'smooth' }); renderProducts(); }

document.addEventListener('click', event => {
  const addButton = event.target.closest('[data-add]'); if (addButton) addToCart(Number(addButton.dataset.add));
  const qtyButton = event.target.closest('[data-qty]'); if (qtyButton) { const item = state.cart.find(cartItem => cartItem.id === Number(qtyButton.dataset.qty)); item.qty += Number(qtyButton.dataset.change); if (item.qty < 1) state.cart = state.cart.filter(cartItem => cartItem.id !== item.id); saveCart(); }
  const category = event.target.closest('[data-category]'); if (category) applyCategory(category.dataset.category);
  const categoryLink = event.target.closest('[data-category-link]'); if (categoryLink) applyCategory(categoryLink.dataset.categoryLink);
  if (event.target.closest('.cart-trigger')) toggleDrawer(true);
  if (event.target.closest('.close-drawer') || event.target.closest('#drawerBackdrop')) toggleDrawer(false);
  if (event.target.closest('.close-after-click')) toggleDrawer(false);
  if (event.target.closest('#mobileFilters')) $('.filters').classList.toggle('mobile-open');
  if (event.target.closest('#clearFilters')) { state.categories = []; state.price = 'all'; document.querySelectorAll('.filter-group input').forEach(input => input.checked = input.value === 'all'); renderProducts(); }
});
$('#searchForm').addEventListener('submit', event => { event.preventDefault(); state.query = $('#searchInput').value.trim(); renderProducts(); document.querySelector('#ofertas').scrollIntoView({ behavior: 'smooth' }); });
$('#searchInput').addEventListener('input', event => { state.query = event.target.value; renderProducts(); });
document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(input => input.addEventListener('change', () => { state.categories = [...document.querySelectorAll('.filter-group input[type="checkbox"]:checked')].map(item => item.value); renderProducts(); }));
document.querySelectorAll('input[name="price"]').forEach(input => input.addEventListener('change', () => { state.price = input.value; renderProducts(); }));
$('#sortProducts').addEventListener('change', event => { state.sort = event.target.value; renderProducts(); });
document.querySelectorAll('[data-scroll]').forEach(button => button.addEventListener('click', () => document.querySelector(button.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' })));
document.querySelector('.checkout-button').addEventListener('click', () => showToast('Checkout demonstrativo: integração de pagamento pronta para conectar.'));
$('#categoryMenu').addEventListener('click', () => document.querySelector('#catalogo').scrollIntoView({ behavior: 'smooth' }));

renderProducts(); renderCart();

