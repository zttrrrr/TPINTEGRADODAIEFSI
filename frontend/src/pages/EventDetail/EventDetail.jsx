import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import eventService from "../../services/eventService";
import "./eventDetail.css";

const EventDetail = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [loadingInscripcion, setLoadingInscripcion] = useState(false);
  const [inscripcionError, setInscripcionError] = useState(null);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const data = await eventService.getById(id);
        setEvento(data);
      } catch (err) {
        setError("No se pudo cargar el evento.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvento();
  }, [id]);

  const handleInscripcion = async () => {
    setInscripcionError(null);
    setLoadingInscripcion(true);
    try {
      await eventService.enrollInEvent(id);
      alert("¡Te inscribiste con éxito!");
    } catch (error) {
      setInscripcionError(error.message || "Ocurrió un error al inscribirte.");
    } finally {
      setLoadingInscripcion(false);
    }
  };

  if (loading) return <p>Cargando evento...</p>;
  if (error) return <p>{error}</p>;
  if (!evento) return <p>No se encontró el evento.</p>;

  return (
    <div className="event-detail-container">
      <h1>{evento.name}</h1>
      <p><strong>Descripción:</strong> {evento.description}</p>
      <p><strong>Fecha:</strong> {new Date(evento.start_date).toLocaleDateString()}</p>
      <p><strong>Duración:</strong> {evento.duration_in_minutes} minutos</p>
      <p><strong>Precio:</strong> ${evento.price}</p>
      <p><strong>Capacidad máxima:</strong> {evento.max_assistance} personas</p>
      <p className={evento.enabled_for_enrollment === "1" ? "text-green" : "text-red"}>
        <strong>Estado:</strong> {evento.enabled_for_enrollment === "1" ? "Inscripción abierta" : "Inscripción cerrada"}
      </p>

      {evento.enabled_for_enrollment === "1" ? (
        <>
          <button
            className="btn-inscribite"
            onClick={handleInscripcion}
            disabled={loadingInscripcion}
          >
            {loadingInscripcion ? "Inscribiendo..." : "INSCRIBITE"}
          </button>
          {inscripcionError && (
            <h6 className="error-text">{inscripcionError}</h6>
          )}
        </>
      ) : (
        <button className="btn-inscribite-disabled" disabled>
          INSCRIPCIÓN CERRADA
        </button>
      )}
    </div>
  );
};

export default EventDetail;
