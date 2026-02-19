import React from 'react'
import { Header } from '../private/Header'
import { Outlet } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { Navigate } from 'react-router-dom';

export const PrivateLayout = () => {

    const { auth, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>
    }

    return (
        <>
            <Header />
            <main className="main-stage">
                {auth?.id ?
                    <Outlet />
                    :
                    <Navigate to="/" />
                }

            </main >

        </>
    )
}
