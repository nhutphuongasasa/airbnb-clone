import { NextResponse } from "next/server";
import prisma from "../../libs/prismadb";


interface IParams {
    listingId?: string,
    userId?: string,
    authorId?: string
}

export async function getReservations(params: IParams) {
    const { listingId, userId, authorId } = params

    const query: any = {}

    if (listingId){
        query.listingId = listingId
    }

    if (userId){
        query.userId = userId
    }

    if( authorId){
        query.authorId = { userId: authorId }//nguoi so huu
    }

    try {
        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
                listing: true
            },
            orderBy: {
                createAt: 'desc'
            }
        })
    
        const safeReservations = reservations.map(
            (reservation) => ({
                ...reservation,
                createAt: reservation.createAt.toISOString(),
                startDate: reservation.startDate.toISOString(),
                endAt: reservation.endDate.toISOString(),
                listing: {
                    ...reservation.listing,
                    createAt: reservation.createAt.toISOString(),
                }
            })
        )

        return safeReservations
    } catch (error) {
        throw new error()
    }
}