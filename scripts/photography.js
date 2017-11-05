(() => {
  const LOADED_PREVIEW = 1;
  const LOADED_THUMB = 2;
  const LOADED_FULL = 3;

  const viewer = document.querySelector('.Gallery-viewer');
  const imgs = Array.prototype.slice.call(document.querySelectorAll('[data-preview]'));
  let resetViewer;
  
  imgs.forEach((img) => {
    const urlPreview = img.getAttribute('data-preview');
  
    img.classList.add('Gallery-image--preview');
    preload(urlPreview, () => {
      if (img.getAttribute('data-loaded') < LOADED_PREVIEW) {
        img.style.backgroundImage = `url(${urlPreview})`;
        img.setAttribute('data-loaded', LOADED_PREVIEW);
      }
    });
  
    img.addEventListener('click', (e) => {
      openViewer(img);
      e.preventDefault();
    });
  });
  
  loadThumbnails();
  
  viewer.addEventListener('click', closeViewer);
  window.addEventListener('scroll', debounce(loadThumbnails, 50));

  document.addEventListener('keyup', (e) => {
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
    const loader = new Image();
    loader.onload = cb;
    loader.src = url;
  }
  
  function loadThumbnails() {
    const imgs = Array.prototype.slice.call(document.querySelectorAll('.Gallery-image--preview'));
    imgs.forEach((img) => {
      if (img.getBoundingClientRect().top < window.innerHeight + 500) {
        const urlThumb = img.getAttribute('data-thumb');
        preload(urlThumb, () => {
          img.style.backgroundImage = `url(${urlThumb})`;
          img.classList.remove('Gallery-image--preview');
        });
      }
    });
  }

  function openViewer(img) {
    clearTimeout(resetViewer);
    const urlThumb = img.getAttribute('data-thumb');
    const urlFull = img.getAttribute('data-full');

    if (img.getAttribute('data-loaded') < LOADED_FULL) {
      viewer.style.backgroundImage = `url(${urlThumb})`;

      preload(urlFull, () => {
        setTimeout(() => {
          viewer.style.backgroundImage = `url(${urlFull})`;
          img.setAttribute('data-loaded', LOADED_FULL);
        }, 500);
      });
    } else {
      viewer.style.backgroundImage = `url(${urlFull})`;
    }

    const pos = img.getBoundingClientRect();
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
  
    resetViewer = setTimeout(() => {
      viewer.classList.remove('Gallery-viewer--closing');
      viewer.style.backgroundImage = '';
      viewer.style.width = '';
      viewer.style.height = '';
      viewer.style.top = '';
      viewer.style.left = '';
    }, 500);
  }
})();
