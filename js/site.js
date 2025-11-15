// Shared site JS: mobile nav toggle and year injection
(function(){
  function initNavToggle(){
    var btns = document.querySelectorAll('.nav-toggle');
    btns.forEach(function(btn){
      var links = btn.parentElement.querySelector('.nav-links');
      if(!links) return;
      btn.addEventListener('click', function(){
        var expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        links.classList.toggle('open');
      });
    });
  }

  function injectYear(){
    var els = document.querySelectorAll('#year');
    els.forEach(function(el){ el.textContent = new Date().getFullYear(); });
  }

  // Close mobile nav when a nav link is clicked (for in-page anchors)
  function closeNavOnAnchorClick(){
    var nav = document.querySelector('.nav');
    if(!nav) return;
    var links = nav.querySelectorAll('.nav-links a[href^="#"]');
    links.forEach(function(a){
      a.addEventListener('click', function(e){
        // Let the browser handle the anchor navigation, but close the mobile menu
        var toggle = nav.querySelector('.nav-toggle');
        var menu = nav.querySelector('.nav-links');
        if(menu && menu.classList.contains('open')){
          menu.classList.remove('open');
          if(toggle){ toggle.setAttribute('aria-expanded', 'false'); }
        }

        // Accessible focus handling: move focus to the target section after scroll
        var targetId = this.getAttribute('href').slice(1);
        if(targetId){
          var target = document.getElementById(targetId);
          if(target){
            // If browser supports scroll behavior via CSS that's enough; otherwise smooth-scroll here
            if(!('scrollBehavior' in document.documentElement.style)){
              target.scrollIntoView({ behavior: 'smooth' });
            }
            // after a short delay (allow scroll) set focus for screen readers
            setTimeout(function(){
              target.setAttribute('tabindex', '-1');
              target.focus({ preventScroll: true });
            }, 300);
          }
        }
      });
    });
  }

  // (brand scroll JS removed per request)


  // Close mobile nav when clicking/touching outside of it or pressing Escape
  function closeNavOnOutsideInteraction(){
    var nav = document.querySelector('.nav');
    if(!nav) return;
    var toggle = nav.querySelector('.nav-toggle');
    var menu = nav.querySelector('.nav-links');
    if(!toggle || !menu) return;

    function isOpen(){ return menu.classList.contains('open'); }
    function close(){
      if(!isOpen()) return;
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    // Use click for broad compatibility; capture outside of nav-links and toggle
    document.addEventListener('click', function(e){
      if(!isOpen()) return;
      var t = e.target;
      // If click is on toggle or inside the menu, do nothing
      if(toggle.contains(t) || menu.contains(t)) return;
      // Otherwise, close the menu
      close();
    }, true);

    // Also support Escape key to close
    document.addEventListener('keydown', function(e){
      if((e.key === 'Escape' || e.key === 'Esc') && isOpen()){
        e.preventDefault();
        close();
        // Return focus to the toggle for accessibility
        try { toggle.focus(); } catch(_) {}
      }
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ initNavToggle(); injectYear(); });
  } else {
    initNavToggle(); injectYear();
  }
  // run close-on-click and accessible anchor handling after DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ closeNavOnAnchorClick(); closeNavOnOutsideInteraction(); });
  } else {
    closeNavOnAnchorClick();
    closeNavOnOutsideInteraction();
  }

  // no dynamic title sizing; letting CSS handle wrapping and layout
})();
