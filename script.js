// Shortcuts
const $ = (q, c = document) => c.querySelector(q);
const $$ = (q, c = document) => [...c.querySelectorAll(q)];

// Navbar toggle mobile
$('#menuBtn')?.addEventListener('click', () => {
  $('#menuMobile').classList.toggle('hidden');
});

// Tahun otomatis di footer
$('#year').textContent = new Date().getFullYear();

// Scroll reveal effect
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('opacity-100', 'translate-y-0');
      io.unobserve(e.target);
    }
  })
}, { threshold: 0.15 });
$$('.reveal').forEach(el => {
  el.classList.add('opacity-0', 'translate-y-6', 'transition', 'duration-700');
  io.observe(el);
});

// Data harga kuota
const prices = [
  { op: 'Telkomsel', qty: '5GB', days: 7, price: 23000 },
  { op: 'Telkomsel', qty: '15GB', days: 30, price: 58000 },
  { op: 'Indosat', qty: '14GB', days: 30, price: 52000 },
  { op: 'Tri', qty: '20GB', days: 30, price: 48000 },
  { op: 'XL/Axis', qty: '35GB', days: 30, price: 89000 },
  { op: 'Smartfren', qty: '18GB', days: 30, price: 52000 }
];
const priceGrid = $('#priceGrid');
const rupiah = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

// Render harga
function renderPrices(filter = 'all') {
  priceGrid.innerHTML = '';
  prices.filter(p => filter === 'all' || p.op === filter).forEach((p) => {
    const card = document.createElement('article');
    card.className = 'reveal p-5 rounded-2xl bg-slate-900/60';
    card.innerHTML = `
      <h3 class="font-bold">${p.op} - ${p.qty}</h3>
      <p>Aktif ${p.days} Hari</p>
      <p class="text-xl font-extrabold">${rupiah(p.price)}</p>
      <button data-op="${p.op}" data-qty="${p.qty}" data-price="${p.price}"
        class="confetti mt-2 bg-brand-500 text-slate-900 font-bold px-4 py-2 rounded-xl">Beli</button>
    `;
    priceGrid.appendChild(card);
  });
  $$('.reveal').forEach(el => io.observe(el));
}
renderPrices();

// Filter operator
$('#filterOp')?.addEventListener('change', e => renderPrices(e.target.value));

// Order ke WhatsApp
function orderWhatsApp({ op, qty, price, nama, nomor }) {
  const text = encodeURIComponent(`Halo Puspa Cell!\nPesan paket:\n${op} - ${qty}\nHarga: ${rupiah(price)}\nNama: ${nama || '-'}\nNomor: ${nomor || '-'}`);
  window.open(`https://wa.me/628389947242?text=${text}`, '_blank');
}

// Klik tombol beli
priceGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-op]');
  if (!btn) return;
  const { op, qty, price } = btn.dataset;
  orderWhatsApp({ op, qty, price });
});

// Form pesan
$('#formPesan')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  orderWhatsApp({
    op: fd.get('operator'),
    qty: fd.get('paket') || 'Konsultasi Paket',
    price: 0,
    nama: fd.get('nama'),
    nomor: fd.get('nomor')
  });
});
