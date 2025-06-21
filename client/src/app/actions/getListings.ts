// import prisma from "../../libs/prismadb";

// export interface IListingsParams {
//   userId?: string,
//   guestCount?: number,
//   roomCount?: number,
//   bathroomCount?: number,
//   startDate?: string,
//   endDate?: string,
//   locationValue?: string,
//   category?: string
// }

// export default async function getListings(
//   params: IListingsParams) {
//   try {
//     const resolvedParams = await params; // Thêm dòng này nếu params là Promise
// // console.log("get lsitinh")
//     const {
//       userId,
//       guestCount,
//       roomCount,
//       bathroomCount,
//       startDate,
//       endDate,
//       locationValue,
//       category,
//     } = resolvedParams || params;

//     let query: any = {}

//     if (userId) {
//       query.userId = userId
//     }

//     if(category){
//       query.category = category
//     }

//     if(roomCount){
//       query.roomCount = {
//         gte: +roomCount// cu phap truy vandu lieu lon hon
//       }
//     }

//     if(bathroomCount){
//       query.bathroomCount = {
//         gte: +bathroomCount// cu phap truy vandu lieu lon hon
//       }
//     }

//     if(guestCount){
//       query.guestCount = {
//         gte: +guestCount// cu phap truy vandu lieu lon hon
//       }
//     }

//     if (locationValue){
//       query.locationValue = locationValue
//     }

//     if( startDate && endDate) {
//       query.NOT = {
//         reservation: {
//           some: {
//             OR: [
//               {
//                 endDate: { gte: startDate},
//                 startDate: { lte: startDate}
//               },
//               {
//                 startDate: { lte: endDate},
//                 endDate: { gte: endDate}
//               }
//             ]
//           }
//         }
//       }
//     }


//     const listings = await prisma.listing.findMany({
//       where: query,
//       orderBy: {
//         createAt: 'desc'
//       }
//     });

//     const safeListings = listings.map((listing) => ({
//       ...listing,
//       createAt: listing.createAt.toISOString(),
//     }));
//     // console.log(listings)

//     return safeListings;
//   } catch (error: any) {
//     throw new Error(error);
//   }
// }
