import { Request, Response } from "express"
import PlaylistsModel from "../models/PlaylistsModel"
import PlaylistEntity from "../entities/PlaylistEntity"
import jwt from "jsonwebtoken"
import RegisterPlaylistService from "../services/RegisterPlaylistService"

export default class PlaylistsController {
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
  getPlaylists = async () => {
    const response = await PlaylistsModel.getPlaylists()

    try {
      if (response) {
        this.res.status(200).json(response)
      } else {
        this.res.status(401).json({ message: "Erro ao procurar playlists" })
      }
    } catch (error) {
      this.res.status(422).json(error)
    }
  }

  getPlaylist = async () => {
    const { id } = this.req.params
    const response = await PlaylistsModel.getPlaylist(parseInt(id))

    try {
      if (response) {
        this.res.status(200).json(response)
      } else {
        this.res.status(401).json({ message: "Erro ao procurar playlist" })
      }
    } catch (error) {
      this.res.status(422).json(error)
    }
  }

  createPlaylists = async () => {
    try {
      const service = new RegisterPlaylistService(this.req.body, this.userId)

      const response = await service.createPlaylist()

      if (response) {
        this.res.status(200).json(`Playlist criada`)
      } else {
        this.res.status(401).json({ message: "Erro ao criar playlist" })
      }
    } catch (error) {
      this.res.status(422).json(error)
    }
  }

  getPlaylistsMusics = async () => {
    const { playlist_id } = this.req.params
    const response = await PlaylistsModel.getPlaylistsMusics(
      parseInt(playlist_id),
    )

    try {
      if (response) {
        this.res.status(200).json(response)
      } else {
        this.res.status(401).json({ message: "Erro ao buscar músicas" })
      }
    } catch (error) {
      this.res.status(422).json(error)
    }
  }

  uptadePlaylistStatus = async () => {
    const { playlist_name, id }: PlaylistEntity = this.req.body

    const response = await PlaylistsModel.updatedPlaylistStatus(
      playlist_name,
      id,
    )

    try {
      if (response) {
        this.res.status(200).json("Playlist alterada com sucesso")
      } else {
        this.res
          .status(401)
          .json({ message: "Erro ao alterar os dados das playlists" })
      }
    } catch (error) {
      this.res.status(422).json(error)
    }
  }

  deletePlaylist = async () => {
    const { playlist_id } = this.req.params
    const response = await PlaylistsModel.deletePlaylist(parseInt(playlist_id))

    try {
      if (response) {
        this.res.status(200).json(`Playlist deletada`)
      } else {
        this.res.status(401).json({ message: "Erro ao deletar playlist" })
      }
    } catch (error) {
      this.res.status(422).json(error)
    }
  }

  deleteMusicToPlaylist = async () => {
    const { playlist_id, music_id } = this.req.query
    const response = await PlaylistsModel.deleteMusicToPlaylist(
      parseInt(playlist_id as string),
      parseInt(music_id as string),
    )

    try {
      if (response) {
        this.res.status(200).json({ message: "Musica deletada" })
      } else {
        this.res.status(401).json({ message: "Erro ao deletar musica" })
      }
    } catch (error) {
      this.res.status(422).json(error)
    }
  }
}
