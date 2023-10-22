import type { Request, Response } from 'express'

import { ListUsersUseCase } from '../../application/usecases/user/listUsers.usecase'
import { UserRepository } from '../../infrastructure/db/postgres/repositories/user.repository'
import { connection } from '../../infrastructure/db/postgres/connection'

export const listUsersController = async (_req: Request, res: Response) => {
  try {
    const userRepository = new UserRepository(connection)

    const users = await new ListUsersUseCase(userRepository).execute()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(422).json({ message: error })
  }
}