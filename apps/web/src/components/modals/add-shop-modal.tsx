"use client"

import * as React from "react"
import { MapPin, Store, Tag, Globe, Navigation } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { api } from "@/lib/api"

interface AddShopModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddShopModal({
  open,
  onOpenChange,
  onSuccess,
}: AddShopModalProps) {
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    address: "",
    category: "supermarket",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return

    setLoading(true)
    try {
      await api.shops.create({
        name: formData.name,
        address: formData.address || undefined,
        category: formData.category,
      })
      onOpenChange(false)
      if (onSuccess) onSuccess()
      setFormData({ name: "", address: "", category: "supermarket" })
    } catch (error) {
      console.error("Failed to add shop:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-primary/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Add New Shop
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80">
            Keep track of where you find the best deals.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="shop-name" className="text-sm font-medium">Shop Name</Label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400/60" />
              <Input
                id="shop-name"
                placeholder="e.g., Trader Joe's"
                className="pl-9 bg-muted/30 border-primary/10"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="address" className="text-sm font-medium">Location / Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400/60" />
              <Input
                id="address"
                placeholder="123 Market St..."
                className="pl-9 bg-muted/30 border-primary/10"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="shop-category" className="text-sm font-medium">Shop Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(val: string | null) => setFormData({ ...formData, category: val || "supermarket" })}
            >
              <SelectTrigger id="shop-category" className="bg-muted/30 border-primary/10">
                <div className="flex items-center gap-2 truncate">
                  <Tag className="h-4 w-4 text-blue-400/60 shrink-0" />
                  <span>{formData.category}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supermarket">Supermarket</SelectItem>
                <SelectItem value="local-market">Local Market</SelectItem>
                <SelectItem value="specialty">Specialty</SelectItem>
                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                <SelectItem value="convenience">Convenience</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-2">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/20"
              disabled={loading || !formData.name}
            >
              {loading ? "Adding..." : "Add to Directory"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
