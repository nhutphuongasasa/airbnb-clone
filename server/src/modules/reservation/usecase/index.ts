import { IRepository, IUseCase } from "../../../shared/interface";
import { AppError } from "../../../shared/model/error";
import { IListingUseCase } from "../../listing/interface";
import { IUserUseCase } from "../../user/interface";
import { IReservationUseCase } from "../interface";
import { ReservationCondDTO, ReservationCreateDTO, ReservationResponse, ReservationResponseSchema } from "../model/dto";
import { Reservation, ReservationSchema } from "../model/model";


export class ReservationUseCase implements IReservationUseCase{
    constructor(
        private readonly listingUseCase: IListingUseCase,
        private readonly userUseCase: IUserUseCase,
        private readonly repository: IRepository<Reservation, ReservationCondDTO>
    ){}

    async create(data: ReservationCreateDTO): Promise<ReservationResponse> {
        const reservation: Reservation = ReservationSchema.parse(data)

        const userExisting = await this.userUseCase.getDetail(reservation.userId)

        if(!userExisting){
            throw new AppError(404, "User not found")
        }

        const listingExisting = await this.listingUseCase.getDetail(reservation.listingId)

        if(!listingExisting){
            throw new AppError(404, "Listing not found")
        }

        const newReservation = await this.repository.Create(reservation)

        return ReservationResponseSchema.parse(newReservation)
    }

    async getList(cond: ReservationCondDTO): Promise<ReservationResponse[] | null> {
        let query: any = Object.entries(cond).reduce((acc: Record<string, any>, [Key, Value]) => {
            if(Value){
                if(['startDate', 'endDate'].includes(Key)){
                    acc = {
                        some: {
                            startDate: { gte: cond.startDate },
                            endDate: { lte: cond.endDate }
                        }
                    }
                }
                else{
                    acc[Key] = cond.listingId
                }
            }
            return acc
        },{})

        const reservations = await this.repository.FindListByCond(query)

        return await Promise.all(
            reservations.map(async (reservation) => {
                const reservationResponse: ReservationResponse = ReservationResponseSchema.parse(reservation)
                return reservationResponse
            })
        )
    }

    async getDetail(id: string): Promise<ReservationResponse> {
        const reservation: Reservation | null = await this.repository.GetById(id)

        if(!reservation){
            throw new AppError(404, "Reservation not found")
        }

        return ReservationResponseSchema.parse(reservation)
    }
}