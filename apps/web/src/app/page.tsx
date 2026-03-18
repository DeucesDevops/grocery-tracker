import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, LineChart, ListTodo, MapPin } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-background to-background dark:from-blue-900/20"></div>
          
          <div className="container mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-muted-foreground mb-8 bg-background/50 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
              The ultimate shopping companion
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Plan, track, and master your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
                grocery spending.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Build smart shopping lists, compare prices across your favorite shops, and visualize your food expenses over time.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto rounded-full">
                  Start Tracking for Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto rounded-full bg-background/50 backdrop-blur-sm">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/50 border-t">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to shop smarter</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Take control of your budget before you even step foot in the aisle.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background rounded-2xl p-8 shadow-sm border transition-shadow hover:shadow-md">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-6">
                  <ListTodo className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Smart Lists</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Build lists quickly from your personal library. See a live running total against your budget as you check items off in-store.
                </p>
              </div>

              <div className="bg-background rounded-2xl p-8 shadow-sm border transition-shadow hover:shadow-md">
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-6">
                  <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Shop Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Log prices per item at specific shops. Find out definitively whether the local market or the superstore is cheaper.
                </p>
              </div>

              <div className="bg-background rounded-2xl p-8 shadow-sm border transition-shadow hover:shadow-md">
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-6">
                  <LineChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Rich Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Turn grocery trips into actionable data. View monthly expenditure charts by shop and by food category.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 border-t">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">
              Ready to tame your grocery bill?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <ul className="text-left space-y-3 mr-4">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" /> Free forever for basic use</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" /> Mobile optimized for in-store</li>
              </ul>
              <Link href="/auth/register">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                  Create your first list
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t text-center text-sm text-muted-foreground">
        <p suppressHydrationWarning>© {new Date().getFullYear()} Grocery Tracker. For shopping peace of mind.</p>
      </footer>
    </div>
  );
}
