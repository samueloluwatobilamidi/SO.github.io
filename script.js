/* ============================================================
   Data Science "case study" content — used to enrich Quick View
   for the 5 R projects with model comparisons and demonstrated
   skills. Analytics (dashboard) cards derive their Quick View
   content generically from their existing card data below.
   ============================================================ */
const dsProjectData = {
  "16": {
    demonstrates: [
      "Multicollinearity diagnostics (VIF)",
      "Leakage-safe train/test scaling",
      "Class-imbalance handling via down-sampling",
      "Model comparison across three classifiers"
    ],
    models: [
      { name: "Logistic Regression", note: "Baseline linear classifier; interpretable coefficients for risk drivers." },
      { name: "LDA", note: "Assumes shared covariance across classes; compared against the linear baseline." },
      { name: "Naive Bayes", note: "Fast probabilistic baseline; independence assumption tested against the other two." }
    ]
  },
  "17": {
    demonstrates: [
      "Non-parametric regression comparison",
      "One-hot encoding for categorical features",
      "Predictor-only feature scaling (target kept on dollar scale)",
      "Decision-tree interpretability alongside black-box models"
    ],
    models: [
      { name: "Decision Tree", note: "Interpretable rules showing which factors (e.g. smoking) drive cost spikes." },
      { name: "KNN", note: "Distance-based regressor, tuned across k = 1–15." },
      { name: "SVR (Radial)", note: "Captures non-linear cost relationships a linear model would miss." }
    ]
  },
  "18": {
    demonstrates: [
      "Missing-value imputation",
      "One-hot encoding of clinical categorical variables",
      "VIF-based multicollinearity check",
      "ROC/AUC-based model comparison"
    ],
    models: [
      { name: "Logistic Regression", note: "Baseline linear classifier for presence vs absence of disease." },
      { name: "LDA", note: "Compared against the logistic baseline under shared-covariance assumptions." },
      { name: "Naive Bayes", note: "Probabilistic baseline evaluated on the same ROC curve." }
    ]
  },
  "19": {
    demonstrates: [
      "Near-zero-variance feature filtering",
      "Multi-class classification across six activities",
      "Ensemble vs kernel vs boosting comparison",
      "Feature importance ranking"
    ],
    models: [
      { name: "Random Forest", note: "Bagged ensemble; also used for sensor feature importance ranking." },
      { name: "SVM (Radial)", note: "Kernel-based classifier evaluated via confusion matrix." },
      { name: "XGBoost", note: "Multi-class boosting with softmax probability outputs." }
    ]
  },
  "20": {
    demonstrates: [
      "Feature engineering (property age, renovation flag)",
      "Regularization comparison (Ridge vs Lasso)",
      "Coefficient-based investment-driver analysis",
      "Correlation diagnostics"
    ],
    models: [
      { name: "OLS Linear", note: "Baseline regression; slightly lower RMSE in the supplied results." },
      { name: "Ridge", note: "L2-regularized; lower MAE and reduced multicollinearity impact." },
      { name: "Lasso", note: "L1-regularized; used for feature selection and driver interpretation." }
    ]
  }
};

const analyticsDemonstrates = {
  excel: [
    "Dashboard design & KPI architecture",
    "PivotTable / PivotChart data modelling",
    "Slicer-driven interactivity",
    "Conditional formatting for visual signals"
  ],
  power: [
    "Data modelling & DAX measures",
    "Interactive report design",
    "Dynamic titles & Top N / Bottom N logic",
    "Cross-filtering & drill-through navigation"
  ]
};

/* ============================================================
   Mobile menu
   ============================================================ */
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  mobileMenu.removeAttribute('data-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
}

menuToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  mobileMenu.setAttribute('data-open', isOpen ? 'true' : 'false');
  mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

document.querySelectorAll('.mobile-menu a').forEach(link => link.addEventListener('click', closeMobileMenu));

/* ============================================================
   Sticky nav — active section highlighting (scroll-spy)
   ============================================================ */
const navLinks = [...document.querySelectorAll('.nav-link')];
const spySections = ['work', 'about', 'skills', 'contact']
  .map(id => document.getElementById(id))
  .filter(Boolean);

function setActiveSection(id) {
  navLinks.forEach(link => link.classList.toggle('active', link.dataset.section === id));
}

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActiveSection(entry.target.id);
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

spySections.forEach(section => sectionObserver.observe(section));

