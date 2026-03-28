import Store from 'electron-store';
import { Text } from '../utils/text.js';
import Log from 'electron-log';

class SettingsController {

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
            Log.error('Error getting settings:', error);
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
            Log.error('Error setting settings:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

}

export const settingsController = new SettingsController();