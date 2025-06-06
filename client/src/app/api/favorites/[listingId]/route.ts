import { NextResponse } from "next/server"
import getCurrentUser from "../../../actions/getCurrentUser"
import prisma from "../../../../libs/prismadb";

interface IParams {
  listingId?: string
}

export async function POST(
  request: Request,
  { params }: {params: IParams}
) {
  const currentUser = await getCurrentUser()

  if (!currentUser){
    return NextResponse.error()
  }

  const { listingId } = await params

  if (!listingId || typeof listingId !== 'string'){
    throw new Error('Invalid ID')
  }

  const favoriteIds = [...(currentUser.favoriteIds || [])]

  favoriteIds.push(listingId)

  const user = await prisma.user.update({
    where:{
      id: currentUser.id
    },
    data: {
      favoriteIds
    }
  })

  return NextResponse.json(user)
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams}
) {
  const currentUser = await getCurrentUser()

  if (!currentUser){
    return NextResponse.error()
  }

  const { listingId } = await params

  if (!listingId || typeof listingId !== 'string'){
    throw new Error('Invalid id')
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])]

  favoriteIds = favoriteIds.filter((id) => id !== listingId )

  const user = await prisma.user.update({
    where: {
      id: currentUser.id
    },
    data: {
      favoriteIds
    }
  })

  return NextResponse.json(user)
}