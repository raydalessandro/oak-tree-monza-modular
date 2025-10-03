# 🌳 Oak Tree Monza - Sito Modulare

Rivenditori autorizzati Vodafone a Monza e Paderno Dugnano.

## 🚀 Come funziona

Ogni pagina HTML include automaticamente **navbar** e **footer** tramite JavaScript:
```html
<div id="navbar-placeholder"></div>
<!-- Contenuto pagina -->
<div id="footer-placeholder"></div>

<script src="/js/loadComponents.js"></script>

oak-tree-monza-modular/
│
├── components/
│   ├── navbar.html          # ✅ Menu navigazione
│   └── footer.html          # ✅ Footer completo
│
├── css/
│   ├── base.css            # Variabili, reset, utility
│   ├── components.css      # Stili navbar, footer, card
│   └── pages.css           # Stili pagine specifiche
│
├── js/
│   ├── loadComponents.js   # Sistema include componenti
│   └── main.js             # Script comuni (menu, lazy-load)
│
├── assets/
│   ├── images/             # Logo, icone, foto
│   └── fonts/              # Font locali (se necessari)
│
├── pages/
│   ├── index.html          # ✅ Homepage con componenti
│   ├── privati.html
│   ├── business.html
│   └── ...
│
├── .gitignore
└── README.md
