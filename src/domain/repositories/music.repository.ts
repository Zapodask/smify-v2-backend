import { Music } from "../entities/music.entity"
import { ICreateMusicModel } from "../models/createMusic.model"
import { IPaginationModel } from "../models/pagination.model"

export interface IMusicRepository {
  listMusics: (search: string, pagination: IPaginationModel) => Promise<Array<Music>>
  getMusicById: (id: number) => Promise<Music>
  createMusic: (music: ICreateMusicModel) => Promise<Music>
}
