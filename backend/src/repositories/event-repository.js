import DBconfig from '../configs/dbConfig.js'
import pkg from 'pg'

const { Client } = pkg;

export default class EventRepository {

    getAllAsync = async (name, startDate, tag) => {
        let returnArray = null;
        const client = new Client(DBconfig)

        try {
            await client.connect();

            let sql = "SELECT * FROM events WHERE 1=1";
            const values = [];
            let count = 1;

            if (name) {
                sql += ` AND LOWER(name) LIKE LOWER($${count})`;
                values.push(`%${name}%`);
                count++;
            }

            if (startDate) {
                sql += ` AND DATE(start_date) = $${count}`;
                values.push(startDate);
                count++;
            }

            if (tag) {
                sql += ` AND LOWER(description) LIKE LOWER($${count})`;
                values.push(`%${tag}%`);
                count++;
            }

            const result = await client.query(sql, values);
            await client.end();

            returnArray = result.rows;

        } catch (error) {
            console.log("Error en getAllAsync:", error);
        }

        return returnArray;
    }

    getByIdAsync = async(id) =>{
        const client = new Client(DBconfig);
        try {
            await client.connect();
            const result = await client.query("SELECT * FROM events WHERE id = $1", [id]);
            await client.end();
            return result.rows[0]; // Devuelve solo un evento
            
        } catch (error) {
            console.log("Error en getByIdAsync:", error);
            return null;
        }
    }

    async existsEvent(name, start_date, id_event_location) {
        const client = new Client(DBconfig);
        try {
            await client.connect();
            const result = await client.query(
                "SELECT 1 FROM events WHERE name = $1 AND start_date = $2 AND id_event_location = $3",
                [name, start_date, id_event_location]
            );
            await client.end();
            return result.rowCount > 0;
        } catch (error) {
            console.log("Error en existsEvent:", error);
            await client.end();
            return false;
        }
    }

    createEventAsync = async(name,description, id_event_category, id_event_location,
        start_date, duration_in_minutes, price, enabled_for_enrollment, 
        max_assistance, id_creator_user) => 
        {
            const client = new Client(DBconfig);
            try {
                await client.connect();
                const result = await client.query("INSERT INTO events (name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *", [name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user]);
                await client.end();
                return result.rows[0];
            } catch (error) {
                console.log("Error en createEventAsync:", error);
                await client.end();
                return null;
            }
        }

    updateEventAsync = async(id, name, description, id_event_category, id_event_location,
        start_date, duration_in_minutes, price, enabled_for_enrollment, 
        max_assistance) => 
        {
            const client = new Client(DBconfig);
            try {
                await client.connect();
                const result = await client.query(`
                    UPDATE events 
                    SET name = $1, description = $2, id_event_category = $3, 
                        id_event_location = $4, start_date = $5, duration_in_minutes = $6, 
                        price = $7, enabled_for_enrollment = $8, max_assistance = $9
                    WHERE id = $10 
                    RETURNING *
                `, [name, description, id_event_category, id_event_location, start_date, 
                     duration_in_minutes, price, enabled_for_enrollment, max_assistance, id]);
                await client.end();
                return result.rows[0];
            } catch (error) {
                console.log("Error en updateEventAsync:", error);
                await client.end();
                return null;
            }
        }

    deleteEventAsync = async(id) => {
        const client = new Client(DBconfig);
        try {
            await client.connect();
            const result = await client.query("DELETE FROM events WHERE id = $1 RETURNING *", [id]);
            await client.end();
            return result.rowCount > 0
        } catch (error) {
            console.log("Error en deleteEventAsync:", error);
            await client.end();
            return false;
        }
    }

    getEnrrolledUsersInEventByIdAsync = async(eventId) => {
        const client = new Client(DBconfig);
        try {
            await client.connect();
            const result = await client.query("SELECT * FROM event_enrollments WHERE id_event = $1", [eventId]);
            await client.end();
            return result.rows; // Devuelve todos los usuarios inscritos en el evento
        } catch (error) {
            console.log("Error en enrrolledUsersInEventAsync:", error);
            await client.end();
            return [];
        }
    }


    enrollUserInEventAsync = async(eventId, userId, description, attended, observations, rating) => {
        const client = new Client(DBconfig);
        try {
            await client.connect();
            const result = await client.query("INSERT INTO event_enrollments (id_event, id_user, description, registration_date_time, attended, observations, rating) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [eventId, userId, description, new Date(), attended, observations, rating]);
            await client.end();
            return result.rows[0];
        } catch (error) {
            console.log("Error en enrollUserInEventAsync:", error);
            await client.end();
            return null;
        }
    }

    deleteEnrollmentAsync = async(eventId, userId) => {
        const client = new Client(DBconfig);
        try {
            await client.connect();
            const result = await client.query("DELETE FROM event_enrollments WHERE id_event = $1 AND id_user = $2 RETURNING *", [eventId, userId]);
            await client.end();
            return result.rowCount > 0;
        } catch (error) {
            console.log("Error en deleteEnrollmentAsync:", error);
            await client.end();
            return false;
        }
    }
}
