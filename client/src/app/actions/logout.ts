import axios from "axios";

export default async function logout() {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/logout`, {}, {
          withCredentials: true
        });
        return res.status === 200 ? { ok: true } : { error: "Logout failed" };
      } catch (error) {
        
      }
}