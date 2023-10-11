import express, { Response } from "express"
import MusicsController from "../controllers/MusicsController"
import PlaylistsController from "../controllers/PlaylistsController"
import UsersController from "../controllers/UsersController"
import middleware from "./middleware"
import MusicsModel from "../models/MusicsModel"

const routes = express.Router()

const callController = async (res: Response, useCase: () => Promise<unknown>, errorStatus: number = 401) => {
  try {
    return await useCase()
  } catch (err) {
    return res.status(errorStatus).json({ message: err })
  }
}

routes.get("/users/session", middleware, async (_, res) => {
  try {
    return res.status(200).end()
  } catch (err) {
    return res.status(500).json({ message: err })
  }
})

routes.get("/users", async (req, res) => {
  callController(res, new UsersController(req, res).getUsersList)
})

routes.post("/musics/add", async (req, res) => {
  callController(res, async () => MusicsModel.addMusics(req.body))
})

routes.get("/users/playlists", async (req, res) => {
  callController(res, new UsersController(req, res).getUserPlaylists)
})

routes.post("/users/create", async (req, res) => {
  callController(res, new UsersController(req, res).createUser)
})

routes.post("/users/login", async (req, res) => {
  callController(res, new UsersController(req, res).loginUser)
})

routes.get("/users/favorite-musics", async (req, res) => {
  callController(res, new UsersController(req, res).getFavoriteMusics)
})

routes.get("/user/profile", middleware, async (req, res) => {
  callController(res, new UsersController(req, res).getUserProfile)
})

routes.get("/musics", async (req, res) => {
  callController(res, new MusicsController(req, res).getMusics)
})

routes.patch("/musics/like-or-desliked", async (req, res) => {
  callController(res, new MusicsController(req, res).likeOrDeslike)
})

routes.get("/musics/liked", async (req, res) => {
  callController(res, new MusicsController(req, res).getLikedMusics)
})

routes.get("/getMusicToId/:id", async (req, res) => {
  callController(res, new MusicsController(req, res).getMusicsToId)
})

routes.post("/musics/addmusictoplaylist", async (req, res) => {
  callController(res, new MusicsController(req, res).addMusicsToPlaylist)
})

routes.get("/playlists", async (req, res) => {
  callController(res, new PlaylistsController(req, res).getPlaylists)
})

routes.get("/playlist/:id", async (req, res) => {
  callController(res, new PlaylistsController(req, res).getPlaylists)
})

routes.post("/playlists/create", middleware, async (req, res) => {
  callController(res, new PlaylistsController(req, res).createPlaylists)
})

routes.patch("/playlists/updated", async (req, res) => {
  callController(res, new PlaylistsController(req, res).uptadePlaylistStatus)
})

routes.delete("/playlists/delete/:playlist_id", async (req, res) => {
  callController(res, new PlaylistsController(req, res).deletePlaylist)
})

routes.delete("/playlists/delete-music", async (req, res) => {
  callController(res, new PlaylistsController(req, res).deleteMusicToPlaylist)
})

routes.get("/playlists/musics/:playlist_id", async (req, res) => {
  callController(res, new PlaylistsController(req, res).getPlaylistsMusics)
})

export default routes
