import { Music } from "./music.entity"
import { Playlist } from "./playlist.entity"

export class User {
  private readonly id: number
  private name: string
  private email: string
  private password: string
  private icon_name?: string
  private playlists: Playlist[]
  private favorite_musics: Music[]

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    playlists: Playlist[],
    favorite_musics: Music[]
  ) {
    this.id = id
    this.name = name
    this.email = email
    this.password = password
    this.playlists = playlists
    this.favorite_musics = favorite_musics
  }

  public getId(): number {
    return this.id
  }

  public getName(): string {
    return this.name
  }

  public getEmail(): string {
    return this.email
  }

  public getPassword(): string {
    return this.password
  }

  public getIconName(): string | undefined {
    return this.icon_name
  }

  public getPlaylists(): Playlist[] {
    return this.playlists
  }

  public getFavoriteMusics(): Music[] {
    return this.favorite_musics
  }
}