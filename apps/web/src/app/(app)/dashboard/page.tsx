import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, Circle, Clock, ListTodo, MapPin, MoreHorizontal, Plus, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

export default async function DashboardPage() {
  // Fetch data on the server
  let summary = { monthlySpend: 432.50, budgetRemaining: 167.50, activeLists: 2, savedViaDeals: 42.80 };
  let activeLists: any[] = [];
  let recentExpenses: any[] = [];

  try {
    const [summaryRes, activeListsRes, recentExpensesRes] = await Promise.all([
      api.dashboard.getSummary(),
      api.dashboard.getActiveLists(),
      api.dashboard.getRecentExpenses()
    ]);
    summary = summaryRes;
    activeLists = activeListsRes;
    recentExpenses = recentExpensesRes;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    // Fallback to defaults (which are already set)
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex">
            Scan Receipt
          </Button>
          <Link href="/lists">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New List
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
            <span className="text-blue-500 text-xs font-bold bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full">+4.5%</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">${summary.monthlySpend.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Stats based on your history
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-green-50/50 dark:bg-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-400">${summary.budgetRemaining.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Of $600.00 monthly budget
            </p>
            <Progress value={72} className="h-1.5 mt-3 bg-green-200 dark:bg-green-900" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Lists</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.activeLists}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Current shopping trips
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saved via Deals</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${summary.savedViaDeals.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated savings this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Active Shopping Lists */}
        <Card className="col-span-1 lg:col-span-4 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Active Lists</CardTitle>
              <CardDescription>Your upcoming shopping trips.</CardDescription>
            </div>
            <Link href="/lists">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeLists.length > 0 ? activeLists.map((list) => (
              <Link href={`/lists/${list.id}`} key={list.id}>
                <div className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors cursor-pointer mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base flex items-center gap-2">
                        {list.name}
                        <Badge variant={list.status === 'ACTIVE' ? 'secondary' : 'outline'} className={`text-[10px] h-5 px-1.5 shadow-none ${list.status === 'ACTIVE' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 'text-muted-foreground'} border-0`}>
                          {list.status}
                        </Badge>
                      </h4>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" /> {list.shop?.name || 'No shop selected'} • <Clock className="h-3 w-3 ml-2 mr-1" /> {list.date ? new Date(list.date).toLocaleDateString() : 'No date'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {list.budget ? `$${Number(list.budget).toFixed(2)}` : 'No budget'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 text-right flex items-center justify-end gap-1">
                      {list.items?.filter((i: any) => i.checked).length || 0} / {list.items?.length || 0} items checked <CheckCircle2 className="h-3 w-3 text-green-500" />
                    </div>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="text-center py-8 text-muted-foreground">
                No active lists. Create one to get started!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Spend & Insights */}
        <Card className="col-span-1 lg:col-span-3 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Expenses</CardTitle>
            <CardDescription>Your latest recorded trips.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentExpenses.length > 0 ? recentExpenses.map((expense) => (
                <div className="flex items-center justify-between" key={expense.id}>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{expense.list?.shop?.name || 'Unknown Shop'}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(expense.createdAt).toLocaleDateString()}, {new Date(expense.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="font-semibold text-sm">${Number(expense.totalSpent).toFixed(2)}</div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No recent expenses recorded.
                </div>
              )}
            </div>
            <Link href="/expenses">
              <Button variant="link" className="w-full mt-6 text-muted-foreground hover:text-primary">
                View Analytics Report
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
