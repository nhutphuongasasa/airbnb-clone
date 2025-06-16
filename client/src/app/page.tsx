'use client'

import Categories from "@/components/Categories";
import ClientOnly from "../components/ClientOnly";
import Container from "../components/Container";
import EmptyState from "../components/EmptyState";
import ListingCard from "../components/ListingCard";
import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";
import userUserStore from "@/hooks/useUser";
import { safeListing } from "@/types";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface HomeProps {
  searchParams: IListingsParams
}

export default  function Home({searchParams}: HomeProps) {
  // const listings = await getListings(searchParams)
  const currentUser = userUserStore(state => state.currentUser)
  const [listings, setListings] = useState<safeListing[]>([])

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/listing`);
        console.log("Fetched listings response:", res.data);
        setListings(res.data.data)
      } catch {
        toast.error("wrong listing page")
      }
    }
    fetchListings()
  }, [])


  if (listings.length === 0){
    return (
      <ClientOnly>
        <EmptyState showReset>
        </EmptyState>
          <h1>Nolsiinth</h1>
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
        {/* <div></div> */}
      </Container>
    </ClientOnly>
          </div>

  )
}
