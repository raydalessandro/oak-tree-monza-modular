/**
 * Google Analytics 4 Integration
 * Con gestione consenso cookie GDPR
 */

(function() {
    'use strict';

    // ⚠️ SOSTITUISCI CON IL TUO MEASUREMENT ID
    const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX';  // ← Inserisci qui il tuo ID

    // Configurazione Google Consent Mode v2
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    
    // Default: tutto denied (finché utente non accetta)
    gtag('consent', 'default', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied',
        'functionality_storage': 'granted',  // Cookie tecnici sempre ok
        'personalization_storage': 'denied',
        'security_storage': 'granted'  // Cookie di sicurezza sempre ok
    });

    // Carica Google Analytics 4
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    script.onload = function() {
        gtag('js', new Date());
        gtag('config', GA4_MEASUREMENT_ID, {
            'anonymize_ip': true,  // Anonimizza IP per GDPR
            'cookie_flags': 'SameSite=None;Secure'
        });
        
        console.log('✅ Google Analytics 4 caricato');
    };

    // Event tracking personalizzati
    window.trackEvent = function(eventName, eventParams = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventParams);
            console.log(`📊 Event tracked: ${eventName}`, eventParams);
        }
    };

    // Esempi di tracking automatici
    document.addEventListener('DOMContentLoaded', () => {
        
        // Track click su telefono
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', () => {
                trackEvent('phone_call', {
                    'phone_number': link.href.replace('tel:', '')
                });
            });
        });

        // Track click su email
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.addEventListener('click', () => {
                trackEvent('email_click', {
                    'email': link.href.replace('mailto:', '')
                });
            });
        });

        // Track scroll depth (50%, 75%, 100%)
        let scrollMarkers = { 50: false, 75: false, 100: false };
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollPercent >= 50 && !scrollMarkers[50]) {
                trackEvent('scroll_depth', { 'depth': '50%' });
                scrollMarkers[50] = true;
            }
            if (scrollPercent >= 75 && !scrollMarkers[75]) {
                trackEvent('scroll_depth', { 'depth': '75%' });
                scrollMarkers[75] = true;
            }
            if (scrollPercent >= 95 && !scrollMarkers[100]) {
                trackEvent('scroll_depth', { 'depth': '100%' });
                scrollMarkers[100] = true;
            }
        });

        // Track tempo sulla pagina (30s, 60s, 120s)
        const timeMarkers = [30000, 60000, 120000]; // millisecondi
        timeMarkers.forEach(time => {
            setTimeout(() => {
                trackEvent('time_on_page', { 'seconds': time / 1000 });
            }, time);
        });
    });

})();