/* ============================================================
   Project filters (category / platform / domain / method)
   ============================================================ */
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalEyebrow = document.getElementById('modal-eyebrow');
const modalBadges = document.getElementById('modal-badges');
const modalInsight = document.getElementById('modal-insight');
const modalProgress = document.getElementById('modal-progress');
const modalDemonstrates = document.getElementById('modal-demonstrates');
const modalModelsWrap = document.getElementById('modal-models-wrap');
const modelTabs = document.getElementById('model-tabs');
const modelNote = document.getElementById('model-note');
const modalCounter = document.getElementById('modal-counter');
const modalPrev = document.getElementById('modal-prev');
const modalNext = document.getElementById('modal-next');
const cards = [...document.querySelectorAll('.project-card')];
const categoryButtons = [...document.querySelectorAll('.category-filter')];
const platformButtons = [...document.querySelectorAll('.platform-filter')];
const domainButtons = [...document.querySelectorAll('.domain-filter')];
const methodButtons = [...document.querySelectorAll('.method-filter')];
const platformGroups = [...document.querySelectorAll('.platform-group')];
const domainGroups = [...document.querySelectorAll('.domain-group')];
const methodGroups = [...document.querySelectorAll('.method-group')];
const filterStatus = document.getElementById('filter-status');

let activeCategory = 'all';
let activePlatform = 'all';
let activeDomain = 'all';
let activeMethod = 'all';
let modalIndex = 0;

function visibleCards() {
  return cards.filter(card => !card.classList.contains('hidden'));
}

function updateFilterButtons(buttons, activeValue, attr) {
  buttons.forEach(button => {
    button.classList.toggle('active', button.dataset[attr] === activeValue);
  });
}

function updateGroupVisibility() {
  const showAnalyticsFilters = activeCategory === 'all' || activeCategory === 'analytics';
  const showDsFilters = activeCategory === 'all' || activeCategory === 'datascience';
  platformGroups.forEach(g => g.classList.toggle('gg-hidden', !showAnalyticsFilters));
  domainGroups.forEach(g => g.classList.toggle('gg-hidden', !showAnalyticsFilters));
  methodGroups.forEach(g => g.classList.toggle('gg-hidden', !showDsFilters));
}

function applyFilters() {
  let visibleCount = 0;
  cards.forEach(card => {
    const category = card.dataset.category;
    const categoryMatch = activeCategory === 'all' || category === activeCategory;
    const platformMatch = category !== 'analytics' || activePlatform === 'all' || card.dataset.platform === activePlatform;
    const domainMatch = category !== 'analytics' || activeDomain === 'all' || card.dataset.domain === activeDomain;
    const methodMatch = category !== 'datascience' || activeMethod === 'all' || card.dataset.method === activeMethod;
    const show = categoryMatch && platformMatch && domainMatch && methodMatch;
    card.classList.toggle('hidden', !show);
    if (show) visibleCount += 1;
  });

  const categoryLabel = activeCategory === 'all' ? '' : activeCategory === 'datascience' ? ' in Data Science' : ' in Analytics';
  const platformLabel = activePlatform === 'all' ? '' : activePlatform === 'power' ? ', Power BI' : ', Excel';
  const domainLabel = activeDomain === 'all' ? '' : `, ${activeDomain.replace(/\b\w/g, c => c.toUpperCase())}`;
  const methodLabel = activeMethod === 'all' ? '' : `, ${activeMethod === 'risk' ? 'Risk / Predictive Analytics' : activeMethod.replace(/\b\w/g, c => c.toUpperCase())}`;
  filterStatus.textContent = `Showing ${visibleCount} project${visibleCount === 1 ? '' : 's'}${categoryLabel}${platformLabel}${domainLabel}${methodLabel}`;
}

categoryButtons.forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.categoryFilter;
  updateFilterButtons(categoryButtons, activeCategory, 'categoryFilter');
  if (activeCategory !== 'analytics' && activeCategory !== 'all') {
    activePlatform = 'all';
    activeDomain = 'all';
    updateFilterButtons(platformButtons, activePlatform, 'platformFilter');
    updateFilterButtons(domainButtons, activeDomain, 'domainFilter');
  }
  if (activeCategory !== 'datascience' && activeCategory !== 'all') {
    activeMethod = 'all';
    updateFilterButtons(methodButtons, activeMethod, 'methodFilter');
  }
  updateGroupVisibility();
  applyFilters();
}));

platformButtons.forEach(button => button.addEventListener('click', () => {
  activePlatform = button.dataset.platformFilter;
  if (activePlatform === 'all') {
    activeDomain = 'all';
    updateFilterButtons(domainButtons, activeDomain, 'domainFilter');
  }
  updateFilterButtons(platformButtons, activePlatform, 'platformFilter');
  applyFilters();
}));

