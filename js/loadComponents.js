(function() {
    'use strict';

    async function loadComponent(elementId, componentPath) {
        const placeholder = document.getElementById(elementId);
        if (!placeholder) return;

        try {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            placeholder.innerHTML = html;

            if (elementId === 'navbar-placeholder') {
                initMobileMenu();
                highlightActivePage();
            }
        } catch (error) {
            console.error(`Errore caricamento ${componentPath}:`, error);
        }
    }

    function initMobileMenu() {
        const menuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (!menuBtn || !mobileMenu) return;

        menuBtn.addEventListener('click', () => {
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.setAttribute('aria-expanded', 'false');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    function highlightActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(currentPage)) {
                link.classList.add('active');
            }
        });
    }

    // ⚠️ PATH RELATIVI per GitHub Pages
    document.addEventListener('DOMContentLoaded', () => {
        loadComponent('navbar-placeholder', './components/navbar.html');
        loadComponent('footer-placeholder', './components/footer.html');
    });
})();
