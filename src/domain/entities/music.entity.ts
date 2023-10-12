export class Music {
  private readonly id: number
  private name: string
  private singer: string
  private playlist_id: number
  private logo?: string

  constructor(
    id: number,
    name: string,
    singer: string,
    playlist_id: number,
    logo?: string
  ) {
    this.id = id
    this.name = name
    this.singer = singer
    this.playlist_id = playlist_id
    this.logo = logo
  }
}
