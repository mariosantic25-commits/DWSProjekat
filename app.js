// ===== DATA =====
const PRODUCTS = [
  { id:1, title:'Vintage Levi\'s 501 farmerke, vel. M', price:45, category:'odjeca', condition:'Dobro', seller:'selma.h', sellerFull:'Selma Hadžić', city:'Sarajevo', emoji:'👖', rating:4.7, reviews:8, desc:'Originalne Levi\'s 501 farmerke iz 90-ih. Malo nošene, bez oštećenja. Veličina M/32.' },
  { id:2, title:'Nike Air Force 1 bijele, vel. 42', price:65, category:'obuca', condition:'Kao novo', seller:'mirko.m', sellerFull:'Mirko Marković', city:'Mostar', emoji:'👟', rating:4.9, reviews:14, desc:'Nike Air Force 1 u odličnom stanju. Nošene svega 3 puta. Dolaze s originalnom kutijom.' },
  { id:3, title:'iPhone 11 64GB crni', price:290, category:'elektronika', condition:'Dobro', seller:'hamid.k', sellerFull:'Hamid Kukić', city:'Tuzla', emoji:'📱', rating:4.5, reviews:6, desc:'iPhone 11 u dobrom stanju. Baterija 89%. Dolazi s punjačem i silikonskom maskom.' },
  { id:4, title:'Siddhartha — Herman Hesse', price:5, category:'knjige', condition:'Prihvatljivo', seller:'ana.v', sellerFull:'Ana Vidović', city:'Sarajevo', emoji:'📚', rating:5.0, reviews:3, desc:'Klasično filozofsko djelo. Malo označenih stranica, inače u dobrom stanju.' },
  { id:5, title:'Drvena stolica s jastukom', price:35, category:'namjestaj', condition:'Dobro', seller:'kemal.b', sellerFull:'Kemal Bašić', city:'Zenica', emoji:'🪑', rating:4.2, reviews:5, desc:'Solidna drvena stolica s mekim jastukom. Preuzimanje u Zenici.' },
  { id:6, title:'Adidas Originals hoodie, vel. L', price:38, category:'odjeca', condition:'Kao novo', seller:'nina.p', sellerFull:'Nina Pejić', city:'Banja Luka', emoji:'👕', rating:4.8, reviews:11, desc:'Adidas hoodie bez ikakvog habanja. Nošen par puta. Tamno siva boja.' },
  { id:7, title:'Yoga prostirka + blokovi', price:20, category:'sport', condition:'Dobro', seller:'amra.s', sellerFull:'Amra Softić', city:'Sarajevo', emoji:'🧘', rating:4.6, reviews:7, desc:'Yoga set: prostirka 6mm i dva bloka. Idealno za početnike.' },
  { id:8, title:'Thermomix TM5 — potpuno ispravan', price:480, category:'kuhinja', condition:'Kao novo', seller:'dragan.n', sellerFull:'Dragan Nikolić', city:'Banja Luka', emoji:'🍳', rating:4.9, reviews:2, desc:'Thermomix TM5 u besprijekornom stanju. Kupljen 2021, malo korišten.' },
  { id:9, title:'Canon EOS 600D + 18-55mm objektiv', price:320, category:'elektronika', condition:'Dobro', seller:'lejla.c', sellerFull:'Lejla Čović', city:'Sarajevo', emoji:'📷', rating:4.7, reviews:9, desc:'Odlična camera za početnike. Shutter count ~12.000. Dolazi s torbom.' },
  { id:10, title:'Muška zimska jakna XL — North Face', price:95, category:'odjeca', condition:'Dobro', seller:'sasa.g', sellerFull:'Saša Grujić', city:'Mostar', emoji:'🧥', rating:4.4, reviews:4, desc:'North Face zimska jakna u tamno zelenoj boji. Topla i vodootporna.' },
  { id:11, title:'LEGO Technic kamion — komplet', price:55, category:'igracke', condition:'Kao novo', seller:'vedran.j', sellerFull:'Vedran Jović', city:'Tuzla', emoji:'🧱', rating:5.0, reviews:1, desc:'LEGO Technic set 42078. Komplet s uputama, sve kockice prisutne.' },
  { id:12, title:'Bicikla Kellys — 26" gradska', price:170, category:'sport', condition:'Dobro', seller:'jasna.m', sellerFull:'Jasna Muratović', city:'Sarajevo', emoji:'🚲', rating:4.5, reviews:8, desc:'Lagana gradska bicikla, 7 brzina Shimano. Servisirana prošlog maja.' },
];

