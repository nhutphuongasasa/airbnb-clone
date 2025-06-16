import { BaseHttpService } from "../../../../shared/transport/http-server";
import { IListingUseCase } from "../../interface";
import { ListingCondDTO, ListingCreateDTO, ListingResponse } from "../../model/dto";

export class ListingHttpService extends BaseHttpService<ListingCreateDTO, ListingCondDTO, ListingResponse>{
    constructor(
        readonly usecase: IListingUseCase
    ){
        super(usecase);
    }
}