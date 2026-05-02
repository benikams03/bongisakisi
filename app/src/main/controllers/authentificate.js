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
            const password = res?.password ? res.password : '$2b$10$nQW2X91X..awDdDIgd81aOFsqJP8JhUXZzlgnq6b1EZWqNtsx.24G'
            if(!res?.password){
                this.store.set('adminAuth',{
                    password: '$2b$05$sVrh0BufbUfAxez.4vyAyuCmpWnF0aFC05YVSN7OPVaZ1T/c4lXPW'
                });
            }
            const verification = await bcrypt.compare( data.password , password );
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

    async changePassword(data) {
        try {
            const res = this.store.get('adminAuth')
            
            // Vérifier que l'ancien mot de passe est correct
            const verification = await bcrypt.compare(data.currentPassword, res.password);
            if (!verification) {
                return {
                    success: false,
                    error: 'L\'ancien mot de passe est incorrect'
                }
            }

            // Hasher le nouveau mot de passe
            const hashedPassword = await bcrypt.hash(data.newPassword, 10);
            
            // Mettre à jour le mot de passe
            this.store.set('adminAuth', {
                password: hashedPassword
            });

            log.info('Mot de passe administrateur modifié avec succès');
            return { success: true };

        } catch (error) {
            log.error('Error changing password:', error);
            return {
                success: false,
                error: 'Erreur lors de la modification du mot de passe'
            }
        }
    }

}

export const authentificationController = new AuthentificationController() 