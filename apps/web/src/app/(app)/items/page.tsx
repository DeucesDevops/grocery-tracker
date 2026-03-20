"use client";

import React, { useState, useEffect } from "react";
import { Plus, Package, Tag, Layers, Search, Filter, MoreVertical, Edit2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { AddItemModal } from "@/components/modals/add-item-modal";

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await api.items.getAll();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setIsModalOpen(true)
  }

  if (loading) return <div className="p-8 text-center">Loading items...</div>;

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Item Library</h1>
          <p className="text-muted-foreground mt-1">
            Build your personal database of grocery items.
          </p>
        </div>
        <Button onClick={addItem} className="gap-2">
          <Plus className="h-4 w-4" /> Add New Item
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search all items..." 
            className="pl-9 h-10 bg-background w-full md:w-[300px] lg:w-[400px]" 
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto h-10 gap-2">
          <Filter className="h-4 w-4" /> Category Filter
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden whitespace-nowrap">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[300px]">Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Default Unit</TableHead>
              <TableHead className="text-right">Lowest Price Logged</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <Package className="h-4 w-4" />
                  </div>
                  {item.name}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal shadow-none">
                    {item.category?.name || 'Uncategorized'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.unit}</TableCell>
                <TableCell className="text-right">
                  <div className="font-medium">
                    {item.prices && item.prices.length > 0 
                      ? `$${Math.min(...item.prices.map((p: any) => Number(p.price))).toFixed(2)}`
                      : 'N/A'}
                  </div>
                  {item.prices && item.prices.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      at {item.prices.sort((a: any, b: any) => Number(a.price) - Number(b.price))[0].shop?.name}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No items found. Add your first item to get started!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddItemModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onSuccess={fetchItems}
      />
    </div>
  )
}
