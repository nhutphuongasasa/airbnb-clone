import { IRepository } from "../../../shared/interface";
import { IListingUseCase } from "../interface";
import { ListingCondDTO, ListingCreateDTO, ListingCreateSchema, ListingResponse, ListingResponseSchema, ListingUserSchema } from "../model/dto";
import { Listing, ListingSchema } from "../model/model";
import { userUseCase } from "../../user/index"
import { AppError } from "../../../shared/model/error";

export class ListingUseCase implements IListingUseCase{
    constructor(
        private readonly repository: IRepository<Listing, ListingCondDTO>,
    ){}

    async create(data: ListingCreateDTO): Promise<ListingResponse> {

        const listing = ListingCreateSchema.parse(data);

        const userExisting = await userUseCase().getDetail(listing.userId);

        if(!userExisting){
            throw new AppError(404, "User does not exist")
        }

        const { location, ...rest } = listing

        const newListing: Listing = {
            ...rest,
            locationValue: data.location.value,
            createAt: new Date(),
        }

        const listingCreated = await this.repository.Create(newListing)

        const Host = {
            ...userExisting,
            id: listing.userId
        }

        if (!listingCreated) {
            throw new Error("Failed to create listing");
        }

        const listingResponse: ListingResponse = ListingResponseSchema.parse(listingCreated);
        console.log(Host)
        listingResponse.user = ListingUserSchema.parse(Host);

        return listingResponse;
    }

    async getDetail(id: string): Promise<ListingResponse | null> {
        const listing = await this.repository.GetById(id)

        const listingResponse: ListingResponse = ListingResponseSchema.parse(listing);

        listingResponse.user = ListingUserSchema.parse(await userUseCase().getDetail(listingResponse.userId))

        return listingResponse;
    }

    async getList(cond: ListingCondDTO): Promise<ListingResponse[] | null> {
        console.log("okeekekeke")
        const query: any = Object.entries(cond).reduce((acc: Record<string, any>, [Key, Value]) => {
            if(Value){
                if(["roomCount", "bathroomCount", "guestCount"].includes(Key)){
                    acc[Key] = {
                        gte: +Value
                    }
                }
                else if( ["startDate", "endDate"].includes(Key)){
                    acc.NOT = {
                        reservation: {
                            some: {
                                OR: [
                                    {
                                        endDate: { gte: cond.startDate },
                                        startDate: { lte: cond.startDate }
                                    },
                                    {
                                        startDate: { lte: cond.endDate },
                                        endDate: { gte: cond.endDate }
                                    }
                                ]
                            }
                        }
                    }
                }
                else{
                    acc[Key] = Value;
                }
            }
            return acc;
        },{})

        const listings = await this.repository.FindListByCond(query);

        const listingResponses: ListingResponse[] = await Promise.all(
            listings.map(async listing => {

                const listingResponse: ListingResponse = ListingResponseSchema.parse(listing)
                const user = await userUseCase().getDetail(listingResponse.userId)

                const tmp = {
                    ...user,
                    id: listingResponse.userId,
                }
                console.log(tmp)
                listingResponse.user = ListingUserSchema.parse(tmp)
                return listingResponse
            })
        )

        return listingResponses;

    }
}