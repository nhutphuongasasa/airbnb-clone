import { NextFunction } from "express";
import { BaseHttpService } from "../../../../shared/transport/http-server";
import { IUserUseCase } from "../../interface";
import { UserCondDTO, UserCreateDTO, UserResponse } from "../../model/dto";

export class UserHttpService extends BaseHttpService<UserCreateDTO, UserCondDTO, UserResponse>{
    constructor(
        readonly usecase: IUserUseCase
    ){
        super(usecase);
    }

    async getDetail(req: any, res: any, next: NextFunction): Promise<void> {
        try {
            const userId = req.body.id;
            const user = await this.usecase.getDetail(userId);
            res.status(200).json({ data: user });
        } catch (error) {
            next(error)
            // res.status(500).json({
            //     message: (error as Error).message,
            // });
        }
    }
}