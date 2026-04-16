import Store from 'electron-store';
import log from 'electron-log';
import os from 'os';
import { Text } from '../utils/text.js';

class ActivateKeyController {
    
    constructor() {
        this.store = new Store();
        this.os = os;
    }

    get() {
        try{
            return {
                success: true,
                data: this.store.get('license')
            }
        } catch (error) {
            log.error('Error getting license:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

    set(data) {
        try{
            const dateExpired = new Date();
            dateExpired.setDate(dateExpired.getDate() + 8)

            this.store.set('license', {
                key: data.key || '',
                createdAt: new Date().toLocaleDateString("en-CA"),
                expired: {
                    isInfinity: data.isInfinity || false,
                    date: dateExpired.toLocaleDateString("en-CA")
                },
                deviceId: {
                    nom: this.os.hostname(),
                    system: this.os.platform(),
                    architecture: this.os.arch()
                }
            });

            return { success: true }
        } catch (error) {
            log.error('Error setting license:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

    update(data) {
        try{
            const currentLicense = this.store.get('license');

            this.store.set('license', {
                key: data.key || currentLicense.key,
                createdAt: data.key ? new Date().toLocaleDateString("en-CA") : currentLicense.createdAt,
                expired: {
                    isInfinity: data.isInfinity || currentLicense.expired.isInfinity,
                    date: data.key ? '' : currentLicense.expired.date
                },
                deviceId: {
                    nom: this.os.hostname(),
                    system: this.os.platform(),
                    architecture: this.os.arch()
                }
            });

            return { success: true }
        } catch (error) {
            log.error('Error setting license:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

}

export const activateKeyController = new ActivateKeyController()