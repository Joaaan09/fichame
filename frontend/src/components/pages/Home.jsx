import React, { useRef, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { formatDate } from '../../helpers/FormatDate';
import { useHome } from '../../hooks/useHome';

export const Home = () => {

    const [timer, setTimer] = useState("00:00:00");
    const intervalRef = useRef(null);
    const { selectedCategory } = useOutletContext();

    const {
        todayHours, lastSession,
        isWorking, setIsWorking,
        workSessionId, setWorkSessionId,
        startTime, setStartTime,
        refetch
    } = useHome();

    // Limpiar intervalo al desmontar
    useEffect(() => {
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    // Timer
    useEffect(() => {
        if (isWorking) {
            intervalRef.current = setInterval(() => {
                const diff = Date.now() - startTime;
                const h = Math.floor(diff / 3600000);
                const m = Math.floor((diff % 3600000) / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                setTimer(
                    `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
                );
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isWorking, startTime]);

    // Lógica del botón
    const handleClick = async () => {
        const token = localStorage.getItem("token");

        if (!isWorking) {
            const now = Date.now();
            setIsWorking(true);
            setStartTime(now);

            const request = await fetch("/api/work-session/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    checkIn: now,
                    categoryId: selectedCategory._id
                }),
            });
            const data = await request.json();
            if (data.status === "success") {
                setWorkSessionId(data.workSession._id);
            }

        } else {
            setIsWorking(false);
            setTimer("00:00:00");

            await fetch("/api/work-session/end", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    checkOut: Date.now(),
                    workSessionId: workSessionId
                }),
            });
            refetch();
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
                    <div className="stat-value">{todayHours}</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Última sesión</div>
                    <div className="stat-value">{formatDate(lastSession)}</div>
                </div>
            </div>
        </>
    )
}
