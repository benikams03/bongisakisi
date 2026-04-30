import { formatDateToFrench } from "../utils/date.js"
import { number } from "../utils/number.js"

export const pdf = (data, type, admin) => {
    return `
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Rapport de Vente - Pharmalix Premium</title>
            <style>

                :root {
                    --primary: #1a1a1a;
                    --secondary: #64748b;
                    --bg-light: #f8fafc;
                    --border: #e2e8f0;
                    --success: #10b981;
                }

                body {
                    font-family: 'Inter', sans-serif;
                    margin: 0;
                    padding: 40px 20px;
                    color: var(--primary);
                }

                .invoice-card {
                    padding: 10px;
                }

                /* --- LOGO & HEADER --- */
                .top-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 60px;
                }

                .logo-section {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                /* Logo Médical en CSS */
                .logo-icon {
                    width: 45px;
                    height: 45px;
                    background: var(--primary);
                    border-radius: 10px;
                    display: grid;
                    place-items: center;
                    position: relative;
                }

                .logo-icon::before, .logo-icon::after {
                    content: "";
                    position: absolute;
                    background: white;
                }
                .logo-icon::before { width: 4px; height: 20px; }
                .logo-icon::after { width: 20px; height: 4px; }

                .brand-name {
                    font-size: 24px;
                    font-weight: 700;
                    letter-spacing: -1px;
                    text-transform: uppercase;
                }

                .pharmacy-info {
                    text-align: right;
                    font-size: 13px;
                    color: var(--secondary);
                    line-height: 1.4;
                }

                .pharmacy-info h2 {
                    margin: 0 0 5px 0;
                    color: var(--primary);
                    font-size: 18px;
                    text-transform: uppercase;
                }

                /* --- INFO RAPPORT --- */
                .report-meta {
                    margin-bottom: 30px;
                    padding: 15px 0;
                    border-top: 1px solid var(--border);
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                }

                .report-title {
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: uppercase;
                    color: var(--secondary);
                }

                /* --- TABLEAU --- */
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }

                th {
                    text-align: left;
                    font-size: 12px;
                    text-transform: uppercase;
                    color: var(--secondary);
                    padding: 15px;
                    border-bottom: 2px solid var(--primary);
                }

                td {
                    padding: 15px;
                    font-size: 14px;
                    border-bottom: 1px solid var(--border);
                }

                .qty { font-weight: 600; color: var(--secondary); }
                .price { font-family: monospace; font-weight: 600; }

                /* --- KPI GRID --- */
                .kpi-container {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin-top: 40px;
                }

                .kpi-box {
                    padding: 20px;
                    border: 1px solid var(--border);
                    border-radius: 6px;
                }

                .kpi-box.dark {
                    background: var(--primary);
                    color: white;
                    grid-column: span 3;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .kpi-label {
                    display: block;
                    font-size: 11px;
                    text-transform: uppercase;
                    margin-bottom: 8px;
                    color: var(--secondary);
                }

                .dark .kpi-label { color: #9ca3af; }

                .kpi-value {
                    font-size: 20px;
                    font-weight: 700;
                }

                .benefit-value { color: var(--success); }

                /* --- FOOTER --- */
                .footer {
                    margin-top: 60px;
                    text-align: center;
                    font-size: 11px;
                    color: var(--secondary);
                    border-top: 1px solid var(--border);
                    padding-top: 20px;
                }

                @media print {
                    body { background: white; padding: 0; }
                    .invoice-card { box-shadow: none; border: none; }
                }
            </style>
        </head>
        <body>

            <div class="invoice-card">
                <div class="top-bar">
                    <div class="logo-section">
                        <div class="logo-icon"></div>
                        <div class="brand-name">BONGISA<span style="font-weight:300">KISI</span></div>
                    </div>
                    <div class="pharmacy-info">
                        <h2>${admin.name}</h2>
                        <p>${admin.address}</p>
                        <p>Email: ${admin.email}</p>
                        <p>Contact: ${admin.phone}</p>
                    </div>
                </div>

                <div class="report-meta">
                    <div>
                        <span class="report-title">Rapport de Vente ${type.charAt(0).toUpperCase() + type.slice(1)} </span>
                    </div>
                    <div style="text-align: right;">
                        <span class="report-title">Date d'Émission</span>
                        <p style="margin: 5px 0; font-weight: 700;">${formatDateToFrench(data?.head[0]?.periode)}</p>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Désignation Médicament</th>
                            <th>Catégorie</th>
                            <th style="text-align: center;">Qté</th>
                            <th style="text-align: right;">Prix Unitaire</th>
                            <th style="text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${
                          data?.body?.map((item, index) => (
                            `
                            <tr>
                                <td>${item.nom_produit}</td>
                                <td>${item.categorie}</td>
                                <td style="text-align: center;" class="qty">${item.quantite_totale}</td>
                                <td style="text-align: right;" class="price">${number.format(item.prix_unitaire)} Fc</td>
                                <td style="text-align: right;" class="price">${number.format(item.prix_total_vendu)} Fc</td>
                            </tr>
                            `
                          )).join('')
                        }
                    </tbody>
                </table>

                <div class="kpi-container">
                    <div class="kpi-box">
                        <span class="kpi-label">Commandes Totales</span>
                        <span class="kpi-value">${data.head[0].nombre_commandes}</span>
                    </div>
                    <div class="kpi-box">
                        <span class="kpi-label">Produits Sortis</span>
                        <span class="kpi-value">${data?.head[0]?.total_quantite}</span>
                    </div>
                    <div class="kpi-box">
                        <span class="kpi-label">Capital (Coût Achat)</span>
                        <span class="kpi-value">${number.format(data?.head[0]?.capital)} FC</span>
                    </div>
                    <div class="kpi-box">
                        <span class="kpi-label">Bénéfice Réalisé</span>
                        <span class="kpi-value benefit-value">+ ${number.format(data?.head[0]?.total_benefice)} FC</span>
                    </div>
                    
                    <div class="kpi-box dark">
                        <div>
                            <span class="kpi-label">Chiffre d'Affaire Total</span>
                            <div style="font-size: 28px; font-weight: 700;">${number.format(data?.head[0]?.total_ventes)} FC</div>
                        </div>
                        <div style="text-align: right; opacity: 0.7; font-size: 12px;">
                            Aucune taxe incluse<br>
                            Validé par le Responsable
                        </div>
                    </div>
                </div>
            </div>

        </body>
    </html>
    `
} 