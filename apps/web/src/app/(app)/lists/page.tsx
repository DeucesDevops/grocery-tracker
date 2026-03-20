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
import { api } from "@/lib/api";

export default async function ListsPage() {
  let lists: any[] = [];
  try {
    lists = await api.lists.getAll();
  } catch (error) {
    console.error("Failed to fetch lists:", error);
  }

  const activeLists = lists.filter(l => l.status === 'ACTIVE');
  const draftLists = lists.filter(l => l.status === 'DRAFT');
  const completedLists = lists.filter(l => l.status === 'COMPLETED');

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
          <TabsTrigger value="active">Active ({activeLists.length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({draftLists.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedLists.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {activeLists.length > 0 ? activeLists.map((list) => (
            <Link href={`/lists/${list.id}`} key={list.id}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer border-0 shadow-sm border-l-4 border-l-blue-500 mb-4">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex shrink-0 items-center justify-center text-blue-600 dark:text-blue-400">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl flex items-center gap-3">
                          {list.name}
                          <Badge variant="secondary" className="text-xs font-normal bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">IN PROGRESS</Badge>
                        </h3>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground mt-2">
                          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {list.shop?.name || 'Unassigned'}</span>
                          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {list.date ? new Date(list.date).toLocaleDateString() : 'No date'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between mt-4 md:mt-0 w-full md:w-auto">
                      <div className="text-2xl font-bold">{list.budget ? `$${Number(list.budget).toFixed(2)}` : 'No budget'}</div>
                      <div className="text-sm font-medium mt-1">Items: {list._count?.items || 0}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )) : (
            <div className="text-center py-12 text-muted-foreground">No active lists.</div>
          )}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          {draftLists.length > 0 ? draftLists.map((list) => (
            <Link href={`/lists/${list.id}`} key={list.id}>
              <Card className="border-dashed shadow-none mb-4 hover:bg-accent/10 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex shrink-0 items-center justify-center text-muted-foreground">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl flex items-center gap-3">
                          {list.name}
                          <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-dashed">DRAFT</Badge>
                        </h3>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground mt-2">
                          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {list.shop?.name || 'Unassigned'}</span>
                          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {list.date ? new Date(list.date).toLocaleDateString() : 'No date'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between mt-4 md:mt-0 w-full md:w-auto">
                      <div className="text-xl font-medium text-muted-foreground">{list.budget ? `Est. $${Number(list.budget).toFixed(2)}` : 'No budget'}</div>
                      <div className="text-sm font-medium mt-1 text-muted-foreground">{list._count?.items || 0} items added</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )) : (
            <div className="text-center py-12 text-muted-foreground">No draft lists.</div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedLists.length > 0 ? (
            <Card className="border-0 shadow-sm opacity-80">
              <CardHeader>
                <CardTitle>History</CardTitle>
                <CardDescription>Your past completed lists are moved here.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">You have {completedLists.length} completed trips. <Link href="/expenses" className="text-primary hover:underline">View Expenses</Link> to see full history.</div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-muted-foreground">No completed lists.</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
