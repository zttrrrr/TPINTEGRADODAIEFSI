import EventRepository from "../repositories/event-repository.js";
import EventLocationRepository from "../repositories/eventLocation-repository.js";

function isTodayOrPast(date) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const eventDate = new Date(date);
    eventDate.setHours(0,0,0,0);
    return eventDate <= today;
}

export default class EventService {
    constructor() {
        this.eventRepository = new EventRepository();
        this.eventLocationRepository = new EventLocationRepository();
    }

    getAllAsync = async (name, startDate, tag) => {
        return await this.eventRepository.getAllAsync(name, startDate, tag);
    }
    
    getByIdAsync = async(id) =>{
        return await this.eventRepository.getByIdAsync(id);
    }

    createEventAsync = async(name,description, id_event_category, id_event_location, 
        start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, 
        id_creator_user) => {        
        if (!name || !description || description.length < 3 || name.length < 3){
            console.log("Service: Error - nombre o descripción inválidos");
            return {
                status: 400,
                body: { success: false, message: "El nombre o la descripción son inválidos." }
            };
        }
        // Validar que max_assistance no sea mayor que max_capacity del event_location
        const eventLocation = await this.eventLocationRepository.getByIdAsync(id_event_location);
        if (!eventLocation) {
            console.log("Service: Error - ubicación no existe");
            return {
                status: 400,
                body: { success: false, message: "La ubicación del evento no existe." }
            };
        }

        if (price < 0 || max_assistance < 0 ) {
            console.log("Service: Error - precio o asistencia negativos");
            return {
                status: 400,
                body: { success: false, message: "El precio o la asistencia máxima no pueden ser negativos." }
            };
        }
        if (max_assistance > eventLocation.max_capacity) {
            console.log("Service: Error - asistencia excede capacidad");
            return {
                status: 400,
                body: { success: false, message: "La asistencia máxima no puede superar la capacidad del lugar." }
            };
        }
        const exists = await this.eventRepository.existsEvent(name, start_date, id_event_location);
        if (exists) {
            return {
                status: 400,
                body: { success: false, message: "Ya existe un evento en esa fecha y lugar" }
            };
        }

        console.log("Service: Todos los datos válidos, creando evento...");
        const result = await this.eventRepository.createEventAsync(name,description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user);
        
        if (result) {
            console.log("Service: Evento creado exitosamente");
            return {
                status: 200,
                body: { success: true, data: result }
            };
        } else {
            console.log("Service: Error al crear evento en BD");
            return {
                status: 500,
                body: { success: false, message: "Error al crear el evento en la base de datos." }
            };
        }
    }

    updateEventAsync = async(id, name,description, id_event_category, id_event_location, 
        start_date, duration_in_minutes, price, enabled_for_enrollment, 
        max_assistance) => {        
        
        if (!name || !description || description.length < 3 || name.length < 3)
        {
            console.log("Service: Error - nombre o descripción inválidos");
            return {
                status: 400,
                body: { success: false, message: "El nombre o la descripción son inválidos." }
            };
        }
        // Validar que max_assistance no sea mayor que max_capacity del event_location
        const eventLocation = await this.eventLocationRepository.getByIdAsync(id_event_location);
        if (!eventLocation) {
            console.log("Service: Error - ubicación no existe");
            return {
                status: 400,
                body: { success: false, message: "La ubicación del evento no existe." }
            };
        }

        if (price < 0 || max_assistance < 0 ) {
            console.log("Service: Error - precio o asistencia negativos");
            return {
                status: 400,
                body: { success: false, message: "El precio o la asistencia máxima no pueden ser negativos." }
            };
        }
        if (max_assistance > eventLocation.max_capacity) {
            console.log("Service: Error - asistencia excede capacidad");
            return {
                status: 400,
                body: { success: false, message: "La asistencia máxima no puede superar la capacidad del lugar." }
            };
        }
        const exists = await this.eventRepository.existsEvent(name, start_date, id_event_location);
        if (exists) {
            return {
                status: 400,
                body: { success: false, message: "Ya existe un evento en esa fecha y lugar" }
            };
        }

        console.log("Service: Todos los datos válidos, creando evento...");
        const result = await this.eventRepository.updateEventAsync(id, name,description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance);
        
        if (result) {
            console.log("Service: Evento actualizado exitosamente");
            return {
                status: 200,
                body: { success: true, data: result }
            };
        } else {
            console.log("Service: Error al actualizar el evento en BD");
            return {
                status: 500,
                body: { success: false, message: "Error al actualizar el evento en la base de datos." }
            };
        }
    }

    deleteEventAsync = async(id) => {
        const deleted = await this.eventRepository.deleteEventAsync(id);
        if (deleted) {
        return {
            status: 200,
            body: { success: true, message: "Evento eliminado correctamente" }
        };
    } else {
        return {
            status: 400,
            body: { success: false, message: "No se pudo eliminar el evento" }
        };
    }

    }

    enrollUserInEventAsync = async(eventId, userId, description, attended, observations, rating) => {
        const event = await this.eventRepository.getByIdAsync(eventId);
        const enrolledUsers = await this.eventRepository.getEnrrolledUsersInEventByIdAsync(eventId);

        if (!event.enabled_for_enrollment) {
            return {
                status: 400,
                body: { success: false, message: "El evento no está habilitado para inscripción" }
            };
        }
        if (enrolledUsers.length > event.max_assistance) {
            return {
                status: 400,
                body: { success: false, message: "El evento ha alcanzado su capacidad máxima de asistencia" }
            };
        }
        if (isTodayOrPast(event.start_date)) {
            return {
                status: 400,
                body: { success: false, message: "No se puede inscribir a un evento que ya ha comenzado o es hoy" }
            };
        }

        const isEnrrolled = enrolledUsers.some(user => user.id_user === userId);
        if (isEnrrolled) {
            return {
                status: 400,
                body: { success: false, message: "El usuario ya está inscripto en este evento" }
            };
        }

        const result = await this.eventRepository.enrollUserInEventAsync(eventId, userId, description, attended, observations, rating);
        
        if (result) {
            return {
                status: 200,
                body: { success: true, message: "Usuario inscrito exitosamente" }
            };
        } else {
            return {
                status: 500,
                body: { success: false, message: "Error al inscribir al usuario en el evento" }
            };
        }
    }

    deleteEnrollmentAsync = async(eventId, userId) => {
        
        const event = await this.eventRepository.getByIdAsync(eventId);
        if (isTodayOrPast(event.start_date)) {
            return {
                status: 400,
                body: { success: false, message: "No se puede inscribir a un evento que ya ha comenzado o es hoy" }
            };
        }
        const enrolledUsers = await this.eventRepository.getEnrrolledUsersInEventByIdAsync(eventId);
        const isEnrrolled = enrolledUsers.some(user => user.id_user === userId);
        if (!isEnrrolled) {
            return {
                status: 400,
                body: { success: false, message: "Aun no estas inscripto en ele vento" }
            };
        }

        const result  = await this.eventRepository.deleteEnrollmentAsync(eventId, userId);
        
        if (result) {
            return {
                status: 200,
                body: { success: true, message: "Inscripción eliminada correctamente" }
            };
        } else {
            return {
                status: 400,
                body: { success: false, message: "No se pudo eliminar la inscripción" }
            };
        }

    }
}




