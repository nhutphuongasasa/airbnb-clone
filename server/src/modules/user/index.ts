import { Router } from "express"
import { UserRepository } from "./infrastructure/repository"
import { UserHttpService } from "./infrastructure/transport/http-service"
import { UserUseCase } from "./usecase"


export const setupUserModule = () => {
    const repository = new UserRepository()
    const usecase = new UserUseCase(repository)
    const httpService = new UserHttpService(usecase)

    const router = Router()
    router.get("/profile", httpService.getDetail.bind(httpService))
    router.post("/", httpService.create.bind(httpService))

    return router
}

export const userUseCase = (): UserUseCase => {
    const userRepository = new UserRepository()
    return new UserUseCase(userRepository)
}