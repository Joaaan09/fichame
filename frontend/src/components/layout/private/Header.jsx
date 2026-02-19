import React from 'react'

export const Header = () => {
    return (
        <header className="header">
            <div className="brand">FichaMe</div>

            <nav className="desktop-nav">
                <a href="#" className="nav-link active">Dashboard</a>
                <a href="#" className="nav-link">Historial</a>
                <a href="#" className="nav-link">Perfil</a>
            </nav>

            <div className="category-selector" id="categorySelector">
                <span id="categoryText">Trabajo</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
        </header>
    )
}
