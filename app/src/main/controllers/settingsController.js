import Store from 'electron-store';
import { Text } from '../utils/text.js';

export class SettingsController {

    constructor() {
        this.store = new Store();
    }

    get() {
        try{
            return {
                success: true,
                data: this.store.get('settings')
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            }
        }
    }

    set(settings) {
        try{
            this.store.set('settings', {
                name: Text.capitalizeWords(settings.name),
                phone: settings.phone.trim(),
                email: Text.toLowerCase(settings.email),
                address: Text.capitalizeWords(settings.address)
            });
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.message
            }
        }
    }

}