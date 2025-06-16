import {z} from "zod"

export const ReservationCreateDTOSchema = z.object({
    userId: z.string().uuid(),
    listingId: z.string().uuid(),
    startDate: z.date(),
    endDate: z.date(),
    totalPrice: z.number()
})

export type ReservationCreateDTO = z.infer<typeof ReservationCreateDTOSchema>

export const ReservationResponseSchema = z.object({
    id: z.string(),
    listingId: z.string().uuid(),
    startDate: z.date(),
    endDate: z.date(),
    totalPrice: z.number(),
    createAt: z.date()
})

export type ReservationResponse = z.infer<typeof ReservationResponseSchema>

export const ReservationCondDTOSchema = z.object({
    listingId: z.string().uuid(),
    startDate: z.date(),
    endDate: z.date(),
    totalPrice: z.number(),
})

export type ReservationCondDTO = z.infer<typeof ReservationCondDTOSchema>




