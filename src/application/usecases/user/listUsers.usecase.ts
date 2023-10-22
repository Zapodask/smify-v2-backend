import { User } from "../../../domain/entities/user.entity"
import { IUserRepository } from "../../../domain/repositories/user.repository"

export class ListUsersUseCase {
  constructor(
    private readonly userRepository: IUserRepository
  ) {}

  public async execute(): Promise<User[]> {
    return await this.userRepository.listUsers()
  }
}