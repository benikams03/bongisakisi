import log from 'electron-log';
import escpos from "escpos";
import USB from "escpos-usb";

class ImprimeController {

    constructor() {
        this.escpos = escpos;
        this.USB = USB;
    }

    print() {
        try {
            
            const device = new this.escpos.USB(); // auto détecte USB
            const printer = new this.escpos.Printer(device);
            const line = "_".repeat(52);

            device.open(() => {
                printer
                    .align("CT")
                    .style('B')
                    .size(2, 2)
                    .text("name_pharamcie")
                printer
                    .align("CT")
                    .size(1, 1)
                    .style('I')
                    .text("bongisakisi")

                printer
                    .align("CT")
                    .text("PHARMACIE BONGISA KISI")
                    .text("----------------------")
                    .align("LT");

                data.items.forEach(item => {
                printer.text(`${item.name} x${item.qty}   ${item.price} CDF`);
                });

                

                printer.text(line)
                printer.tableCustom([
                    { text: 'TOTAL', align: 'LEFT', width: 0.7 },
                    { text: '12000Fc' + " FC", align: 'RIGHT', width: 0.3 }
                ])

                
                printer.align('CT').text('Merci pour votre visite, à bientôt !')
                printer.barcode("1234567890", "EAN13");

                printer.cut();
                printer.close();
            });
            
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