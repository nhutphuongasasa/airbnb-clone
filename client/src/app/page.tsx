import Categories from "@/components/Categories";
import ClientOnly from "../components/ClientOnly";
import Container from "../components/Container";
import EmptyState from "../components/EmptyState";
import ListingCard from "../components/ListingCard";
import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";

interface HomeProps {
  searchParams: IListingsParams
}

export default async function Home({searchParams}: HomeProps) {
  const listings = await getListings(searchParams)
  const currentUser = await getCurrentUser()

  if (listings.length === 0){
    return (
      <ClientOnly>
        <EmptyState showReset></EmptyState>
      </ClientOnly>
    )
  }
  
  return (
    <div>
    <Categories></Categories>

    <ClientOnly>
      <Container>
        <div className="
          pt-10
          grid 
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
          ">
          {listings.map((listing) => {
            return (
              <ListingCard
              data={listing}
              currentUser={currentUser}
              key={listing.id}></ListingCard>
            )
          })}
        </div>
      </Container>
    </ClientOnly>
          </div>

  )
}
