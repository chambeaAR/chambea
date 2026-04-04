// =============================================
// CHAMBEA — LÓGICA DE LA APLICACIÓN
// =============================================

// ---- DATOS BASE: TRABAJADORES ----
const defaultWorkers = [
  {
    id: 1,
    name: "Manuel Pernalete",
    skill: "Jardinero",
    icon: "🌿",
    city: "Caracas",
    zone: "Todo Caracas",
    rating: 4.8,
    reviews: 4,
    experience: "7 años",
    jobs: 12,
    price: 8,
    description: "Jardinero profesional con experiencia en mantenimiento de jardines residenciales y comerciales en Caracas. Poda, siembra, abono, limpieza de áreas verdes y diseño de jardines a medida.",
    phone: "584127200453",
    available: true,
    verified: true,
    avatar: "MP",
    avatarColor: "#15803D",
    photo: null,
    userCreated: false
  },
  {
    id: 2,
    name: "Bernardo Yaya",
    skill: "Plomero",
    icon: "🔧",
    city: "Caracas",
    zone: "Todo Caracas",
    rating: 4.7,
    reviews: 5,
    experience: "10 años",
    jobs: 18,
    price: 12,
    description: "Plomero con amplia experiencia en instalaciones, reparaciones y mantenimiento de tuberías residenciales y comerciales. Atención rápida para emergencias: filtraciones, tuberías rotas, instalación de sanitarios y más.",
    phone: "584142813330",
    available: true,
    verified: true,
    avatar: "BY",
    avatarColor: "#1E3A5F",
    photo: null,
    userCreated: false
  },
  {
    id: 3,
    name: "Cipriano Barreto",
    skill: "Limpieza",
    icon: "🧹",
    city: "Caracas",
    zone: "Todo Caracas",
    rating: 4.6,
    reviews: 3,
    experience: "5 años",
    jobs: 9,
    price: 7,
    description: "Especialista en limpieza profunda de hogares, apartamentos y oficinas en Caracas. Servicio completo: limpieza general, limpieza post-obra, desinfección y mantenimiento regular.",
    phone: "584127272762",
    available: true,
    verified: true,
    avatar: "CB",
    avatarColor: "#0D9488",
    photo: null,
    userCreated: false
  },
  {
    id: 4,
    name: "José Ramírez",
    skill: "Aire acondicionado",
    icon: "❄️",
    city: "Caracas",
    zone: "Todo Caracas",
    rating: 4.9,
    reviews: 5,
    experience: "8 años",
    jobs: 15,
    price: 25,
    description: "Técnico especialista en instalación, mantenimiento y reparación de aires acondicionados residenciales y comerciales en Caracas. Servicio rápido, garantizado y con repuestos originales.",
    phone: "584261160067",
    available: true,
    verified: true,
    avatar: "JR",
    avatarColor: "#0369A1",
    photo: null,
    userCreated: false
  },
  {
    id: 5,
    name: "Temisto Mencias",
    skill: "Remodelaciones",
    icon: "🏗️",
    city: "Caracas",
    zone: "Toda Caracas",
    rating: 4.8,
    reviews: 3,
    experience: "15 años",
    jobs: 20,
    price: null,
    description: "Especialista en remodelaciones con 15 años de experiencia. Maneja construcción general, impermeabilización, plomería y electricidad. Presupuesto personalizado después de evaluar el trabajo.",
    phone: "584120178428",
    available: true,
    verified: true,
    avatar: "TM",
    avatarColor: "#7C3AED",
    photo: null,
    userCreated: false
  },
  {
    id: 6,
    name: "Adilio",
    skill: "Pintor",
    icon: "🎨",
    city: "Caracas",
    zone: "Toda Caracas",
    rating: 4.7,
    reviews: 4,
    experience: "10 años",
    jobs: 16,
    price: null,
    description: "Pintor profesional con 10 años de experiencia en Caracas. Pintura interior, exterior, fachadas y acabados. Presupuesto por metro cuadrado después de evaluar el espacio.",
    phone: "584241528231",
    available: true,
    verified: true,
    avatar: "AD",
    avatarColor: "#D97706",
    photo: null,
    userCreated: false
  }
];

// ---- CONSTANTES DE SKILL ----
const SKILL_ICONS = {
  "Plomero": "🔧", "Electricista": "⚡", "Pintor": "🎨",
  "Limpieza": "🧹", "Carpintero": "🪚", "Aire acondicionado": "❄️",
  "Cerrajero": "🔐", "Jardinero": "🌿", "Albañil": "🧱", "Remodelaciones": "🏗️", "Otro": "🛠️"
};

