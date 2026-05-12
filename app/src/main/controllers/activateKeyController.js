import Store from 'electron-store';
import log from 'electron-log';
import os from 'os';
import pkg from "node-machine-id";
const { machineIdSync } = pkg;
import bcrypt from 'bcryptjs';
import { PUBLIC_KEY } from '../store/secutiy.js';
import crypto from "crypto";

class ActivateKeyController {
    
    constructor() {
        this.store = new Store();
        this.os = os;
        this.bcrypt = bcrypt;
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

    async hash(content) {
        const salt = await this.bcrypt.genSalt(5)
        return await this.bcrypt.hash(content, salt);
    }
    
    async compareHash(content, hash) {
        return await this.bcrypt.compare(content, hash);
    }

    getOsInfo() {
        return {
            deviceId: machineIdSync(),
            nom: this.os.hostname(),
            system: this.os.platform(),
            architecture: this.os.arch()
        }
    }

    set(data) {
        try{
            this.store.set('license', data);
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

    verifyLicense() {
        try{
            const currentLicense = this.store.get('license');
            const isValid = crypto.verify(
                "sha256",
                Buffer.from(JSON.stringify({
                    key: currentLicense.license.key,
                    expires: false,
                    deviceId: this.getOsInfo().deviceId
                })),
                PUBLIC_KEY,
                Buffer.from(currentLicense.signature, "base64")
            );
            
            return { success: !isValid }
        } catch (error) {
            log.error('Error verifying license:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

}

export const activateKeyController = new ActivateKeyController()