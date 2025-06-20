import { useRouter } from "next/navigation";
// import { SafeUser } from "../types";
import useLoginModal from "./useLoginModal";
import { useCallback, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
// import { fetchProfile } from "./useProfile";
import userUserStore from "./useUser";

interface IUseFavorite {
  listingId: string,
}

export const useFavorite = ({
  listingId,
}: IUseFavorite) => {
  const router = useRouter()
  const loginModal = useLoginModal()

  const onSetUser = userUserStore()
  const currentUser = userUserStore(state => state.currentUser)

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || []

    return list.includes(listingId)
  }, [currentUser, listingId])

  const toggleFavorite = useCallback(async (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation()

    if (!currentUser){
      return loginModal.onOpen()
    }

    try {

      if (hasFavorited){
        const request =  await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/favorites/${listingId}`,{
          withCredentials: true
        }).then((res) => {
          // console.log(res.data)
          onSetUser.onSet(res.data)
        })
        
      }else{
        const request1 = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/favorites/${listingId}`,{},{
          withCredentials: true
        }).then((res) => {
          // console.log(res.data)
          onSetUser.onSet(res.data)
        })
      }
      router.refresh()
      toast.success("Success")
    } catch (error) {
      // toast.error('Sone thing went wrong'+error)
    }
  },[currentUser, hasFavorited, listingId, loginModal, router])

  return {
    hasFavorited,
    toggleFavorite
  }
}