const AVATAR_COLORS = [
  "#1E3A5F","#7C3AED","#0D9488","#92400E","#DB2777",
  "#0369A1","#065F46","#6D28D9","#15803D","#C2410C","#78350F","#B45309"
];

// ---- ESTADO ----
let workers = [];
let reviews = {};
let activeCategory = "";
let activeCity = "Caracas";
let searchQuery = "";
let sortBy = "rating";
let uploadedPhotoBase64 = null;

// ---- LOCALSTORAGE ----
function loadFromStorage() {
  try {
    const storedWorkers = JSON.parse(localStorage.getItem('chambea_workers') || '[]');
    reviews = JSON.parse(localStorage.getItem('chambea_reviews') || '{}');
    workers = [...defaultWorkers, ...storedWorkers];
    // Apply any stored reviews to worker ratings
    workers.forEach(w => applyStoredReviews(w));
  } catch {
    workers = [...defaultWorkers];
    reviews = {};
  }
}

function applyStoredReviews(worker) {
  const wReviews = reviews[worker.id];
  if (!wReviews || wReviews.length === 0) return;
  const total = wReviews.reduce((sum, r) => sum + r.rating, 0);
  const baseReviews = worker.userCreated ? 0 : worker.reviews;
  const baseRating  = worker.userCreated ? 0 : (worker.rating * worker.reviews);
  const allCount = baseReviews + wReviews.length;
  const allTotal = baseRating + total;
  worker.rating  = Math.round((allTotal / allCount) * 10) / 10;
  worker.reviews = allCount;
}

function saveUserWorkers() {
  const userWorkers = workers.filter(w => w.userCreated);
  localStorage.setItem('chambea_workers', JSON.stringify(userWorkers));
}

function saveReviews() {
  localStorage.setItem('chambea_reviews', JSON.stringify(reviews));
}

// ---- RENDER ESTRELLAS ----
function renderStars(rating) {
  let html = '<div class="stars-display">';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      html += '<span class="star filled">★</span>';
    } else if (rating >= i - 0.5) {
      html += '<span class="star half">★</span>';
    } else {
      html += '<span class="star">★</span>';
    }
  }
  html += '</div>';
  return html;
}

// ---- RENDER AVATAR ----
function renderAvatar(w) {
  if (w.photo) {
    return `<img src="${w.photo}" alt="${w.name}" />`;
  }
  return `<span style="background:${w.avatarColor}20;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:${w.avatarColor};border-radius:50%;">${w.avatar}</span>`;
}

