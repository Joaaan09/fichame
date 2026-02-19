import React, { useState, useRef, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

export const Home = () => {

    // Estados
    const [isWorking, setIsWorking] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [timer, setTimer] = useState("00:00:00");
    const intervalRef = useRef(null);
    const { selectedCategory } = useOutletContext();
    const [workSessionId, setWorkSessionId] = useState(null);
    const [todayHours, setTodayHours] = useState(0);

    // Limpiar intervalo al desmontar componente
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        const fetchTotalHours = async () => {
            const res = await fetch("/api/work-session/list", {
                headers: { "Authorization": localStorage.getItem("token") }
            });
            const data = await res.json();
            const today = new Date().toISOString().split("T")[0];
            const todaySessions = data.workSessions.filter(ws => {
                return new Date(ws.checkIn).toISOString().split("T")[0] === today;
            });
            let total = 0;
            todaySessions.forEach(ws => {
                if (ws.checkOut) {
                    total += new Date(ws.checkOut).getTime() - new Date(ws.checkIn).getTime();
                }
            });
            const h = Math.floor(total / (1000 * 60 * 60));
            const m = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
            setTodayHours(`${h}h ${m}m`);
        };
        fetchTotalHours();
    }, [isWorking]);

    // Detectar si hay una jornada activa
    useEffect(() => {
        const checkActiveSession = async () => {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/work-session/active", {
                headers: { "Authorization": token }
            });
            const data = await res.json();
            if (data.status === "success" && data.workSession) {
                setIsWorking(true);
                setStartTime(new Date(data.workSession.checkIn).getTime());
                setWorkSessionId(data.workSession._id);
            }
        };
        checkActiveSession();
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
                    "Authorization": `${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    checkIn: startTime,
                    categoryId: selectedCategory._id
                }),
            });

            const data = await request.json();

            if (data.status === "success") {
                setWorkSessionId(data.workSession._id);
            }

        } else {
            // STOP
            setIsWorking(false);
            setTimer("00:00:00");

            // Petición
            const request = await fetch("/api/work-session/end", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    checkOut: startTime,
                    workSessionId: workSessionId
                }),
            });

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
                    <div className="stat-value">09:30 - 13:42</div>
                </div>
            </div>
        </>
    )
}
