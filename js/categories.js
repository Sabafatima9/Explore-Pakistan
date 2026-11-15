/* ============================================================
   EXPLORE PAKISTAN -- Categories Page JavaScript
   All logic is written using plain functions -- no classes used.
   ============================================================ */

/* Category definitions */
var categories = [
  {
    id: 'mountains',
    name: 'Mountains and Passes',
    icon: 'Mountains',
    description: 'Home to five of the world\'s 14 eight-thousanders, Pakistan\'s mountains are among the most dramatic on Earth.',
    color: '#4a7c59',
    bgColor: 'rgba(74,124,89,0.1)',
    destIds: ['skardu', 'fairy', 'khunjerab']
  },
  {
    id: 'valleys',
    name: 'Scenic Valleys',
    icon: 'Valleys',
    description: 'Lush green valleys carved by ancient rivers, bursting with cherry blossoms in spring and golden leaves in autumn.',
    color: '#2d7d32',
    bgColor: 'rgba(45,125,50,0.1)',
    destIds: ['hunza', 'swat', 'naran']
  },
  {
    id: 'historical',
    name: 'Historical Places',
    icon: 'History',
    description: 'From 5,000-year-old cities to Mughal masterpieces -- Pakistan\'s history spans some of civilization\'s greatest chapters.',
    color: '#8d6e63',
    bgColor: 'rgba(141,110,99,0.1)',
    destIds: ['lahore', 'mohenjo', 'katasraj']
  },
  {
    id: 'beaches',
    name: 'Beaches and Coasts',
    icon: 'Beaches',
    description: 'Stretching along the Arabian Sea, Pakistan\'s coastline offers unspoiled beaches, rugged cliffs, and dramatic seascapes.',
    color: '#0288d1',
    bgColor: 'rgba(2,136,209,0.1)',
    destIds: ['gwadar']
  },
  {
    id: 'lakes',
    name: 'Lakes and Rivers',
    icon: 'Lakes',
    description: 'High-altitude glacial lakes, turquoise rivers, and serene water bodies nestled among towering peaks.',
    color: '#00838f',
    bgColor: 'rgba(0,131,143,0.1)',
    destIds: ['naran', 'hunza', 'skardu']
  },
  {
    id: 'cities',
    name: 'Cultural Cities',
    icon: 'Cities',
    description: 'Vibrant cities where centuries of tradition, Mughal grandeur, and modern Pakistan come alive in bazaars and monuments.',
    color: '#7b1fa2',
    bgColor: 'rgba(123,31,162,0.1)',
    destIds: ['lahore', 'islamabad', 'murree']
  }
];

/* Entry point */
document.addEventListener('DOMContentLoaded', function () {
  renderCategoryCards();
  renderCategoryTabs();
  renderCategorySection('mountains');
});

/* ---- Render top overview cards for each category ---- */
function renderCategoryCards() {
  var container = document.getElementById('categoriesOverview');
  if (!container) return;

  categories.forEach(function (cat) {
    var card = buildCategoryOverviewCard(cat);
    container.appendChild(card);
  });

  activateCategoryReveal(container);
}

/* ---- Build a category overview card element ---- */
function buildCategoryOverviewCard(cat) {
  var div = document.createElement('div');
  div.className = 'cat-overview-card reveal';
  div.style.borderTop = '4px solid ' + cat.color;

  div.innerHTML =
    '<div class="cat-icon" style="background:' + cat.bgColor + ';color:' + cat.color + '">' +
      cat.icon +
    '</div>' +
    '<h3 style="color:' + cat.color + '">' + cat.name + '</h3>' +
    '<p>' + cat.description + '</p>' +
    '<button class="btn" style="background:' + cat.color + ';color:#fff;margin-top:15px;padding:9px 20px;font-size:0.88rem;"' +
      ' onclick="switchTab(\'' + cat.id + '\')">' +
      'View Places' +
    '</button>';

  return div;
}

/* ---- Render tab buttons ---- */
function renderCategoryTabs() {
  var tabsContainer = document.getElementById('categoryTabs');
  if (!tabsContainer) return;

  categories.forEach(function (cat, i) {
    var btn = document.createElement('button');
    btn.className = 'cat-tab-btn' + (i === 0 ? ' active' : '');
    btn.setAttribute('data-cat', cat.id);
    btn.textContent = cat.name;
    btn.addEventListener('click', function () {
      switchTab(cat.id);
    });
    tabsContainer.appendChild(btn);
  });
}

/* ---- Switch to a category tab ---- */
function switchTab(catId) {
  var tabBtns = document.querySelectorAll('.cat-tab-btn');
  tabBtns.forEach(function (b) {
    b.classList.toggle('active', b.getAttribute('data-cat') === catId);
  });

  renderCategorySection(catId);

  var section = document.getElementById('categoryDetail');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ---- Render destination cards for a specific category ---- */
function renderCategorySection(catId) {
  var cat = getCategoryById(catId);
  if (!cat) return;

  var detail = document.getElementById('categoryDetail');
  if (!detail) return;

  var dests = cat.destIds.map(function (id) {
    return getDestinationById(id);
  }).filter(function (d) { return d !== null; });

  var headerHtml =
    '<div class="cat-detail-header" style="border-left:5px solid ' + cat.color + '">' +
      '<span class="cat-big-icon">' + cat.icon + '</span>' +
      '<div>' +
        '<h2 style="color:' + cat.color + '">' + cat.name + '</h2>' +
        '<p>' + cat.description + '</p>' +
      '</div>' +
    '</div>';

  var cardsHtml = '<div class="cards-grid" id="catCardsGrid">';
  dests.forEach(function (d) {
    cardsHtml += buildCatCardHtml(d);
  });
  cardsHtml += '</div>';

  detail.innerHTML = headerHtml + cardsHtml;

  activateCategoryReveal(detail);
}

/* ---- Build HTML string for a destination card in categories ---- */
function buildCatCardHtml(d) {
  var tagsHtml = d.tags.map(function (t) {
    return '<span class="tag tag-green">' + t + '</span>';
  }).join('');

  return (
    '<div class="dest-card reveal">' +
      '<div class="card-img-wrap">' +
        '<img src="' + d.image + '" alt="' + d.name + '"' +
             ' onerror="this.src=\'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80\'" loading="lazy">' +
        '<span class="card-badge">' + d.category + '</span>' +
        '<span class="card-rating">&#9733; ' + d.rating + '</span>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="card-location">&#x1F4CD; ' + d.location + '</div>' +
        '<h3>' + d.name + '</h3>' +
        '<p>' + d.desc + '</p>' +
        '<div class="card-tags">' + tagsHtml + '</div>' +
        '<div class="card-footer">' +
          '<span class="card-season">Best time: <strong>' + d.bestTime + '</strong></span>' +
          '<button class="btn btn-primary" data-open-modal="' + d.id + '" style="padding:8px 18px;font-size:0.85rem;">' +
            'Learn More' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

/* ---- Get a category object by id ---- */
function getCategoryById(id) {
  for (var i = 0; i < categories.length; i++) {
    if (categories[i].id === id) return categories[i];
  }
  return null;
}

/* ---- Activate scroll-reveal for a container ---- */
function activateCategoryReveal(container) {
  var revealEls = container.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(function (el) { observer.observe(el); });
}

/* Expose switchTab globally (called from overview card buttons) */
window.switchTab = switchTab;
