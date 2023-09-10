import mysql from 'mysql2'
import 'dotenv/config';

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
})


export function executeQuery<T>(query: string, values?: any){
    return new Promise((resolve, reject) => 
        connection.query(query, values, (err, results) => {
            if(err){
                reject(err)
            } else {
                resolve(results as unknown as T)
            }
        })
    ) as Promise<T>;
}

export default connection