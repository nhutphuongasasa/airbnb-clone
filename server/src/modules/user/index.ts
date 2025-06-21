import { Router } from "express"
import { UserRepository } from "./infrastructure/repository"
import { UserHttpService } from "./infrastructure/transport/http-service"
import { UserUseCase } from "./usecase"
import { listingUseCase } from "../listing/index"


export const setupUserModule = () => {
    const repository = new UserRepository()
    const usecase = new UserUseCase(repository, listingUseCase())
    const httpService = new UserHttpService(usecase)

    const router = Router()
    // router.get("/profile", httpService.getDetail.bind(httpService))
    // router.post("/", httpService.create.bind(httpService))
    // router.post("/favorites/:id", httpService.addFavoriteListing.bind(httpService))
    // router.delete("/favorites/:id", httpService.removeDavoriteListing.bind(httpService))
    // router.get("/favorites", httpService.getFavoriteListing.bind(httpService))

    /**
   * @openapi
   * /api/user/profile:
   *   get:
   *     tags:
   *       - Users
   *     summary: Get user profile
   */
  router.get("/profile", httpService.getDetail.bind(httpService));

  /**
   * @openapi
   * /api/user:
   *   post:
   *     tags:
   *       - Users
   *     summary: Create a new user
   */
  router.post("/", httpService.create.bind(httpService));

  /**
   * @openapi
   * /api/user/favorites/{id}:
   *   post:
   *     tags:
   *       - Users
   *     summary: Add listing to favorites
   */
  router.post("/favorites/:id", httpService.addFavoriteListing.bind(httpService));

  /**
   * @openapi
   * /api/user/favorites/{id}:
   *   delete:
   *     tags:
   *       - Users
   *     summary: Remove listing from favorites
   */
  router.delete("/favorites/:id", httpService.removeDavoriteListing.bind(httpService));

  /**
   * @openapi
   * /api/user/favorites:
   *   get:
   *     tags:
   *       - Users
   *     summary: Get all favorite listings
   */
  router.get("/favorites", httpService.getFavoriteListing.bind(httpService));


    return router
}

export const userUseCase = (): UserUseCase => {
    const repository = new UserRepository()

    return new UserUseCase(repository, listingUseCase())
}