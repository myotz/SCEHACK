"use client"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4 text-balance">Restaurant Storage Manager</h1>
            <p className="text-xl text-gray-600 mb-8 text-pretty">
              Streamline your restaurant's inventory management with our comprehensive storage tracking system. Monitor
              stock levels, track activities, and maintain optimal inventory control.
            </p>
          </div>

          {user ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome back, {user.name}!</h2>
              <p className="text-gray-600 mb-6">Access your storage management tools below.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                  <Link href="/storage">Manage Storage</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-3 bg-transparent"
                >
                  <Link href="/activity">View Activity Log</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Inventory Tracking</h3>
                  <p className="text-gray-600 text-sm">
                    Monitor stock levels, expiration dates, and storage locations in real-time.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity Logging</h3>
                  <p className="text-gray-600 text-sm">
                    Track all storage activities with detailed logs and employee accountability.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Access</h3>
                  <p className="text-gray-600 text-sm">
                    Employee-only access with role-based permissions and secure authentication.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                  <Link href="/login">Employee Login</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-3 bg-transparent"
                >
                  <Link href="/register">Register Account</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
