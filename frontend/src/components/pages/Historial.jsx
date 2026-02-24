import React from 'react'
import { useWorkSessions } from '../../hooks/useWorkSessions';

export const Historial = () => {

    const { sessions, loading, refetch } = useWorkSessions();

    const isToday = (date) => {
        const d = new Date(date);
        const today = new Date();
        return d.toDateString() === today.toDateString();
    };

    const isYesterday = (date) => {
        const d = new Date(date);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return d.toDateString() === yesterday.toDateString();
    };

    const workSessionCard = sessions.map((session) => (
        <div className="history-item" key={session.id}>
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
    ))




    return (
        <section className="page-content">

            <div className="history-group">
                {/*Crear label para cada una de las jornadas*/}
                {sessions.map((session) => {
                    if (isToday(session.checkIn)) return <div className="group-label" key={session.id}>Hoy</div>;
                    if (isYesterday(session.checkIn)) return <div className="group-label" key={session.id}>Ayer</div>;

                    return (
                        <div className="group-label" key={session.id}>
                            {new Date(session.checkIn).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                            })}
                        </div>
                    );
                })}

                <div className="ios-list">
                    {workSessionCard}
                </div>

            </div>



        </section>
    )
}
