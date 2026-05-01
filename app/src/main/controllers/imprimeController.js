import log from 'electron-log';
import pkg from "electron-pos-printer";
import Store from 'electron-store';

const { PosPrinter } = pkg;

class ImprimeController {

    constructor() {
        this.store = new Store();
    }

    async getPrinters(mainWindow) {
        try {
            const res = await mainWindow.webContents.getPrintersAsync();
            return {
                success: true,
                data: res
            };
        } catch (error) {
            log.error('Erreur lors de la récupération des imprimantes:', error);
            return {
                success: false,
                error: 'Erreur lors de la récupération des imprimantes'
            };
        }
    }

    async print(datas) {
        try {

            const infosPharma = this.store.get('settings') 
            const infosPrint = this.store.get('pdfExportSettings') 
            const line = ('-').repeat(75)

            const data = [
                {
                    type: "text",
                    value: infosPharma.name,
                    style: { textAlign: "center", fontSize: "24px", fontWeight: "bold" }
                },
                {
                    type: "text",
                    value: infosPharma.address,
                    style: { textAlign: "center" }
                },
                {
                    type: "text",
                    value: "Tél: " + infosPharma.phone,
                    style: { textAlign: "center" }
                },

                { type: "text", value: line },

                // Infos facture
                {
                    type: "text",
                    value: "Date & Heure: " + datas[0]?.datecreate,
                    style: { textAlign: "left" }
                },

                { type: "text", value: line },

                // Table produits
                {
                    type: "table",
                    style: { border: "0px solid #ddd" },
                    tableHeader: ["Produit", "Qte", "Prix"],
                    tableBody: datas.map(item => [
                        item.name.substring(0, 30),
                        item.quantity.toString(),
                        item.price_total.toString() + " FC"
                    ]),
                    tableFooter: ["TOTAL", datas.reduce((acc, item) => acc + item.price_total, 0).toString() + " FC"],
                    tableHeaderStyle: {
                        textAlign: "center",
                        fontWeight: "bold"
                    },
                    tableBodyStyle: {
                        textAlign: "center"
                    },
                    tableFooterStyle: {
                        textAlign: "right",
                        fontWeight: "bold"
                    }
                },


                // Footer
                {
                    type: "text",
                    value: "Merci pour votre visite, à bientôt !",
                    style: { "text-align": "center" }
                },

                // Barcode
                {
                    type: "barCode",
                    value: "1234567890",
                    height: 40,
                    width: 2,
                    style: {textAlign: 'center'},
                    displayValue: false
                }
            ];

            // Récupérer l'imprimante sélectionnée
            const settings = this.store.get('pdfExportSettings') || {};
            const selectedPrinter = settings.selectedPrinter || 'POS-80';
            
            await PosPrinter.print(data, {
                preview: false,
                silent: true,
                width: "300px",
                margin: "0 0 0 0",
                copies: 1,
                printerName: infosPrint?.selectedPrinter,
                timeOutPerLine: 400,
                pageSize: "80mm"
            });

            return{ success: true };
            
        } catch (error) {
            log.error('Error printing:', error);
            return {
                success: false,
                error: 'Erreur lors de l\'impression'
            };
        }
    }
    
}

export const imprimeController = new ImprimeController();