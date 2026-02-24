import React from 'react';

export const Modal = ({ isOpen, onClose, title, children }) => {
    // Si no está abierto, no renderizamos nada
    if (!isOpen) return null;


    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </header>
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
};
