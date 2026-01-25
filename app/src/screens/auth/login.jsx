import { Input } from "../../components/ui/input"
import { Bouton } from "../../components/ui/bouton"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Auths } from "../../services/authentification"
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const redirect = useNavigate()

    const { register, handleSubmit, formState: {errors}, reset } = useForm()
    const auth = async (data) => {
        
        const res = Auths(data.username, data.password)
        if(res.succes) {
            reset()
            toast.success( 'Connexion réussi')
            sessionStorage.setItem('user', JSON.stringify({ role : res.role }))
            if( res.role === 'caissier'  ) {
                redirect('/')
            } else if ( res.role === 'admin' ) {
                redirect('/admin')
            } else {
                null
            }
        }else {
            toast.error( res.msg )
        }
    }

    return(<>
    <main className="flex justify-center items-center h-screen">
        <div className="w-2/7">

            <h3 className="text-center font-bold text-3xl pb-6">
                <span className="text-gray-400">BATELA</span>PHARMA</h3>

            <form method="post" onSubmit={handleSubmit(auth)} className="border border-gray-300 py-8 px-6 rounded-lg shadow-sx w-full">
                <div className="text-center pb-4">
                    <h3 className="font-semibold text-xl">Connexion</h3>
                    <p className="text-sm text-gray-500">Connectez-vous pour accéder au système</p>
                </div>

                <div className="grid gap-y-3">
                    <Input
                        type="text"
                        {...register('username',
                            { 
                                required:'Champ requis', 
                                pattern: /^[A-Za-zà-ÿ0-1\s'-]+$/
                            }
                        )}
                        error={errors.username}
                        helperText={ errors.username ? errors.username.message : null }
                        placeholder="Nom d'utilisateur"
                    />

                    <Input
                        type="password"
                        {...register('password',
                            { 
                                required:'Champ requis',
                            }
                        )}
                        error={errors.password}
                        helperText={ errors.password ? errors.password.message : null}
                        placeholder="••••••••"
                    />

                    <Bouton load={false}>Connexion</Bouton>
                </div>
            </form>
        </div>
    </main>
    </>)
}