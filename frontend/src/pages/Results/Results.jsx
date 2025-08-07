import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import eventService from "../../services/eventService";
import EventCard from "../../components/eventCard.jsx/eventCard";

const Results = () => {
  const location = useLocation();
  const filtros = location.state?.filtros || {};
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getAll(
          filtros.name,
          filtros.tag,
          filtros.startDate
        );
        setEvents(response);
      } catch (error) {
        console.error("Error fetching events:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [filtros]);

  if (loading) return <p>Cargando resultados...</p>;

  return (
    <div>
      <h1>Resultados</h1>
      {events.length > 0 ? (
        <div className="event-grid">
          {events.map((event) => (
            <EventCard
              key={event.id}
              name={event.name}
              description={event.description}
              date={event.start_date}
              duration={event.duration_in_minutes}
              price={event.price}
              capacity={event.max_assistance}
              enrollmentStatus={event.enabled_for_enrollment}
            />
          ))}
        </div>
      ) : (
        <p>No se encontraron eventos.</p>
      )}
    </div>
  );
};

export default Results;
