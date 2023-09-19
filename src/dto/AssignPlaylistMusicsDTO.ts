class AssignPlaylistMusicsDTO {
  music_ids: number[]
  playlist_id: number
  constructor(data: AssignPlaylistMusicsDTO) {
    this.music_ids = data.music_ids
    this.playlist_id = data.playlist_id
  }
}
export default AssignPlaylistMusicsDTO
