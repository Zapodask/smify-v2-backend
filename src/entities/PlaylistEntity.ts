export default interface PlaylistEntity {
    id: number;
    playlist_name: string;
}

export interface CreatePlaylistEntity {
    playlist_name: string;
    musicsIds: number[];
}