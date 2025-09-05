"use client"

import type React from "react"

import { useAuth } from "@/lib/auth"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      const redirectUrl = searchParams.get("redirect") || "/login"
      if (pathname !== "/login" && pathname !== "/register" && pathname !== "/") {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      } else {
        router.push("/login")
      }
    }
  }, [user, isLoading, router, searchParams, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-4">You need to be logged in as an employee to access this area.</p>
          <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
            <Link href="/login">Employee Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Storage Manager</h1>
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Secure Access
              </Badge>
            </div>

            <nav className="flex items-center space-x-4">
              <Link
                href="/storage"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/storage"
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Storage
              </Link>
              <Link
                href="/activity"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/activity"
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Activity Log
              </Link>
              <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200">
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">{user.name}</p>
                  <div className="flex items-center space-x-1">
                    <Badge
                      variant={user.role === "manager" ? "default" : "secondary"}
                      className={`text-xs ${user.role === "manager" ? "bg-orange-500" : ""}`}
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900 bg-transparent"
                >
                  Sign Out
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Employee Access Only</span>
              <span>•</span>
              <span>Session Active</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Secure Connection</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
