import SurahList from "@/components/surah-list";
import { ThemeToggle } from "@/components/theme-toggle";
import { BackgroundMesh } from "@/components/background-mesh";

export default function Home() {
  return (
    <>
      <BackgroundMesh />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1
              className="text-3xl font-bold dark:text-white text-primary"
              id="nav"
            >
              BacaQur'an
            </h1>
            <ThemeToggle />
          </div>
          <SurahList />
        </div>
      </main>
    </>
  );
}
