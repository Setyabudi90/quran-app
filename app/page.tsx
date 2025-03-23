import SurahList from "@/components/surah-list";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1
              className="text-3xl font-bold dark:text-white text-primary"
              id="nav"
            >
              BacaQur'an
            </h1>
            <div className="flex items-center gap-2">
              <Link href="/kompas/kiblat">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background/20 backdrop-blur-sm border-primary/20 dark:border-white/30 hover:bg-background/30"
                >
                  <Compass className="h-4 w-4" />
                  <span className="sr-only">Kompas Kiblat</span>
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
          <SurahList />
        </div>
      </main>
    </>
  );
}
