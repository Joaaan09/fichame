import React, { useState } from 'react'
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export const Login = () => {

    const { form, changed } = useForm({});
    const [login, setLogin] = useState("not_sended");
    const { setAuth } = useAuth();

    const loginUser = async (e) => {
        e.preventDefault();

        // Recoger datos formulario
        let userToLogin = form;

        // Petición al backend
        const request = await fetch(Global.url + "user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userToLogin)
        });

        const data = await request.json();

        // Persisitir los datos en el navegador
        if (data.status == "success") {

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setLogin("login");

            // Redirección
            setTimeout(() => {

                // Set datos en el auth
                setAuth(data.user);
                window.location.reload();
            }, 1000)


        } else {
            setLogin("error")
        }

    }

    return (
        <div id="loginForm" className="form-wrapper fade-in">
            {login && (
                <strong
                    className={`alert ${login === "login"
                        ? "alert-success"
                        : login === "error"
                            ? "alert-error"
                            : ""
                        }`}
                >
                    {login === "login"
                        ? "Usuario logueado correctamente"
                        : login === "error"
                            ? "El usuario o contraseña no son correctos"
                            : ""}
                </strong>
            )}
            <form onSubmit={loginUser}>
                <div className="input-group">
                    <label className="input-label">Correo electrónico</label>
                    <input type="email" name="email" className="input-field" placeholder="nombre@ejemplo.com" id="loginEmail" required onChange={changed} />
                    <div className="error-msg">Por favor introduce un email válido.</div>
                </div>

                <div className="input-group">
                    <label className="input-label">Contraseña</label>
                    <input type="password" name="password" className="input-field" placeholder="••••••••" id="loginPass" onChange={changed} required />
                    <div className="error-msg">La contraseña es incorrecta.</div>
                </div>

                <button type="submit" className="btn-primary">Iniciar sesión</button>
            </form>

            <div className="toggle-text">
                ¿No tienes cuenta?
                <Link to="/registro">
                    <span className="toggle-link">Crear cuenta</span>

                </Link>
            </div>
        </div>
    )
}
