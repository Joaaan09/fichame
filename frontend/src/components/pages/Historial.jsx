import React from 'react';
// Importamos tanto el hook como la función de utilidad
import { useWorkSessions, groupSessionsByDate } from '../../hooks/useWorkSessions';
import { useState } from 'react';
import { Modal } from '../common/Modal';
import { useOutletContext } from 'react-router-dom';

export const Historial = () => {
    // Obtenemos las sesiones del hook
    const { sessions, loading, refetch } = useWorkSessions();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const token = localStorage.getItem("token");

    const { categories } = useOutletContext();

    const handleDelete = async () => {
        const request = await fetch("/api/work-session/remove/" + selectedSession?._id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        if (request.ok) {
            setMostrarModal(false);
            refetch();
        }
    };

    const handleEdit = async (checkIn, checkOut, category, description) => {
        const request = await fetch("/api/work-session/update/" + selectedSession?._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                checkIn: new Date(checkIn).toISOString(), // Convertimos a formato ISO real
                checkOut: new Date(checkOut).toISOString(),
                categoryId: category,
                description
            })
        });

        if (request.ok) {
            setMostrarModal(false);
            refetch();
        }
    };


    const openDeleteModal = (session) => {
        setSelectedSession(session);
        setMostrarModal(true);
    };

    const openEditModal = (session) => {
        setSelectedSession(session);
        setMostrarModal(true);
    };

    const toggleDropdown = (id) => {
        if (activeDropdown === id) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(id);
        }
    };

    const fechaParaInput = (fechaISO) => {
        if (!fechaISO) return "";
        const date = new Date(fechaISO);

        // Obtenemos los componentes en hora local
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        // Devolvemos el formato exacto que pide el input: YYYY-MM-DDTHH:mm
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }



    // Agrupamos las sesiones usando la función que creaste
    // 'grouped' será un objeto tipo: { "lunes...": [sesion1, sesion2], "martes...": [...] }
    const grouped = groupSessionsByDate(sessions);

    if (loading) return <section className="page-content"><div className="group-label">Cargando...</div></section>;

    return (
        <section className="page-content">
            <header className="history-header">
                <h2>Historial</h2>
                <button className="btn-add-session" onClick={() => {/* Aquí irá la lógica de crear manual */ }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    Nueva jornada
                </button>
            </header>

            {Object.keys(grouped).map(date => {
                return (
                    <div className="history-group" key={date}>
                        <div className="group-label">{date}</div>
                        <div className="ios-list">
                            {grouped[date].map(session => {
                                // Cálculo de duración para sesiones terminadas
                                let duration = "...";
                                if (session.checkOut) {
                                    const diff = new Date(session.checkOut) - new Date(session.checkIn);
                                    const h = Math.floor(diff / 3600000);
                                    const m = Math.floor((diff % 3600000) / 60000);
                                    duration = `${h}h ${m}m`;
                                }

                                const timeIn = new Date(session.checkIn).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
                                const timeOut = session.checkOut
                                    ? new Date(session.checkOut).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
                                    : "En curso";

                                return (
                                    <div className="history-item" key={session._id}>
                                        <div className="h-time-block">
                                            <span className="h-main-time">{timeIn} - {timeOut}</span>
                                            <div className="h-sub-time">
                                                <div className={`dot ${session.checkOut ? 'green' : 'green animate-pulse'}`}></div>
                                                {session.category ? session.category.name : 'Entrada'}
                                            </div>
                                        </div>

                                        <div className="h-total" style={!session.checkOut ? { color: 'var(--accent-blue)', background: 'rgba(0,113,227,0.1)' } : {}}>
                                            {duration}
                                        </div>

                                        <div className="settings-wrapper" style={{ marginLeft: '12px' }}>
                                            <button className="settings" onClick={() => toggleDropdown(session._id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#86868B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-settings"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>
                                            </button>
                                            {activeDropdown === session._id && (
                                                <div className="dropdown">
                                                    <button className="dropdown-item" onClick={() => openEditModal(session)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-clock-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12a9 9 0 1 0 -9.972 8.948c.32 .034 .644 .052 .972 .052" /><path d="M12 7v5l2 2" /><path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39" /></svg>
                                                    </button>

                                                    <button className="dropdown-item delete" onClick={() => openDeleteModal(session)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-clock-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20.926 13.15a9 9 0 1 0 -7.835 7.784" /><path d="M12 7v5l2 2" /><path d="M22 22l-5 -5" /><path d="M17 22l5 -5" /></svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            })}
            {/* Modal de eliminación (FUERA del bucle) */}
            <Modal
                isOpen={mostrarModal}
                onClose={() => setMostrarModal(false)}
                title="Eliminar sesión"
            >
                <div className="modal-delete-confirm">
                    <p>¿Estás seguro de que deseas eliminar esta sesión?</p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                        <button
                            className="btn-cancel"
                            style={{ background: '#F2F2F7', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
                            onClick={() => setMostrarModal(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            className="btn-delete"
                            style={{ background: 'var(--accent-red)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
                            onClick={() => {
                                console.log("Eliminando sesión:", selectedSession?._id);
                                // Aquí irá el fetch futuro
                                handleDelete(selectedSession._id);
                                setMostrarModal(false);
                            }}
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={mostrarModal && !!selectedSession}
                onClose={() => setMostrarModal(false)}
                title="Editar sesión"
            >
                <div className="modal-form">
                    <div className="form-group">
                        <label>Hora de entrada</label>
                        <input
                            type="datetime-local"
                            value={fechaParaInput(selectedSession?.checkIn)}
                            onChange={(e) => setSelectedSession({ ...selectedSession, checkIn: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Hora de salida</label>
                        <input
                            type="datetime-local"
                            value={fechaParaInput(selectedSession?.checkOut)}
                            onChange={(e) => setSelectedSession({ ...selectedSession, checkOut: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Categoría</label>
                        <select
                            value={selectedSession?.category?._id || selectedSession?.category || ""}
                            onChange={(e) => setSelectedSession({ ...selectedSession, category: e.target.value })}
                        >
                            <option value="">Seleccionar categoría</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea
                            rows="3"
                            value={selectedSession?.description || ""}
                            onChange={(e) => setSelectedSession({ ...selectedSession, description: e.target.value })}
                            placeholder="Añade una descripción..."
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'flex-end' }}>
                        <button
                            className="btn-cancel"
                            style={{ background: '#F2F2F7', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
                            onClick={() => setMostrarModal(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            className="btn-delete"
                            style={{ background: 'var(--accent-green)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
                            onClick={() => {
                                handleEdit(selectedSession.checkIn, selectedSession.checkOut, selectedSession.category?._id || selectedSession.category, selectedSession.description);
                            }}
                        >
                            Guardar cambios
                        </button>
                    </div>
                </div>
            </Modal>
        </section>
    );
};
