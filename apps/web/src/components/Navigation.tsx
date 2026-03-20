import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-primary font-tracking-tight">
              Grocery<span className="text-foreground">Tracker</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Dashboard
            </Link>
            <Link href="/lists" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Lists
            </Link>
            <Link href="/expenses" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Expenses
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                Log in
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
