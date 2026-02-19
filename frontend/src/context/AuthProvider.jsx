import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Carga inicial del usuario desde localStorage
        const initializeAuth = () => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');

            if (token && user) {
                setAuth(JSON.parse(user));
            }

            setLoading(false);
        };

        initializeAuth();
    }, []);

    // Función para actualizar usuario en contexto y localStorage
    const updateAuth = (updatedUser) => {
        if (updatedUser === null) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setAuth(null);
            return;
        }
        setAuth(prev => {
            const newAuth = { ...prev, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(newAuth));
            return newAuth;
        });
    };

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth: updateAuth,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
