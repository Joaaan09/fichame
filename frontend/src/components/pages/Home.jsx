import React from 'react'

export const Home = () => {
    return (
        <>

            <h1 className="timer-display" id="timer">00:00:00</h1>

            <button className="action-button state-start" id="mainBtn">
                <span className="btn-label" id="btnLabel">Entrar</span>
            </button>

            <div className="bottom-stats">
                <div className="stat-item">
                    <div className="stat-label">Hoy</div>
                    <div className="stat-value">4h 12m</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Última sesión</div>
                    <div className="stat-value">09:30 - 13:42</div>
                </div>
            </div>
        </>
    )
}
