import React from 'react'
import { useState } from 'react';

export const Header = ({ categories, selectedCategory, setSelectedCategory }) => {

    // Obtener categoría
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <header className="header">
            <div className="brand">FichaMe</div>

            <nav className="desktop-nav">
                <a href="#" className="nav-link active">Dashboard</a>
                <a href="#" className="nav-link">Historial</a>
                <a href="#" className="nav-link">Perfil</a>
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
