import { queries } from '../models/index.js'
import log from 'electron-log';
import { dialog, BrowserWindow } from 'electron';
import Store from 'electron-store';
import * as PDFModule from '../views/PDF.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { Text } from '../utils/text.js';

class ExportController {

    constructor() {
        this.queries = queries;
        this.mainWindow = null;
        this.store = new Store();
        this.pdf = PDFModule.pdf;
        this.fs = fs;
        this.path = path;
        this.os = os;
        this.browserWindow = null;
    }

    setMainWindow(window) {
        this.mainWindow = window;
    }

    get(type, date) {
        try {
            let query = '';
            let groupBy = '';
            let whereClause = '';
            
            // Déterminer le GROUP BY et le WHERE selon le type
            switch(type) {
                case 'journalier':
                    groupBy = "strftime('%Y-%m-%d', datecreate)";
                    whereClause = `strftime('%Y-%m', datecreate) LIKE '${date}%'`;
                    break;
                case 'mensuel':
                    groupBy = "strftime('%Y-%m', datecreate)";
                    whereClause = `strftime('%Y', datecreate) LIKE '${date}%'`;
                    break;
                case 'annuel':
                    groupBy = "strftime('%Y', datecreate)";
                    whereClause = '1=1'; // Pas de filtre WHERE
                    break;
                default:
                    throw new Error('Type invalide. Utilisez: jour, mois, ou annee');
            }
            
            // Requête SQL pour obtenir les statistiques
            query = `
                SELECT 
                    ${groupBy} as periode,
                    SUM(price_total) as total_ventes,
                    SUM(price_benefit) as total_benefice,
                    (SUM(price_total) - SUM(price_benefit)) as capital,
                    SUM(quantity) as total_quantite,
                    COUNT(DISTINCT panier) as nombre_commandes
                FROM orders 
                WHERE ${whereClause}
                AND status = 'confirmed'
                GROUP BY ${groupBy}
                ORDER BY periode DESC
            `;
            
            // Exécuter la requête
            const result = this.queries.raw(query);
            
            return {
                success: true,
                data: result
            }
            
        } catch (error) {
            log.error('Erreur dans ExportController.get():', error);
            // En cas d'erreur, retourner des données fictives pour tester
            return {
                success: false,
                error: error.message
            }
        }
    }

    getBy(type, date) {
        try {
            let query = '';
            let groupBy = '';
            let whereClause = '';
            
            // Déterminer le GROUP BY et le WHERE selon le type
            switch(type) {
                case 'journalier':
                    groupBy = "strftime('%Y-%m-%d', datecreate)";
                    whereClause = `strftime('%Y-%m-%d', datecreate) = '${date}'`;
                    break;
                case 'mensuel':
                    groupBy = "strftime('%Y-%m', datecreate)";
                    whereClause = `strftime('%Y-%m', datecreate) = '${date}'`;
                    break;
                case 'annuel':
                    groupBy = "strftime('%Y', datecreate)";
                    whereClause = `strftime('%Y', datecreate) = '${date}'`;
                    break;
                default:
                    throw new Error('Type invalide. Utilisez: jour, mois, ou annee');
            }
            
            // Requête SQL pour obtenir les statistiques
            query = `
                SELECT 
                    ${groupBy} as periode,
                    SUM(price_total) as total_ventes,
                    SUM(price_benefit) as total_benefice,
                    (SUM(price_total) - SUM(price_benefit)) as capital,
                    SUM(quantity) as total_quantite,
                    COUNT(DISTINCT panier) as nombre_commandes
                FROM orders 
                WHERE ${whereClause}
                AND status = 'confirmed'
                GROUP BY ${groupBy}
                ORDER BY periode DESC
            `;
            
            // Exécuter la requête
            const result = this.queries.raw(query);

            // ================================================================================
            
            // Requête pour récupérer les détails des produits vendus selon la période
            let detailQuery = '';
            let detailWhereClause = '';
            
            // Déterminer le filtre selon le type pour les détails
            switch(type) {
                case 'journalier':
                    detailWhereClause = `strftime('%Y-%m-%d', o.datecreate) = '${date}'`;
                    break;
                case 'mensuel':
                    detailWhereClause = `strftime('%Y-%m', o.datecreate) = '${date}'`;
                    break;
                case 'annuel':
                    detailWhereClause = `strftime('%Y', o.datecreate) = '${date}'`;
                    break;
                default:
                    detailWhereClause = '1=1';
            }
            
            // Requête SQL pour les détails des produits avec jointures et regroupement
            detailQuery = `
                SELECT 
                    p.name as nom_produit,
                    f.name as categorie,
                    p.price_sell as prix_unitaire,
                    SUM(o.price_total) as prix_total_vendu,
                    SUM(o.quantity) as quantite_totale,
                    COUNT(DISTINCT o.panier) as nombre_commandes,
                    MIN(o.datecreate) as premiere_vente,
                    MAX(o.datecreate) as derniere_vente
                FROM orders o
                LEFT JOIN medicaments p ON o.id_medoc = p.id
                LEFT JOIN families f ON p.family_id = f.id
                WHERE ${detailWhereClause}
                AND o.status = 'confirmed'
                GROUP BY p.id, p.name, f.name, p.price_sell
                ORDER BY quantite_totale DESC, p.name ASC
            `;
            
            // Exécuter la requête des détails
            const detailResult = this.queries.raw(detailQuery);
            
            return {
                success: true,
                data: {
                    head: result,
                    body: detailResult
                }
            }
            
        } catch (error) {
            log.error('Erreur dans ExportController.get():', error);
            // En cas d'erreur, retourner des données fictives pour tester
            return {
                success: false,
                error: error.message
            }
        }

    }


