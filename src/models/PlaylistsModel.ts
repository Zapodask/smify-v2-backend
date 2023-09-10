import MusicEntity from "../entities/MusicEntity";
import PlaylistEntity, { CreatePlaylistEntity } from "../entities/PlaylistEntity";
import { executeQuery } from "./connection";



export default class PlaylistsModel {
    static async getPlaylists() {
        const query = "SELECT * FROM playlists"
        const response = await executeQuery(query)

        return response as PlaylistEntity[]
    }

    
    static async createPlaylist(playlistProfile: CreatePlaylistEntity, user_id: number) {
        const createPlaylistName = "INSERT INTO playlists(playlist_name) VALUES(?)"

        const values = [playlistProfile.playlist_name]
        const query = await executeQuery(createPlaylistName, values)

        // @ts-ignore
        const playlistId = query.insertId

        
        const createMusicPlaylist = "INSERT INTO music_playlist(playlist_id, music_id) VALUES(?, ?)"

        playlistProfile.musicsIds.map(async (musicId: number) => {
            const values = [playlistId, musicId]
            await executeQuery(createMusicPlaylist, values)
        })

        const createUserPlaylist = "INSERT INTO user_playlists(user_id, playlist_id) VALUES(?, ?)"
        await executeQuery(createUserPlaylist, [user_id, playlistId])

        return query
    }

    static async getPlaylistsMusics(playlist_id: number) {
        const query = "SELECT m.* FROM music_playlist as mp INNER JOIN musics as m ON m.id = mp.music_id WHERE mp.playlist_id = ?"
        
        const values = [playlist_id]
        const response = await executeQuery(query, values)

        return response as MusicEntity[]
    }

    static async updatedPlaylistStatus(playlist_name: string, id: number){
        const query = "UPDATE playlists SET playlist_name = ? WHERE id = ?"

        const values = [playlist_name, id]
        const response = await executeQuery(query, values)

        return response
    }

    static async deletePlaylist(playlist_id: number) {
        const values = [playlist_id]

        const deleteFromMusicPlaylist = await executeQuery("DELETE FROM music_playlist WHERE playlist_id = ?", values)
        const deleteFromPlaylists = await executeQuery("DELETE FROM playlists WHERE id = ?", values)

        return {
            deleteFromMusicPlaylist,
            deleteFromPlaylists
        }
    }

    static async deleteMusicToPlaylist(playlist_id: number, music_id: number) {

        const query = "DELETE FROM music_playlist WHERE playlist_id = ? AND music_id = ?"
        const values = [playlist_id, music_id]
        const response = await executeQuery(query, values)

        return response
    }
}