import { useState, useEffect } from 'react';
import { useWorkSessions } from './useWorkSessions';

export const useHome = () => {
    const [todayHours, setTodayHours] = useState("0h 0m");
    const [lastSession, setLastSession] = useState(null);
    const [isWorking, setIsWorking] = useState(false);
    const [workSessionId, setWorkSessionId] = useState(null);
    const [startTime, setStartTime] = useState(0);

    const token = localStorage.getItem("token");

    const { sessions, refetch } = useWorkSessions();

    // Recalcular stats cuando sessions cambia
    useEffect(() => {
        if (!sessions.length) return;

        // Última sesión registrada (global)
        setLastSession(sessions[0] || null);

        // Total de hoy
        const today = new Date().toISOString().split("T")[0];
        const todaySessions = sessions.filter(ws =>
            new Date(ws.checkIn).toISOString().split("T")[0] === today
        );
        let total = 0;
        todaySessions.forEach(ws => {
            if (ws.checkOut) total += new Date(ws.checkOut) - new Date(ws.checkIn);
        });
        const h = Math.floor(total / 3600000);
        const m = Math.floor((total % 3600000) / 60000);
        setTodayHours(`${h}h ${m}m`);
    }, [sessions]);

    // Detectar sesión activa al montar
    useEffect(() => {
        const checkActiveSession = async () => {
            const res = await fetch("/api/work-session/active", {
                headers: { "Authorization": token }
            });
            const data = await res.json();
            if (data.workSession) {
                setIsWorking(true);
                setWorkSessionId(data.workSession._id);
                setStartTime(new Date(data.workSession.checkIn).getTime());
            }
        };
        checkActiveSession();
    }, []);

    return {
        todayHours, lastSession,
        isWorking, setIsWorking,
        workSessionId, setWorkSessionId,
        startTime, setStartTime,
        refetch
    };
};