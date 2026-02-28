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
    const [modoModal, setModoModal] = useState(null); // 'edit' | 'delete' | 'create' | null
    const [selectedSession, setSelectedSession] = useState(null);
    const [error, setError] = useState(null);
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
            setModoModal(null);
            setError(null);
            refetch();
        } else {
            setError("Error al eliminar la sesión");
        }
    };

    const handleEdit = async (checkIn, checkOut, category, description) => {
        // Aseguramos que las fechas sean válidas antes de convertirlas
        const isoCheckIn = checkIn ? new Date(checkIn).toISOString() : null;
        const isoCheckOut = checkOut ? new Date(checkOut).toISOString() : null;

        const request = await fetch("/api/work-session/update/" + selectedSession?._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                checkIn: isoCheckIn,
                checkOut: isoCheckOut,
                categoryId: category,
                description
            })
        });

        if (request.ok) {
            setModoModal(null);
            setError(null);
            refetch();
        } else {
            setError("Error al actualizar la sesión");
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        // Extraer los datos del formulario
        const dataFrom = new FormData(e.target);
        const { checkIn, checkOut, categoryId, description } = Object.fromEntries(dataFrom.entries());

        const request = await fetch("/api/work-session/create", {
            method: "POST",
            body: JSON.stringify({
                checkIn: checkIn ? new Date(checkIn).toISOString() : null,
                checkOut: checkOut ? new Date(checkOut).toISOString() : null,
                categoryId: categoryId,
                description
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        if (request.ok) {
            setModoModal(null);
            setError(null);
            refetch();
        } else {
            setError("Error al crear la sesión");
        }
    }


    const openDeleteModal = (session) => {
        setError(null);
        setSelectedSession(session);
        setModoModal('delete');
    };

    const openEditModal = (session) => {
        setError(null);
        setSelectedSession(session);
        setModoModal('edit');
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
                <button className="btn-add-session" onClick={() => { setModoModal('create') }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    Nueva jornada
                </button>
                <Modal isOpen={modoModal === 'create'}
                    onClose={() => { setModoModal(null); setError(null); }}
                    title="Nueva jornada" >
                    <form onSubmit={handleCreate}>
                        <div className="input-group">
                            <label className="input-label">Check-in</label>
                            <input type="datetime-local" name="checkIn" className="input-field" required />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Check-out</label>
                            <input type="datetime-local" name="checkOut" className="input-field" required />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Categoría</label>
                            <select name="categoryId" className="input-field" required>
                                <option value="">Selecciona una categoría</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Descripción</label>
                            <textarea name="description" className="input-field"></textarea>
                        </div>
                        <button type="submit" className="btn-primary">Crear</button>
                    </form>


                </Modal>
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

                                        <div className={`h-total ${!session.checkOut ? 'active' : ''}`}>
                                            {duration}
                                        </div>

                                        <div className="settings-wrapper">
                                            <button className="settings" onClick={() => toggleDropdown(session._id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#86868B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-settings"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>
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
            <Modal
                isOpen={modoModal === 'delete'}
                onClose={() => { setModoModal(null); setError(null); }}
                title="Eliminar sesión"
            >
                <div className="modal-delete-confirm">
                    {error && <div className="error-msg">{error}</div>}
                    <p>¿Estás seguro de que deseas eliminar esta sesión?</p>
                    <div className="modal-footer">
                        <button
                            className="btn-ios cancel"
                            onClick={() => { setModoModal(null); setError(null); }}
                        >
                            Cancelar
                        </button>
                        <button
                            className="btn-ios delete"
                            onClick={() => {
                                console.log("Eliminando sesión:", selectedSession?._id);
                                handleDelete();
                            }}
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={modoModal === 'edit'}
                onClose={() => { setModoModal(null); setError(null); }}
                title="Editar sesión"
            >
                <div className="modal-form">
                    {error && <div className="error-msg">{error}</div>}
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

                    <div className="modal-footer">
                        <button
                            className="btn-ios cancel"
                            onClick={() => { setModoModal(null); setError(null); }}
                        >
                            Cancelar
                        </button>
                        <button
                            className="btn-ios save"
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
