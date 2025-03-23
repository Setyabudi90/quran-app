"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import KiblatCompass from "./kiblatCompass";

interface Coordinates {
  latitude: number;
  longitude: number;
}

export default function Page() {
  const router = useRouter();
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        setError("Tidak dapat mengakses lokasi. Mohon izinkan akses lokasi.");
      }
    );
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="bg-background/20 backdrop-blur-sm border-primary/20 hover:bg-background/30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-primary dark:text-white">
            Kompas Kiblat
          </h1>
        </div>
      </div>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <KiblatCompass location={location} />
      )}
    </div>
  );
}
