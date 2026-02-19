import React from 'react'
import { Header } from '../private/Header'
import { Outlet } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const PrivateLayout = () => {

    const { auth, loading } = useAuth();

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/category/list', {
                headers: { 'Authorization': token }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setCategories(data.categories);
                if (data.categories.length > 0) setSelectedCategory(data.categories[0]);
            }
        };
        fetchCategories();
    }, []);

    return (
        <>
            <Header categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            <main className="main-stage">
                {auth?.id ?
                    <Outlet context={{ selectedCategory }} />
                    :
                    <Navigate to="/" />
                }

            </main >

        </>
    )
}
