const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const menuOverlay = document.getElementById('menuOverlay');

function openMenu() {
    navLinks.classList.add('active');
    menuToggle.classList.add('active');
    menuOverlay.classList.add('open');

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            navLinks.classList.add('open');
        });
    });

    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Cerrar menú');
}

function closeMenu() {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('active');
    menuOverlay.classList.remove('open');

    navLinks.addEventListener('transitionend', function handler(e) {
        if (e.target === navLinks.querySelector('#botonDonarSobre')) {
            navLinks.classList.remove('active');
            navLinks.removeEventListener('transitionend', handler);
        }
    });

    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
}

menuToggle.addEventListener('click', () => {
    const isOpening = !navLinks.classList.contains('active');
    isOpening ? openMenu() : closeMenu();
});

menuOverlay.addEventListener('click', closeMenu);

const navLinkItems = navLinks.querySelectorAll('a');

navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
});