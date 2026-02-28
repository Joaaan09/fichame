import { useState, useEffect, useCallback } from 'react';

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const request = await fetch("/api/category/list", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                },
            });

            const response = await request.json();

            if (response.status === "success") {
                setCategories(response.categories);
                setError(null);
            } else {
                setError(response.message || "Error al cargar categorías");
                setCategories([]);
            }
        } catch (err) {
            setError(err.message || "Error de red al cargar categorías");
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        loading,
        error,
        refetchCategories: fetchCategories
    };
};
