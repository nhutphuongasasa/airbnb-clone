import { Request, Response, NextFunction } from "express";
import { AuthUseCase } from "../../usecase";
import { generateAccessToken, generateRefreshToken } from "../../../../shared/lib/genToken";

export class AuthHttpService{
    constructor(
        readonly authUseCase: AuthUseCase
    ){}

    async Login(req: Request, res: Response, next: NextFunction){
        try {
            const {email, password} = req.body
            const result = await this.authUseCase.Login(email, password)

            console.log(result)
            res.json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    Logout(req: Request, res: Response, next: NextFunction){
        try {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
            });
            res.clearCookie('accessToken', {
                httpOnly: true,
                secure: true,
            });
            console.log("User logged out successfully");
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            next(error)
        }
    }

    LoginWithGoogle(req: Request, res: Response, next: NextFunction){
        try {
            const user = req.user as any
            console.log(user)

            const accessToken = generateAccessToken(user)
    
            const refreshToken = generateRefreshToken(user)
    
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
    
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                maxAge: 15 * 60 * 1000
            })
    
            res.send(`
                <script>
                  window.opener.postMessage({ success: true, user: ${JSON.stringify(user)} }, "http://localhost:3000");
                  window.close();
                </script>
            `);
        } catch (error) {
            next(error)
        }
    }

    LoginWithGithub(req: Request, res: Response, next: NextFunction){
        try {
            
        } catch (error) {
            next(error)
        }
    }

    async Register(req: Request, res: Response, next: NextFunction){
        try {
            const { name, email, password } = req.body
            const result = this.authUseCase.Register(name, password, email)

            res.json(result)
        } catch (error) {
            next(error)
        }
    }
}