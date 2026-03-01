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

    // Guardar cuando selecciona categoría
    const selectCategory = (categoryId) => {
        const category = categories.find(c => c._id === categoryId);
        if (category) {
            setSelectedCategory(category);
            localStorage.setItem('lastCategory', categoryId);
        }
    };

    // Seleccionar la primera categoría por defecto cuando cargan
    useEffect(() => {
        if (categories.length > 0) {
            // Comprobamos si la categoría seleccionada actualmente sigue existiendo en el nuevo array de categories
            const categoryStillExists = categories.find(c => c._id === selectedCategory?._id);

            if (!categoryStillExists) {
                // Si la hemos borrado, seleccionamos la primera de la lista por defecto
                setSelectedCategory(categories[0]);
            }
        } else {
            // Si nos hemos quedado sin ninguna categoría
            setSelectedCategory(null);
        }
    }, [categories]); // "Vigilante" que se ejecuta cada vez que categories cambia

    // Recuperar al cargar el componente
    useEffect(() => {
        const lastCategoryId = localStorage.getItem('lastCategory');
        if (lastCategoryId && categories.length > 0) {
            const category = categories.find(c => c._id === lastCategoryId);
            if (category) {
                setSelectedCategory(category);
            }
        }
    }, [categories]);

    return (
        <>
            <Header categories={categories} selectCategory = {selectCategory} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} refetchCategories={refetchCategories} />
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
