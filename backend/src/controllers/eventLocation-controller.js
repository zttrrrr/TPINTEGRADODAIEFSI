import { Router } from "express";
import {StatusCodes} from 'http-status-codes';
import EventLocationService from "../services/eventLocation-service.js";
import { authenticateToken } from "../middleware/auth-middleware.js";

const router = Router();
const service = new EventLocationService();

// GET /api/event-location - Obtener todas las ubicaciones del usuario autenticado
router.get('', authenticateToken, async (req, res) => {
    try {
        const returnArray = await service.getAllByUserIdAsync(req.user.id);

        if (returnArray != null) {
            return res.status(StatusCodes.OK).json(returnArray);
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal error");
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal error");
    }
});

// GET /api/event-location/:id - Obtener ubicación específica del usuario autenticado
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const eventLocation = await service.getByIdAndUserIdAsync(id, req.user.id);

        if (eventLocation) {
            res.status(StatusCodes.OK).json(eventLocation);
        } else {
            res.status(StatusCodes.NOT_FOUND).send("Ubicación no encontrada");
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal error");
    }
});

// POST /api/event-location - Crear nueva ubicación
router.post('', authenticateToken, async (req, res) => {
    try {
        const eventLocationData = {
            ...req.body,
            id_creator_user: req.user.id
        };

        const newEventLocation = await service.createAsync(eventLocationData);
        
        if (newEventLocation) {
            return res.status(StatusCodes.CREATED).json(newEventLocation);
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error al crear la ubicación");
        }
    } catch (error) {
        if (error.message.includes("debe tener al menos 3 caracteres") || 
            error.message.includes("es requerido") || 
            error.message.includes("debe ser mayor a 0")) {
            return res.status(StatusCodes.BAD_REQUEST).send(error.message);
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal error");
    }
});

export default router;