let cartItems = [
  { ...PRODUCTS[1], qty:1 },
  { ...PRODUCTS[2], qty:1 },
  { ...PRODUCTS[5], qty:1 },
];
let favorites = new Set();
let currentUser = null;
let currentProduct = null;
let currentCategory = 'sve';
let chatMessages = [
  { out:false, text:'Pozdrav! Da li je ovo još dostupno?', time:'10:24' },
  { out:true, text:'Zdravo! Da, još je dostupno 👍', time:'10:26' },
  { out:false, text:'Super. Može li malo niže, npr. 55 KM?', time:'10:28' },
  { out:true, text:'Nažalost ne mogu ispod 60, cijena je već sniženа.', time:'10:29' },
  { out:false, text:'Ok, uzimam za 60. Kada možemo dogovoriti preuzimanje?', time:'10:35' },
];

// ===== NAVIGATION =====
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-'+name);
  if (page) { page.classList.add('active'); window.scrollTo(0,0); }
  if (name==='cart') renderCart();
  if (name==='profile') { renderProfileGrid(); renderProfileReviews(); }
  if (name==='admin') { renderAdminProducts(); renderAdminUsers(); }
  if (name==='chat') renderChat();
  closeAllModals();
}

// ===== AUTH =====
function requireAuth(cb) {
  if (currentUser) { cb(); }
  else { showModal('modal-login'); pendingAction = cb; }
}
let pendingAction = null;
function login() {
  currentUser = { name:'Amir', initials:'AK' };
  document.getElementById('auth-logged-out').style.display='none';
  document.getElementById('auth-logged-in').style.display='flex';
  document.getElementById('msg-badge').style.display='flex';
  closeAllModals();
  showToast('👋','Prijavljeni ste. Dobrodošli, Amir!');
  if (pendingAction) { pendingAction(); pendingAction=null; }
}
function register() {
  login();
  showToast('🎉','Račun kreiran! Dobrodošli na Thriftly.');
}
function logout() {
  currentUser = null;
  document.getElementById('auth-logged-out').style.display='flex';
  document.getElementById('auth-logged-in').style.display='none';
  document.getElementById('msg-badge').style.display='none';
  showToast('👋','Odjavljeni ste.');
  showPage('home');
}

// ===== MODALS =====
function showModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function closeAllModals() { document.querySelectorAll('.overlay').forEach(m=>m.classList.add('hidden')); }

// ===== TOAST =====
function showToast(icon, text, duration=3200) {
  const wrap = document.getElementById('toast-wrap');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-text">${text}</span><span class="toast-close" onclick="this.parentElement.remove()">✕</span>`;
  wrap.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateX(20px)'; t.style.transition='all 0.3s'; setTimeout(()=>t.remove(),300); }, duration);
}

// ===== DARK MODE =====
function toggleDark() {
  const isDark = document.documentElement.getAttribute('data-theme')==='dark';
  document.documentElement.setAttribute('data-theme', isDark?'light':'dark');
  document.getElementById('dark-icon').innerHTML = isDark
    ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
    : '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
}

// ===== CATEGORIES =====
function filterCat(btn, cat) {
  document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  currentCategory = cat;
  renderGrid(document.getElementById('search-input').value, cat);
}

// ===== SEARCH =====
function handleSearch(q) {
  renderGrid(q, currentCategory);
}

