import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useWorkSessions, calculateTotalHours } from '../../hooks/useWorkSessions';
import { useTheme } from '../../context/ThemeContext';
import { useOutletContext } from 'react-router-dom';


export const Profile = () => {

    const [modoModal, setModoModal] = useState(null);
    const userToEdit = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(userToEdit);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }
    const [modalError, setModalError] = useState(null); // Error específico para modales de perfil
    const { sessions } = useWorkSessions();
    const { darkMode, toggleTheme } = useTheme();
    const { categories = [], refetchCategories } = useOutletContext() || {};


    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    const years = Array.from(
        { length: 100 },
        (_, i) => new Date().getFullYear() - i
    ).map(year => ({
        value: year,
        label: String(year)
    }));


    const handleEdit = async (e) => {
        e.preventDefault();

        // Extraer datos del formulario
        const formData = new FormData(e.target);
        const updatedData = {
            name: formData.get("name"),
            email: formData.get("email")
        };

        // Si hay contraseña, la añadimos
        const password = formData.get("password");
        if (password) updatedData.password = password;

        try {
            const request = await fetch('/api/user/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify(updatedData)
            });

            const response = await request.json();

            if (response.status === "success") {
                // Actualizar estado local
                setUser(response.user);

                // Actualizar localStorage para que persista al recargar
                const currentUser = JSON.parse(localStorage.getItem("user"));
                const newUser = { ...currentUser, ...response.user };
                localStorage.setItem("user", JSON.stringify(newUser));

                // Mostrar éxito y cerrar modal
                setModoModal(null);
                setStatus({ type: 'success', message: 'Perfil actualizado correctamente' });
                setTimeout(() => setStatus(null), 3000);
            } else {
                setStatus({ type: 'error', message: response.message || 'Error al actualizar' });
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
            setStatus({ type: 'error', message: 'Error de conexión con el servidor' });
        }
    }

    const deleteCategory = async (id) => {
        const request = await fetch("/api/category/remove/" + id, {
            method: "DELETE",
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        if (data.status === "success") {
            setModalError({ type: 'success', message: 'Categoría eliminada correctamente' });
            await refetchCategories(); // Refrescar del servidor
        } else {
            setModalError({ type: 'error', message: data.message || 'Error al eliminar' });
        }
    }



    return (
        <section id="view-profile" className="page-content">

            {status && (
                <div className={`${status.type}-msg profile-status-msg`}>
                    {status.message}
                </div>
            )}

            <div className="profile-header">
                <div className="avatar-large">
                    JP
                    <div className="avatar-edit-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="white" strokeWidth="3"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                    </div>
                </div>
                <h2 className="user-name">{user.name}</h2>
                <p className="user-role">{user.email}</p>
            </div>

            <div className="settings-group">
                <a href="#" className="setting-row" onClick={() => setModoModal("edit")}>
                    <div className="row-left">
                        <div className="icon-box bg-blue">
                            <svg width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <span className="row-text" onClick={() => setModoModal("edit")}>Editar datos personales</span>
                        <Modal isOpen={modoModal === 'edit'}
                            onClose={() => { setModoModal(null); setStatus(null); }}
                            title="Editar datos personales">
                            <form onSubmit={handleEdit}>
                                {status?.type === 'error' && (
                                    <div className="error-msg">{status.message}</div>
                                )}
                                <div className="input-group">
                                    <label className="input-label">Nombre</label>
                                    <input type="text" name="name" className="input-field" defaultValue={user.name} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Email</label>
                                    <input type="email" name="email" className="input-field" defaultValue={user.email} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Contraseña</label>
                                    <input type="password" name="password" className="input-field" placeholder="Nueva contraseña (opcional)" />
                                </div>
                                <button type="submit" className="btn-primary">Guardar</button>
                            </form>
                        </Modal>
                    </div>
                    <div className="row-right">
                        <svg width="20" height="20" viewBox="0 0 24 24"
                            fill="none" stroke="#C7C7CC" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                </a>


            </div>

            <div className="settings-group">
                <a href="#" className="setting-row" onClick={() => setModoModal("categorias")}>
                    <div className="row-left">
                        <div className="icon-box bg-red">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                        </div>
                        <span className="row-text" onClick={() => setModoModal("categorias")}>Gestionar categorias</span>
                    </div>
                    <div className="row-right">
                        <svg width="20" height="20" viewBox="0 0 24 24"
                            fill="none" stroke="#C7C7CC" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                </a>

                <Modal isOpen={modoModal === 'categorias'}
                    onClose={() => { setModoModal(null); setModalError(null); setStatus(null); }}
                    title="Gestionar categorias">
                    {modalError && (
                        <div className={`status-message ${modalError.type}`}>
                            {modalError.message}
                        </div>
                    )}
                    {categories.map((category) => (
                        <div key={category._id || category.id} className="category-item">
                            <div className="category-color" style={{ backgroundColor: category.color }}></div>
                            <div className="category-name">{category.name}</div>
                            <svg onClick={() => deleteCategory(category._id || category.id)} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                <path d="M10 11v6M14 11v6"></path>
                            </svg>
                        </div>
                    ))}
                </Modal>
            </div>

            <div className="settings-group">
                <a href="#" className="setting-row" onClick={() => setModoModal("horas")}>
                    <div className="row-left">
                        <div className="icon-box bg-green">
                            <svg width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <span className="row-text">Historial de horas por meses</span>
                    </div>
                    <div className="row-right">
                        <svg width="20" height="20" viewBox="0 0 24 24"
                            fill="none" stroke="#C7C7CC" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                </a>
            </div>


            <div className="settings-group">
                <a href="#" className="setting-row" onClick={toggleTheme}>
                    <div className="row-left">
                        <div className="icon-box bg-gray">
                            <svg width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        </div>
                        <span className="row-text">Apariencia</span>
                    </div>
                    <div className="row-right">
                        <span className="value-text">{darkMode ? 'Oscuro' : 'Claro'}</span>
                        <svg width="20" height="20" viewBox="0 0 24 24"
                            fill="none" stroke="#C7C7CC" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                </a>
            </div>
            <Modal isOpen={modoModal === 'horas'} onClose={() => setModoModal(null)} title="Horas por mes">
                <div className="form-group">
                    <div className="form-row">
                        <select
                            name="mes"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        >
                            <option value="1">Enero</option>
                            <option value="2">Febrero</option>
                            <option value="3">Marzo</option>
                            <option value="4">Abril</option>
                            <option value="5">Mayo</option>
                            <option value="6">Junio</option>
                            <option value="7">Julio</option>
                            <option value="8">Agosto</option>
                            <option value="9">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>

                        <select
                            name="year"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        >
                            {years.map(y => (
                                <option key={y.value} value={y.value}>{y.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="profile-summary-card">
                        <p className="profile-summary-label">
                            Total acumulado
                        </p>
                        <h2 className="profile-summary-value">
                            {calculateTotalHours(sessions.filter(s => {
                                const date = new Date(s.checkIn);
                                return (date.getMonth() + 1) === selectedMonth && date.getFullYear() === selectedYear;
                            }))}
                        </h2>
                    </div>
                </div>
            </Modal>
            <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>

            <p className="profile-version">
                Versión 1.0.0
            </p>

        </section >
    )

}