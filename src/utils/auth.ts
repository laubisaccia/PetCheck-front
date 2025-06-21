import { jwtDecode } from "jwt-decode"


export type TokenPayload = {
  email: string
  role: string
  exp: number
}

export function getUserFromToken(): TokenPayload | null {
  const token = localStorage.getItem("token")
  if (!token) return null
  try {
    return jwtDecode<TokenPayload>(token)
  } catch (error) {
    console.error("Error decoding token:", error)
    return null
  }
}