// ===== SORT =====
function sortProducts(val) {
  const q = document.getElementById('search-input').value;
  renderGrid(q, currentCategory, val);
}

// ===== RENDER GRID =====
function renderGrid(q='', cat='sve', sort='novo') {
  const grid = document.getElementById('product-grid');
  let products = [...PRODUCTS];
  if (q.trim()) {
    const ql = q.toLowerCase();
    products = products.filter(p => p.title.toLowerCase().includes(ql) || p.seller.includes(ql));
  }
  if (cat !== 'sve') {
    products = products.filter(p => p.category === cat);
  }
  if (sort==='cjeftino') products.sort((a,b)=>a.price-b.price);
  else if (sort==='skupo') products.sort((a,b)=>b.price-a.price);
  else if (sort==='ocjena') products.sort((a,b)=>b.rating-a.rating);
  
  document.getElementById('product-count').textContent = `• ${products.length.toLocaleString()} oglasa`;

  if (!products.length) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="icon">🔍</div>Nema rezultata za ovu pretragu.</div>';
    return;
  }

  grid.innerHTML = products.map(p => `
    <div class="pcard" onclick="openProduct(${p.id})">
      <div class="pcard-img-placeholder" style="font-size:52px">${p.emoji}</div>
      <div class="pcard-condition"><span class="tag ${conditionTag(p.condition)}">${p.condition}</span></div>
      <button class="pcard-fav ${favorites.has(p.id)?'active':''}" onclick="event.stopPropagation();toggleFav(${p.id},this)">${favorites.has(p.id)?'♥':'♡'}</button>
      <div class="pcard-body">
        <div class="pcard-title">${p.title}</div>
        <div class="pcard-price">${p.price} KM</div>
        <div class="pcard-meta">
          <div class="pcard-seller">
            <div class="pcard-seller-avatar">${p.seller[0].toUpperCase()}</div>
            ${p.seller}
          </div>
          <span style="font-size:11px;color:var(--text-3)">⭐ ${p.rating}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function conditionTag(c) {
  if(c==='Novo s etiketom') return 'tag-green';
  if(c==='Kao novo') return 'tag-denim';
  if(c==='Dobro') return 'tag-brown';
  return 'tag-orange';
}

// ===== PRODUCT DETAIL =====
function openProduct(id) {
  currentProduct = PRODUCTS.find(p=>p.id===id);
  if (!currentProduct) return;
  const p = currentProduct;
  document.getElementById('detail-title').textContent = p.title;
  document.getElementById('detail-price').textContent = p.price + ' KM';
  document.getElementById('detail-img').textContent = p.emoji;
  document.getElementById('detail-desc').textContent = p.desc;
  document.getElementById('detail-seller-name').textContent = p.sellerFull;
  document.getElementById('detail-seller-avatar').textContent = p.sellerFull.split(' ').map(w=>w[0]).join('');
  document.getElementById('detail-seller-stats').textContent = `⭐ ${p.rating} · ${p.reviews} recenzija · ${p.city}`;
  document.getElementById('detail-fav-btn').textContent = favorites.has(p.id)?'♥':'♡';
  
  document.getElementById('detail-tags').innerHTML = `
    <span class="tag ${conditionTag(p.condition)}">${p.condition}</span>
    <span class="tag tag-denim">${p.city}</span>
    <span class="tag tag-brown">Kat: ${p.category}</span>
  `;

  document.getElementById('detail-list').innerHTML = `
    <div class="detail-row"><span class="dk">Stanje</span><span class="dv">${p.condition}</span></div>
    <div class="detail-row"><span class="dk">Kategorija</span><span class="dv">${p.category}</span></div>
    <div class="detail-row"><span class="dk">Lokacija</span><span class="dv">${p.city}</span></div>
    <div class="detail-row"><span class="dk">Ocjena prodavača</span><span class="dv">⭐ ${p.rating}</span></div>
    <div class="detail-row"><span class="dk">Broj recenzija</span><span class="dv">${p.reviews}</span></div>
  `;

  const reviews = [
    { initials:'NK', name:'Nina K.', date:'3 dana ago', text:'Fantastičan prodavač, brza dostava i tačan opis proizvoda!', stars:'★★★★★' },
    { initials:'BJ', name:'Boris J.', date:'1 sedmicu ago', text:'Sve ok, malo sporiji odgovor ali proizvod je točno kao opisano.', stars:'★★★★☆' },
  ];
  document.getElementById('detail-reviews').innerHTML = reviews.map(r=>`
    <div class="review-card">
      <div class="review-header">
        <div class="review-avatar">${r.initials}</div>
        <span class="review-name">${r.name}</span>
        <span style="color:var(--orange);font-size:12px">${r.stars}</span>
        <span class="review-date">${r.date}</span>
      </div>
      <div class="review-text">${r.text}</div>
    </div>
  `).join('');

  showPage('product');
}

// ===== FAVORITES =====
function toggleFav(id, btn) {
  if (favorites.has(id)) { favorites.delete(id); btn.textContent='♡'; btn.classList.remove('active'); showToast('♡','Uklonjeno iz omiljenih'); }
  else { favorites.add(id); btn.textContent='♥'; btn.classList.add('active'); showToast('♥','Dodano u omiljene!'); }
}
function toggleDetailFav() {
  if (!currentProduct) return;
  const id = currentProduct.id;
  const btn = document.getElementById('detail-fav-btn');
  if (favorites.has(id)) { favorites.delete(id); btn.textContent='♡'; showToast('♡','Uklonjeno iz omiljenih'); }
  else { favorites.add(id); btn.textContent='♥'; showToast('♥','Dodano u omiljene!'); }
}

// ===== CART =====
function addToCart() {
  if (!currentProduct) return;
  const existing = cartItems.find(i=>i.id===currentProduct.id);
  if (existing) { showToast('🛒','Proizvod je već u korpi!'); return; }
  cartItems.push({...currentProduct, qty:1});
  updateCartBadge();
  showToast('🛒','Dodano u korpu!');
}
function updateCartBadge() {
  document.getElementById('cart-badge').textContent = cartItems.length;
}
function renderCart() {
  const itemsEl = document.getElementById('cart-items');
  const summaryEl = document.getElementById('summary-rows');
  
  if (!cartItems.length) {
    itemsEl.innerHTML = '<div class="empty-state"><div class="icon">🛒</div>Vaša korpa je prazna.<br><br><button class="btn btn-primary" onclick="showPage(\'home\')">Pretraži oglase</button></div>';
    summaryEl.innerHTML = '';
    document.getElementById('cart-total').textContent = '0 KM';
    return;
  }

  itemsEl.innerHTML = cartItems.map((item,i) => `
    <div class="cart-item">
      <div class="cart-item-img" style="display:flex;align-items:center;justify-content:center;font-size:32px;background:var(--bg-subtle)">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.title}</div>
        <div class="cart-item-seller">Prodavač: ${item.sellerFull} · ${item.city}</div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="tag ${conditionTag(item.condition)}">${item.condition}</span>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <span class="cart-item-price">${item.price} KM</span>
        <button class="cart-item-remove" onclick="removeFromCart(${i})">🗑</button>
      </div>
    </div>
  `).join('');

  const total = cartItems.reduce((s,i)=>s+i.price,0);
  const shipping = 0;
  summaryEl.innerHTML = cartItems.map(i=>`
    <div class="summary-row"><span>${i.title.substring(0,30)}${i.title.length>30?'…':''}</span><span>${i.price} KM</span></div>
  `).join('') + `<div class="summary-row"><span>Dostava</span><span style="color:var(--green)">Besplatno</span></div>`;
  document.getElementById('cart-total').textContent = (total + shipping) + ' KM';
}
function removeFromCart(idx) {
  cartItems.splice(idx, 1);
  updateCartBadge();
  renderCart();
  showToast('🗑️','Uklonjeno iz korpe');
}

// ===== CHAT =====
function renderChat() {
  const convos = [
    { initials:'MM', name:'Mirko Marković', last:'Ok, uzimam za 60...', time:'10:35', active:true },
    { initials:'SH', name:'Selma Hadžić', last:'Hvala! Javljam se sutra.', time:'Juče', active:false },
    { initials:'AV', name:'Ana Vidović', last:'Da li imate isti model?', time:'Pon', active:false },
  ];
  document.getElementById('chat-list').innerHTML = convos.map(c=>`
    <div class="chat-convo ${c.active?'active':''}">
      <div class="chat-convo-avatar" style="background:${c.active?'var(--green-light)':'var(--bg-subtle)'};color:${c.active?'var(--green)':'var(--text-2)'}">${c.initials}</div>
      <div style="flex:1;min-width:0">
        <div class="chat-convo-name">${c.name}</div>
        <div class="chat-convo-last">${c.last}</div>
      </div>
      <div class="chat-convo-time">${c.time}</div>
    </div>
  `).join('');
  renderMessages();
}
function renderMessages() {
  const el = document.getElementById('chat-messages');
  el.innerHTML = chatMessages.map(m=>`
    <div class="msg ${m.out?'out':'in'}">
      ${!m.out?`<div style="width:28px;height:28px;border-radius:99px;background:var(--denim-light);color:var(--denim);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0">MM</div>`:''}
      <div>
        <div class="msg-bubble">${m.text}</div>
        <div class="msg-time">${m.time}</div>
      </div>
    </div>
  `).join('');
  el.scrollTop = el.scrollHeight;
}
function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  if (!currentUser) { showModal('modal-login'); return; }
  const now = new Date();
  chatMessages.push({ out:true, text, time: now.getHours()+':'+String(now.getMinutes()).padStart(2,'0') });
  input.value = '';
  renderMessages();
  setTimeout(()=>{
    chatMessages.push({ out:false, text:'Razumijem, javim se uskoro!', time: now.getHours()+':'+String(now.getMinutes()+1).padStart(2,'0') });
    renderMessages();
  }, 1500);
}

// ===== PROFILE TABS =====
function switchTab(btn, tabId) {
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.add('hidden'));
  document.getElementById(tabId).classList.remove('hidden');
}
function renderProfileGrid() {
  const myProducts = PRODUCTS.slice(0,5);
  document.getElementById('profile-grid').innerHTML = myProducts.map(p=>`
    <div class="pcard" onclick="openProduct(${p.id})">
      <div class="pcard-img-placeholder" style="font-size:46px">${p.emoji}</div>
      <div class="pcard-condition"><span class="tag ${conditionTag(p.condition)}">${p.condition}</span></div>
      <div class="pcard-body">
        <div class="pcard-title">${p.title}</div>
        <div class="pcard-price">${p.price} KM</div>
        <div class="pcard-meta">
          <span style="font-size:12px;color:var(--text-3)">${p.city}</span>
          <span style="font-size:11px;color:var(--text-3)">⭐ ${p.rating}</span>
        </div>
      </div>
    </div>
  `).join('');
}
function renderProfileReviews() {
  const reviews = [
    { initials:'KL', name:'Kemal L.', date:'2 sedmice ago', text:'Odličan prodavač, sve tačno kao opisano. Brza komunikacija!', stars:'★★★★★' },
    { initials:'JM', name:'Jasna M.', date:'1 mjesec ago', text:'Proizvod u odličnom stanju. Preporučujem svima.', stars:'★★★★★' },
    { initials:'DP', name:'Davor P.', date:'2 mjeseca ago', text:'Malo sporiji odgovor ali generalno zadovoljan kupovinom.', stars:'★★★★☆' },
  ];
  document.getElementById('profile-reviews').innerHTML = reviews.map(r=>`
    <div class="review-card">
      <div class="review-header">
        <div class="review-avatar">${r.initials}</div>
        <span class="review-name">${r.name}</span>
        <span style="color:var(--orange);font-size:12px">${r.stars}</span>
        <span class="review-date">${r.date}</span>
      </div>
      <div class="review-text">${r.text}</div>
    </div>
  `).join('');
}

// ===== ADMIN =====
function switchAdminTab(btn, tabId) {
  document.querySelectorAll('.admin-nav-item').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('[id^="atab-"]').forEach(t=>t.classList.add('hidden'));
  document.getElementById(tabId).classList.remove('hidden');
}
function renderAdminProducts() {
  document.getElementById('admin-products-table').innerHTML = PRODUCTS.map(p=>`
    <tr>
      <td><span style="font-size:20px">${p.emoji}</span> ${p.title.substring(0,30)}</td>
      <td>${p.sellerFull}</td>
      <td style="font-family:var(--font-display);color:var(--green);font-weight:600">${p.price} KM</td>
      <td><span class="tag ${conditionTag(p.condition)}">${p.condition}</span></td>
      <td style="color:var(--text-3)">Juče</td>
      <td style="display:flex;gap:6px">
        <button class="table-action ta-warn" onclick="showToast('⚠️','Oglas privremeno sakriven')">Sakrij</button>
        <button class="table-action ta-danger" onclick="this.closest('tr').remove();showToast('🗑️','Oglas obrisan')">Obriši</button>
      </td>
    </tr>
  `).join('');
}
function renderAdminUsers() {
  const users = [
    { initials:'AK', name:'Amir Kovačević', email:'amir@ex.com', date:'Jan 2023', sales:89, status:'Aktivan' },
    { initials:'SH', name:'Selma Hadžić', email:'selma@ex.com', date:'Mar 2023', sales:34, status:'Aktivan' },
    { initials:'HK', name:'Hamid Kukić', email:'hamid@ex.com', date:'Jun 2023', sales:12, status:'Upozoren' },
    { initials:'U4', name:'User_4821', email:'u4821@ex.com', date:'Nov 2024', sales:2, status:'Prijavljen' },
  ];
  document.getElementById('admin-users-table').innerHTML = users.map(u=>`
    <tr>
      <td style="display:flex;align-items:center;gap:8px">
        <div style="width:30px;height:30px;border-radius:99px;background:var(--green-light);color:var(--green);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">${u.initials}</div>
        ${u.name}
      </td>
      <td style="color:var(--text-3)">${u.email}</td>
      <td style="color:var(--text-3)">${u.date}</td>
      <td>${u.sales}</td>
      <td><span class="tag ${u.status==='Aktivan'?'tag-green':u.status==='Upozoren'?'tag-orange':'tag-red'}">${u.status}</span></td>
      <td style="display:flex;gap:6px">
        <button class="table-action ta-warn" onclick="showToast('⚠️','Korisnik upozoren')">Upozori</button>
        <button class="table-action ta-danger" onclick="showToast('🚫','Korisnik banoviran')">Ban</button>
      </td>
    </tr>
  `).join('');
}

// ===== ADD PRODUCT =====
function addProduct() {
  closeAllModals();
  showToast('✅','Oglas uspješno objavljen!');
}

// ===== FILTER RESET =====
function resetFilters() {
  document.querySelectorAll('.filter-option input').forEach(c=>c.checked=true);
  document.getElementById('price-min').value='';
  document.getElementById('price-max').value='';
  showToast('↺','Filteri resetovani');
}

// ===== INIT =====
renderGrid();
updateCartBadge();

// Secret admin access: logo triple click
let logoClicks = 0;
document.querySelector('.logo').addEventListener('click', ()=>{
  logoClicks++;
  if (logoClicks>=3) { logoClicks=0; login(); showPage('admin'); showToast('🔐','Admin panel otvoren'); }
  setTimeout(()=>logoClicks=0, 1200);
});
