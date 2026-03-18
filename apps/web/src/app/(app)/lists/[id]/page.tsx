"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Edit2, MoreVertical, Plus, Share, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data
const MOCK_LIST = {
  id: "wkgroceries",
  name: "Weekend Groceries",
  shop: "Aldi Supermarket",
  date: "Today",
  budget: 80,
  status: "IN PROGRESS",
  items: [
    { id: "1", name: "Organic Milk 2L", category: "Dairy", qty: 2, price: 3.5, checked: true },
    { id: "2", name: "Free Range Eggs 12pk", category: "Dairy", qty: 1, price: 4.2, checked: true },
    { id: "3", name: "Sourdough Bread", category: "Bakery", qty: 1, price: 5.5, checked: true },
    { id: "4", name: "Avocados (3 pack)", category: "Produce", qty: 1, price: 4.8, checked: false },
    { id: "5", name: "Chicken Breast", category: "Meat", qty: 1, price: 12.0, checked: false },
    { id: "6", name: "Pasta Sauce", category: "Pantry", qty: 2, price: 3.0, checked: false },
  ]
};

export default function ListDetailPage({ params }: { params: { id: string } }) {
  const [items, setItems] = useState(MOCK_LIST.items);

  const toggleCheck = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const currentTotal = items.filter(i => i.checked).reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const estimatedTotal = items.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const budgetPercentage = Math.min(100, (currentTotal / MOCK_LIST.budget) * 100);
  
  const checkedCount = items.filter(i => i.checked).length;
  const isOverBudget = currentTotal > MOCK_LIST.budget;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-auto max-w-4xl mx-auto pb-24 md:pb-0">
      
      {/* Header Area */}
      <div className="flex flex-col gap-4 mb-6">
        <Link href="/lists" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-fit transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Lists
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">{MOCK_LIST.name}</h1>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 pointer-events-none">
                {MOCK_LIST.status}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              {MOCK_LIST.shop} • {MOCK_LIST.date}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
              <Share className="h-4 w-4" /> Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem><Edit2 className="mr-2 h-4 w-4" /> Edit List Info</DropdownMenuItem>
                <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Duplicate List</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50"><Trash2 className="mr-2 h-4 w-4" /> Delete List</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
        
        {/* Shopping List Items */}
        <div className="md:col-span-2 flex flex-col gap-4 bg-card rounded-2xl border shadow-sm p-4 md:p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              Items <Badge variant="outline" className="ml-1">{checkedCount} / {items.length}</Badge>
            </h2>
            <Button size="sm" variant="ghost" className="gap-1 text-primary hover:bg-primary/10">
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </div>

          <div className="space-y-2">
            {items.sort((a, b) => Number(a.checked) - Number(b.checked)).map((item) => (
              <div 
                key={item.id} 
                onClick={() => toggleCheck(item.id)}
                className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${item.checked ? 'bg-muted/50 border-transparent opacity-60' : 'bg-background hover:border-primary/50 hover:shadow-sm'}`}
              >
                <button 
                  className={`flex shrink-0 h-6 w-6 rounded-full border-2 items-center justify-center transition-colors ${item.checked ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground hover:border-primary'}`}
                >
                  {item.checked && <Check className="h-3 w-3" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">{item.category}</span>
                    <span className="text-xs text-muted-foreground">Qty: {item.qty}</span>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <p className={`font-semibold ${item.checked ? 'text-muted-foreground' : ''}`}>
                    ${(item.price * item.qty).toFixed(2)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">${item.price.toFixed(2)}/ea</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget & Stats Sidebar */}
        <div className="md:col-span-1 hidden md:flex flex-col gap-6">
          <Card className="shadow-sm border-0 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Budget Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between mb-2">
                <span className={`text-4xl font-extrabold ${isOverBudget ? 'text-red-600' : 'text-primary'}`}>
                  ${currentTotal.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground font-medium">/ ${MOCK_LIST.budget.toFixed(2)}</span>
              </div>
              <Progress 
                value={budgetPercentage} 
                className={`h-2.5 mt-4 ${isOverBudget ? 'bg-red-200 dark:bg-red-900 [&>div]:bg-red-600' : ''}`} 
              />
              <div className="flex justify-between items-center mt-3 text-xs">
                <span className="text-muted-foreground">Current Spent</span>
                <span className={`${isOverBudget ? 'text-red-600 font-semibold' : 'text-muted-foreground'}`}>
                  {isOverBudget ? 'Over Budget' : `$${(MOCK_LIST.budget - currentTotal).toFixed(2)} left`}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-dashed hover:bg-accent/50 transition-colors">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-1">
                <PieChart className="h-5 w-5" />
              </div>
              <h3 className="font-medium">Estimated Total</h3>
              <p className="text-2xl font-bold">${estimatedTotal.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">If all items are purchased</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Sticky Footer (Budget Meter & Checkout) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t md:hidden z-50">
        <div className="flex items-center justify-between mb-3 text-sm font-medium">
          <span className="text-muted-foreground">Budget: <span className={isOverBudget ? 'text-red-600' : 'text-foreground font-semibold'}>${currentTotal.toFixed(2)}</span> / ${MOCK_LIST.budget}</span>
          <span className="text-xs text-muted-foreground">{checkedCount} / {items.length} items</span>
        </div>
        <Progress 
          value={budgetPercentage} 
          className={`h-2 mb-4 ${isOverBudget ? 'bg-red-200 [&>div]:bg-red-600' : ''}`} 
        />
        <Button className="w-full h-12 text-md rounded-xl shadow-lg" disabled={checkedCount === 0}>
          Finish Trip & Log Expense
        </Button>
      </div>

    </div>
  );
}

// Importing PieChart here since it was missing above
import { PieChart } from "lucide-react";
