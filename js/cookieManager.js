/**
 * Cookie Manager - GDPR Compliant
 * Gestisce consensi cookie e integrazione analytics
 */

class CookieManager {
    constructor() {
        this.COOKIE_NAME = 'oak_cookie_consent';
        this.COOKIE_EXPIRY = 365; // giorni
        this.defaultPreferences = {
            necessary: true,  // Sempre true
            analytics: false,
            marketing: false,
            timestamp: null,
            version: '1.0' // Versione policy
        };
        console.log('🍪 CookieManager inizializzato');
    }

    // Inizializza il sistema cookie
    init() {
        console.log('🍪 Controllo consenso cookie...');
        const consent = this.getConsent();
        
        if (!consent) {
            // Prima visita: mostra banner dopo breve delay
            console.log('🍪 Prima visita - mostro banner');
            setTimeout(() => {
                this.showBanner();
            }, 1000); // Delay di 1 secondo per UX migliore
        } else {
            // Già dato il consenso: applica preferenze
            console.log('🍪 Consenso già presente:', consent);
            this.applyConsent(consent);
        }

        this.attachEventListeners();
    }

    // Mostra banner cookie
    showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'block';
            banner.classList.add('show');
            // Accessibility: focus sul banner
            banner.setAttribute('tabindex', '-1');
            banner.focus();
            console.log('✅ Cookie banner mostrato');
        } else {
            console.error('❌ Banner cookie non trovato nel DOM');
        }
    }

    // Nascondi banner
    hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300); // Aspetta animazione
            console.log('✅ Cookie banner nascosto');
        }
    }

    // Mostra modal impostazioni
    showModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Carica preferenze salvate
            const consent = this.getConsent();
            if (consent) {
                document.getElementById('cookie-analytics').checked = consent.analytics;
                document.getElementById('cookie-marketing').checked = consent.marketing;
            }
            console.log('✅ Modal cookie aperto');
        } else {
            console.error('❌ Modal cookie non trovato nel DOM');
        }
    }

    // Nascondi modal
    hideModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300); // Aspetta animazione
            document.body.style.overflow = '';
            console.log('✅ Modal cookie chiuso');
        }
    }

    // Salva consenso
    saveConsent(preferences) {
        const consent = {
            ...preferences,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        const cookieValue = JSON.stringify(consent);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + this.COOKIE_EXPIRY);
        
        document.cookie = `${this.COOKIE_NAME}=${encodeURIComponent(cookieValue)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax; Secure`;
        
        console.log('✅ Consenso salvato:', consent);
        return consent;
    }

    // Leggi consenso salvato
    getConsent() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === this.COOKIE_NAME) {
                try {
                    const consent = JSON.parse(decodeURIComponent(value));
                    console.log('🍪 Consenso trovato:', consent);
                    return consent;
                } catch (e) {
                    console.error('❌ Errore parsing cookie consent:', e);
                    return null;
                }
            }
        }
        return null;
    }

    // Applica consenso (attiva analytics, marketing, etc.)
    applyConsent(consent) {
        console.log('🔧 Applicando consenso:', consent);

        // Analytics (Google Analytics 4)
        if (consent.analytics) {
            if (window.gtag) {
                gtag('consent', 'update', {
                    'analytics_storage': 'granted'
                });
                console.log('✅ Analytics abilitati');
            }
            // Puoi anche caricare dinamicamente GA4 qui se non è già caricato
            this.loadGoogleAnalytics();
        } else {
            if (window.gtag) {
                gtag('consent', 'update', {
                    'analytics_storage': 'denied'
                });
                console.log('❌ Analytics disabilitati');
            }
        }

        // Marketing (Google Ads, Facebook Pixel)
        if (consent.marketing) {
            if (window.gtag) {
                gtag('consent', 'update', {
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted'
                });
                console.log('✅ Marketing abilitato');
            }
            // Carica eventuali pixel marketing
            this.loadMarketingPixels();
        } else {
            if (window.gtag) {
                gtag('consent', 'update', {
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied'
                });
                console.log('❌ Marketing disabilitato');
            }
        }
    }

    // Carica Google Analytics dinamicamente
    loadGoogleAnalytics() {
        // Solo se non già caricato
        if (!window.GA_INITIALIZED) {
            console.log('📊 Caricamento Google Analytics...');
            // Il tuo codice GA è già in analytics.js
            window.GA_INITIALIZED = true;
        }
    }

    // Carica pixel marketing
    loadMarketingPixels() {
        // Esempio Facebook Pixel (se necessario)
        // if (!window.FB_INITIALIZED) {
        //     // Carica Facebook Pixel
        //     window.FB_INITIALIZED = true;
        // }
    }

    // Accetta tutti i cookie
    acceptAll() {
        const consent = this.saveConsent({
            necessary: true,
            analytics: true,
            marketing: true
        });
        
        this.applyConsent(consent);
        this.hideBanner();
        this.hideModal();
        
        // Track evento
        if (window.trackEvent) {
            window.trackEvent('cookie_consent', { action: 'accept_all' });
        }
        
        console.log('✅ Tutti i cookie accettati');
    }

    // Rifiuta tutti (solo necessari)
    rejectAll() {
        const consent = this.saveConsent({
            necessary: true,
            analytics: false,
            marketing: false
        });
        
        this.applyConsent(consent);
        this.hideBanner();
        this.hideModal();
        
        // Track evento (se analytics era già attivo)
        if (window.trackEvent) {
            window.trackEvent('cookie_consent', { action: 'reject_all' });
        }
        
        console.log('✅ Cookie non necessari rifiutati');
    }

    // Salva preferenze personalizzate
    saveCustomPreferences() {
        const analytics = document.getElementById('cookie-analytics')?.checked || false;
        const marketing = document.getElementById('cookie-marketing')?.checked || false;
        
        const consent = this.saveConsent({
            necessary: true,
            analytics: analytics,
            marketing: marketing
        });
        
        this.applyConsent(consent);
        this.hideModal();
        this.hideBanner();
        
        // Track evento
        if (window.trackEvent) {
            window.trackEvent('cookie_consent', { 
                action: 'custom',
                analytics: analytics,
                marketing: marketing
            });
        }
        
        console.log('✅ Preferenze personalizzate salvate');
    }

    // Event listeners
    attachEventListeners() {
        // Banner: Accetta tutti
        const acceptBtn = document.getElementById('cookie-accept-all');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                this.acceptAll();
            });
        }

        // Banner: Rifiuta
        const rejectBtn = document.getElementById('cookie-reject-all');
        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => {
                this.rejectAll();
            });
        }

        // Banner: Personalizza
        const settingsBtn = document.getElementById('cookie-settings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.hideBanner();
                this.showModal();
            });
        }

        // Modal: Chiudi
        const modalClose = document.getElementById('cookie-modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.hideModal();
                this.showBanner();
            });
        }

        // Modal: Salva preferenze
        const saveBtn = document.getElementById('cookie-save-preferences');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveCustomPreferences();
            });
        }

        // Modal: Accetta tutti
        const acceptModalBtn = document.getElementById('cookie-accept-all-modal');
        if (acceptModalBtn) {
            acceptModalBtn.addEventListener('click', () => {
                this.acceptAll();
            });
        }

        // Chiudi modal cliccando fuori
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal();
                    this.showBanner();
                }
            });
        }

        // ESC per chiudere modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
                this.hideModal();
                this.showBanner();
            }
        });

        console.log('✅ Event listeners cookie configurati');
    }

    // Revoca consenso (per testing o link "Gestisci cookie")
    revokeConsent() {
        document.cookie = `${this.COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        console.log('🗑️ Consenso revocato - ricarico pagina');
        window.location.reload();
    }

    // Apri modal gestione (chiamabile da link footer)
    openSettings() {
        this.showModal();
    }
}

// Inizializza al caricamento pagina
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inizializzazione Cookie Manager...');
    const cookieManager = new CookieManager();
    
    // Aspetta che tutti i componenti siano caricati
    setTimeout(() => {
        cookieManager.init();
    }, 500);
    
    // Esponi globalmente per debug/link "Gestisci cookie"
    window.cookieManager = cookieManager;
});
