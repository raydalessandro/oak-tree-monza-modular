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
            timestamp: null
        };
    }

    // Inizializza il sistema cookie
    init() {
        const consent = this.getConsent();
        
        if (!consent) {
            // Prima visita: mostra banner
            this.showBanner();
        } else {
            // Già dato il consenso: applica preferenze
            this.applyConsent(consent);
        }

        this.attachEventListeners();
    }

    // Mostra banner cookie
    showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'block';
            // Accessibility: focus sul banner
            banner.setAttribute('tabindex', '-1');
            banner.focus();
        }
    }

    // Nascondi banner
    hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    // Mostra modal impostazioni
    showModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Carica preferenze salvate
            const consent = this.getConsent();
            if (consent) {
                document.getElementById('cookie-analytics').checked = consent.analytics;
                document.getElementById('cookie-marketing').checked = consent.marketing;
            }
        }
    }

    // Nascondi modal
    hideModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // Salva consenso
    saveConsent(preferences) {
        const consent = {
            ...preferences,
            timestamp: new Date().toISOString()
        };
        
        const cookieValue = JSON.stringify(consent);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + this.COOKIE_EXPIRY);
        
        document.cookie = `${this.COOKIE_NAME}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
        
        return consent;
    }

    // Leggi consenso salvato
    getConsent() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === this.COOKIE_NAME) {
                try {
                    return JSON.parse(decodeURIComponent(value));
                } catch (e) {
                    console.error('Errore parsing cookie consent:', e);
                    return null;
                }
            }
        }
        return null;
    }

    // Applica consenso (attiva analytics, marketing, etc.)
    applyConsent(consent) {
        console.log('Applicando consenso:', consent);

        // Analytics (Google Analytics 4)
        if (consent.analytics && window.gtag) {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
            console.log('✅ Analytics abilitati');
        } else if (window.gtag) {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
            console.log('❌ Analytics disabilitati');
        }

        // Marketing (Google Ads, Facebook Pixel)
        if (consent.marketing && window.gtag) {
            gtag('consent', 'update', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted'
            });
            console.log('✅ Marketing abilitato');
        } else if (window.gtag) {
            gtag('consent', 'update', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied'
            });
            console.log('❌ Marketing disabilitato');
        }
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
        
        // Ricarica per applicare gli script
        window.location.reload();
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
        
        // Ricarica per applicare gli script
        window.location.reload();
    }

    // Event listeners
    attachEventListeners() {
        // Banner: Accetta tutti
        document.getElementById('cookie-accept-all')?.addEventListener('click', () => {
            this.acceptAll();
        });

        // Banner: Rifiuta
        document.getElementById('cookie-reject-all')?.addEventListener('click', () => {
            this.rejectAll();
        });

        // Banner: Personalizza
        document.getElementById('cookie-settings')?.addEventListener('click', () => {
            this.hideBanner();
            this.showModal();
        });

        // Modal: Chiudi
        document.getElementById('cookie-modal-close')?.addEventListener('click', () => {
            this.hideModal();
            this.showBanner();
        });

        // Modal: Salva preferenze
        document.getElementById('cookie-save-preferences')?.addEventListener('click', () => {
            this.saveCustomPreferences();
        });

        // Modal: Accetta tutti
        document.getElementById('cookie-accept-all-modal')?.addEventListener('click', () => {
            this.acceptAll();
        });

        // Chiudi modal cliccando fuori
        document.getElementById('cookie-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'cookie-modal') {
                this.hideModal();
                this.showBanner();
            }
        });
    }

    // Revoca consenso (per testing o link "Gestisci cookie")
    revokeConsent() {
        document.cookie = `${this.COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        window.location.reload();
    }
}

// Inizializza al caricamento pagina
document.addEventListener('DOMContentLoaded', () => {
    const cookieManager = new CookieManager();
    cookieManager.init();
    
    // Esponi globalmente per debug/link "Gestisci cookie"
    window.cookieManager = cookieManager;
});
