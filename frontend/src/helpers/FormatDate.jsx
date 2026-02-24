export const formatDate = (session, complete) => {
    if (!session || !session.checkOut) return "Sin sesiones";
    const checkIn = new Date(session.checkIn);
    const checkOut = new Date(session.checkOut);

    const date = checkIn.toLocaleDateString("es-ES"); // "24/2/2026"
    const timeIn = checkIn.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    const timeOut = checkOut.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

    if (complete) {
        return `${date}\n${timeIn} - ${timeOut}`;
    }
    return `${timeIn} - ${timeOut}`;
}