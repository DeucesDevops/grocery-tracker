"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Calendar as CalendarIcon, Wallet, ShoppingBag, Plus } from "lucide-react"

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

interface CreateListModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateListModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateListModalProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [shops, setShops] = React.useState<any[]>([])
  const [formData, setFormData] = React.useState({
    name: "",
    shopId: "",
    budget: "",
    date: "",
  })

  React.useEffect(() => {
    if (open) {
      fetchShops()
    }
  }, [open])

  const fetchShops = async () => {
    try {
      const data = await api.shops.getAll()
      setShops(data)
    } catch (error) {
      console.error("Failed to fetch shops:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return

    setLoading(true)
    try {
      const newList = await api.lists.create({
        name: formData.name,
        shopId: formData.shopId || undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
      })
      onOpenChange(false)
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/lists/${newList.id}`)
      }
    } catch (error) {
      console.error("Failed to create list:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-primary/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            New Shopping List
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80">
            Plan your next trip to the store with a fresh list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-medium">List Name</Label>
            <Input
              id="name"
              placeholder="e.g., Weekend Groceries"
              className="bg-muted/30 border-primary/10 focus:border-primary/40 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="shop" className="text-sm font-medium">Target Shop</Label>
              <Select 
                value={formData.shopId} 
                onValueChange={(val: string | null) => setFormData({ ...formData, shopId: val || "" })}
              >
                <SelectTrigger id="shop" className="bg-muted/30 border-primary/10">
                  <div className="flex items-center gap-2 truncate">
                    <ShoppingBag className="h-4 w-4 text-primary/60 shrink-0" />
                    <span>{shops.find(s => s.id === formData.shopId)?.name || "Select shop"}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {shops.map((shop) => (
                    <SelectItem key={shop.id} value={shop.id}>
                      {shop.name}
                    </SelectItem>
                  ))}
                  {shops.length === 0 && (
                    <div className="p-2 text-xs text-muted-foreground text-center">No shops found</div>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="budget" className="text-sm font-medium">Budget ($)</Label>
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
                <Input
                  id="budget"
                  type="number"
                  placeholder="0.00"
                  className="pl-9 bg-muted/30 border-primary/10 focus:border-primary/40"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date" className="text-sm font-medium">Planned Date</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
              <Input
                id="date"
                type="date"
                className="pl-9 bg-muted/30 border-primary/10 focus:border-primary/40"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/20"
              disabled={loading || !formData.name}
            >
              {loading ? "Creating..." : "Create Shopping List"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
