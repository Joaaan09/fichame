import React from 'react'
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import { useState } from 'react';
export const Register = () => {

    const { form, changed } = useForm({});
    const [login, setLogin] = useState("not_sended");
    const { setAuth } = useAuth();

    const registerUser = async (e) => {
        e.preventDefault();

        const userToRegister = form;
        console.log("Registering user:", userToRegister);

        const request = await fetch(Global.url + "user/register", {
            method: "POST",
            body: JSON.stringify(userToRegister),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await request.json();
        console.log("Register response:", data);

        if (data.status === "success") {
            setLogin("sended");

            // Auto-login instantáneo:
            const loginRequest = await fetch(Global.url + "user/login", {
                method: "POST",
                body: JSON.stringify({ email: form.email, password: form.password }), // Usas los datos del form actual
                headers: { "Content-Type": "application/json" }
            });

            const loginData = await loginRequest.json();

            if (loginData.status == "success") {
                localStorage.setItem("token", loginData.token);
                localStorage.setItem("user", JSON.stringify(loginData.user));
                setAuth(loginData.user);

                // Rediriges o recargas igual que en el Login
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } else {
            setLogin("error");
        }


    }


    return (
        <div id="registerForm" className="form-wrapper fade-in">
            <div className="form-header">
                <h2>Crear cuenta</h2>
            </div>
            {login && (
                <strong
                    className={`alert ${login === "sended"
                        ? "alert-success"
                        : login === "error"
                            ? "alert-error"
                            : ""
                        }`}
                >
                    {login === "sended"
                        ? "Usuario registrado correctamente"
                        : login === "error"
                            ? "Error al registrar el usuario"
                            : ""}
                </strong>
            )}
            <form onSubmit={registerUser}>
                <div className="input-group">
                    <label className="input-label">Nombre</label>
                    <input type="text" name="name" className="input-field" placeholder="Tu nombre" id="registerName" required onChange={changed} />
                </div>
                <div className="input-group">
                    <label className="input-label">Correo electrónico</label>
                    <input type="email" name="email" className="input-field" placeholder="nombre@ejemplo.com" id="registerEmail" required onChange={changed} />
                    <div className="field-error">Por favor introduce un email válido.</div>
                </div>

                <div className="input-group">
                    <label className="input-label">Contraseña</label>
                    <input type="password" name="password" className="input-field" placeholder="••••••••" id="registerPass" onChange={changed} required />
                </div>

                <button type="submit" className="btn-primary">Registarse</button>
            </form>

            <div className="toggle-text">
                ¿Ya tienes cuenta?
                <Link to="/login">
                    <span className="toggle-link">Inicia sesión</span>

                </Link>
            </div>
        </div>
    )
}
