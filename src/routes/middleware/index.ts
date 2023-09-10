import { NextFunction, Request, Response } from "express";



export default async function middleware(req: Request, res: Response, next: NextFunction) {
    const token = await req.signedCookies.token;

    if(!token) {
        return res.status(401).json({ message: 'error: não autorizado' })
    }


    next()
}