// ---- RENDER CARDS ----
function renderWorkers(list) {
  const grid = document.getElementById('workersGrid');
  const empty = document.getElementById('emptyState');
  const count = document.getElementById('resultsCount');

  if (list.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    count.textContent = 'Sin resultados';
    return;
  }

  empty.style.display = 'none';
  count.textContent = `Mostrando ${list.length} profesional${list.length !== 1 ? 'es' : ''}`;

  grid.innerHTML = list.map(w => {
    const wReviewCount = (reviews[w.id] || []).length;
    return `
    <div class="worker-card" data-id="${w.id}">
      <div class="card-top" style="background:linear-gradient(135deg,${w.avatarColor} 0%,${w.avatarColor}CC 100%);">
        ${w.userCreated ? '<span class="card-badge-new">✦ Nuevo</span>' : (w.available ? '<span class="card-badge-available">● Disponible</span>' : '')}
        ${w.verified ? '<span class="card-badge-verified">✓ Verificado</span>' : ''}
        <div class="card-avatar">${renderAvatar(w)}</div>
      </div>
      <div class="card-body">
        <h3 class="card-name">${w.name}</h3>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
          <div class="card-skill">${w.icon} ${w.skill}</div>
          ${w.price ? `<div class="card-price">$${w.price}/hr</div>` : ''}
        </div>
        <div class="card-location">📍 ${w.zone ? w.zone + ', ' : ''}${w.city}</div>
        <div class="card-stars">
          ${renderStars(w.rating)}
          <span class="rating-num">${w.rating.toFixed(1)}</span>
          <span class="rating-count">(${w.reviews} reseña${w.reviews !== 1 ? 's' : ''})</span>
        </div>
        <p class="card-description">${w.description}</p>
        <div class="card-meta">
          <div class="card-meta-item">
            <span class="meta-label">Precio/hora</span>
            <span class="meta-value" style="color:#059669;">${w.price ? '$' + w.price : 'A consultar'}</span>
          </div>
          <div class="card-meta-item">
            <span class="meta-label">Ciudad</span>
            <span class="meta-value">${w.city}</span>
          </div>
          <div class="card-meta-item">
            <span class="meta-label">Reseñas</span>
            <span class="meta-value">${wReviewCount > 0 ? '+' + wReviewCount + ' nuevas' : w.reviews}</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn-contact" onclick="openContact(${w.id})">
            💬 Contactar por WhatsApp
          </button>
          <button class="btn-review" onclick="openReview(${w.id})" title="Dejar reseña">
            ⭐
          </button>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ---- FILTRAR ----
function applyFilters() {
  let list = [...workers];

  if (activeCategory) list = list.filter(w => w.skill === activeCategory);
  if (activeCity) list = list.filter(w => w.city === activeCity);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(w =>
      w.name.toLowerCase().includes(q) ||
      w.skill.toLowerCase().includes(q) ||
      (w.zone || '').toLowerCase().includes(q) ||
      w.description.toLowerCase().includes(q)
    );
  }

  if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'reviews') list.sort((a, b) => b.reviews - a.reviews);
  else if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

  renderWorkers(list);
}

function resetFilters() {
  activeCategory = "";
  activeCity = "";
  searchQuery = "";
  document.getElementById('searchInput').value = '';
  document.getElementById('cityFilter').value = '';
  document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active-cat'));
  document.querySelector('.cat-card[data-cat=""]').classList.add('active-cat');
  applyFilters();
  document.getElementById('trabajadores').scrollIntoView({ behavior: 'smooth' });
}

// ---- NAVBAR SCROLL ----
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// ---- HAMBURGER ----
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => document.getElementById('mobileMenu').classList.remove('open'));
});

// ---- CATEGORÍAS ----
document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active-cat'));
    card.classList.add('active-cat');
    activeCategory = card.dataset.cat;
    applyFilters();
    document.getElementById('trabajadores').scrollIntoView({ behavior: 'smooth' });
  });
});

// ---- HERO TAGS ----
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', () => {
    activeCategory = tag.dataset.cat;
    activeCity = document.getElementById('cityFilter').value || 'Caracas';
    document.querySelectorAll('.cat-card').forEach(c => {
      c.classList.toggle('active-cat', c.dataset.cat === activeCategory);
    });
    applyFilters();
    document.getElementById('trabajadores').scrollIntoView({ behavior: 'smooth' });
  });
});

// ---- BUSCAR ----
document.getElementById('searchBtn').addEventListener('click', () => {
  searchQuery = document.getElementById('searchInput').value.trim();
  activeCity = document.getElementById('cityFilter').value;
  applyFilters();
  document.getElementById('trabajadores').scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('searchBtn').click();
});

// ---- SORT ----
document.getElementById('sortFilter').addEventListener('change', e => {
  sortBy = e.target.value;
  applyFilters();
});

// =============================================
// MODAL HELPERS
// =============================================
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

function overlayClose(modalId) {
  document.getElementById(modalId).addEventListener('click', e => {
    if (e.target === document.getElementById(modalId)) closeModal(modalId);
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal('signupModal');
    closeModal('contactModal');
    closeModal('reviewModal');
  }
});

// =============================================
// 1. SIGNUP MODAL — REGISTRO DE TRABAJADORES
// =============================================
function openSignup() { openModal('signupModal'); }
function closeSignup() { closeModal('signupModal'); }

['openSignupNav','openSignupCta'].forEach(id => {
  document.getElementById(id).addEventListener('click', e => { e.preventDefault(); openSignup(); });
});
document.getElementById('openSignupMobile').addEventListener('click', e => { e.preventDefault(); openSignup(); });
document.getElementById('openSignupFooter').addEventListener('click', e => { e.preventDefault(); openSignup(); });
document.getElementById('closeModal').addEventListener('click', closeSignup);
overlayClose('signupModal');

// PHOTO UPLOAD
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const photoUploadArea = document.getElementById('photoUploadArea');

photoUploadArea.addEventListener('click', () => photoInput.click());

photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    uploadedPhotoBase64 = e.target.result;
    photoPreview.classList.add('has-image');
    photoPreview.innerHTML = `<img src="${uploadedPhotoBase64}" alt="Vista previa" />`;
  };
  reader.readAsDataURL(file);
});

// FORM SUBMIT — Creates actual worker profile
document.getElementById('signupForm').addEventListener('submit', e => {
  e.preventDefault();

  const name  = document.getElementById('sf-name').value.trim();
  const phone = document.getElementById('sf-phone').value.trim().replace(/\D/g, '');
  const skill = document.getElementById('sf-skill').value;
  const price = parseInt(document.getElementById('sf-price').value) || null;
  const city  = document.getElementById('sf-city').value;
  const zone  = document.getElementById('sf-zone').value.trim();
  const desc  = document.getElementById('sf-desc').value.trim();

  if (!name || !phone || !skill || !city || !desc) {
    showToast('⚠️ Completa todos los campos obligatorios');
    return;
  }

  const initials = name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
  const newId = Date.now();

  const newWorker = {
    id: newId,
    name,
    skill,
    icon: SKILL_ICONS[skill] || '🛠️',
    city,
    zone,
    rating: 0,
    reviews: 0,
    experience: 'Nuevo',
    jobs: 0,
    price,
    description: desc,
    phone,
    available: true,
    verified: false,
    avatar: initials,
    avatarColor: color,
    photo: uploadedPhotoBase64 || null,
    userCreated: true
  };

  workers.unshift(newWorker);
  saveUserWorkers();
  applyFilters();

  closeSignup();
  e.target.reset();
  uploadedPhotoBase64 = null;
  photoPreview.classList.remove('has-image');
  photoPreview.innerHTML = '<span class="photo-placeholder-icon">📷</span><span>Toca para subir una foto</span>';

  showToast('✓ ¡Perfil publicado! Ya apareces en Chambea');
  setTimeout(() => {
    document.getElementById('trabajadores').scrollIntoView({ behavior: 'smooth' });
  }, 600);
});

// =============================================
// 2. CONTACT MODAL — WHATSAPP DIRECTO
// =============================================
function openContact(workerId) {
  const w = workers.find(w => w.id === workerId);
  if (!w) return;

  const avatarHtml = w.photo
    ? `<img src="${w.photo}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:3px solid #F97316;" />`
    : `<div style="width:64px;height:64px;border-radius:50%;background:${w.avatarColor}20;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:${w.avatarColor};border:3px solid ${w.avatarColor}30;">${w.avatar}</div>`;

  document.getElementById('contactWorkerPreview').innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
      ${avatarHtml}
      <strong style="font-size:18px;color:#0D1B2A;">${w.name}</strong>
      <span style="font-size:13px;color:#F97316;font-weight:600;">${w.icon} ${w.skill} • ${w.city}</span>
      <div style="display:flex;align-items:center;gap:4px;font-size:13px;color:#6B7280;">
        <span style="color:#F59E0B;">★</span>
        <strong style="color:#374151;">${w.rating > 0 ? w.rating.toFixed(1) : 'Nuevo'}</strong>
        <span>(${w.reviews} reseña${w.reviews !== 1 ? 's' : ''})</span>
        ${w.price ? `<span>• <strong style="color:#059669;">$${w.price}/hr</strong></span>` : ''}
      </div>
    </div>
  `;

  const rawPhone = w.phone.replace(/\D/g, '');
  // Venezuelan numbers: if starts with 0, replace with country code 58
  const intlPhone = rawPhone.startsWith('0') ? '58' + rawPhone.slice(1) : rawPhone;
  const waMsg = encodeURIComponent(`Hola ${w.name}, te conseguí en Chambea y me gustaría contratar tus servicios.`);

  document.getElementById('whatsappLink').href = `https://wa.me/${intlPhone}?text=${waMsg}`;
  document.getElementById('callLink').href = `tel:+${intlPhone}`;

  openModal('contactModal');
}

document.getElementById('closeContactModal').addEventListener('click', () => closeModal('contactModal'));
overlayClose('contactModal');

// =============================================
// 3. REVIEW MODAL — SISTEMA DE RESEÑAS
// =============================================
let selectedRating = 0;

const starLabels = ['', 'Muy malo', 'Regular', 'Bueno', 'Muy bueno', '¡Excelente!'];

function openReview(workerId) {
  const w = workers.find(w => w.id === workerId);
  if (!w) return;

  document.getElementById('rv-workerId').value = workerId;
  selectedRating = 0;
  document.getElementById('rv-rating').value = 0;
  document.getElementById('rv-name').value = '';
  document.getElementById('rv-comment').value = '';
  document.getElementById('starLabel').textContent = 'Selecciona una calificación';

  // Reset stars
  document.querySelectorAll('.star-pick').forEach(s => s.classList.remove('active'));

  // Worker preview
  document.getElementById('reviewWorkerPreview').innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:#F9FAFB;border-radius:12px;margin-bottom:16px;">
      <div style="width:44px;height:44px;border-radius:50%;background:${w.avatarColor}20;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:${w.avatarColor};flex-shrink:0;">${w.avatar}</div>
      <div>
        <strong style="color:#0D1B2A;font-size:15px;">${w.name}</strong><br>
        <span style="color:#F97316;font-size:12px;font-weight:600;">${w.icon} ${w.skill} • ${w.city}</span>
      </div>
    </div>
  `;

  // Render existing reviews for this worker
  renderReviewsList(workerId);

  openModal('reviewModal');
}

function renderReviewsList(workerId) {
  const container = document.getElementById('reviewsList');
  const wReviews = (reviews[workerId] || []).slice().reverse();

  if (wReviews.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <p class="reviews-list-title">Reseñas recientes (${wReviews.length})</p>
    ${wReviews.map(r => `
      <div class="review-item">
        <div class="review-item-header">
          <div class="review-item-author">
            <div class="review-author-avatar">${(r.name || 'A').split(' ').map(p => p[0]).join('').toUpperCase().slice(0,2)}</div>
            <div>
              <div class="review-author-name">${r.name || 'Anónimo'}</div>
              <div class="review-author-date">${r.date}</div>
            </div>
          </div>
          <div class="review-item-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        </div>
        <p class="review-item-comment">${r.comment}</p>
      </div>
    `).join('')}
  `;
}

// Star picker interaction
document.querySelectorAll('.star-pick').forEach(star => {
  star.addEventListener('mouseenter', () => {
    const val = parseInt(star.dataset.val);
    document.querySelectorAll('.star-pick').forEach(s => {
      s.classList.toggle('active', parseInt(s.dataset.val) <= val);
    });
    document.getElementById('starLabel').textContent = starLabels[val];
  });

  star.addEventListener('mouseleave', () => {
    document.querySelectorAll('.star-pick').forEach(s => {
      s.classList.toggle('active', parseInt(s.dataset.val) <= selectedRating);
    });
    document.getElementById('starLabel').textContent = selectedRating > 0 ? starLabels[selectedRating] : 'Selecciona una calificación';
  });

  star.addEventListener('click', () => {
    selectedRating = parseInt(star.dataset.val);
    document.getElementById('rv-rating').value = selectedRating;
    document.querySelectorAll('.star-pick').forEach(s => {
      s.classList.toggle('active', parseInt(s.dataset.val) <= selectedRating);
    });
    document.getElementById('starLabel').textContent = starLabels[selectedRating];
  });
});

// Review form submit
document.getElementById('reviewForm').addEventListener('submit', e => {
  e.preventDefault();

  const workerId = parseInt(document.getElementById('rv-workerId').value);
  const rating   = parseInt(document.getElementById('rv-rating').value);
  const name     = document.getElementById('rv-name').value.trim() || 'Anónimo';
  const comment  = document.getElementById('rv-comment').value.trim();

  if (rating === 0) {
    showToast('⚠️ Selecciona una calificación de 1 a 5 estrellas');
    return;
  }
  if (!comment) {
    showToast('⚠️ Escribe un comentario para tu reseña');
    return;
  }

  // Save review
  if (!reviews[workerId]) reviews[workerId] = [];
  const now = new Date();
  reviews[workerId].push({
    rating,
    name,
    comment,
    date: now.toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' })
  });
  saveReviews();

  // Recalculate worker rating
  const w = workers.find(w => w.id === workerId);
  if (w) applyStoredReviews(w);

  // Re-render
  applyFilters();
  renderReviewsList(workerId);

  // Reset form
  document.getElementById('rv-comment').value = '';
  document.getElementById('rv-name').value = '';
  selectedRating = 0;
  document.getElementById('rv-rating').value = 0;
  document.querySelectorAll('.star-pick').forEach(s => s.classList.remove('active'));
  document.getElementById('starLabel').textContent = 'Selecciona una calificación';

  showToast('✓ ¡Reseña publicada! Gracias por tu opinión');
});

document.getElementById('closeReviewModal').addEventListener('click', () => closeModal('reviewModal'));
overlayClose('reviewModal');

// =============================================
// TOAST NOTIFICATIONS
// =============================================
function showToast(msg) {
  let toast = document.getElementById('chambea-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'chambea-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  document.getElementById('cityFilter').value = 'Caracas';
  applyFilters();
});
