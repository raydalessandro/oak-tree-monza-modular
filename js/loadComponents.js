// Sistema di caricamento componenti HTML - Oak Tree Monza
(function() {
    'use strict';

    // Funzione per caricare un componente
    async function loadComponent(elementId, componentPath) {
        const placeholder = document.getElementById(elementId);
        if (!placeholder) {
            console.warn(`Placeholder #${elementId} non trovato`);
            return;
        }

        try {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            placeholder.innerHTML = html;

            // Inizializza funzioni specifiche per componente
            if (elementId === 'navbar-placeholder') {
                initMobileMenu();
                highlightActivePage();
                initScrollEffect(); // ← NUOVO: Effetto scroll navbar
            }
            
            console.log(`✅ Componente caricato: ${componentPath}`);
        } catch (error) {
            console.error(`❌ Errore caricamento ${componentPath}:`, error);
            placeholder.innerHTML = `
                <div style="padding: 1rem; background: #fee; border: 1px solid #fcc; border-radius: 8px; color: #c00;">
                    <strong>⚠️ Errore caricamento componente</strong>
                    <p style="font-size: 0.9rem; margin: 0.5rem 0 0 0;">
                        Non è stato possibile caricare ${componentPath}. 
                        Controlla la console per dettagli.
                    </p>
                </div>
            `;
        }
    }

    // Inizializza menu mobile
    function initMobileMenu() {
        const menuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (!menuBtn || !mobileMenu) {
            console.warn('Menu mobile non trovato');
            return;
        }

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

        // Chiudi menu premendo ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
                menuBtn.setAttribute('aria-expanded', 'false');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        console.log('✅ Menu mobile inizializzato');
    }

    // Evidenzia pagina attiva nel menu
    function highlightActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(currentPage)) {
                link.classList.add('active');
            }
        });
        console.log(`✅ Pagina attiva: ${currentPage}`);
    }

    // Effetto scroll navbar (aggiunge classe 'scrolled')
    function initScrollEffect() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let lastScroll = 0;
        let ticking = false;

        window.addEventListener('scroll', () => {
            lastScroll = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (lastScroll > 50) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });

        console.log('✅ Scroll effect navbar inizializzato');
    }

    // Carica tutti i componenti al DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 Caricamento componenti...');
        
        // Carica componenti in ordine
        loadComponent('brand-ribbon-placeholder', './components/brand-ribbon.html');
        loadComponent('navbar-placeholder', './components/navbar.html');
        loadComponent('footer-placeholder', './components/footer.html');
        loadComponent('cookie-banner-placeholder', './components/cookie-banner.html');
    });
})();
