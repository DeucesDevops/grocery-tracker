"use client"

import * as React from "react"
import { CheckCircle2, DollarSign, FileText, ShoppingCart, Percent } from "lucide-react"

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
import { api } from "@/lib/api"

interface FinishTripModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listId: string
  listName: string
  itemsCount: number
  checkedCount: number
  onSuccess?: () => void
}

export function FinishTripModal({
  open,
  onOpenChange,
  listId,
  listName,
  itemsCount,
  checkedCount,
  onSuccess,
}: FinishTripModalProps) {
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    totalSpent: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.totalSpent) return

    setLoading(true)
    try {
      await api.lists.finishTrip(listId, {
        totalSpent: parseFloat(formData.totalSpent),
        notes: formData.notes || undefined,
      })
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Failed to finish trip:", error)
    } finally {
      setLoading(false)
    }
  }

  const completionRate = itemsCount > 0 ? Math.round((checkedCount / itemsCount) * 100) : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-emerald-500/20 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Finish Shopping Trip
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Review and log your expenses for "{listName}".
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4 px-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10 mb-4">
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Items Found</span>
            <div className="text-2xl font-bold text-emerald-500 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {checkedCount}/{itemsCount}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-2 border-l border-emerald-500/10">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Completion</span>
            <div className="text-2xl font-bold text-emerald-500 flex items-center gap-1">
              {completionRate}
              <Percent className="h-5 w-5" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="total-spent" className="text-sm font-medium">Total Amount Spent</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
              <Input
                id="total-spent"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-9 bg-muted/30 border-emerald-500/20 focus:border-emerald-500/50 transition-all text-lg font-bold"
                value={formData.totalSpent}
                onChange={(e) => setFormData({ ...formData, totalSpent: e.target.value })}
                required
                autoFocus
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes" className="text-sm font-medium text-muted-foreground">Additional Notes</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />
              <textarea
                id="notes"
                placeholder="Any surprises or savings?"
                className="flex min-h-[80px] w-full rounded-md border border-primary/10 bg-muted/30 px-3 py-2 text-sm pl-9 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button 
              type="submit" 
              className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 font-bold"
              disabled={loading || !formData.totalSpent}
            >
              {loading ? "Processing..." : "Finish & Log Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
