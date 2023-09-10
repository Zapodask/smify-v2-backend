import bcryptjs from 'bcryptjs';
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import UsersModel from "../models/usersModel";
import Utils from '../utils';


export default class UsersController {
    private userId!: number;
    constructor(
        private readonly req: Request,
        private readonly res: Response
    ) {
        if (this.req.signedCookies.token) {
            const token = jwt.verify(this.req.signedCookies.token, process.env.SECRET as string) as { id: number }
            this.userId = parseInt(token.id.toString())
        }
    }

    getUsersList = async () => {
        const response = await UsersModel.listUsers()

        this.res.status(200).json(response)
    }

    getUserPlaylists = async () => {
        const response = await UsersModel.getUserPlaylists(this.userId)

        try {
            if (response) {
                this.res.status(200).json(response)
            }

            else {
                this.res.status(401).json({ message: 'Erro ao procurar playlists' })
            }
        } catch (error) {
            this.res.status(422).json(error)
        }
    }

    getUserProfile = async () => {
        try {
            const response = await UsersModel.getUserProfile(this.userId)

            return this.res.status(200).json(response)
        } catch(error) {
            return this.res.status(422).json({ message: error })
        }
        
    }

    createUser = async () => {
        try {
            if (Utils.validadeEmail(this.req.body.email) === false) throw new Error('Email inválido')

            const response = await UsersModel.createUsers(this.req.body)

            if (!response) throw new Error('Email já existente')

            return this.res.status(200).json({ message: 'Usuario criado com sucesso' })


        } catch (error) {
            return this.res.status(422).json({ message: error })
        }
    }

    loginUser = async () => {
        try {
            const response = await UsersModel.LoginUsers(this.req.body)

            const comparePassword = bcryptjs.compareSync(this.req.body.password, response[0].password)

            if (!comparePassword) throw new Error()

            const jwtToken = jwt.sign({ id: response[0].id }, process.env.SECRET as string, {
                expiresIn: '1d',

            })

            return this.res.cookie('token', jwtToken, {
                httpOnly: true,
                signed: true,
                sameSite: 'none',
                secure: true
            }).send()

        } catch {
            return this.res.status(422).json({ message: 'Email ou senha incorretos' })
        }

    }

    getFavoriteMusics = async () => {
        try{
            const response = await UsersModel.getFavoriteMusics(this.userId)

            return this.res.status(200).json(response)
        }

        catch(error) {
            return this.res.status(422).json({ message: error })
        }
    }
}