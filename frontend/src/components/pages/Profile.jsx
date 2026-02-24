import React from 'react'

export const Profile = () => {

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }


    return (
        <section id="view-profile" className="page-content">

            <div className="profile-header">
                <div className="avatar-large">
                    JP
                    <div className="avatar-edit-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="3"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                    </div>
                </div>
                <h2 className="user-name">Juan Pérez</h2>
                <p className="user-role">Desarrollador Senior</p>
            </div>

            <div className="settings-group">
                <a href="#" className="setting-row">
                    <div className="row-left">
                        <div className="icon-box bg-blue">
                            <svg width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <span className="row-text">Datos Personales</span>
                    </div>
                    <div className="row-right">
                        <svg width="20" height="20" viewBox="0 0 24 24"
                            fill="none" stroke="#C7C7CC" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                </a>

                <a href="#" className="setting-row">
                    <div className="row-left">
                        <div className="icon-box bg-green">
                            <svg width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </div>
                        <span className="row-text">Notificaciones</span>
                    </div>
                    <div className="row-right">
                        <span className="value-text">Activadas</span>
                        <svg width="20" height="20" viewBox="0 0 24 24"
                            fill="none" stroke="#C7C7CC" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                </a>
            </div>

            <div className="settings-group">
                <a href="#" className="setting-row">
                    <div className="row-left">
                        <div className="icon-box bg-gray">
                            <svg width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        </div>
                        <span className="row-text">Apariencia</span>
                    </div>
                    <div className="row-right">
                        <span className="value-text">Claro</span>
                        <svg width="20" height="20" viewBox="0 0 24 24"
                            fill="none" stroke="#C7C7CC" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                </a>
            </div>

            <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>

            <p style={{
                textAlign: "center",
                marginTop: "20px",
                color: "var(--text-secondary)",
                fontSize: "0.8rem"
            }}>
                Versión 1.0.0
            </p>

        </section>
    )
}
