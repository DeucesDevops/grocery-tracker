import { Plus, Package, Search, Filter } from "lucide-react";

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

export default function ItemsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Item Library</h1>
          <p className="text-muted-foreground mt-1">
            Build your personal database of grocery items.
          </p>
        </div>
        <Button className="gap-2">
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
            <TableRow>
              <TableCell className="font-medium flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                  <Package className="h-4 w-4" />
                </div>
                Organic Milk 2L
              </TableCell>
              <TableCell><Badge variant="secondary" className="font-normal shadow-none">Dairy</Badge></TableCell>
              <TableCell className="text-muted-foreground">Bottle</TableCell>
              <TableCell className="text-right">
                <div className="font-medium">$3.50</div>
                <div className="text-xs text-muted-foreground">at Aldi</div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                  <Package className="h-4 w-4" />
                </div>
                Avocados (3 pack)
              </TableCell>
              <TableCell><Badge variant="secondary" className="font-normal shadow-none">Produce</Badge></TableCell>
              <TableCell className="text-muted-foreground">Pack</TableCell>
              <TableCell className="text-right">
                <div className="font-medium">$4.80</div>
                <div className="text-xs text-muted-foreground">at Trader Joe's</div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                  <Package className="h-4 w-4" />
                </div>
                Sourdough Bread
              </TableCell>
              <TableCell><Badge variant="secondary" className="font-normal shadow-none">Bakery</Badge></TableCell>
              <TableCell className="text-muted-foreground">Loaf</TableCell>
              <TableCell className="text-right">
                <div className="font-medium">$5.50</div>
                <div className="text-xs text-muted-foreground">at Whole Foods</div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                  <Package className="h-4 w-4" />
                </div>
                Chicken Breast
              </TableCell>
              <TableCell><Badge variant="secondary" className="font-normal shadow-none">Meat</Badge></TableCell>
              <TableCell className="text-muted-foreground">kg</TableCell>
              <TableCell className="text-right">
                <div className="font-medium">$12.00</div>
                <div className="text-xs text-muted-foreground">at Aldi</div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                  <Package className="h-4 w-4" />
                </div>
                Pasta Sauce
              </TableCell>
              <TableCell><Badge variant="secondary" className="font-normal shadow-none">Pantry</Badge></TableCell>
              <TableCell className="text-muted-foreground">Jar</TableCell>
              <TableCell className="text-right">
                <div className="font-medium">$2.90</div>
                <div className="text-xs text-muted-foreground">at Tesco Express</div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
