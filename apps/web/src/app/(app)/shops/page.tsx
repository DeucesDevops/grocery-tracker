"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Store, MapPin, Tag, Search, Filter, MoreVertical, Globe, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { AddShopModal } from "@/components/modals/add-shop-modal";

export default function ShopsPage() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const data = await api.shops.getAll();
      setShops(data);
    } catch (error) {
      console.error("Failed to fetch shops:", error);
    } finally {
      setLoading(false);
    }
  };

  const addShop = () => {
    setIsModalOpen(true)
  };

  if (loading) return <div className="p-8 text-center">Loading shops...</div>;

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Shops</h1>
          <p className="text-muted-foreground mt-1">
            Manage your frequently visited stores and compare prices.
          </p>
        </div>
        <Button onClick={addShop} className="gap-2">
          <Plus className="h-4 w-4" /> Add New Shop
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shops.length > 0 ? shops.map((shop, index) => {
          const colors = [
            "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
            "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400",
            "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400",
            "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400"
          ];
          const colorClass = colors[index % colors.length];

          return (
            <Card key={shop.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${colorClass}`}>
                    <MapPin className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="text-xs font-normal capitalize">{shop.category || 'Shop'}</Badge>
                </div>
                <CardTitle className="text-xl mt-4 shrink-0">{shop.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> Location set
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  {shop.address || 'No address provided'}
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="text-sm font-medium">
                    <Tag className="inline h-4 w-4 mr-1 text-muted-foreground" /> Prices Logged
                  </div>
                  <Link href={`/shops/${shop.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1 h-8 text-primary">
                      View <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        }) : (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No shops found. Add your first shop to start comparing prices!
          </div>
        )}
      </div>

      <AddShopModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onSuccess={fetchShops}
      />
    </div>
  )
}
