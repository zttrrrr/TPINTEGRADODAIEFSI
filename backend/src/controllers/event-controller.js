import { Router } from "express";
import {StatusCodes} from 'http-status-codes';
import EventService from "../services/event-service.js";
import { authenticateToken } from "../middleware/auth-middleware.js";

const router = Router();
const service = new EventService();

router.get('', async (req, res) => {
    const { name, startDate, tag } = req.query;

    const returnArray = await service.getAllAsync(name, startDate, tag);

    if (returnArray != null) {
        return res.status(StatusCodes.OK).json(returnArray);
    } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal error");
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;  // Acceder al ID de la URL
    const event = await service.getByIdAsync(id);  // Buscar el evento en la base de datos

    if (event) {
        res.status(StatusCodes.OK).json(event);  // Si el evento existe, devolverlo
    } else {
        res.status(StatusCodes.NOT_FOUND).send("Evento no encontrado");
    }
});

// Aplicar middleware de autenticación solo en la ruta POST
router.post('', authenticateToken, async (req, res) => {
    const {name,description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance} = req.body;
    
    // Usar el ID del usuario logueado como id_creator_user
    const id_creator_user = req.user.id;
    
    const result = await service.createEventAsync(name,description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user);
    
    if (result && result.status === 200) {
        res.status(StatusCodes.CREATED).json(result.body);
    } else if (result && result.status === 400) {
        res.status(StatusCodes.BAD_REQUEST).json(result.body);
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "No se pudo crear el evento" });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params; 
    const {name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance} = req.body;
    const userId = req.user.id;

    const event = await service.getByIdAsync(id);
    if (!event) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Evento no encontrado" });
    }
    if (event.id_creator_user !== userId) {
        return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "No tienes permiso para editar este evento" });
    }

    const result = await service.updateEventAsync(id, name,description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance);
    
    if (result && result.status === 200) {
        res.status(StatusCodes.OK).json(result.body);
    } else if (result && result.status === 400) {
        res.status(StatusCodes.BAD_REQUEST).json(result.body);
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "No se pudo crear el evento" });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const event = await service.getByIdAsync(id);
    if (!event) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Evento no encontrado" });
    }
    if (event.id_creator_user !== userId) {
        return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "No tienes permiso para eliminar este evento" });
    }

    const result = await service.deleteEventAsync(id);

    if (result && result.status === 200) {
        res.status(StatusCodes.OK).json(result.body);
    } else if (result && result.status === 400) {
        res.status(StatusCodes.BAD_REQUEST).json(result.body);
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "No se pudo eliminar el evento" });
    }

});

router.post('/:id/enrollment', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const {description, attended, observations, rating} = req.body;
    const userId = req.user.id;

    const event = await service.getByIdAsync(id);
    if (!event) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Evento no encontrado" });
    } 

    const result = await service.enrollUserInEventAsync(id, userId, description, attended, observations, rating);

    if (result && result.status === 200) {
        res.status(StatusCodes.OK).json(result.body);
    } else if (result && result.status === 400) {
        res.status(StatusCodes.BAD_REQUEST).json(result.body);
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "No se pudo INSCRIBIR al evento" });
    }

});

router.delete('/:id/enrollment', authenticateToken, async (req, res) => {
    const { id } = req.params; 
    const userId = req.user.id;

    const event = await service.getByIdAsync(id);
    if (!event) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Evento no encontrado" });
    } 

    const result = await service.deleteEnrollmentAsync(id, userId);
    
    if (result && result.status === 200) {
        res.status(StatusCodes.OK).json(result.body);
    } else if (result && result.status === 400) {
        res.status(StatusCodes.BAD_REQUEST).json(result.body);
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error al desincribirse del evento" });
    }
})

export default router;