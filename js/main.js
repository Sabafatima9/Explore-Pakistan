/* ============================================================
   EXPLORE PAKISTAN -- Main JavaScript (shared across all pages)
   ============================================================ */

/* ---- Navbar: scroll effect + hamburger menu ---- */
(function initNavbar() {
  var navbar    = document.querySelector('.navbar');
  var hamburger = document.querySelector('.hamburger');
  var mobileMenu = document.querySelector('.mobile-menu');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar && navbar.classList.add('scrolled');
    } else {
      navbar && navbar.classList.remove('scrolled');
    }
    var btn = document.getElementById('scrollTopBtn');
    if (btn) {
      btn.classList.toggle('show', window.scrollY > 400);
    }
  });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage ||
        (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ---- Scroll-to-top ---- */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- Scroll-reveal animation ---- */
(function initScrollReveal() {
  var revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ---- Toast notification helper ---- */
function showToast(message) {
  var old = document.querySelector('.toast');
  if (old) old.remove();

  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      toast.classList.add('show');
    });
  });

  setTimeout(function () {
    toast.classList.remove('show');
    setTimeout(function () { toast.remove(); }, 350);
  }, 3000);
}

/* ---- Modal open/close ---- */
(function initModal() {
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-open-modal]');
    if (btn) {
      var id   = btn.getAttribute('data-open-modal');
      var dest = getDestinationById(id);
      if (dest) openModal(dest);
      return;
    }
    if (e.target.classList.contains('modal-overlay')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
})();

function openModal(dest) {
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'destModal';

  var highlightsHtml = '';
  if (dest.highlights && dest.highlights.length) {
    var items = dest.highlights.map(function (h) {
      return '<li>' + h + '</li>';
    }).join('');
    highlightsHtml =
      '<div class="modal-highlights">' +
        '<h4>Highlights</h4>' +
        '<ul>' + items + '</ul>' +
      '</div>';
  }

  var tagsHtml = dest.tags.map(function (t) {
    return '<span class="tag tag-green">' + t + '</span>';
  }).join('');

  overlay.innerHTML =
    '<div class="modal-box-wrapper">' +
      '<div class="modal-box">' +
        '<button class="modal-close" onclick="closeModal()" title="Close">X</button>' +
        '<img class="modal-img" src="' + dest.image + '" alt="' + dest.name + '"' +
             ' onerror="this.src=\'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80\'">' +
        '<div class="modal-content">' +
          '<div class="card-tags">' + tagsHtml + '</div>' +
          '<h2>' + dest.name + '</h2>' +
          '<div class="modal-meta">' +
            '<span>Location: ' + dest.location + '</span>' +
            '<span>Rating: ' + dest.rating + ' / 5.0</span>' +
            '<span>Best Time: ' + dest.bestTime + '</span>' +
            '<span>Type: ' + dest.category + '</span>' +
          '</div>' +
          '<p>' + (dest.fullDesc || dest.desc) + '</p>' +
          highlightsHtml +
          '<div class="modal-actions">' +
            '<button class="btn btn-primary" onclick="showToast(\'Added to your wishlist!\'); closeModal();">' +
              'Add to Wishlist' +
            '</button>' +
            '<button class="btn btn-outline" onclick="closeModal()">Close</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.classList.add('open');
    });
  });
}

function closeModal() {
  var overlay = document.getElementById('destModal');
  if (overlay) {
    overlay.classList.remove('open');
    setTimeout(function () {
      overlay.remove();
      document.body.style.overflow = '';
    }, 300);
  }
}

