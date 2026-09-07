document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  var navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));

  // 1. Fixed header shadow on scroll
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // 2. Mobile navigation toggle and icon swap
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.innerHTML = isOpen ? '&#10005;' : '&#9776;';
    });

    // Automatically close mobile nav when any link is clicked
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '&#9776;';
      });
    });
  }

  // 3. Scroll-spy: highlight active section in navbar
  if (navLinks.length && sections.length && 'IntersectionObserver' in window) {
    var linkFor = {};
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        linkFor[href.slice(1)] = link;
      }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkFor[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  // 4. Class filter chips
  var chips = document.querySelectorAll('.filter-chip');
  var cards = document.querySelectorAll('.class-card');
  if (chips.length && cards.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        var filter = chip.getAttribute('data-filter');
        cards.forEach(function (card) {
          var show = filter === 'all' || card.getAttribute('data-subject') === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // Remember to replace this with your NEW Apps Script deployment URL
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwsdjzOVCu6s8z8ZMFk8f7mr1gGBwvauztEZKuCIBJ7MDSI_QiI-bkXW-XoihRCkVpj/exec';
  const form = document.forms['submit-to-google-sheet'];
  const msg = document.getElementById('msg');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot check
      const hp = form.querySelector('input[name="website"]');
      if (hp && hp.value) return;

      msg.textContent = 'Sending inquiry...';
      msg.style.color = '#333';

      try {
      // The 'no-cors' mode tells the browser to just send the data and not worry about reading Google's redirect response
      fetch(scriptURL, { 
        method: 'POST', 
        body: new FormData(form),
        mode: 'no-cors'
      });

      // Since we aren't waiting for the JSON, we immediately show success
      msg.textContent = 'Inquiry sent successfully! We will be in touch soon.';
      msg.style.color = 'green';
      form.reset();

    } catch (error) {
      msg.textContent = 'Network error. Please try again.';
      msg.style.color = 'red';
      console.error(error);
    }

      // Clear the message after 5 seconds
      setTimeout(() => { msg.textContent = ''; }, 5000);
    });
  }
});