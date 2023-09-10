import express from "express"
import MusicsController from "../controllers/MusicsController"
import PlaylistsController from "../controllers/PlaylistsController"
import UsersController from "../controllers/UsersController"
import middleware from "./middleware"


const routes = express.Router()

routes.get('/users/session', middleware, async (_, res) => {
    try {
        return res.status(200).end()

    } catch(err) {
        return res.status(500).json({ message: err })
    }
})

routes.get('/users', async (req, res) => {
    try {
        return await new UsersController(req, res).getUsersList()
    } catch {
        return res.status(401).json({ message: 'error' })
    }
})

routes.get('/users/playlists', async (req, res) => {
    try{
        return await new UsersController(req, res).getUserPlaylists()
    } catch(err) {
        return res.status(500).json({ message: err })
    }
})

routes.post('/users/create', async (req, res) => {
    try {
        return await new UsersController(req, res).createUser()
    } catch {
        return res.status(401).json({ message: 'error' })
    }
})

routes.post('/users/login', async (req, res) => {
    try {
        return await new UsersController(req, res).loginUser()
    } catch {
        return res.status(401).json({ message: 'error' })
    }
})

routes.get('/users/favorite-musics', async (req, res) => {
    try {
        return await new UsersController(req, res).getFavoriteMusics()
    } catch {
        return res.status(401).json({ message: 'error' })
    }
})


routes.get('/user/profile', middleware, async (req, res) => {
    try {
        return await new UsersController(req, res).getUserProfile()
    } catch {
        return res.status(401).json({ message: 'error' })
    }
})

routes.get('/musics', async (req, res) => {
    try {
        return await new MusicsController(req, res).getMusics()
    } catch {
        return res.status(401).json({ message: 'error' })
    }
})

routes.patch('/musics/like-or-desliked', async (req, res) => {
    try {
        return await new MusicsController(req, res).likeOrDeslike()
    } catch {
        return res.status(401).json({message: 'error'})
    }
})

routes.get('/getMusicToId/:id', async (req, res) => {
    try {
        return await new MusicsController(req, res).getMusicsToId()
    } catch {
        return res.status(401).json({ message: 'error' })
    }
})

routes.post('/musics/addmusictoplaylist', async (req, res) => {
    try {
        return await new MusicsController(req, res).addMusicsToPlaylist()
    } catch {
        return res.status(401).json({ message: 'error' })
    }
})

routes.get('/playlists', async (req, res) => {
    try {
        return await new PlaylistsController(req, res).getPlaylists()
    } catch {
        return res.status(401).json({ message: 'Ocorreu um erro' })
    }
})

routes.post('/playlists/create', middleware, async (req, res) => {
    try {
        return await new PlaylistsController(req, res).createPlaylists()
    } catch {
        return res.status(401).json({ message: 'Ocorreu um erro' })
    }
})

routes.patch('/playlists/updated', async (req, res) => {
    try {
        return await new PlaylistsController(req, res).uptadePlaylistStatus()
    } catch {
        return res.status(401).json({ message: 'Ocorreu um erro' })
    }
})

routes.delete('/playlists/delete/:playlist_id', async (req, res) => {
    try {
        return await new PlaylistsController(req, res).deletePlaylist()
    } catch {
        return res.status(401).json({ message: 'Ocorreu um erro' })
    }
})

routes.delete('/playlists/delete-music', async (req, res) => {
    try {
        return await new PlaylistsController(req, res).deleteMusicToPlaylist()
    } catch {
        return res.status(401).json({ message: 'Ocorreu um erro' })
    }
})

routes.get('/playlists/musics/:playlist_id', async (req, res) => {
    try {
        return await new PlaylistsController(req, res).getPlaylistsMusics()
    } catch (error) {
        return res.status(500).json({ message: error })
    }
})

export default routes
