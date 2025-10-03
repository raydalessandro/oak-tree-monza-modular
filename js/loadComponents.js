// Sistema di caricamento componenti HTML
(function() {
    'use strict';

    // Funzione per caricare un componente
    async function loadComponent(elementId, componentPath) {
        const placeholder = document.getElementById(elementId);
        if (!placeholder) return;

        try {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            placeholder.innerHTML = html;

            // Se è la navbar, inizializza il menu mobile
            if (elementId === 'navbar-placeholder') {
                initMobileMenu();
                highlightActivePage();
            }
        } catch (error) {
            console.error(`Errore caricamento ${componentPath}:`, error);
            placeholder.innerHTML = `<p style="color:red;">Errore caricamento componente</p>`;
        }
    }

    // Inizializza menu mobile
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

        // Chiudi menu al click su link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.setAttribute('aria-expanded', 'false');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Evidenzia pagina attiva nel menu
    function highlightActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href').includes(currentPage)) {
                link.classList.add('active');
            }
        });
    }

    // Carica componenti al DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        loadComponent('navbar-placeholder', '/components/navbar.html');
        loadComponent('footer-placeholder', '/components/footer.html');
    });
})();
