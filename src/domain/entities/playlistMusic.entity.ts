export class PlaylistMusic {
  private readonly id: number
  private playlist_id: number
  private music_id: number

  constructor(id: number, playlist_id: number, music_id: number) {
    this.id = id
    this.playlist_id = playlist_id
    this.music_id = music_id
  }
}
