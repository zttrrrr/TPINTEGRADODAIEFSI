import "./Home.css";
import { useEffect, useState, useRef } from "react";
import EventCard from "../../components/eventCard.jsx/eventCard";
import eventService from "../../services/eventService";
import SearchBar from "../../components/serachBar/searchBar";

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchEvents = async () => {
        // Revisa si ya hay eventos guardados en sessionStorage
        const cached = sessionStorage.getItem("cachedEvents");

        if (cached) {
            setEvents(JSON.parse(cached));
            return;
        }

        try {
            setLoading(true);
            const data = await eventService.getAll();
            setEvents(data);
            sessionStorage.setItem("cachedEvents", JSON.stringify(data));
        } catch (error) {
            setErrorMessage(error.message);
            console.error("Error al obtener eventos:", error.message);
        } finally {
            setLoading(false);
        }
        };

        fetchEvents();
    }, []);

    return (
        <div className="home-container">
            <SearchBar/>
            <h1>Eventos disponibles</h1>
            <p>{errorMessage}</p>
            
                {loading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <p>Cargando eventos...</p>
                </div>
            ) : (
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
                    id={event.id}
                    />
                ))}
                </div>
        )}
        </div>
    );
};

export default Home;