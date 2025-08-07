import DBconfig from "../configs/dbConfig.js";
import pkg from 'pg'

const { Client } = pkg;


const UserRepository = {
    
    async findByUsername(username) {
        const client = new Client(DBconfig)
        try {
            await client.connect()
            const result = await client.query("SELECT * FROM users WHERE username = $1", [username]);
            console.log("ddd", result.rows.length)
            return result.rows[0];

        } catch (error) {
            console.log("Error en findUsername:", error);
        }
    },

    async create({ first_name, last_name, username, password }) {
        const client = new Client(DBconfig)
        try {
            await client.connect()
            await client.query(
                "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)",
                [first_name, last_name, username, password]
            );
            await client.end();
        } catch (error) {
            console,log("error enr egister")
            await client.end();
        }


    }
};

export default UserRepository; 