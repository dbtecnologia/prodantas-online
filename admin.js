const seedProducts = [
  { id: 1, name: 'Kit torneira monocomando Black', category: 'Hidráulica', price: 129.90, oldPrice: 159.90, stock: 8, active: true, photo: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=500&q=80', image: '🚰' },
  { id: 2, name: 'Tinta acrílica fosca 18L branca', category: 'Tintas', price: 189.90, oldPrice: 229.90, stock: 4, active: true, photo: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=500&q=80', image: '🪣' },
  { id: 3, name: 'Furadeira de impacto 650W', category: 'Ferramentas', price: 219.90, oldPrice: 269.90, stock: 19, active: true, photo: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=500&q=80', image: '🔩' },
  { id: 4, name: 'Lâmpada LED bulbo 12W — 3 un.', category: 'Elétrica', price: 24.90, oldPrice: 34.90, stock: 3, active: true, photo: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=500&q=80', image: '💡' },
  { id: 5, name: 'Argamassa AC-II interna e externa 20kg', category: 'Materiais', price: 18.90, oldPrice: 22.90, stock: 42, active: true, photo: 'https://images.unsplash.com/photo-1516216628859-9bccecab13ca?auto=format&fit=crop&w=500&q=80', image: '🧱' },
  { id: 6, name: 'Jogo de ferramentas 100 peças', category: 'Ferramentas', price: 159.90, oldPrice: 199.90, stock: 0, active: false, photo: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?auto=format&fit=crop&w=500&q=80', image: '🛠️' },
];
const sampleOrders = [
  { id: '#PD-1048', customer: 'Marcos Alves', items: '4 itens', total: 'R$ 438,60', status: 'Em separação', className: 'packing', date: 'Hoje, 09:42' },
  { id: '#PD-1047', customer: 'Construtora Norte', items: '18 itens', total: 'R$ 2.184,00', status: 'Pago', className: 'paid', date: 'Hoje, 09:18' },
  { id: '#PD-1046', customer: 'Juliana Mendes', items: '2 itens', total: 'R$ 249,80', status: 'Enviado', className: 'sent', date: 'Hoje, 08:51' },
  { id: '#PD-1045', customer: 'Rafael Costa', items: '7 itens', total: 'R$ 813,40', status: 'Aguardando pagamento', className: '', date: 'Ontem, 18:20' },
];
let products = JSON.parse(localStorage.getItem('prodantas-products') || 'null') || seedProducts;

const $ = selector => document.querySelector(selector);
const money = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
function saveProducts() { localStorage.setItem('prodantas-products', JSON.stringify(products)); }
function toast(message) { const el = $('#adminToast'); el.textContent = message; el.classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => el.classList.remove('show'), 2600); }
function orderMarkup(order) { return `<div class="order-row"><strong>${order.id}<small>${order.date}</small></strong><span>${order.customer}<small>${order.items}</small></span><strong>${order.total}</strong><span class="order-status ${order.className}">${order.status}</span><button data-order="${order.id}">Ver detalhes</button></div>`; }
function renderOrders() { const header = '<div class="order-row header"><span>Pedido</span><span>Cliente</span><span>Total</span><span>Status</span><span></span></div>'; $('#recentOrders').innerHTML = header + sampleOrders.slice(0, 3).map(orderMarkup).join(''); $('#allOrders').innerHTML = header + sampleOrders.map(orderMarkup).join(''); }
function renderStock() { $('#stockList').innerHTML = products.filter(product => product.stock < 10).slice(0, 4).map(product => `<div class="stock-item"><img class="stock-thumb" src="${product.photo}" alt="${product.name}" /><div><strong>${product.name}</strong><small>${product.category}</small></div><div class="stock-level"><b>${product.stock === 0 ? 'Esgotado' : `${product.stock} un.`}</b><small>repor agora</small></div></div>`).join('') || '<p class="empty-note">Nenhum item em atenção.</p>'; }
function renderProducts() { const query = ($('#adminProductSearch')?.value || '').toLowerCase(); const category = $('#adminCategoryFilter')?.value || 'all'; const filtered = products.filter(product => product.name.toLowerCase().includes(query) && (category === 'all' || product.category === category)); $('#productCount').textContent = `${filtered.length} produtos`; $('#adminProductTable').innerHTML = `<div class="admin-product-row header"><span>Produto</span><span>Categoria</span><span>Preço</span><span>Estoque</span><span></span></div>${filtered.map(product => `<div class="admin-product-row"><div class="product-cell"><img src="${product.photo}" alt="${product.name}" /><div><strong>${product.name}</strong><small>${product.active ? 'Publicado na loja' : 'Pausado'}</small></div></div><span>${product.category}</span><strong>${money(product.price)}</strong><span class="stock-chip ${product.stock < 10 ? 'low' : ''}">${product.stock === 0 ? 'Esgotado' : `${product.stock} un.`}</span><div class="row-actions"><button data-edit="${product.id}">Editar</button><button data-delete="${product.id}">Excluir</button></div></div>`).join('')}`; }
function openProduct(product) { $('#productModal').classList.add('open'); $('#productId').value = product?.id || ''; $('#productName').value = product?.name || ''; $('#productCategory').value = product?.category || 'Materiais'; $('#productStock').value = product?.stock ?? 10; $('#productPrice').value = product?.price ?? 0; $('#productOldPrice').value = product?.oldPrice ?? 0; $('#productPhoto').value = product?.photo || ''; $('.modal-heading h2').textContent = product ? 'Editar produto' : 'Novo produto'; }
function closeProduct() { $('#productModal').classList.remove('open'); }
function showSection(name) { document.querySelectorAll('.admin-section').forEach(section => section.classList.toggle('active', section.id === `section-${name}`)); document.querySelectorAll('.admin-nav button').forEach(button => button.classList.toggle('active', button.dataset.section === name)); const label = document.querySelector(`[data-section="${name}"] span`)?.textContent || 'Visão geral'; $('#pageTitle').textContent = label; $('#adminSidebar').classList.remove('open'); }

document.addEventListener('click', event => {
  const nav = event.target.closest('[data-section]'); if (nav) showSection(nav.dataset.section);
  const target = event.target.closest('[data-section-target]'); if (target) showSection(target.dataset.sectionTarget);
  if (event.target.closest('[data-open-product]')) openProduct();
  if (event.target.closest('[data-close-modal]')) closeProduct();
  const edit = event.target.closest('[data-edit]'); if (edit) openProduct(products.find(product => product.id === Number(edit.dataset.edit)));
  const remove = event.target.closest('[data-delete]'); if (remove) { products = products.filter(product => product.id !== Number(remove.dataset.delete)); saveProducts(); renderProducts(); renderStock(); toast('Produto removido do painel.'); }
  if (event.target.closest('[data-order]')) toast(`Abrindo ${event.target.closest('[data-order]').dataset.order} — o detalhe completo entra na próxima etapa.`);
  if (event.target.closest('#menuToggle')) $('#adminSidebar').classList.toggle('open');
  if (event.target.closest('#saveCampaigns')) toast('Campanhas salvas na sessão atual.');
  if (event.target.closest('#saveSettings')) toast('Configurações salvas na sessão atual.');
});
$('#productForm').addEventListener('submit', event => { event.preventDefault(); const id = Number($('#productId').value) || Date.now(); const next = { id, name: $('#productName').value.trim(), category: $('#productCategory').value, stock: Number($('#productStock').value), price: Number($('#productPrice').value), oldPrice: Number($('#productOldPrice').value), photo: $('#productPhoto').value.trim() || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=80', active: true, image: '📦', tone: 'steel', badge: '' }; const index = products.findIndex(product => product.id === id); if (index >= 0) products[index] = { ...products[index], ...next }; else products.unshift(next); saveProducts(); renderProducts(); renderStock(); closeProduct(); toast('Produto salvo. A loja usa esta atualização neste navegador.'); });
$('#adminProductSearch').addEventListener('input', renderProducts); $('#adminCategoryFilter').addEventListener('change', renderProducts);
renderProducts(); renderStock(); renderOrders();

