import Store from 'electron-store';
import { Text } from '../utils/text.js';
import Log from 'electron-log';
import fs from 'fs';
import path from 'path';
import os from 'os';
class SettingsController {

    constructor() {
        this.store = new Store();
        this.fs = fs;
        this.path = path;
        this.os = os;
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

            this.store.set('pdfExportSettings',{
                pdfExportPath: this.path.join(this.os.homedir(), 'Documents')
            });
            
            this.store.set('adminAuth',{
                password: '$2b$05$sVrh0BufbUfAxez.4vyAyuCmpWnF0aFC05YVSN7OPVaZ1T/c4lXPW'
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

    update(settings) {
        try{
            const currentSettings = this.store.get('settings');
            this.store.set('settings', {
                name: Text.capitalizeWords(settings.name || currentSettings.name),
                phone: settings.phone.trim() || currentSettings.phone,
                email: Text.toLowerCase(settings.email || currentSettings.email),
                address: Text.capitalizeWords(settings.address || currentSettings.address)
            });
            return { success: true }
        } catch (error) {
            Log.error('Error updating settings:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

}

export const settingsController = new SettingsController();