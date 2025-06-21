import { Router } from "express"
import { listingUseCase } from "../listing/index"
import { userUseCase } from "../user/index"
import { ReservationRepository } from "./infrastructure/repository"
import { ReservationHttpService } from "./infrastructure/transport/http-service"
import { ReservationUseCase } from "./usecase"

export const setupReservationModule = () => {
    const repository = new ReservationRepository() 
    const usecase = new ReservationUseCase(listingUseCase(), userUseCase(), repository)
    const httpService = new ReservationHttpService(usecase)

    const router = Router()

    // router.get("/", httpService.getList.bind(httpService))
    // router.get("/:id", httpService.getDetail.bind(httpService))
    // router.post("/", httpService.create.bind(httpService))
    // router.delete("/:id", httpService.delete.bind(httpService))
    
    /**
 * @openapi
 * /api/reservation:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Lấy danh sách tất cả reservations
 */
router.get("/", httpService.getList.bind(httpService));

/**
 * @openapi
 * /api/reservation/{id}:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Lấy chi tiết một reservation
 */
router.get("/:id", httpService.getDetail.bind(httpService));

/**
 * @openapi
 * /api/reservation:
 *   post:
 *     tags:
 *       - Reservations
 *     summary: Tạo mới một reservation
 */
router.post("/", httpService.create.bind(httpService));

/**
 * @openapi
 * /api/reservation/{id}:
 *   delete:
 *     tags:
 *       - Reservations
 *     summary: Xoá reservation theo id
 */
router.delete("/:id", httpService.delete.bind(httpService));


    return router
}

export const reservationsUseCase = () => {
    const repository = new ReservationRepository() 
    const usecase = new ReservationUseCase(listingUseCase(), userUseCase(), repository)

    return usecase
}