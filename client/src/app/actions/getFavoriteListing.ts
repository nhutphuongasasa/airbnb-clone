import getCurrentUser from "./getCurrentUser";
import prisma from '../../libs/prismadb'

export async function getFavoriteListings() {
    try {
        const currentUser = await getCurrentUser()

        if (!currentUser){
            return []
        }

        const favorites = await prisma.listing.findMany({
            where: {
                id: {
                    in: [...currentUser.favoriteIds || []]
                }
            }
        })

        const safeFavorites = favorites.map((favorite) => ({
            ...favorite,
            createAt: favorite.createAt.toISOString(),
        }))

        return safeFavorites

    } catch (error) {
        throw new Error(error)
    }
}