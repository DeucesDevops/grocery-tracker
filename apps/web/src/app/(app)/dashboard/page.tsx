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

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, John! Here's what's happening.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex">
            Scan Receipt
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New List
          </Button>
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
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">$432.50</div>
            <p className="text-xs text-muted-foreground mt-1">
              $17.50 more than last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-green-50/50 dark:bg-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-400">$167.50</div>
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
            <div className="text-3xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">
              1 pending, 1 in progress
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saved via Deals</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$42.80</div>
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
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* List Item 1 */}
            <div className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-base flex items-center gap-2">
                    Weekend Groceries
                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 shadow-none border-0">IN PROGRESS</Badge>
                  </h4>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 mr-1" /> Aldi Supermarket • <Clock className="h-3 w-3 ml-2 mr-1" /> Today
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">$45.20 <span className="text-muted-foreground font-normal text-sm">/ $80.00</span></div>
                <div className="text-xs text-muted-foreground mt-1 text-right flex items-center justify-end gap-1">
                  12 / 18 items checked <CheckCircle2 className="h-3 w-3 text-green-500" />
                </div>
              </div>
            </div>

            {/* List Item 2 */}
            <div className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-base flex items-center gap-2">
                    Party Supplies
                    <Badge variant="outline" className="text-[10px] h-5 px-1.5 shadow-none text-muted-foreground">DRAFT</Badge>
                  </h4>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    No shop selected • <Clock className="h-3 w-3 ml-2 mr-1" /> Friday
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-muted-foreground">Est. $120.00</div>
                <div className="text-xs text-muted-foreground mt-1 text-right flex items-center justify-end gap-1">
                  14 items <Circle className="h-3 w-3" />
                </div>
              </div>
            </div>
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
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Whole Foods Market</span>
                  <span className="text-xs text-muted-foreground">Yesterday, 4:30 PM</span>
                </div>
                <div className="font-semibold text-sm">$86.40</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Trader Joe's</span>
                  <span className="text-xs text-muted-foreground">Oct 12, 10:15 AM</span>
                </div>
                <div className="font-semibold text-sm">$45.10</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Farmers Market</span>
                  <span className="text-xs text-muted-foreground">Oct 10, 9:00 AM</span>
                </div>
                <div className="font-semibold text-sm">$32.00</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Aldi Supermarket</span>
                  <span className="text-xs text-muted-foreground">Oct 05, 6:45 PM</span>
                </div>
                <div className="font-semibold text-sm">$112.90</div>
              </div>
            </div>
            <Button variant="link" className="w-full mt-6 text-muted-foreground hover:text-primary">
              View Analytics Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
