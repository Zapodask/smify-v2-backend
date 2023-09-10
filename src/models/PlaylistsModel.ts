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

        const checkPlaylist = await executeQuery("SELECT * FROM playlists WHERE playlist_name = $1", [playlistProfile.playlist_name]) as PlaylistEntity[]

        if(checkPlaylist.length > 0) {
            playlistProfile.playlist_name = `${playlistProfile.playlist_name} - ${checkPlaylist.length}`
        }
    
        await executeQuery("INSERT INTO playlists(playlist_name) VALUES($1)", [playlistProfile.playlist_name])

        const playlistId = await executeQuery("SELECT id FROM playlists WHERE playlist_name = $1", [playlistProfile.playlist_name]) as PlaylistEntity[]
        
        const createMusicPlaylist = "INSERT INTO music_playlist(playlist_id, music_id) VALUES($1, $2)"

        playlistProfile.musicsIds.map(async (musicId: number) => {
            const values = [playlistId[0].id, musicId]
            await executeQuery(createMusicPlaylist, values)
        })

        const createUserPlaylist = "INSERT INTO user_playlists(user_id, playlist_id) VALUES($1, $2)"
        await executeQuery(createUserPlaylist, [user_id, playlistId[0].id])

        return 'Playlist criada'
    }

    static async getPlaylistsMusics(playlist_id: number) {
        const query = "SELECT m.* FROM music_playlist as mp INNER JOIN musics as m ON m.id = mp.music_id WHERE mp.playlist_id = $1"
        
        const values = [playlist_id]
        const response = await executeQuery(query, values)

        return response as MusicEntity[]
    }

    static async updatedPlaylistStatus(playlist_name: string, id: number){
        const query = "UPDATE playlists SET playlist_name = $1 WHERE id = $2"

        const values = [playlist_name, id]
        const response = await executeQuery(query, values)

        return response
    }

    static async deletePlaylist(playlist_id: number) {
        const values = [playlist_id]

        const deleteFromMusicPlaylist = await executeQuery("DELETE FROM music_playlist WHERE playlist_id = $1", values)
        const deleteFromPlaylists = await executeQuery("DELETE FROM playlists WHERE id = $1", values)

        return {
            deleteFromMusicPlaylist,
            deleteFromPlaylists
        }
    }

    static async deleteMusicToPlaylist(playlist_id: number, music_id: number) {

        const query = "DELETE FROM music_playlist WHERE playlist_id = $1 AND music_id = $2"
        const values = [playlist_id, music_id]
        const response = await executeQuery(query, values)

        return response
    }
}