"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "employee" | "manager"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    email: "manager@restaurant.com",
    password: "password123",
    name: "John Manager",
    role: "manager",
  },
  {
    id: "2",
    email: "employee@restaurant.com",
    password: "password123",
    name: "Jane Employee",
    role: "employee",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("restaurant-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("restaurant-user", JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Check if user already exists
    if (mockUsers.find((u) => u.email === email)) {
      return false
    }

    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role: "employee",
    }

    mockUsers.push(newUser)
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("restaurant-user", JSON.stringify(userWithoutPassword))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("restaurant-user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
