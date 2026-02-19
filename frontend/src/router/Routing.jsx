import { Routes, Route, BrowserRouter, Navigate, Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/public/PublicLayout';
import { PrivateLayout } from '../components/layout/private/PrivateLayout';
import { Login } from '../components/user/Login';
import { Register } from '../components/user/Register';
import { AuthProvider } from '../context/AuthProvider';
import { Home } from '../components/pages/Home';


export const Routing = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<PublicLayout />}>
                        <Route index element={<Login></Login>}></Route>
                        <Route path='login' element={<Login></Login>}></Route>
                        <Route path='registro' element={<Register></Register>}></Route>
                    </Route>
                    <Route path="/home" element={<PrivateLayout />}>
                        <Route index element={<Home></Home>}></Route>
                        <Route path='home' element={<Home></Home>}></Route>

                    </Route>

                    <Route path="*" element={
                        <>
                            <p>
                                <h1> Error 404</h1>
                                <Link to="/">Volver al inicio</Link>
                            </p>
                        </>
                    }></Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}