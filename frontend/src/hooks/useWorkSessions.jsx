// hooks/useWorkSessions.jsx
import { useState, useEffect } from 'react';

export const useWorkSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        setLoading(true);
        const res = await fetch("/api/work-session/list", {
            headers: { "Authorization": localStorage.getItem("token") }
        });
        const data = await res.json();
        setSessions(data.workSessions || []);
        setLoading(false);
    };

    useEffect(() => { fetchSessions(); }, []);

    return { sessions, loading, refetch: fetchSessions };
};