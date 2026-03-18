"use client";

import { Download, TrendingDown, TrendingUp, Filter } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MOCK_MONTHLY_DATA = [
  { name: 'Jan', spend: 400 },
  { name: 'Feb', spend: 300 },
  { name: 'Mar', spend: 550 },
  { name: 'Apr', spend: 450 },
  { name: 'May', spend: 480 },
  { name: 'Jun', spend: 420 },
  { name: 'Jul', spend: 600 },
];

const MOCK_CATEGORY_DATA = [
  { name: 'Produce', value: 35 },
  { name: 'Meat', value: 25 },
  { name: 'Dairy', value: 15 },
  { name: 'Pantry', value: 15 },
  { name: 'Other', value: 10 },
];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

export default function ExpensesPage() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Understand where your money goes every month.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-sm bg-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$432.50</div>
            <div className="flex items-center text-xs text-red-500 mt-1 font-medium">
              <TrendingUp className="h-3 w-3 mr-1" /> +4.5% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Spend / Trip</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$68.20</div>
            <div className="flex items-center text-xs text-green-500 mt-1 font-medium">
              <TrendingDown className="h-3 w-3 mr-1" /> -12% vs overall avg
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">Produce</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1 font-medium gap-2">
              35% of total budget <Badge variant="secondary" className="h-4 px-1 text-[9px]">HEALTHY</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Monthly Trend Chart */}
        <Card className="col-span-1 lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Spending Trend</CardTitle>
            <CardDescription>Your grocery expenses over the last 7 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_MONTHLY_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} tickFormatter={(val) => `$${val}`} />
                  <RechartsTooltip 
                    cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                    contentStyle={{borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))'}}
                    formatter={(val) => [`$${val}`, 'Spend']}
                  />
                  <Bar dataKey="spend" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="col-span-1 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Where your money went this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_CATEGORY_DATA}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {MOCK_CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))'}}
                    formatter={(val) => [`${val}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3 mt-4">
              {MOCK_CATEGORY_DATA.map((item, i) => (
                <div key={item.name} className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></span>
                      {item.name}
                    </span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
