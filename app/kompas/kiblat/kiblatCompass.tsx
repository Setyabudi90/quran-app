"use client";

import { useEffect, useState, useRef } from "react";
import { RotateCw, MapPin } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Coordinates {
  latitude: number;
  longitude: number;
}

export default function KiblatCompass({
  location,
}: {
  location: Coordinates | null;
}) {
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const compassRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!location) return;

    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;
    const userLatRad = (location.latitude * Math.PI) / 180;
    const kaabaLatRad = (kaabaLat * Math.PI) / 180;
    const lngDiffRad = ((kaabaLng - location.longitude) * Math.PI) / 180;

    const y = Math.sin(lngDiffRad);
    const x =
      Math.cos(userLatRad) * Math.tan(kaabaLatRad) -
      Math.sin(userLatRad) * Math.cos(lngDiffRad);
    let qibla = (Math.atan2(y, x) * 180) / Math.PI;

    qibla = (qibla + 360) % 360;
    setQiblaDirection(qibla);
  }, [location]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setCompassHeading((prev) =>
          prev ? prev * 0.8 + (event.alpha as number) * 0.2 : event.alpha
        );
      }
    };

    if ("DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation);
    } else {
      setError("Perangkat Anda tidak mendukung sensor orientasi.");
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  useEffect(() => {
    if (
      !compassRef.current ||
      compassHeading === null ||
      qiblaDirection === null
    )
      return;
    const needleRotation = qiblaDirection - compassHeading;
    compassRef.current.style.transform = `rotate(${needleRotation}deg)`;
  }, [compassHeading, qiblaDirection]);

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Terjadi Kesalahan</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {location ? (
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm">
            Lokasi Anda: {location.latitude.toFixed(4)}°,{" "}
            {location.longitude.toFixed(4)}°
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-4">
          <RotateCw className="h-4 w-4 animate-spin" />
          <span className="text-sm">Mendapatkan lokasi Anda...</span>
        </div>
      )}

      {qiblaDirection !== null && (
        <div className="text-sm mb-4">
          Arah Kiblat: {qiblaDirection.toFixed(1)}° dari utara
        </div>
      )}

      <Card className="backdrop-blur-sm bg-background/30 border-primary/20">
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-64 h-64 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 flex items-center justify-center">
                {/* Arah Mata Angin */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm font-bold">
                  N
                </div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm font-bold">
                  S
                </div>
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm font-bold">
                  W
                </div>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-bold">
                  E
                </div>

                {/* Garis-garis skala kompas */}
                {Array.from({ length: 72 }).map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-0.5 ${
                      i % 9 === 0 ? "h-3 bg-primary" : "h-1.5 bg-primary/50"
                    }`}
                    style={{
                      transform: `rotate(${i * 5}deg) translateY(-31px)`,
                      transformOrigin: "bottom center",
                    }}
                  />
                ))}

                {/* Jarum Kiblat */}
                <div
                  ref={compassRef}
                  className="absolute w-1 h-56 bg-gradient-to-t from-primary to-transparent origin-bottom"
                >
                  <div className="absolute -left-2 -top-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-background rounded-full"></div>
                  </div>
                </div>

                {/* Titik tengah kompas */}
                <div className="absolute w-4 h-4 bg-primary rounded-full"></div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center mt-4">
              Arahkan bagian atas ponsel Anda ke arah yang ditunjukkan oleh
              jarum kompas untuk menghadap ke arah Kiblat
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-background/30 border-primary/20 mt-4">
        <CardHeader>
          <CardTitle>Petunjuk Penggunaan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            1. Pastikan Anda mengizinkan akses lokasi dan sensor orientasi
            perangkat.
          </p>
          <p>
            2. Pegang ponsel Anda secara horizontal (datar) seperti kompas
            sungguhan.
          </p>
          <p>
            3. Jarum kompas akan menunjuk ke arah Kiblat (Ka'bah di Mekkah).
          </p>
          <p>
            4. Untuk hasil terbaik, gunakan di luar ruangan untuk menghindari
            gangguan magnetik.
          </p>
          <p>
            5. Kalibrasi kompas perangkat Anda jika arah yang ditunjukkan tidak
            akurat.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
