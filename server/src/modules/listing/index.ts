import { Router } from "express"
import { ListingRepository } from "./infrastructure/repository"
import { ListingHttpService } from "./infrastructure/transport/http-service"
import { ListingUseCase } from "./usecase"

export const  setupListingModule = () => {
    const repository = new ListingRepository()
    const usecase = new ListingUseCase(repository)
    const httpService = new ListingHttpService(usecase)

    const router = Router()

    // router.get("/me", httpService.getListMe.bind(httpService))
    // router.get("/:id", httpService.getDetail.bind(httpService))
    // router.post("/", httpService.create.bind(httpService))
    // router.get("/", httpService.getList.bind(httpService))
    // router.delete("/:id", httpService.deleteListing.bind(httpService))

    /**
 * @openapi
 * /api/listing/me:
 *   get:
 *     tags:
 *       - Listings
 *     summary: Lấy danh sách listing của chính người dùng (current user)
 */
router.get("/me", httpService.getListMe.bind(httpService));

/**
 * @openapi
 * /api/listing/{id}:
 *   get:
 *     tags:
 *       - Listings
 *     summary: Lấy chi tiết một listing theo ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 */
router.get("/:id", httpService.getDetail.bind(httpService));

/**
 * @openapi
 * /api/listing:
 *   post:
 *     tags:
 *       - Listings
 *     summary: Tạo một listing mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 */
router.post("/", httpService.create.bind(httpService));

/**
 * @openapi
 * /api/listing:
 *   get:
 *     tags:
 *       - Listings
 *     summary: Lấy danh sách tất cả listing
 */
router.get("/", httpService.getList.bind(httpService));

/**
 * @openapi
 * /api/listing/{id}:
 *   delete:
 *     tags:
 *       - Listings
 *     summary: Xoá một listing theo ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 */
router.delete("/:id", httpService.deleteListing.bind(httpService));


    return router
}

export const listingUseCase = (): ListingUseCase => {
    const repository = new ListingRepository()
    return new ListingUseCase(repository)
}