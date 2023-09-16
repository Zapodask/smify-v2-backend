import PlaylistEntity, { CreatePlaylistEntity } from "../entities/PlaylistEntity";
import { executeQuery } from "../models/connection";



export default class RegisterPlaylistService {
    constructor(
        protected readonly playlistProfile: CreatePlaylistEntity,
        protected readonly user_id: number
    ) { }

    protected async checkPlaylistName() {
        const checkPlaylist = await executeQuery("SELECT * FROM playlists WHERE playlist_name = $1", [this.playlistProfile.playlist_name]) as PlaylistEntity[]

        if (checkPlaylist.length > 0) {
            this.playlistProfile.playlist_name = `${this.playlistProfile.playlist_name} - ${checkPlaylist.length}`
        }

        return this.playlistProfile.playlist_name
    }

    protected async createMusicPlaylist(playlistId: number) {
        const createMusicPlaylist = "INSERT INTO music_playlist(playlist_id, music_id) VALUES($1, $2)"
        this.playlistProfile.musicsIds.map(async (musicId: number) => {
            const values = [playlistId, musicId]
            await executeQuery(createMusicPlaylist, values)
        })
    }

    public async findPlaylistId() {
        const playlistId = await executeQuery("SELECT id FROM playlists WHERE playlist_name = $1", [this.playlistProfile.playlist_name]) as PlaylistEntity[]

        return playlistId[0].id
    }

    public async createPlaylist() {
        const checkPlaylistName = await this.checkPlaylistName()

        if (checkPlaylistName) {
            await executeQuery("INSERT INTO playlists(playlist_name) VALUES($1)", [checkPlaylistName])
        }

        const playlistId = await this.findPlaylistId()
        await this.createMusicPlaylist(playlistId)

        const createUserPlaylist = "INSERT INTO user_playlists(user_id, playlist_id) VALUES($1, $2)"
        const response = await executeQuery(createUserPlaylist, [this.user_id, playlistId])

        return response
    }

}