import { IUseCase } from "../../../shared/interface";
import { UserCondDTO, UserCreateDTO, UserResponse } from "../model/dto";
import { User } from "../model/model";

export interface IUserUseCase extends IUseCase<UserCreateDTO, UserCondDTO, UserResponse> {
    getByEmail(email: string): Promise<any>
}

export const USER_MODEL = "user" as const;


