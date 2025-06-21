import { Router } from "express"
import { AuthHttpService } from "./infrastructure/transport/http-service"
import { AuthUseCase } from "./usecase"
import passport from "passport"

export const setupAuthModule = () => {
    const usecase = new AuthUseCase()
    const httpService = new AuthHttpService(usecase)

    const router = Router()

    // router.get("/google",
    //     passport.authenticate("google", {scope: ['profile', 'email']})
    // )
    // router.get("/github",
    //     passport.authenticate("github", {scope: ['profile', 'email'], prompt:'select_account'})
    // )
    // router.get("/callback/google",
    //     passport.authenticate('google', { failureRedirect: 'login', session: false}),
    //     httpService.LoginWithGoogle.bind(httpService)
    // )
    // router.get("/github",
    //     passport.authenticate("github", {scope: ['profile', 'email'], prompt:'select_account'}),
    //     httpService.LoginWithGithub.bind(httpService)
    // )
    // router.post("/login", httpService.Login.bind(httpService))
    // router.post("/register", httpService.Register.bind(httpService))
    // router.post("/logout", httpService.Logout.bind(httpService))

    /**
 * @openapi
 * /api/auth/google:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Đăng nhập với Google (chuyển hướng đến Google OAuth)
 */
router.get("/google", passport.authenticate("google", { scope: ['profile', 'email'] }));

/**
 * @openapi
 * /api/auth/github:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Đăng nhập với GitHub (chuyển hướng đến GitHub OAuth)
 */
router.get("/github", passport.authenticate("github", { scope: ['profile', 'email'], prompt: 'select_account' }));

/**
 * @openapi
 * /api/auth/callback/google:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Xử lý callback từ Google OAuth
 */
router.get("/callback/google",
  passport.authenticate('google', { failureRedirect: 'login', session: false }),
  httpService.LoginWithGoogle.bind(httpService)
);

/**
 * @openapi
 * /api/auth/github:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Xử lý callback từ GitHub OAuth
 */
router.get("/github",
  passport.authenticate("github", { scope: ['profile', 'email'], prompt: 'select_account' }),
  httpService.LoginWithGithub.bind(httpService)
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng nhập bằng email và mật khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post("/login", httpService.Login.bind(httpService));

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng ký tài khoản mới
 */
router.post("/register", httpService.Register.bind(httpService));

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng xuất
 */
router.post("/logout", httpService.Logout.bind(httpService));


    return router
}