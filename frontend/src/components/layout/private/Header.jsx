import React from 'react'
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Modal } from '../../common/Modal';

export const Header = ({ categories, selectedCategory, setSelectedCategory, refetchCategories }) => {

    // Obtener categoría
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));

    const [modoModal, setModoModal] = useState(null);

    const openCreateModal = () => {
        setError(null);
        setModoModal('create');
    };


    const handleNewCategory = async (e) => {
        e.preventDefault();
        const dataFrom = new FormData(e.target);
        const { name, color } = Object.fromEntries(dataFrom.entries());

        const request = await fetch("/api/category/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            },
            body: JSON.stringify({
                user: user._id,
                name,
                color
            }),
        });

        if (request.ok) {
            const data = await request.json();
            await refetchCategories(); // Refrescar toda la lista desde el servidor
            setSelectedCategory(data.category); // Activar la recién creada
            setShowDropdown(false);
            setModoModal(null);
        }
        else {
            setError("Error al crear la categoría");
        }
    }

    return (
        <header className="header">
            <div className="brand">FichaMe</div>

            <nav className="desktop-nav">
                <NavLink to="/home" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
                <NavLink to="/home/historial" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Historial</NavLink>
                <NavLink to="/home/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Perfil</NavLink>
            </nav>

            <div className="category-selector" id="categorySelector" onClick={() => setShowDropdown(!showDropdown)}>
                <span>{selectedCategory?.name || 'Categoría'}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                {showDropdown && (
                    <div className="category-dropdown">
                        {categories.map(cat => (
                            <div key={cat._id} onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCategory(cat);
                                setShowDropdown(false);
                            }}>
                                {cat.name}
                            </div>
                        ))}
                        <div className="category-dropdown-item" onClick={openCreateModal}>
                            + Nueva categoría
                        </div>
                    </div>

                )}

            </div>
            <Modal
                isOpen={modoModal === 'create'}
                onClose={() => { setModoModal(null); setError(null); }}
                title="Nueva categoría"
            >
                <form onSubmit={handleNewCategory}>
                    {error && <div className="error-msg" style={{ display: 'block', marginBottom: '1rem' }}>{error}</div>}
                    <div className="input-group">
                        <label className="input-label">Nombre</label>
                        <input type="text" name="name" className="input-field" placeholder="Ej. Diseño, Backend..." required />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Color del punto</label>
                        <input type="color" name="color" className="input-field" style={{ height: '40px', padding: '2px', cursor: 'pointer' }} />
                    </div>
                    <button type="submit" className="btn-primary">Crear</button>
                </form>
            </Modal>
        </header>
    )
}
