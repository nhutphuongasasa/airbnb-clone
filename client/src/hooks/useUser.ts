import { SafeUser } from "@/types";
import { create } from "zustand";

interface UserUserStore {
    currentUser: any | null,
    onClear: () => void,
    onSet: (user: any) => void,
    onGet: () => any,
}

const userUserStore = create<UserUserStore>((set, get)=> ({
    currentUser: null,
    onClear: () => set({ currentUser: null }),
    onSet: user => set({ currentUser: user }),
    onGet: () => get().currentUser
}))

export default userUserStore;