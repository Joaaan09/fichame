import React from 'react'
import { Header } from '../private/Header'
import { Outlet } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCategories } from '../../../hooks/useCategories';

export const PrivateLayout = () => {

    const { auth, loading } = useAuth();
    const { categories, refetchCategories, loading: categoriesLoading } = useCategories();
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Seleccionar la primera categoría por defecto cuando cargan
    useEffect(() => {
        if (categories.length > 0 && !selectedCategory) {
            setSelectedCategory(categories[0]);
        }
    }, [categories, selectedCategory]);

    return (
        <>
            <Header categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} refetchCategories={refetchCategories} />
            <main className="main-stage">
                {auth?.id ?
                    <Outlet context={{ selectedCategory, categories, refetchCategories }} />
                    :
                    <Navigate to="/" />
                }

            </main >

        </>
    )
}
