import { IUseCase } from "../../../shared/interface";
import { ListingCondDTO, ListingCreateDTO, ListingResponse } from "../model/dto";

export interface IListingUseCase extends IUseCase<ListingCreateDTO, ListingCondDTO, ListingResponse> {}

export const LISTING_MODEL = "listing" as const;