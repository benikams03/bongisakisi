import { removeSpaces } from "../utils/string"

const admin = {
    username : 'admin',
    password : 'adm!n2026#btpm'
}

const caissier = {
    username : 'caissier001',
    password : 'c@issier2026!'
}

export function Auths(Username, Password) {
    let clearU, clearP
    clearU = removeSpaces(Username)
    clearP = removeSpaces(Password)

    if( clearU === admin.username ) {
        if( clearP === admin.password ) {
            return { 
                succes : true,
                role : 'admin' 
            }
        } else {
            return { 
                succes : false,
                msg : 'Mot de passe incorrect.'
            }
        }
    } else if( clearU === caissier.username ) {
        if( clearP === caissier.password ) {
            return { 
                succes : true,
                role : 'caissier'
            }
        } else {
            return { 
                succes : false,
                msg : 'Mot de passe incorrect.'
            }
        }
    } else {
        return {
            succes : false,
            msg : "Nom d'utilisateur incorrect."
        }
    }
}