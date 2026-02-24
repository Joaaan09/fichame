import React from 'react'
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export const Header = ({ categories, selectedCategory, setSelectedCategory }) => {

    // Obtener categoría
    const [showDropdown, setShowDropdown] = useState(false);

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
                    </div>
                )}

            </div>
        </header>
    )
}
