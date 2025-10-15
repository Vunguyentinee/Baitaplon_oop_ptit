    // =========================
    // DỮ LIỆU MẪU
    // =========================
    const products = [
      { id: 1, title: "F50 League", brand: "Adidas", price: 2400000, oldPrice: 1090000, tag: "sale", cate: "giay", createdAt: "2025-09-01" },
      { id: 2, title: "Áo đấu CLB City 24/25", brand: "City", price: 720000, oldPrice: 0, tag: "moi", cate: "ao", createdAt: "2025-08-14" },
      { id: 3, title: "Bóng Futsal Pro Size 4", brand: "ProBall", price: 560000, oldPrice: 680000, tag: "sale", cate: "bong", createdAt: "2025-07-10" },
      { id: 4, title: "Vớ thi đấu Elite", brand: "Elite", price: 120000, oldPrice: 0, tag: "moi", cate: "phukien", createdAt: "2025-08-28" },
      { id: 5, title: "Giày Futsal Phantom Z", brand: "SportZ", price: 990000, oldPrice: 1250000, tag: "sale", cate: "giay", createdAt: "2025-09-18" },
      { id: 6, title: "Áo đấu CLB Barca 24/25", brand: "Barca", price: 690000, oldPrice: 0, tag: "moi", cate: "ao", createdAt: "2025-07-30" },
      { id: 7, title: "Bình nước thể thao 800ml", brand: "Hydro", price: 150000, oldPrice: 0, tag: "", cate: "phukien", createdAt: "2025-06-18" },
      { id: 8, title: "Túi đựng giày chống thấm", brand: "GearUp", price: 190000, oldPrice: 0, tag: "", cate: "phukien", createdAt: "2025-09-22" },
    ];

    function iconBall(){ return `<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M2 12h20M12 2v20M4 4l4 4M20 4l-4 4M4 20l4-4M20 20l-4-4\"/></svg>` }
    const vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

    // =========================
    // RENDER LƯỚI SẢN PHẨM (link sang chi tiết)
    // =========================
    const grid = document.getElementById('productGrid');
    function renderProducts(list){
      grid.innerHTML = list.map(p => `
        <article class=\"product\" data-id=\"${p.id}\" data-cate=\"${p.cate}\" data-tag=\"${p.tag}\" data-price=\"${p.price}\" data-created=\"${p.createdAt}\">\n\
          ${p.tag === 'sale' ? `<span class=\"badge\">SALE</span>` : (p.tag === 'moi' ? `<span class=\"badge\" style=\"background:#22c55e;color:#07131f\">MỚI</span>` : '')}\n\
          <a class=\"thumb\" href=\"#/product/${p.id}\" aria-label=\"Mở chi tiết sản phẩm\">${iconBall()}</a>\n\
          <div class=\"p-body\">\n\
            <div class=\"brand\">${p.brand}</div>\n\
            <a class=\"title\" href=\"#/product/${p.id}\">${p.title}</a>\n\
            <div class=\"price\">\n\
              <span class=\"new\">${vnd.format(p.price)}</span>\n\
              ${p.oldPrice ? `<span class=\"old\">${vnd.format(p.oldPrice)}</span>` : ''}\n\
            </div>\n\
            <div class=\"p-actions\">\n\
              <a class=\"btn-outline\" href=\"#/product/${p.id}\">Chọn size</a>\n\
            </div>\n\
          </div>\n\
        </article>`).join('');
    }
    renderProducts(products);

    // =========================
    // LỌC & SẮP XẾP
    // =========================
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const sortSelect = document.getElementById('sortSelect');

    function applyFilters(){
      const term = searchInput.value.trim().toLowerCase();
      const activeChip = document.querySelector('.chip.active')?.dataset.chip || 'all';
      const navActive = document.querySelector('.nav-inner a.active')?.dataset.filter || '';
      let list = [...products];
      if (term) list = list.filter(p => (p.title + ' ' + p.brand).toLowerCase().includes(term));
      if (navActive) list = list.filter(p => p.cate === navActive || p.tag === navActive);
      if (activeChip === 'sale') list = list.filter(p => p.tag === 'sale');
      if (activeChip === 'moi') list = list.filter(p => p.tag === 'moi');
      if (activeChip === '<1000') list = list.filter(p => p.price < 1000000);
      if (activeChip === '>=1000') list = list.filter(p => p.price >= 1000000);
      const sortVal = sortSelect.value;
      if (sortVal === 'price-asc') list.sort((a,b)=> a.price - b.price);
      if (sortVal === 'price-desc') list.sort((a,b)=> b.price - a.price);
      if (sortVal === 'newest') list.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
      renderProducts(list);
    }
    searchBtn.addEventListener('click', applyFilters);
    searchInput.addEventListener('keydown', e=>{ if(e.key==='Enter') applyFilters(); });
    sortSelect.addEventListener('change', applyFilters);
    document.querySelectorAll('.nav-inner a').forEach(a => { a.addEventListener('click', e => { e.preventDefault(); document.querySelectorAll('.nav-inner a').forEach(x => x.classList.remove('active')); a.classList.add('active'); applyFilters(); }) });
    document.querySelectorAll('.chip').forEach(chip => { chip.addEventListener('click', () => { document.querySelectorAll('.chip').forEach(c => c.classList.remove('active')); chip.classList.add('active'); applyFilters(); }); });

    // =========================
    // GIỎ HÀNG (lưu theo size)
    // =========================
    let cart = [];
    const openCartBtn = document.getElementById('openCart');
    const closeCartBtn = document.getElementById('closeCart');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartItems = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('subtotal');
    const cartCount = document.getElementById('cartCount');

    function toggleCart(show){ cartDrawer.classList.toggle('open', show); cartDrawer.setAttribute('aria-hidden', show ? 'false' : 'true'); }
    openCartBtn.addEventListener('click', () => toggleCart(true));
    closeCartBtn.addEventListener('click', () => toggleCart(false));

    function changeQty(id, delta, size){
      const it = cart.find(x=>x.id===id && x.size===size);
      if(!it) return;
      it.qty += delta;
      if (it.qty <= 0) cart = cart.filter(x=> !(x.id===id && x.size===size));
      renderCart();
    }

    function renderCart(){
      cartItems.innerHTML = cart.map(it => `
        <div class=\"cart-item\">\n\
          <div style=\"width:56px;height:56px;border-radius:10px;background:#0b1328;display:grid;place-items:center;border:1px solid var(--stroke)\">${iconBall()}</div>\n\
          <div>\n\
            <div style=\"font-weight:700\">${it.title}</div>\n\
            <div style=\"font-size:13px;color:#6b7280\">${it.brand} • Size <strong>${it.size}</strong></div>\n\
            <div style=\"margin-top:6px\">${vnd.format(it.price)}</div>\n\
          </div>\n\
          <div class=\"qty\">\n\
            <button aria-label=\"Giảm\" onclick=\"changeQty(${it.id},-1,'${it.size}')\">-</button>\n\
            <span>${it.qty}</span>\n\
            <button aria-label=\"Tăng\" onclick=\"changeQty(${it.id},1,'${it.size}')\">+</button>\n\
          </div>\n\
        </div>`).join('');
      const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
      subtotalEl.textContent = vnd.format(subtotal);
      cartCount.textContent = cart.reduce((s,it)=>s+it.qty,0);
    }

    document.getElementById('checkoutBtn').addEventListener('click', () => { alert('Đi tới trang thanh toán (demo)'); });

    // =========================
    // SHOW/HIDE VIEW + CHI TIẾT
    // =========================
    const heroSection   = document.getElementById('heroSection');
    const toolbarEl     = document.getElementById('toolbar');
    const detailView    = document.getElementById('detailView');
    const productsSection = document.getElementById('productGrid');

    function showHome(){
  heroSection.hidden = false;
  toolbarEl.hidden = false;
  productsSection.hidden = false;
  detailView.hidden = true;
  loginView.hidden = true;     // ⬅️ ẩn login
}
    function showLogin(){
  heroSection.hidden = true;
  toolbarEl.hidden = true;
  productsSection.hidden = true;
  detailView.hidden = true;
  loginView.hidden = false;    // ⬅️ hiện login
}

    const loginView = document.getElementById('loginView');

function showDetail(){
  detailView.hidden = false;
  heroSection.hidden = true;
  toolbarEl.hidden = true;
  productsSection.hidden = true;
  loginView.hidden = true;
} 

    // Hàm trả về danh sách size theo loại
    function sizesFor(p){ if (p.cate === 'giay') return [38,39,40,41,42,43]; if (p.cate === 'ao') return ['S','M','L','XL']; return ['mngvcfxsza8876543']; }

    // DOM chi tiết
    const detailBrand = document.getElementById('detailBrand');
    const detailTitle = document.getElementById('detailTitle');
    const detailPrice = document.getElementById('detailPrice');
    const detailOld   = document.getElementById('detailOld');
    const sizeGroup   = document.getElementById('sizeGroup');
    const sizeHint    = document.getElementById('sizeHint');
    const qtyDisplay  = document.getElementById('qtyDisplay');
    const minusBtn    = document.getElementById('minusBtn');
    const plusBtn     = document.getElementById('plusBtn');
    const addToCartDetail = document.getElementById('addToCartDetail');
    const buyNowBtn   = document.getElementById('buyNowBtn');
    const detailMeta  = document.getElementById('detailMeta');

    let currentDetail = { id:null, size:null, qty:1 };

    function openDetail(id){
      const p = products.find(x => x.id === Number(id));
      if (!p) { location.hash = ''; return; }
      currentDetail = { id: p.id, size: null, qty: 1 };
      detailBrand.textContent = p.brand;
      detailTitle.textContent = p.title;
      detailPrice.textContent = vnd.format(p.price);
      detailOld.textContent = p.oldPrice ? vnd.format(p.oldPrice) : '';
      qtyDisplay.textContent = '1';
      addToCartDetail.disabled = true; buyNowBtn.disabled = true;

      const sizes = sizesFor(p);
      sizeGroup.innerHTML = sizes.map(s => `<button type=\"button\" class=\"size-option\" data-size=\"${s}\">${s}</button>`).join('');
      sizeHint.textContent = p.cate === 'giay' ? 'Mẹo: Nếu bàn chân bè, chọn lớn hơn 0.5–1 size.' : (p.cate === 'ao' ? 'Form áo thể thao hơi ôm, nếu thích rộng chọn lớn hơn 1 size.' : 'Phụ kiện 1 size (FREE).');
      if (sizes.length === 1){ currentDetail.size = String(sizes[0]); sizeGroup.querySelector('.size-option').classList.add('active'); addToCartDetail.disabled = false; buyNowBtn.disabled = false; }

      sizeGroup.querySelectorAll('.size-option').forEach(btn => {
        btn.addEventListener('click', () => {
          sizeGroup.querySelectorAll('.size-option').forEach(x => x.classList.remove('active'));
          btn.classList.add('active');
          currentDetail.size = btn.dataset.size;
          addToCartDetail.disabled = false; buyNowBtn.disabled = false;
        });
      });

      minusBtn.onclick = () => { currentDetail.qty = Math.max(1, currentDetail.qty - 1); qtyDisplay.textContent = String(currentDetail.qty); }
      plusBtn.onclick  = () => { currentDetail.qty += 1; qtyDisplay.textContent = String(currentDetail.qty); }

      addToCartDetail.onclick = () => {
        if (!currentDetail.size) return alert('Chọn size trước khi thêm vào giỏ!');
        const exist = cart.find(c => c.id === p.id && c.size === currentDetail.size);
        if (exist) exist.qty += currentDetail.qty; else cart.push({ ...p, size: currentDetail.size, qty: currentDetail.qty });
        renderCart(); toggleCart(true);
      };

      buyNowBtn.onclick = () => { addToCartDetail.click(); alert('Đi tới trang thanh toán (demo)'); };

      detailMeta.textContent = `Mã SP: #${p.id} • Danh mục: ${p.cate} • Tình trạng: ${p.tag || 'thường'}`;
    }

    // =========================
    // ROUTER đọc hash
    // =========================
    function router(){
  const m = location.hash.match(/^#\/product\/(\d+)/);
  if (m) { openDetail(m[1]); showDetail(); return; }

  if (location.hash === '#/login') { showLogin(); return; }

  // mặc định là trang chủ
  showHome();
}
    window.addEventListener('hashchange', router);
    window.addEventListener('load', router);

    // Nút Quay lại
    document.querySelector('#loginView .backlink')?.addEventListener('click', (e) => {
  e.preventDefault();
  location.hash = ''; // về home
});

    // =========================
    // SLIDER (đặt sau router)
    // =========================
    const banner = document.getElementById('banner');
    const slidesWrap = banner.querySelector('.slides');
    const slides = Array.from(banner.querySelectorAll('.slide'));
    const dotsWrap = banner.querySelector('.dots');
    let idx = 0; let auto;
    function makeDots(){ dotsWrap.innerHTML = slides.map((_,i)=>`<span class=\"dot ${i===idx?'active':''}\" data-i=\"${i}\"></span>`).join(''); dotsWrap.querySelectorAll('.dot').forEach(d=>d.addEventListener('click',()=>go(+d.dataset.i))); }
    function go(i){ idx = (i+slides.length)%slides.length; slidesWrap.style.transform = `translateX(-${idx*100}%)`; makeDots(); }
    function start(){ auto = setInterval(()=>go(idx+1), 4500); }
    function stop(){ clearInterval(auto); }
    banner.addEventListener('mouseenter', stop); banner.addEventListener('mouseleave', start); makeDots(); start();

    // ESC để đóng giỏ
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') toggleCart(false); });

    // Xử lý đăng nhập trang riêng (#/login)
const loginBtn = document.getElementById("loginBtn");

// Khi bấm vào icon người → chuyển sang trang đăng nhập
document.getElementById('loginBtn')?.addEventListener('click', () => {
  location.hash = '#/login';
});

// Khi ở trang đăng nhập, xử lý form
const loginFormPage = document.getElementById("loginFormPage");

loginFormPage?.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("usernamePage").value.trim();
  const password = document.getElementById("passwordPage").value.trim();

  if (username === "admin" && password === "123") {
    alert("Đăng nhập thành công!");
    // ví dụ: ghi vào localStorage
    // localStorage.setItem("user", username);
    location.hash = ""; // quay về trang chủ
  } else {
    alert("Sai tên đăng nhập hoặc mật khẩu!");
  }
});
