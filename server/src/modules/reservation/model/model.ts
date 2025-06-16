import {z} from 'zod'

export const ReservationSchema = z.object({
    id: z.string().optional(),
    userId: z.string({ required_error: "userId is required"}).uuid(),
    listingId: z.string({ required_error: "listingId is required"}).uuid(),
    startDate: z.string({ required_error: "startDate is required"}).date(),
    endDate: z.string({ required_error: "endDate is required"}).date(),
    totalPrice: z.number({ required_error: "totalPrice is required"}),
    createAt: z.date().optional()
})

export type Reservation =  z.infer<typeof ReservationSchema>