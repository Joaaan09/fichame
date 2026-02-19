import React, { useState, useRef, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

export const Home = () => {

    // Estados
    const [isWorking, setIsWorking] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [timer, setTimer] = useState("00:00:00");
    const intervalRef = useRef(null);
    const { selectedCategory } = useOutletContext();

    // Limpiar intervalo al desmontar componente
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Actualizar timer cada segundo cuando está trabajando
    useEffect(() => {
        if (isWorking) {
            intervalRef.current = setInterval(() => {
                const now = Date.now();
                const diff = now - startTime;

                const h = Math.floor(diff / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);

                setTimer(
                    `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
                );
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isWorking, startTime]);

    // Lógica del botón
    const handleClick = async () => {
        if (!isWorking) {
            // START
            setIsWorking(true);
            setStartTime(Date.now());
            // Petición
            const request = await fetch("/api/work-session/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    checkIn: startTime,
                }),
            });
        } else {
            // STOP
            setIsWorking(false);
            setTimer("00:00:00");
        }
    };

    return (
        <>
            <h1 className="timer-display">{timer}</h1>

            <button
                className={`action-button ${isWorking ? 'state-stop' : 'state-start'}`}
                onClick={handleClick}
            >
                <span className="btn-label">{isWorking ? 'Salir' : 'Entrar'}</span>
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
