import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import AddlikeOrDeslikeService from "../services/LikeOrDeslikeService"
import { MusicRepository } from "../repositories/music.repository"

export default class MusicsController {
  private userId!: number
  constructor(
    private readonly req: Request,
    private readonly res: Response,
  ) {
    if (this.req.signedCookies.token) {
      const token = jwt.verify(
        this.req.signedCookies.token,
        process.env.SECRET as string,
      ) as { id: number }
      this.userId = parseInt(token.id.toString())
    }
  }

  getMusics = async () => {
    try {
      console.log("entrou no controler getMusics")
      const search = this.req.query

      const response = await MusicRepository.getMusics({
        search: search.search as string,
        limit: parseInt((search.limit as string) || "20"),
        offset: parseInt((search.offset as string) || "0"),
      })

      console.log("musics", response)

      return this.res.status(200).json(response)
    } catch (error) {
      return this.res.status(422).json(error)
    }
  }

  getMusicsToId = async () => {
    try {
      const { id } = this.req.params
      const response = await MusicRepository.getMusicToId(parseInt(id))

      return this.res.status(200).json(response)
    } catch (error) {
      return this.res.status(422).json(error)
    }
  }

  addMusicsToPlaylist = async () => {
    try {
      const { musics_ids, playlist_id } = this.req.body
      const response = await MusicRepository.addMusicToPlaylist(
        musics_ids,
        playlist_id,
      )

      return this.res.status(200).json(response)
    } catch (error) {
      return this.res.status(422).json(error)
    }
  }

  likeOrDeslike = async () => {
    try {
      const { music_id } = this.req.body

      const service = new AddlikeOrDeslikeService(this.userId, music_id)
      const response = await service.addlikeOrDeslike()

      return this.res.status(200).json(response)
    } catch (error) {
      return this.res.status(422).json(error)
    }
  }

  getLikedMusics = async () => {
    try {
      const response = await MusicRepository.getLikedMusics(this.userId)

      return this.res.status(200).json(response)
    } catch (error) {
      return this.res.status(422).json(error)
    }
  }
}
