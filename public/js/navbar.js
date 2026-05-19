// Hamburguesa mobile
(function () {
    const btn = document.getElementById('navbar-hamburger');
    const menu = document.getElementById('navbar-mobile');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        btn.classList.toggle('open');
        menu.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
            btn.classList.remove('open');
            menu.classList.remove('open');
        }
    });
})();
