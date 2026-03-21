import Store from 'electron-store';
import Text from '../utils/text';

export class SettingsController {

    constructor() {
        this.store = new Store();
    }

    get() {
        return this.store.get('settings');
    }

    create(settings) {
        this.store.set('settings', {
            name: Text.capitalizeWords(settings.name),
            telephone: settings.telephone.trim(),
            email: Text.toLowerCase(settings.email),
            address: Text.capitalizeWords(settings.address)
        });
    }

}