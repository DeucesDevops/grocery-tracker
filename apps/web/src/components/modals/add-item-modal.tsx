"use client"

import * as React from "react"
import { Package, Tag, Layers, FileText } from "lucide-react"

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

interface AddItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddItemModal({
  open,
  onOpenChange,
  onSuccess,
}: AddItemModalProps) {
  const [loading, setLoading] = React.useState(false)
  const [categories, setCategories] = React.useState<any[]>([])
  const [formData, setFormData] = React.useState({
    name: "",
    categoryId: "",
    unit: "each",
    notes: "",
  })

  React.useEffect(() => {
    if (open) {
      fetchCategories()
    }
  }, [open])

  const fetchCategories = async () => {
    try {
      // Assuming api.categories.getAll exists or using a shared lib
      // For now we'll fetch from a generic endpoint or mock if not available
      // Actually, categories are often nested in items or lists
      const data = await api.lists.getAll().then(lists => {
          // Extract unique categories from lists/items if possible, or just use defaults
          return [
              { id: 'prod', name: 'Produce' },
              { id: 'dairy', name: 'Dairy' },
              { id: 'meat', name: 'Meat' },
              { id: 'pantry', name: 'Pantry' },
              { id: 'frozen', name: 'Frozen' },
              { id: 'beverages', name: 'Beverages' },
              { id: 'household', name: 'Household' },
          ]
      })
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return

    setLoading(true)
    try {
      await api.items.create({
        name: formData.name,
        unit: formData.unit,
        categoryId: formData.categoryId || undefined,
        notes: formData.notes || undefined,
      })
      onOpenChange(false)
      if (onSuccess) onSuccess()
      setFormData({ name: "", categoryId: "", unit: "each", notes: "" })
    } catch (error) {
      console.error("Failed to add item:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-primary/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-primary bg-clip-text text-transparent">
            Add New Item
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80">
            Expand your library with a new grocery item.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="item-name" className="text-sm font-medium">Item Name</Label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400/60" />
              <Input
                id="item-name"
                placeholder="e.g., Avocados"
                className="pl-9 bg-muted/30 border-primary/10"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-sm font-medium">Category</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(val: string | null) => setFormData({ ...formData, categoryId: val || "" })}
              >
                <SelectTrigger id="category" className="bg-muted/30 border-primary/10">
                  <div className="flex items-center gap-2 truncate text-sm">
                    {formData.categoryId === "produce" && <Tag className="h-4 w-4 text-green-400/60" />}
                    {formData.categoryId === "dairy" && <Tag className="h-4 w-4 text-yellow-400/60" />}
                    {formData.categoryId === "pantry" && <Tag className="h-4 w-4 text-amber-400/60" />}
                    {formData.categoryId === "meat" && <Tag className="h-4 w-4 text-red-400/60" />}
                    {formData.categoryId === "bakery" && <Tag className="h-4 w-4 text-orange-400/60" />}
                    {formData.categoryId === "frozen" && <Tag className="h-4 w-4 text-blue-400/60" />}
                    <span>{formData.categoryId || "Select..."}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produce">Produce & Veggies</SelectItem>
                  <SelectItem value="dairy">Dairy & Eggs</SelectItem>
                  <SelectItem value="pantry">Pantry Staples</SelectItem>
                  <SelectItem value="meat">Meat & Seafood</SelectItem>
                  <SelectItem value="bakery">Bakery Items</SelectItem>
                  <SelectItem value="frozen">Frozen Foods</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="unit" className="text-sm font-medium">Default Unit</Label>
              <Select 
                value={formData.unit} 
                onValueChange={(val: string | null) => setFormData({ ...formData, unit: val || "each" })}
              >
                <SelectTrigger id="unit" className="bg-muted/30 border-primary/10">
                  <div className="flex items-center gap-2 truncate">
                    <Layers className="h-4 w-4 text-emerald-400/60 shrink-0" />
                    <span>{formData.unit}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="each">each</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="pack">pack</SelectItem>
                  <SelectItem value="box">box</SelectItem>
                  <SelectItem value="bottle">bottle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes" className="text-sm font-medium">Notes (Optional)</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-emerald-400/60" />
              <textarea
                id="notes"
                placeholder="Important info..."
                className="flex min-h-[80px] w-full rounded-md border border-primary/10 bg-muted/30 px-3 py-2 text-sm pl-9 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-500 to-primary hover:from-emerald-600 hover:to-primary/90 shadow-lg shadow-emerald-500/20"
              disabled={loading || !formData.name}
            >
              {loading ? "Adding..." : "Add to Library"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
