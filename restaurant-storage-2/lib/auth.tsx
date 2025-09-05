"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"

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
    const checkStoredUser = () => {
      try {
        const storedUser = localStorage.getItem("restaurant-user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Error loading stored user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkStoredUser()
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    return new Promise((resolve) => {
      const foundUser = mockUsers.find((u) => u.email === email && u.password === password)
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        try {
          localStorage.setItem("restaurant-user", JSON.stringify(userWithoutPassword))
        } catch (error) {
          console.error("Error saving user:", error)
        }
        setIsLoading(false)
        resolve(true)
      } else {
        setIsLoading(false)
        resolve(false)
      }
    })
  }, [])

  const register = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)

    return new Promise((resolve) => {
      // Check if user already exists
      if (mockUsers.find((u) => u.email === email)) {
        setIsLoading(false)
        resolve(false)
        return
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
      try {
        localStorage.setItem("restaurant-user", JSON.stringify(userWithoutPassword))
      } catch (error) {
        console.error("Error saving user:", error)
      }
      setIsLoading(false)
      resolve(true)
    })
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    try {
      localStorage.removeItem("restaurant-user")
    } catch (error) {
      console.error("Error removing user:", error)
    }
  }, [])

  const contextValue = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      isLoading,
    }),
    [user, login, register, logout, isLoading],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
