import 'dotenv/config'
import pkg from 'pg';


const DBconfig = {
    host        :   process.env.DB_HOST     ??  '',
    database    :   process.env.DB_DATABASE ??  '',
    user        :   process.env.DB_USER        ??  '',
    password    :   process.env.DB_PASSWORD    ??  '',
    port        :   process.env.DB_PORT     ??  '',
}

export default DBconfig;