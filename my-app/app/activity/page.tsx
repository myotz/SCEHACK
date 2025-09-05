"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { StorageProvider, useStorage } from "@/lib/storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Plus, Edit, Trash2, Move, Clock, User, Package } from "lucide-react"

function ActivityContent() {
  const { activities } = useStorage()
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAction = actionFilter === "all" || activity.action === actionFilter

    let matchesDate = true
    if (dateFilter !== "all") {
      const activityDate = new Date(activity.timestamp)
      const today = new Date()
      const diffTime = today.getTime() - activityDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      switch (dateFilter) {
        case "today":
          matchesDate = diffDays <= 1
          break
        case "week":
          matchesDate = diffDays <= 7
          break
        case "month":
          matchesDate = diffDays <= 30
          break
      }
    }

    return matchesSearch && matchesAction && matchesDate
  })

  const getActionIcon = (action: string) => {
    switch (action) {
      case "added":
        return <Plus className="w-4 h-4" />
      case "updated":
        return <Edit className="w-4 h-4" />
      case "removed":
        return <Trash2 className="w-4 h-4" />
      case "moved":
        return <Move className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "added":
        return "bg-green-100 text-green-800 border-green-200"
      case "updated":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "removed":
        return "bg-red-100 text-red-800 border-red-200"
      case "moved":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffTime / (1000 * 60))

    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getActivityStats = () => {
    const today = new Date()
    const todayActivities = activities.filter((activity) => {
      const activityDate = new Date(activity.timestamp)
      return activityDate.toDateString() === today.toDateString()
    })

    const thisWeekActivities = activities.filter((activity) => {
      const activityDate = new Date(activity.timestamp)
      const diffTime = today.getTime() - activityDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 7
    })

    return {
      total: activities.length,
      today: todayActivities.length,
      thisWeek: thisWeekActivities.length,
    }
  }

  const stats = getActivityStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-gray-600 mt-1">Track all storage activities and employee actions in real-time</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All recorded activities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.today}</div>
            <p className="text-xs text-muted-foreground">Activities today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeek}</div>
            <p className="text-xs text-muted-foreground">Activities this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search activities, items, or employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="added">Added</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
              <SelectItem value="removed">Removed</SelectItem>
              <SelectItem value="moved">Moved</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Activity Timeline
          </CardTitle>
          <CardDescription>
            {filteredActivities.length} of {activities.length} activities shown
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredActivities.length > 0 ? (
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-b-0"
                >
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${getActionColor(activity.action)}`}
                    >
                      {getActionIcon(activity.action)}
                    </div>
                  </div>

                  {/* Activity content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getActionColor(activity.action)} capitalize`}>{activity.action}</Badge>
                        <span className="font-medium text-gray-900">{activity.itemName}</span>
                      </div>
                      <span className="text-sm text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                    </div>

                    <p className="text-gray-600 mt-1">{activity.details}</p>

                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{activity.employeeName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(activity.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600">
                {searchTerm || actionFilter !== "all" || dateFilter !== "all"
                  ? "Try adjusting your search or filters."
                  : "Activities will appear here as employees interact with storage items."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      {activities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Summary</CardTitle>
            <CardDescription>Quick overview of recent storage activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {["added", "updated", "removed", "moved"].map((action) => {
                const count = activities.filter((activity) => activity.action === action).length
                return (
                  <div key={action} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div
                      className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${getActionColor(action)}`}
                    >
                      {getActionIcon(action)}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{action} Items</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function ActivityPage() {
  return (
    <ProtectedLayout>
      <StorageProvider>
        <ActivityContent />
      </StorageProvider>
    </ProtectedLayout>
  )
}
