const LoginForm = () => {
    return (

        <form className="login-form">
            <input className="input-text"
                type="text"
                id="idUser"
                name="idUser"
                placeholder="Nombre de usuario o email"
                required
                minlength="3"
            />
            <input
                type="password"
                name="user-password"
                id="user-password"
                placeholder="Contraseña"
                minlength="8"
                maxlength="64"
                required
                autocomplete="current-password"
                aria-label="Contraseña del usuario"
                pattern=".{8,}"
            />
                        
            <button className="btn-form-base btn-form-login" type="submit">Iniciar sesión</button>            
            <a href="/recuperar-contraseña" aria-label="Recuperar contraseña olvidada" className="text-primary hover:underline">
                ¿Has olvidado la contraseña?
            </a>

            <hr className="w-full border-t-2 border-gray-25 rounded-full" />

            <button
                className="btn-form-base btn-form-signup"
                type="submit"
            >
                Crear cuenta
            </button>



        </form>
    )
}

export default LoginForm;