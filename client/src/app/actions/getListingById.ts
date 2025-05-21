import prisma from '../../libs/prismadb'

export interface IParam {
  listingId?: string
}

export default async function getListingById(
  param: IParam
) {
  try {
    const { listingId } = await param

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId
      },
      include: {
        user: true
      }
    })

    if (!listing){
      return null
    }

    return {
      ...listing,
      createAt: listing.createAt.toISOString(),
      user: {
        ...listing.user,
        createdAt: listing.user.createdAt?.toISOString(),
        updatedAt: listing.user.updatedAt?.toISOString(),
        emailVerified: listing.user.emailVerified?.toISOString() || null
      }
    }
  } catch (error: any) {
    throw new Error(error)
  }
}