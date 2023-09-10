import { Request, Response } from "express"
import MusicsModel from "../models/MusicsModel"
import jwt from 'jsonwebtoken';



export default class MusicsController {
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


    getMusics = async () => {
        try {
            const search = this.req.query

            const response = await MusicsModel.getMusics({
                search: search.search as string,
                limit: parseInt(search.limit as string),
                offset: parseInt(search.offset as string)
            })

            return this.res.status(200).json(response)

        } catch (error) {
            return this.res.status(422).json(error)
        }
    }

    getMusicsToId = async () => {
        try {
            const { id } = this.req.params;
            const response = await MusicsModel.getMusicToId(parseInt(id))

            return this.res.status(200).json(response)

        } catch (error) {
            return this.res.status(422).json(error)
        }
    }

    addMusicsToPlaylist = async () => {
        try{
            const {musics_ids, playlist_id} = this.req.body;
            const response = await MusicsModel.addMusicToPlaylist(musics_ids, playlist_id)

            return this.res.status(200).json(response)
        } catch(error) {
            return this.res.status(422).json(error)
        }
    }

    likeOrDeslike = async () => {
        try {
            const {music_id} = this.req.body;
            const response = await MusicsModel.likeOrDeslike(this.userId, music_id)

            return this.res.status(200).json(response)
        } catch (error) {
            return this.res.status(422).json(error)
        } 
    }
}