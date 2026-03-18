import Link from "next/link";
import { Plus, MoreHorizontal, ShoppingBag, MapPin, Clock, Circle, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ListsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopping Lists</h1>
          <p className="text-muted-foreground mt-1">
            Manage your past and upcoming grocery lists.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Create New List
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active (2)</TabsTrigger>
          <TabsTrigger value="drafts">Drafts (1)</TabsTrigger>
          <TabsTrigger value="completed">Completed (14)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {/* Active List 1 */}
          <Link href="/lists/wkgroceries">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer border-0 shadow-sm border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex shrink-0 items-center justify-center text-blue-600 dark:text-blue-400">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl flex items-center gap-3">
                        Weekend Groceries
                        <Badge variant="secondary" className="text-xs font-normal">IN PROGRESS</Badge>
                      </h3>
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Aldi Supermarket</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Today</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between mt-4 md:mt-0 w-full md:w-auto">
                    <div className="text-2xl font-bold">$45.20 <span className="text-base font-normal text-muted-foreground">/ $80.00 limits</span></div>
                    <div className="text-sm font-medium mt-1">12 of 18 items checked</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
           {/* Draft List 1 */}
           <Card className="border-dashed shadow-none">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex shrink-0 items-center justify-center text-muted-foreground">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl flex items-center gap-3">
                        Party Supplies
                        <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-dashed">DRAFT</Badge>
                      </h3>
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Unassigned</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Friday Oct 24</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between mt-4 md:mt-0 w-full md:w-auto">
                    <div className="text-xl font-medium text-muted-foreground">Est. $120.00</div>
                    <div className="text-sm font-medium mt-1 text-muted-foreground">14 items added</div>
                  </div>
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="border-0 shadow-sm opacity-80">
            <CardHeader>
              <CardTitle>History</CardTitle>
              <CardDescription>Your past completed lists are moved here.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="text-sm text-muted-foreground">You have 14 completed trips. <Link href="/expenses" className="text-primary hover:underline">View Expenses</Link> to see full history.</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