/* ---- Destinations Data ---- */
var destinations = [
  {
    id: 'hunza',
    name: 'Hunza Valley',
    location: 'Gilgit-Baltistan',
    category: 'Valley',
    tags: ['Valley', 'Mountain', 'Scenic'],
    rating: '4.9',
    bestTime: 'Apr - Oct',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Hunza_Valley_HDR.jpg/960px-Hunza_Valley_HDR.jpg',
    desc: 'A breathtaking valley cradled by towering Karakoram peaks, known for its cherry blossoms, ancient forts, and legendary hospitality.',
    fullDesc: 'Hunza Valley is one of Pakistan\'s most mesmerising destinations, nestled at an altitude of 2,438 metres in the Karakoram mountain range. The valley is famous for its stunning scenery of snow-capped peaks, terraced fields, and the turquoise Hunza River. The ancient Baltit Fort and Altit Fort stand as proud sentinels of the valley\'s rich history. Hunza is also celebrated for its cherry and apricot blossoms in spring, and the warm, welcoming culture of the Hunzakut people.',
    highlights: [
      'Baltit Fort (900+ years old)',
      'Attabad Lake (turquoise blue)',
      "Eagle's Nest viewpoint",
      'Rakaposhi base camp trek',
      'Cherry blossom festival (April)',
      'Karimabad old bazaar'
    ]
  },
  {
    id: 'skardu',
    name: 'Skardu',
    location: 'Gilgit-Baltistan',
    category: 'Mountain',
    tags: ['Mountain', 'Adventure', 'Lakes'],
    rating: '4.8',
    bestTime: 'May - Sep',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Shangrila_resort_skardu.jpg/960px-Shangrila_resort_skardu.jpg',
    desc: 'The gateway to K2 and home to some of the world\'s most dramatic high-altitude lakes, deserts, and ancient Buddhist ruins.',
    fullDesc: 'Skardu is the administrative capital of Gilgit-Baltistan and serves as the base camp for expeditions to K2, the world\'s second-highest mountain. The city sits at 2,228 metres and is surrounded by towering mountains, cold deserts, and brilliant blue lakes. Shangrila Resort, known as the "Heaven on Earth," sits beside the remarkable Kachura Lake. The ancient Skardu Fort overlooks the Indus River, while the Sarfaranga Cold Desert offers a surreal landscape that defies imagination.',
    highlights: [
      'K2 base camp gateway',
      'Shangrila Resort and Kachura Lake',
      'Deosai National Park',
      'Skardu Cold Desert',
      'Upper Kachura Lake',
      'Shigar Valley and Fort'
    ]
  },
  {
    id: 'swat',
    name: 'Swat Valley',
    location: 'Khyber Pakhtunkhwa',
    category: 'Valley',
    tags: ['Valley', 'Historical', 'Scenic'],
    rating: '4.7',
    bestTime: 'Mar - Nov',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Mahodand_l.jpg/960px-Mahodand_l.jpg',
    desc: 'The "Switzerland of Pakistan" -- lush green valleys, roaring rivers, ancient Buddhist ruins, and snow-covered peaks all in one.',
    fullDesc: 'Swat Valley, often called the "Switzerland of Pakistan," is a magnificent valley in Khyber Pakhtunkhwa known for its lush green meadows, crystal-clear rivers, and ancient history. The valley was once the heart of the Gandharan Buddhist civilization, and numerous ancient stupas and Buddhist sculptures can still be found here. Malam Jabba ski resort offers winter sports, while Kalam and Mahodand Lake are summer paradises.',
    highlights: [
      'Malam Jabba Ski Resort',
      'Mahodand Lake',
      'Buddhist archaeological sites',
      'Kalam Valley',
      'Swat River trout fishing',
      'Fizagat Park'
    ]
  },
  {
    id: 'naran',
    name: 'Naran Kaghan',
    location: 'Khyber Pakhtunkhwa',
    category: 'Valley',
    tags: ['Valley', 'Lakes', 'Trekking'],
    rating: '4.8',
    bestTime: 'Jun - Sep',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Lulusar_Lake%2C_Naran%2C_KPK%2C_Pakistan.JPG/960px-Lulusar_Lake%2C_Naran%2C_KPK%2C_Pakistan.JPG',
    desc: 'Home to the magical Saif-ul-Malook Lake and the beautiful Kaghan Valley, a haven for trekkers, nature lovers, and honeymooners.',
    fullDesc: 'The Naran Kaghan Valley is one of Pakistan\'s most beloved tourist destinations, situated in Mansehra District. The valley is dominated by the legendary Lake Saif-ul-Malook, sitting at 3,224 metres above sea level and surrounded by snow-capped peaks. The glacial waters of the lake change colour with the sky, creating a magical atmosphere that has inspired centuries of Punjabi folklore.',
    highlights: [
      'Lake Saif-ul-Malook',
      'Babusar Top (4,173m)',
      'Lulusar Lake',
      'Ansoo Lake trek',
      'Naran Bazaar',
      'Lalazar Plateau meadows'
    ]
  },
  {
    id: 'fairy',
    name: 'Fairy Meadows',
    location: 'Gilgit-Baltistan',
    category: 'Mountain',
    tags: ['Mountain', 'Camping', 'Trek'],
    rating: '4.9',
    bestTime: 'May - Oct',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Fairy_Meadows%2C_Pakistan.jpg/960px-Fairy_Meadows%2C_Pakistan.jpg',
    desc: 'A magical alpine meadow at the base of Nanga Parbat, the world\'s ninth-highest mountain -- perhaps Pakistan\'s most iconic view.',
    fullDesc: 'Fairy Meadows (locally known as Joot) is an alpine meadow at 3,300 metres above sea level, right at the base of Nanga Parbat -- the world\'s ninth-highest mountain at 8,126 metres. The view of Nanga Parbat\'s Raikot face is considered one of the most breathtaking mountain panoramas on Earth. The meadow is accessible via a thrilling jeep track from Raikot Bridge, followed by a 2-3 hour hike through pine forests.',
    highlights: [
      'Nanga Parbat base camp view',
      'Fairy Meadows camping',
      'Pine forest trekking',
      'Beyal Camp (higher viewpoint)',
      'Raikot Bridge',
      'Photography paradise'
    ]
  },
  {
    id: 'murree',
    name: 'Murree',
    location: 'Punjab',
    category: 'Hill Station',
    tags: ['Hill Station', 'Family', 'Scenic'],
    rating: '4.5',
    bestTime: 'Year-round',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
    desc: 'Pakistan\'s favourite hill station -- a cool mountain retreat with colonial-era charm, pine forests, and panoramic Himalayan views.',
    fullDesc: 'Murree is Pakistan\'s most popular and accessible hill station, located about 50 km from Islamabad at an elevation of 2,290 metres. Established during the British colonial era, Murree retains much of its charming Victorian architecture along Mall Road. The town is surrounded by dense pine and oak forests, and in winter becomes a snowy wonderland.',
    highlights: [
      'Mall Road and Kashmir Point',
      'Patriata chairlift',
      'Pindi Point viewpoint',
      'Bhurban golf course',
      'GPO Mall colonial architecture',
      'Winter snowfall season'
    ]
  },
  {
    id: 'lahore',
    name: 'Lahore',
    location: 'Punjab',
    category: 'Historical City',
    tags: ['Historical', 'Culture', 'Food'],
    rating: '4.8',
    bestTime: 'Oct - Mar',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    desc: 'The "Heart of Pakistan" -- a city of Mughal splendour, vibrant bazaars, world-class food, and centuries of living culture.',
    fullDesc: 'Lahore is Pakistan\'s cultural capital and second-largest city, known for its remarkable Mughal-era architecture, vibrant street life, and extraordinary food scene. The Lahore Fort and Badshahi Mosque rank among the finest examples of Mughal architecture in the world. Walled City (Old Lahore) is a labyrinth of narrow lanes, ancient havelis, and buzzing bazaars including the famous Anarkali Bazaar.',
    highlights: [
      'Badshahi Mosque (Mughal era)',
      'Lahore Fort and Sheesh Mahal',
      'Shalimar Gardens',
      'Walled City and Anarkali Bazaar',
      'Lahori food: nihari, paye, halwa puri',
      'Wagah Border ceremony'
    ]
  },
  {
    id: 'islamabad',
    name: 'Islamabad',
    location: 'Federal Capital',
    category: 'Capital City',
    tags: ['Capital', 'Modern', 'Nature'],
    rating: '4.6',
    bestTime: 'Oct - Apr',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
    desc: 'Pakistan\'s beautiful green capital -- a planned city of wide boulevards, the majestic Faisal Mosque, and the scenic Margalla Hills.',
    fullDesc: 'Islamabad, Pakistan\'s capital city, is widely regarded as one of the most beautiful and well-planned capital cities in Asia. Built in the 1960s, the city is characterised by its wide tree-lined avenues, modern architecture, and lush greenery backed by the Margalla Hills. The iconic Faisal Mosque is a masterpiece of modern Islamic architecture.',
    highlights: [
      'Faisal Mosque (iconic)',
      'Margalla Hills hiking',
      'Daman-e-Koh viewpoint',
      'Pakistan Monument',
      'Lok Virsa Museum',
      'Rawal Lake and F-9 Park'
    ]
  },
  {
    id: 'khunjerab',
    name: 'Khunjerab Pass',
    location: 'Gilgit-Baltistan',
    category: 'Mountain Pass',
    tags: ['Mountain', 'Adventure', 'Border'],
    rating: '4.7',
    bestTime: 'May - Nov',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    desc: 'The world\'s highest paved international border crossing at 4,693 metres -- a dramatic pass connecting Pakistan and China.',
    fullDesc: 'Khunjerab Pass is the highest paved international border crossing in the world, sitting at 4,693 metres on the Karakoram Highway. The pass marks the border between Pakistan and China and is a point of immense natural beauty. The drive up the Karakoram Highway (KKH) through Hunza is itself one of the world\'s greatest road trips, often called the Eighth Wonder of the World.',
    highlights: [
      'Highest paved border crossing',
      'Karakoram Highway (KKH)',
      'Marco Polo sheep sightings',
      'Khunjerab National Park',
      'China-Pakistan border monument',
      'Spectacular mountain vistas'
    ]
  },
  {
    id: 'mohenjo',
    name: 'Mohenjo-daro',
    location: 'Sindh',
    category: 'Archaeological Site',
    tags: ['Historical', 'UNESCO', 'Ancient'],
    rating: '4.6',
    bestTime: 'Nov - Feb',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
    desc: 'A UNESCO World Heritage Site -- ruins of one of the world\'s first great cities from the ancient Indus Valley Civilization (2600 BCE).',
    fullDesc: 'Mohenjo-daro (meaning "Mound of the Dead") is one of the most important archaeological sites in the world and a UNESCO World Heritage Site. This ancient city flourished around 2600-1900 BCE as part of the Indus Valley Civilization. The city featured remarkably advanced urban planning with a grid street system, sophisticated drainage, and multi-storey buildings made of fired brick.',
    highlights: [
      'UNESCO World Heritage Site',
      'Great Bath (5,000 years old)',
      'Sophisticated ancient drainage system',
      'Indus Valley Civilization museum',
      'Ancient grid-plan streets',
      'The famous Dancing Girl artefact'
    ]
  },
  {
    id: 'katasraj',
    name: 'Katas Raj Temples',
    location: 'Punjab',
    category: 'Historical Site',
    tags: ['Historical', 'Religious', 'Culture'],
    rating: '4.4',
    bestTime: 'Oct - Mar',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
    desc: 'A sacred Hindu temple complex around a holy pond -- one of the most significant Hindu pilgrimage sites in Pakistan, dating to antiquity.',
    fullDesc: 'Katas Raj Temples, located near Chakwal in Punjab, are a complex of ancient Hindu temples surrounding the sacred Katas Raj pond. According to Hindu mythology, the pond was formed from the tears of Lord Shiva. The temples date from the Hindu Shahi period (around 6th to 9th centuries CE) and are among the most important Hindu pilgrimage sites in the world.',
    highlights: [
      'Sacred Hindu pond',
      'Ancient Shahi-era temples',
      'Lord Shiva main temple',
      'Mythological significance',
      'Peaceful lake reflection',
      'Archaeological museum nearby'
    ]
  },
  {
    id: 'gwadar',
    name: 'Gwadar',
    location: 'Balochistan',
    category: 'Beach',
    tags: ['Beach', 'Port', 'Scenic'],
    rating: '4.5',
    bestTime: 'Oct - Mar',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    desc: 'A rising deep-sea port city on the Arabian Sea with pristine beaches, golden sunsets, and jaw-dropping coastal cliffs.',
    fullDesc: 'Gwadar is a port city on the southwestern coast of Balochistan, situated on the Arabian Sea. Once a small fishing village, Gwadar has transformed into a major strategic port city under CPEC. The city offers stunning coastal landscapes including the iconic Hammerhead formation, Padi Zirr beach, and spectacular sunsets over the Arabian Sea.',
    highlights: [
      'Pristine Arabian Sea beaches',
      'Hammerhead rock formation',
      'Deep-sea fishing',
      'CPEC Port development',
      'Hingol National Park nearby',
      'Spectacular sunsets over sea'
    ]
  }
];

/* ---- Helper: get destination by id ---- */
function getDestinationById(id) {
  for (var i = 0; i < destinations.length; i++) {
    if (destinations[i].id === id) return destinations[i];
  }
  return null;
}

/* ---- Expose globals ---- */
window.showToast          = showToast;
window.openModal          = openModal;
window.closeModal         = closeModal;
window.scrollToTop        = scrollToTop;
window.destinations       = destinations;
window.getDestinationById = getDestinationById;
