import React from 'react'

export const Historial = () => {
    return (
        <section className="page-content">

            {/* Grupo: Hoy */}
            <div className="history-group">
                <div className="group-label">Hoy</div>
                <div className="ios-list">
                    <div className="history-item">
                        <div className="h-time-block">
                            <span className="h-main-time">09:00 - En curso</span>
                            <div className="h-sub-time">
                                <div className="dot green"></div> Entrada
                            </div>
                        </div>
                        <div className="h-total" style={{ color: 'var(--accent-blue)', background: 'rgba(0,113,227,0.1)' }}>
                            ...
                        </div>
                    </div>
                </div>
            </div>



        </section>
    )
}
