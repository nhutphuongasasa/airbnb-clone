import { BaseHttpService } from "../../../../shared/transport/http-server";
import { IReservationUseCase } from "../../interface";
import { ReservationCondDTO, ReservationCreateDTO, ReservationResponse } from "../../model/dto";

export class ReservationHttpService extends BaseHttpService<ReservationCreateDTO, ReservationCondDTO, ReservationResponse>{
    constructor(
        readonly usecase: IReservationUseCase
    ){
        super(usecase)
    }
}