/* Tarjetas de Nuestros Programas -> ventana emergente con la misma
   informacion e imagenes de la pagina de detalle (sin navegar). */
(function () {
  var overlay = null;

  function buildModal() {
    overlay = document.createElement('div');
    overlay.className = 'prog-modal-overlay';
    overlay.innerHTML =
      '<div class="prog-modal" role="dialog" aria-modal="true" aria-label="Detalle del programa">' +
      '<button class="prog-modal-close" aria-label="Cerrar">×</button>' +
      '<div class="prog-modal-content"></div>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay
      .querySelector('.prog-modal-close')
      .addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open'))
        closeModal();
    });
  }

  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showStatus(html) {
    overlay.querySelector('.prog-modal-content').innerHTML =
      '<div class="prog-modal-status">' + html + '</div>';
  }

  function fixPaths(html) {
    // Las paginas de detalle viven en actividades/, sus rutas "../x"
    // equivalen a "actividades/../x" vistas desde el index.
    return html.split('src="../').join('src="actividades/../')
      .split('href="../').join('href="actividades/../');
  }

  function renderDetail(infoHtml, images) {
    var content = overlay.querySelector('.prog-modal-content');
    var thumbs = images
      .map(function (src, i) {
        return (
          '<img src="' +
          src +
          '" alt="Foto ' +
          (i + 1) +
          '" data-idx="' +
          i +
          '" class="' +
          (i === 0 ? 'active' : '') +
          '">'
        );
      })
      .join('');

    content.innerHTML =
      '<div class="prog-modal-body">' +
      '<div class="prog-modal-gallery">' +
      '<img class="prog-main" src="' +
      (images[0] || '') +
      '" alt="Foto del programa">' +
      '<div class="prog-thumbs">' +
      thumbs +
      '</div>' +
      '</div>' +
      '<div class="prog-modal-info">' +
      infoHtml +
      '</div>' +
      '</div>';

    var main = content.querySelector('.prog-main');
    content.querySelectorAll('.prog-thumbs img').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        content
          .querySelectorAll('.prog-thumbs img')
          .forEach(function (t) { t.classList.remove('active'); });
        thumb.classList.add('active');
        main.src = thumb.src;
        main.classList.remove('swap');
        void main.offsetWidth;
        main.classList.add('swap');
      });
    });
  }

  function openProgram(url, fallbackTitle) {
    if (!overlay) buildModal();
    openModal();
    showStatus('Cargando información del programa…');

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var info = doc.querySelector('.info-column');
        var imgs = Array.prototype.map.call(
          doc.querySelectorAll('#sliderTrack img'),
          function (img) { return img.getAttribute('src'); }
        ).filter(Boolean);

        if (!info && imgs.length === 0) throw new Error('empty');

        var infoHtml = info
          ? fixPaths(info.innerHTML)
          : '<h1>' + fallbackTitle + '</h1>';
        var fixedImgs = imgs.map(function (s) {
          return s.indexOf('../') === 0 ? 'actividades/../' + s.slice(3) : s;
        });
        renderDetail(infoHtml, fixedImgs);
      })
      .catch(function () {
        showStatus(
          'No se pudo cargar la vista previa. ' +
          '<a href="' + url + '">Abrir la página del programa ↗</a>'
        );
      });
  }

  document.querySelectorAll('#actividades .actividad a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || /^https?:/i.test(href)) return;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var title =
        (a.querySelector('h3') && a.querySelector('h3').textContent.trim()) ||
        'Programa';
      openProgram(href, title);
    });
  });
})();
