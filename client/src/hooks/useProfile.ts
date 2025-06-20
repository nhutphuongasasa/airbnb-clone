"use client"

import userUserStore from "./useUser"
import axios from "axios"


export const fetchProfile = async() => {
    const onSet = userUserStore.getState().onSet
    const result = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/profile`,{
        withCredentials: true
    })
    .then((res) => {
      console.log(res.data.data)
      onSet(res.data.data)
    })
  }

