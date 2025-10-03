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

            // Inizializza funzioni specifiche per componente DOPO il caricamento
            if (elementId === 'navbar-placeholder') {
                // Aspetta che il DOM sia aggiornato
                setTimeout(() => {
                    initMobileMenu();
                    highlightActivePage();
                    initScrollEffect();
                }, 100);
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

    // Inizializza menu mobile - FIX SEMPLIFICATO
    function initMobileMenu() {
        const menuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (!menuBtn || !mobileMenu) {
            console.error('❌ Menu mobile non trovato! Controlla che navbar.html sia caricata correttamente.');
            console.log('menuBtn:', menuBtn);
            console.log('mobileMenu:', mobileMenu);
            return;
        }

        console.log('🔧 Inizializzazione menu mobile...');

        // Gestisci click sul bottone hamburger
        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            
            console.log('🍔 Click hamburger! Stato attuale:', isExpanded ? 'aperto' : 'chiuso');
            
            // Toggle stato
            menuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('active');
            
            // FIX SEMPLIFICATO per body overflow
            if (!isExpanded) {
                // Apertura menu - blocca scroll
                document.body.style.overflow = 'hidden';
            } else {
                // Chiusura menu - ripristina scroll
                document.body.style.overflow = '';
            }
            
            console.log('✅ Menu mobile:', isExpanded ? 'chiuso' : 'aperto');
        });

        // Chiudi menu al click su link
        const menuLinks = mobileMenu.querySelectorAll('a');
        console.log(`📱 Trovati ${menuLinks.length} link nel menu mobile`);
        
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                console.log('🔗 Click su link mobile menu');
                closeMenu();
            });
        });

        // Funzione helper per chiudere il menu
        function closeMenu() {
            menuBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('active');
            // FIX SEMPLIFICATO
            document.body.style.overflow = '';
        }

        // Chiudi menu premendo ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
                console.log('⌨️ ESC premuto - chiudo menu');
                closeMenu();
            }
        });

        // Chiudi menu cliccando fuori
        document.addEventListener('click', (e) => {
            const isClickInsideMenu = mobileMenu.contains(e.target);
            const isClickOnButton = menuBtn.contains(e.target);
            const isMenuOpen = menuBtn.getAttribute('aria-expanded') === 'true';
            
            if (isMenuOpen && !isClickInsideMenu && !isClickOnButton) {
                console.log('👆 Click fuori dal menu - chiudo');
                closeMenu();
            }
        });

        // Previeni scroll del body quando menu è aperto (su touch devices)
        mobileMenu.addEventListener('touchmove', (e) => {
            const isScrollable = mobileMenu.scrollHeight > mobileMenu.clientHeight;
            if (!isScrollable) {
                e.preventDefault();
            }
        });

        console.log('✅ Menu mobile inizializzato con successo');
    }

    // Evidenzia pagina attiva nel menu
    function highlightActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const allLinks = document.querySelectorAll('.nav-link');
        
        console.log(`🎯 Evidenzio pagina attiva: ${currentPage}`);
        console.log(`📋 Trovati ${allLinks.length} link totali`);
        
        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href.includes(currentPage) || (currentPage === 'index.html' && href === './'))) {
                link.classList.add('active');
                console.log(`✅ Link attivo: ${href}`);
            }
        });
    }

    // Effetto scroll navbar (aggiunge classe 'scrolled')
    function initScrollEffect() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) {
            console.warn('⚠️ Navbar non trovata per scroll effect');
            return;
        }

        let lastScroll = 0;
        let ticking = false;

        window.addEventListener('scroll', () => {
            // Non processare scroll se menu è aperto
            if (document.body.style.overflow === 'hidden') {
                return;
            }
            
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
        console.log('🚀 Inizio caricamento componenti Oak Tree...');
        console.log('📱 Larghezza viewport:', window.innerWidth + 'px');
        console.log('💻 Mobile breakpoint: < 1024px');
        
        // Carica componenti in ordine sequenziale
        Promise.all([
            loadComponent('brand-ribbon-placeholder', './components/brand-ribbon.html'),
            loadComponent('navbar-placeholder', './components/navbar.html'),
            loadComponent('footer-placeholder', './components/footer.html'),
            loadComponent('cookie-banner-placeholder', './components/cookie-banner.html')
        ]).then(() => {
            console.log('✅ Tutti i componenti caricati!');
        }).catch(error => {
            console.error('❌ Errore durante il caricamento:', error);
        });
    });
})();
