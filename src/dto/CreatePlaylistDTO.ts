class CreatePlaylistDTO {
  playlist_name: string
  user_id: number
  constructor(data: CreatePlaylistDTO) {
    this.playlist_name = data.playlist_name
    this.user_id = data.user_id
  }
}
export default CreatePlaylistDTO
