import { Navigate } from "react-router-dom";

export default function Middleware ({ roles =[] ,children }) {

    const userConnecter = JSON.parse(sessionStorage.getItem('user'));

    if(userConnecter) {

        if( roles.includes(userConnecter.role) ){
            null
        }else{
            return <Navigate to='/auth' />
        }

    }else{
        return <Navigate to='/auth' />
    }

    return children;
}