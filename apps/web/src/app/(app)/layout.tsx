import Link from "next/link";
import { LayoutDashboard, ListTodo, MapPin, Package, PieChart, Settings, LogOut } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-bold text-lg text-primary tracking-tight">
              Grocery<span className="text-foreground">Tracker</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/dashboard" className="transition-colors hover:text-primary text-foreground">
              Dashboard
            </Link>
            <Link href="/lists" className="transition-colors hover:text-primary text-muted-foreground">
              Lists
            </Link>
            <Link href="/expenses" className="transition-colors hover:text-primary text-muted-foreground">
              Expenses
            </Link>
            <Link href="/shops" className="transition-colors hover:text-primary text-muted-foreground">
              Shops
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 border border-border cursor-pointer overflow-hidden">
                <Avatar className="h-full w-full">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">JD</AvatarFallback>
                </Avatar>
              </Button>
            } />
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john.doe@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Desktop only) */}
        <aside className="hidden w-64 flex-col border-r bg-background md:flex">
          <nav className="filter-nav grid gap-2 p-4 text-sm font-medium">
            <Link href="/dashboard" className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-all">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Link>
            <Link href="/lists" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
              <ListTodo className="h-4 w-4" />
              Shopping Lists
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-semibold">2</span>
            </Link>
            <Link href="/items" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
              <Package className="h-4 w-4" />
              Item Library
            </Link>
            <Link href="/shops" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
              <MapPin className="h-4 w-4" />
              My Shops
            </Link>
            <div className="mt-4 border-t pt-4"></div>
            <Link href="/expenses" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
              <PieChart className="h-4 w-4" />
              Analytics
            </Link>
          </nav>
        </aside>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
