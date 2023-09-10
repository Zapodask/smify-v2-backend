import pg from 'pg';

import 'dotenv/config';

const connection = new pg.Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    ssl: {
        rejectUnauthorized: false
    }
})

console.log('connection databese', process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USER, process.env.DB_NAME, process.env.DB_PASS)

export function executeQuery<T>(query: string, values?: any){
    return new Promise((resolve, reject) => 
        connection.query(query, values, (err, results) => {
            if(err){
                reject(err)
            } else {
                resolve(results.rows as unknown as T)
            }
        })
    ) as Promise<T>;
}

export default connection