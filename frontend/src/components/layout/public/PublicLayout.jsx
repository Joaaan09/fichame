import React from 'react'
import { Header } from './Header'
import { Outlet } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { Navigate } from 'react-router-dom';


export const PublicLayout = () => {
    const { auth } = useAuth();
    return (
        <>
            <div className="auth-container">
                <Header />
                <section className="auth-card">
                    {!auth?.id ?
                        <Outlet />
                        :
                        <Navigate to="/home" />
                    }

                </section>
            </div>

        </>
    )
}
