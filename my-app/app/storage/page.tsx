"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { StorageProvider, useStorage } from "@/lib/storage"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2, Plus, Package, AlertTriangle } from "lucide-react"

function StorageContent() {
  const { items, addItem, removeItem } = useStorage()
  const { user } = useAuth()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Form state for adding new items
  const [newItem, setNewItem] = useState({
    name: "",
    category: "produce" as const,
    quantity: 0,
    unit: "lbs" as const,
    location: "",
    expirationDate: "",
  })

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleAddItem = () => {
    if (!newItem.name || !newItem.location || !newItem.expirationDate) return

    addItem({
      ...newItem,
      addedBy: user?.name || "Unknown",
    })

    setNewItem({
      name: "",
      category: "produce",
      quantity: 0,
      unit: "lbs",
      location: "",
      expirationDate: "",
    })
    setIsAddDialogOpen(false)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      produce: "bg-green-100 text-green-800",
      meat: "bg-red-100 text-red-800",
      dairy: "bg-blue-100 text-blue-800",
      "dry-goods": "bg-yellow-100 text-yellow-800",
      frozen: "bg-cyan-100 text-cyan-800",
      beverages: "bg-purple-100 text-purple-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const isExpiringSoon = (expirationDate: string) => {
    const expDate = new Date(expirationDate)
    const today = new Date()
    const diffTime = expDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Storage Inventory</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant's storage items and track inventory levels</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Storage Item</DialogTitle>
              <DialogDescription>Enter the details for the new inventory item.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g., Fresh Tomatoes"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(value: any) => setNewItem({ ...newItem, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="produce">Produce</SelectItem>
                      <SelectItem value="meat">Meat</SelectItem>
                      <SelectItem value="dairy">Dairy</SelectItem>
                      <SelectItem value="dry-goods">Dry Goods</SelectItem>
                      <SelectItem value="frozen">Frozen</SelectItem>
                      <SelectItem value="beverages">Beverages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    placeholder="e.g., Walk-in Cooler A"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={newItem.unit} onValueChange={(value: any) => setNewItem({ ...newItem, unit: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lbs">lbs</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="pieces">pieces</SelectItem>
                      <SelectItem value="gallons">gallons</SelectItem>
                      <SelectItem value="liters">liters</SelectItem>
                      <SelectItem value="boxes">boxes</SelectItem>
                      <SelectItem value="cases">cases</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiration">Expiration Date</Label>
                <Input
                  id="expiration"
                  type="date"
                  value={newItem.expirationDate}
                  onChange={(e) => setNewItem({ ...newItem, expirationDate: e.target.value })}
                />
              </div>
              <Button onClick={handleAddItem} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="produce">Produce</SelectItem>
            <SelectItem value="meat">Meat</SelectItem>
            <SelectItem value="dairy">Dairy</SelectItem>
            <SelectItem value="dry-goods">Dry Goods</SelectItem>
            <SelectItem value="frozen">Frozen</SelectItem>
            <SelectItem value="beverages">Beverages</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {items.filter((item) => isExpiringSoon(item.expirationDate)).length}
            </div>
            <p className="text-xs text-muted-foreground">Items expiring within 3 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(items.map((item) => item.category)).size}</div>
            <p className="text-xs text-muted-foreground">Different item categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className={`${isExpiringSoon(item.expirationDate) ? "border-orange-200 bg-orange-50" : ""}`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge className={getCategoryColor(item.category)}>{item.category.replace("-", " ")}</Badge>
                    {isExpiringSoon(item.expirationDate) && (
                      <Badge variant="destructive" className="text-xs">
                        Expiring Soon
                      </Badge>
                    )}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">
                  {item.quantity} {item.unit}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{item.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Expires:</span>
                <span className={`font-medium ${isExpiringSoon(item.expirationDate) ? "text-orange-600" : ""}`}>
                  {new Date(item.expirationDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Added by:</span>
                <span className="font-medium">{item.addedBy}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">
            {searchTerm || categoryFilter !== "all"
              ? "Try adjusting your search or filters."
              : "Start by adding your first storage item."}
          </p>
        </div>
      )}
    </div>
  )
}

export default function StoragePage() {
  return (
    <ProtectedLayout>
      <StorageProvider>
        <StorageContent />
      </StorageProvider>
    </ProtectedLayout>
  )
}
