/* ============================================================
   EXPLORE PAKISTAN -- Home Page JavaScript
   All logic is written using plain functions -- no classes used.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  initSlideshow();
  initCounters();
  renderFeaturedDestinations();
  initHeroSearch();
});

/* ---- Hero Slideshow ---- */
function initSlideshow() {
  var slides  = document.querySelectorAll('.hero-slide');
  var dots    = document.querySelectorAll('.hero-dot');
  var current = 0;
  var timer;

  if (!slides.length) return;

  function goToSlide(n) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function nextSlide() { goToSlide(current + 1); }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(nextSlide, 5000);
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      goToSlide(i);
      startTimer();
    });
  });

  var prevBtn = document.getElementById('heroPrev');
  var nextBtn = document.getElementById('heroNext');

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goToSlide(current - 1);
      startTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      goToSlide(current + 1);
      startTimer();
    });
  }

  startTimer();
}

/* ---- Animated counters in stats strip ---- */
function initCounters() {
  var counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el     = entry.target;
        var target = parseInt(el.getAttribute('data-target'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var start  = 0;
        var step   = Math.ceil(target / 60);

        var intervalId = setInterval(function () {
          start += step;
          if (start >= target) {
            start = target;
            clearInterval(intervalId);
          }
          el.textContent = start.toLocaleString() + suffix;
        }, 25);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (c) { observer.observe(c); });
}

/* ---- Render 4 featured destination cards on home page ---- */
function renderFeaturedDestinations() {
  var grid = document.getElementById('featuredGrid');
  if (!grid) return;

  var featuredIds = ['hunza', 'skardu', 'lahore', 'fairy'];

  featuredIds.forEach(function (id) {
    var d = getDestinationById(id);
    if (!d) return;

    var tagsHtml = d.tags.map(function (t) {
      return '<span class="tag tag-green">' + t + '</span>';
    }).join('');

    var card = document.createElement('div');
    card.className = 'dest-card reveal';
    card.innerHTML =
      '<div class="card-img-wrap">' +
        '<img src="' + d.image + '" alt="' + d.name + '"' +
             ' onerror="this.src=\'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80\'">' +
        '<span class="card-badge">' + d.category + '</span>' +
        '<span class="card-rating">&#9733; ' + d.rating + '</span>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="card-location"><span class="icon">&#x1F4CD;</span> ' + d.location + '</div>' +
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

    grid.appendChild(card);
  });

  /* Activate scroll-reveal for the new cards */
  var revealEls = grid.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(function (el) { observer.observe(el); });
}

/* ---- Hero search form ---- */
function initHeroSearch() {
  var form  = document.getElementById('heroSearchForm');
  var input = document.getElementById('heroSearchInput');
  if (!form || !input) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (q) {
      window.location.href = 'destinations.html?search=' + encodeURIComponent(q);
    }
  });
}