domainButtons.forEach(button => button.addEventListener('click', () => {
  activeDomain = button.dataset.domainFilter;
  updateFilterButtons(domainButtons, activeDomain, 'domainFilter');
  applyFilters();
}));

methodButtons.forEach(button => button.addEventListener('click', () => {
  activeMethod = button.dataset.methodFilter;
  updateFilterButtons(methodButtons, activeMethod, 'methodFilter');
  applyFilters();
}));

/* ============================================================
   Quick View modal — populated dynamically per project
   ============================================================ */
function titleCase(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function renderModelTabs(models) {
  modelTabs.innerHTML = '';
  modelNote.textContent = models[0] ? models[0].note : '';
  models.forEach((model, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = model.name;
    btn.className = i === 0 ? 'active' : '';
    btn.addEventListener('click', () => {
      modelTabs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      modelNote.textContent = model.note;
    });
    modelTabs.appendChild(btn);
  });
}

function renderProgress(isDataScience) {
  const phases = isDataScience ? ['Data', 'Model', 'Evaluate', 'Insight'] : ['Data Prep', 'Design', 'Build', 'Insight'];
  modalProgress.innerHTML = '';
  phases.forEach((phase, i) => {
    const span = document.createElement('span');
    span.className = 'phase';
    span.innerHTML = `<span class="phase-dot"></span>${phase}`;
    modalProgress.appendChild(span);
    if (i < phases.length - 1) {
      const line = document.createElement('span');
      line.className = 'phase-line';
      modalProgress.appendChild(line);
    }
  });
}

function openModalFromCard(cardIndex) {
  const currentCards = visibleCards();
  if (!currentCards.length) return;
  modalIndex = Math.max(0, Math.min(cardIndex, currentCards.length - 1));
  const card = currentCards[modalIndex];
  const button = card.querySelector('.image-btn');
  const id = card.dataset.id;
  const isDataScience = card.dataset.category === 'datascience';
  const title = button.dataset.title;
  const description = card.querySelector('.card-body p')?.textContent.trim() || '';

  modalImg.src = button.dataset.img;
  modalImg.alt = button.querySelector('img')?.alt || title;
  modalTitle.textContent = title;
  modalEyebrow.textContent = isDataScience ? 'Data Science Case Study' : 'Dashboard Case Study';
  modalInsight.textContent = description;

  // Badges: reuse the same labels already shown on the card face.
  const metaSpans = [...card.querySelectorAll('.meta span')].map(s => s.textContent);
  modalBadges.innerHTML = '';
  metaSpans.forEach(label => {
    const span = document.createElement('span');
    span.textContent = titleCase(label);
    modalBadges.appendChild(span);
  });

  renderProgress(isDataScience);

  const demonstrates = isDataScience
    ? (dsProjectData[id]?.demonstrates || [])
    : (analyticsDemonstrates[card.dataset.platform] || []);
  modalDemonstrates.innerHTML = '';
  demonstrates.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    modalDemonstrates.appendChild(li);
  });

  if (isDataScience && dsProjectData[id]?.models) {
    modalModelsWrap.hidden = false;
    renderModelTabs(dsProjectData[id].models);
  } else {
    modalModelsWrap.hidden = true;
  }

  modalCounter.textContent = `${modalIndex + 1} / ${currentCards.length}`;
  modalPrev.disabled = currentCards.length < 2;
  modalNext.disabled = currentCards.length < 2;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function moveModal(step) {
  const currentCards = visibleCards();
  if (currentCards.length < 2) return;
  modalIndex = (modalIndex + step + currentCards.length) % currentCards.length;
  openModalFromCard(modalIndex);
}

document.querySelectorAll('.image-btn').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('.project-card');
  openModalFromCard(visibleCards().indexOf(card));
}));

document.querySelectorAll('.view-btn').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('.project-card');
  openModalFromCard(visibleCards().indexOf(card));
}));

document.querySelector('.modal-close').addEventListener('click', closeModal);
modalPrev.addEventListener('click', () => moveModal(-1));
modalNext.addEventListener('click', () => moveModal(1));
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });

document.addEventListener('keydown', event => {
  if (!modal.classList.contains('open')) return;
  if (event.key === 'Escape') closeModal();
  if (event.key === 'ArrowLeft') moveModal(-1);
  if (event.key === 'ArrowRight') moveModal(1);
});

/* ============================================================
   Scroll-reveal (respects prefers-reduced-motion via CSS)
   ============================================================ */
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

updateGroupVisibility();
applyFilters();
