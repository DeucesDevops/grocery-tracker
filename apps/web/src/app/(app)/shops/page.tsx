import Link from "next/link";
import { Plus, MapPin, Navigation, Tag, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ShopsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Shops</h1>
          <p className="text-muted-foreground mt-1">
            Manage your frequently visited stores and compare prices.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add New Shop
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Shop Card 1 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <MapPin className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="text-xs font-normal">Supermarket</Badge>
            </div>
            <CardTitle className="text-xl mt-4 shrink-0">Aldi Supermarket</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Navigation className="h-3 w-3" /> 1.2 miles away
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              98 High Street, London, UK
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-sm font-medium">
                <Tag className="inline h-4 w-4 mr-1 text-muted-foreground" /> 145 Prices Logged
              </div>
              <Link href="/shops/aldi">
                <Button variant="ghost" size="sm" className="gap-1 h-8 text-primary">
                  View <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Shop Card 2 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400">
                <MapPin className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="text-xs font-normal">Farmers Market</Badge>
            </div>
            <CardTitle className="text-xl mt-4 shrink-0">Walthamstow Market</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Navigation className="h-3 w-3" /> 3.4 miles away
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              High Street, Walthamstow
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-sm font-medium">
                <Tag className="inline h-4 w-4 mr-1 text-muted-foreground" /> 32 Prices Logged
              </div>
              <Button variant="ghost" size="sm" className="gap-1 h-8 text-primary">
                View <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Shop Card 3 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <MapPin className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="text-xs font-normal">Convenience</Badge>
            </div>
            <CardTitle className="text-xl mt-4 shrink-0">Tesco Express</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Navigation className="h-3 w-3" /> 0.3 miles away
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Corner of Main Rd and 2nd
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-sm font-medium">
                <Tag className="inline h-4 w-4 mr-1 text-muted-foreground" /> 89 Prices Logged
              </div>
              <Button variant="ghost" size="sm" className="gap-1 h-8 text-primary">
                View <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
