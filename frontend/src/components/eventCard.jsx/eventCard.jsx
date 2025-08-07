import "./eventCard.css";
import { useNavigate } from "react-router-dom";

const EventCard = ({id, name, description, date, duration, price, capacity, enrollmentStatus }) => {

  const navigate = useNavigate()
  return (
    <div className="event-card">
      <h2 className="event-title">{name}</h2>
      <p className="event-description">{description}</p>
      <p className="event-info"><strong>Fecha:</strong> {date}</p>
      <p className="event-info"><strong>Duración:</strong> {duration} min</p>
      <p className="event-info"><strong>Precio:</strong> ${price}</p>
      <p className="event-info"><strong>Cupo máximo:</strong> {capacity} personas</p>
      <p className={`event-status ${enrollmentStatus === "1" ? "open" : "closed"}`}>
        {enrollmentStatus === "1" ? "Inscripción abierta" : "Inscripción cerrada"}
      </p>

      <button onClick={() => navigate(`/eventDetail/${id}`)}>Ver mas</button>
    </div>
  );
};

export default EventCard;
