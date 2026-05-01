import log from 'electron-log'
import bcrypt from "bcryptjs"
import Store from 'electron-store';

class AuthentificationController {

    constructor () {
        this.store = new Store();
    }

    async login(data) {
        try {
            const res = this.store.get('adminAuth')
            const verification = await bcrypt.compare( data.password , res.password );
            if( !verification ) {
                return {
                    success: false,
                    error: 'Invalid password'
                }
            }else {
                return { success: true }
            }

        } catch (error) {
            log.error('Error logging in:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

}

export const authentificationController = new AuthentificationController() 