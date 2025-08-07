import DBconfig from '../configs/dbConfig.js'
import pkg from 'pg'

const { Client } = pkg;

export default class EventLocationRepository {

    getAllAsync = async () => {
        let returnArray = null;
        const client = new Client(DBconfig)

        try {
            await client.connect();
            const result = await client.query("SELECT * FROM event_locations");
            await client.end();
            returnArray = result.rows;
        } catch (error) {
            console.log("Error en getAllAsync:", error);
        }

        return returnArray;
    }

    getAllByUserIdAsync = async (userId) => {
        let returnArray = null;
        const client = new Client(DBconfig)

        try {
            await client.connect();
            const result = await client.query("SELECT * FROM event_locations WHERE id_creator_user = $1", [userId]);
            await client.end();
            returnArray = result.rows;
        } catch (error) {
            console.log("Error en getAllByUserIdAsync:", error);
        }

        return returnArray;
    }

    getByIdAsync = async(id) =>{
        const client = new Client(DBconfig);
        try {
            await client.connect();
            const result = await client.query("SELECT * FROM event_locations WHERE id = $1", [id]);
            await client.end();
            return result.rows[0]; // Devuelve solo una ubicación
        } catch (error) {
            console.log("Error en getByIdAsync:", error);
            return null;
        }
    }

    getByIdAndUserIdAsync = async(id, userId) =>{
        const client = new Client(DBconfig);
        try {
            await client.connect();
            const result = await client.query("SELECT * FROM event_locations WHERE id = $1 AND id_creator_user = $2", [id, userId]);
            await client.end();
            return result.rows[0];
        } catch (error) {
            console.log("Error en getByIdAndUserIdAsync:", error);
            return null;
        }
    }

    createAsync = async(eventLocation) => {
        const client = new Client(DBconfig);
        try {
            await client.connect();
            const result = await client.query(
                "INSERT INTO event_locations (id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [eventLocation.id_location, eventLocation.name, eventLocation.full_address, eventLocation.max_capacity, eventLocation.latitude, eventLocation.longitude, eventLocation.id_creator_user]
            );
            await client.end();
            return result.rows[0];
        } catch (error) {
            console.log("Error en createAsync:", error);
            return null;
        }
    }
} 