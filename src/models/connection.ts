import mysql from 'mysql2'
import 'dotenv/config';

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'musicplayerdb',
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