    // =========================== EXPORT ==========================================
    async exportPdf(data, type) {
        try {
            // Créer le BrowserWindow uniquement pour l'export PDF
            if (!this.browserWindow) {
                this.browserWindow = new BrowserWindow({ 
                    show: false,
                    webPreferences: {
                        nodeIntegration: true,
                        contextIsolation: false
                    }
                });
            }

            const paths = this.store.get('pdfExportSettings')
            const basePath = this.path.join(paths.pdfExportPath, 'BongisaKisi');
            // 1. créer PharmacieApp s'il n'existe pas
            if (!this.fs.existsSync(basePath)) {
                this.fs.mkdirSync(basePath, { recursive: true });
            }

            // 2. sous-dossiers
            const folders = [ 'journalier', 'mensuel', 'annuel'];

            // 3. créer les sous-dossiers
            folders.forEach(folder => {
                const fullPath = this.path.join(basePath, folder);

                if (!this.fs.existsSync(fullPath)) {
                    this.fs.mkdirSync(fullPath);
                }
            });
            
            const html = this.pdf(data, type, this.store.get('settings'));
            await this.browserWindow.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html));

            const pdf = await this.browserWindow.webContents.printToPDF({
                printBackground: true
            });

            const fileName = `rapport-vente-${type}-${data?.head[0]?.periode}.pdf`;
            let filePath;
            if(type === 'journalier'){
                filePath = this.path.join(basePath, 'journalier', fileName);
            } else if (type === 'mensuel'){
                filePath = this.path.join(basePath, 'mensuel', fileName);
            } else {
                filePath = this.path.join(basePath, 'annuel', fileName);
            }
            
            this.fs.writeFileSync(filePath, pdf);

            // Nettoyer le BrowserWindow après l'export
            this.browserWindow.close();
            this.browserWindow = null;

            return {
                success: true
            }

        } catch (error) {
            log.error('Erreur lors de l\'export PDF:', error)
            return { 
                success: false, 
                error: error.message
            }
        }
    }

    // ================================== SETTINGS ======================================
    async openFolderDialog() {
        try {
    
            const result = await dialog.showOpenDialog(this.mainWindow, {
                properties: ['openDirectory'],
                title: 'Sélectionner un dossier pour les exports PDF',
                buttonLabel: 'Sélectionner ce dossier'
            })
    
            return result
        } catch (error) {
            log.error('Erreur lors de l\'ouverture du dialogue de dossier:', error)
            throw error
        }
    }

    getPdfExportSettings() {
        try {
            const settings = this.store.get('pdfExportSettings');
            return {
                success: true,
                data: settings
            }
        } catch (error) {
            log.error('Erreur lors de la récupération des paramètres PDF:', error)
            return {
                success: false,
                error: error.message
            }
        }
    }

    savePdfExportSettings(settings) {
        try {
            this.store.set('pdfExportSettings', settings);
            return {
                success: true
            }
        } catch (error) {
            log.error('Erreur lors de la sauvegarde des paramètres PDF:', error)
            return {
                success: false,
                error: error.message
            }
        }
    }
    
}

export const exportController = new ExportController();