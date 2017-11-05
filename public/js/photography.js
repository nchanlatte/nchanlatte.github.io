(function () {
  var LOADED_PREVIEW = 1;
  var LOADED_THUMB = 2;
  var LOADED_FULL = 3;

  var viewer = document.querySelector('.Gallery-viewer');
  var imgs = Array.prototype.slice.call(document.querySelectorAll('[data-preview]'));
  var resetViewer;
  
  imgs.forEach(function (img) {
    var urlPreview = img.getAttribute('data-preview');
  
    img.classList.add('Gallery-image--preview');
    preload(urlPreview, function () {
      if (img.getAttribute('data-loaded') < LOADED_PREVIEW) {
        img.style.backgroundImage = "url(" + urlPreview + ")";
        img.setAttribute('data-loaded', LOADED_PREVIEW);
      }
    });
  
    img.addEventListener('click', function (e) {
      openViewer(img);
      e.preventDefault();
    });
  });
  
  loadThumbnails();
  
  viewer.addEventListener('click', closeViewer);
  window.addEventListener('scroll', debounce(loadThumbnails, 50));

  document.addEventListener('keyup', function (e) {
    if (e.keyCode === 27 && viewer.classList.contains('Gallery-viewer--open')) {
      closeViewer();
      e.preventDefault();
    }
  });
  
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  
  function preload(url, cb) {
    var loader = new Image();
    loader.onload = cb;
    loader.src = url;
  }
  
  function loadThumbnails() {
    var imgs = Array.prototype.slice.call(document.querySelectorAll('.Gallery-image--preview'));
    imgs.forEach(function (img) {
      if (img.getBoundingClientRect().top < window.innerHeight + 500) {
        var urlThumb = img.getAttribute('data-thumb');
        preload(urlThumb, function () {
          img.style.backgroundImage = "url(" + urlThumb + ")";
          img.classList.remove('Gallery-image--preview');
        });
      }
    });
  }

  function openViewer(img) {
    clearTimeout(resetViewer);
    var urlThumb = img.getAttribute('data-thumb');
    var urlFull = img.getAttribute('data-full');

    if (img.getAttribute('data-loaded') < LOADED_FULL) {
      viewer.style.backgroundImage = "url(" + urlThumb + ")";

      preload(urlFull, function () {
        setTimeout(function () {
          viewer.style.backgroundImage = "url(" + urlFull + ")";
          img.setAttribute('data-loaded', LOADED_FULL);
        }, 500);
      });
    } else {
      viewer.style.backgroundImage = "url(" + urlFull + ")";
    }

    var pos = img.getBoundingClientRect();
    viewer.style.width = pos.width + 'px';
    viewer.style.height = pos.height + 'px';
    viewer.style.top = pos.top + 'px';
    viewer.style.left = pos.left + 'px';
    viewer.clientHeight;
    viewer.classList.add('Gallery-viewer--open');
  }

  function closeViewer() {
    viewer.classList.add('Gallery-viewer--closing');
    viewer.classList.remove('Gallery-viewer--open');
  
    resetViewer = setTimeout(function () {
      viewer.classList.remove('Gallery-viewer--closing');
      viewer.style.backgroundImage = '';
      viewer.style.width = '';
      viewer.style.height = '';
      viewer.style.top = '';
      viewer.style.left = '';
    }, 500);
  }
})();
