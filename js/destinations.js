/* ============================================================
   EXPLORE PAKISTAN -- Destinations Page JavaScript
   All logic is written using plain functions -- no classes used.
   ============================================================ */

/* Global state for filter and search */
var currentFilter = 'all';
var currentSearch = '';

/* Entry point */
document.addEventListener('DOMContentLoaded', function () {
  initSearch();
  initFilterButtons();
  initSortSelect();
  renderCards();
});

/* ---- Render destination cards based on current filter and search ---- */
function renderCards() {
  var grid = document.getElementById('destinationsGrid');
  if (!grid) return;

  grid.innerHTML = '';

  var filtered = applyFilters(destinations);

  /* Update result count */
  var countEl = document.getElementById('resultCount');
  if (countEl) {
    countEl.textContent = filtered.length + ' destination' + (filtered.length !== 1 ? 's' : '') + ' found';
  }

  /* Empty state */
  if (filtered.length === 0) {
    grid.innerHTML =
      '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-light);">' +
        '<div style="font-size:3rem;margin-bottom:15px;">&#128269;</div>' +
        '<h3 style="color:var(--green-dark);margin-bottom:8px;">No destinations found</h3>' +
        '<p>Try a different search term or category.</p>' +
        '<button class="btn btn-outline" onclick="resetFilters()" style="margin-top:20px;">Show All</button>' +
      '</div>';
    return;
  }

  filtered.forEach(function (d) {
    var card = buildDestinationCard(d);
    grid.appendChild(card);
  });

  activateReveal(grid);
}

/* ---- Apply current filter and search to the destinations array ---- */
function applyFilters(list) {
  return list.filter(function (d) {
    var matchCategory =
      currentFilter === 'all' ||
      d.category.toLowerCase().indexOf(currentFilter.toLowerCase()) !== -1 ||
      d.tags.some(function (t) {
        return t.toLowerCase().indexOf(currentFilter.toLowerCase()) !== -1;
      });

    var matchSearch =
      currentSearch === '' ||
      d.name.toLowerCase().indexOf(currentSearch) !== -1 ||
      d.location.toLowerCase().indexOf(currentSearch) !== -1 ||
      d.desc.toLowerCase().indexOf(currentSearch) !== -1 ||
      d.tags.some(function (t) {
        return t.toLowerCase().indexOf(currentSearch) !== -1;
      });

    return matchCategory && matchSearch;
  });
}

/* ---- Build a single destination card DOM element ---- */
function buildDestinationCard(d) {
  var tagsHtml = d.tags.map(function (t) {
    return '<span class="tag tag-green">' + t + '</span>';
  }).join('');

  var card = document.createElement('div');
  card.className = 'dest-card reveal';
  card.innerHTML =
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
    '</div>';

  return card;
}

/* ---- Activate scroll-reveal for cards inside a container ---- */
function activateReveal(container) {
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

/* ---- Set up category filter buttons ---- */
function initFilterButtons() {
  var filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderCards();

      var grid = document.getElementById('destinationsGrid');
      if (grid) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ---- Set up search input ---- */
function initSearch() {
  var searchInput = document.getElementById('destSearch');
  if (!searchInput) return;

  /* Pre-fill from URL query string */
  var params = new URLSearchParams(window.location.search);
  var q = params.get('search');
  if (q) {
    searchInput.value = q;
    currentSearch = q.toLowerCase();
  }

  searchInput.addEventListener('input', function () {
    currentSearch = searchInput.value.trim().toLowerCase();
    renderCards();
  });

  var clearBtn = document.getElementById('searchClear');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      searchInput.value = '';
      currentSearch = '';
      renderCards();
      searchInput.focus();
    });
  }
}

/* ---- Set up sort select ---- */
function initSortSelect() {
  var sortSelect = document.getElementById('sortSelect');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', function () {
    var val = sortSelect.value;
    if (val === 'name') {
      destinations.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    } else if (val === 'rating') {
      destinations.sort(function (a, b) {
        return parseFloat(b.rating) - parseFloat(a.rating);
      });
    }
    renderCards();
  });
}

/* ---- Reset all filters (called from empty-state button) ---- */
function resetFilters() {
  currentFilter = 'all';
  currentSearch = '';

  var searchInput = document.getElementById('destSearch');
  if (searchInput) searchInput.value = '';

  var filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(function (b) { b.classList.remove('active'); });

  var allBtn = document.querySelector('[data-filter="all"]');
  if (allBtn) allBtn.classList.add('active');

  renderCards();
}
