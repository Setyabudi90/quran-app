"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Compass, MapPin, RotateCw } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { BackgroundMesh } from "@/components/background-mesh";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Coordinates {
  latitude: number;
  longitude: number;
}

export default function QiblaCompass() {
  const router = useRouter();
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>("prompt");
  const compassRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setPermissionStatus(result.state);

        result.onchange = function () {
          setPermissionStatus(this.state);
        };
      });
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Error getting location:", err);
          setError(
            "Tidak dapat mengakses lokasi Anda. Mohon izinkan akses lokasi untuk menggunakan kompas kiblat."
          );
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser Anda.");
    }
  }, []);

  useEffect(() => {
    if (location) {
      const kaabaLat = 21.4225;
      const kaabaLng = 39.8262;

      const userLat = location.latitude;
      const userLng = location.longitude;

      const userLatRad = userLat * (Math.PI / 180);
      const kaabaLatRad = kaabaLat * (Math.PI / 180);
      const lngDiffRad = (kaabaLng - userLng) * (Math.PI / 180);

      const y = Math.sin(lngDiffRad);
      const x =
        Math.cos(userLatRad) * Math.tan(kaabaLatRad) -
        Math.sin(userLatRad) * Math.cos(lngDiffRad);
      let qibla = Math.atan2(y, x) * (180 / Math.PI);

      qibla = (qibla + 360) % 360;

      setQiblaDirection(qibla);
    }
  }, [location]);

  useEffect(() => {
    let lastAlpha = 0;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        let heading = event.alpha;

        heading = lastAlpha * 0.8 + heading * 0.2;
        lastAlpha = heading;

        if (window.orientation !== undefined) {
          const screenOrientation = window.orientation || 0;
          heading = (360 - heading + screenOrientation) % 360;
        }

        setCompassHeading(heading);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    } else {
      setError(
        "Perangkat Anda tidak mendukung sensor orientasi yang diperlukan untuk kompas."
      );
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  useEffect(() => {
    if (
      compassRef.current &&
      compassHeading !== null &&
      qiblaDirection !== null
    ) {
      const needleRotation = qiblaDirection - compassHeading;

      compassRef.current.style.transition = "transform 0.3s ease-out";
      compassRef.current.style.transform = `rotate(${needleRotation}deg)`;
    }
  }, [compassHeading, qiblaDirection]);

  const requestOrientationPermission = async () => {
    if (
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      try {
        const permission = await (
          DeviceOrientationEvent as any
        ).requestPermission();
        if (permission === "granted") {
          setError(null);

          window.addEventListener(
            "deviceorientation",
            (event) => {
              if (event.alpha !== null) {
                let heading = event.alpha;

                if (window.orientation !== undefined) {
                  const screenOrientation = window.orientation || 0;
                  heading = (360 - heading + screenOrientation) % 360;
                }

                setCompassHeading(heading);
              }
            },
            true
          );
        } else {
          setError(
            "Izin orientasi perangkat ditolak. Kompas tidak akan berfungsi."
          );
        }
      } catch (err) {
        console.error("Error requesting device orientation permission:", err);
        setError("Tidak dapat mengakses sensor orientasi perangkat.");
      }
    }
  };

  const goBack = () => {
    router.back();
  };

  useEffect(() => {
    if (error && error.includes("tidak mendukung sensor")) {
      let angle = 0;
      const interval = setInterval(() => {
        angle = (angle + 1) % 360;
        if (compassRef.current && qiblaDirection !== null) {
          const simulatedHeading = angle;
          setCompassHeading(simulatedHeading);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [error, qiblaDirection]);

  return (
    <>
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goBack}
                className="bg-background/20 backdrop-blur-sm border-primary/20 hover:bg-background/30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold text-primary dark:text-white">Kompas Kiblat</h1>
            </div>
            <ThemeToggle />
          </div>

          <Card className="backdrop-blur-sm bg-background/30 border-primary/20 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary" />
                Arah Kiblat
              </CardTitle>
              <CardDescription>
                Gunakan kompas ini untuk menemukan arah kiblat dari lokasi Anda
                saat ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Terjadi Kesalahan</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

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

              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative w-64 h-64 mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 flex items-center justify-center">
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

                    <div
                      ref={compassRef}
                      className="absolute w-1 h-56 bg-gradient-to-t from-primary to-transparent origin-bottom"
                      style={{ transform: "rotate(0deg)" }}
                    >
                      <div className="absolute -left-2 -top-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-background rounded-full"></div>
                      </div>
                    </div>

                    <div className="absolute w-4 h-4 bg-primary rounded-full"></div>
                  </div>
                </div>

                {typeof (DeviceOrientationEvent as any).requestPermission ===
                  "function" && (
                  <Button
                    onClick={requestOrientationPermission}
                    className="mt-4"
                  >
                    Izinkan Akses Sensor
                  </Button>
                )}

                <p className="text-sm text-muted-foreground text-center mt-4">
                  Arahkan bagian atas ponsel Anda ke arah yang ditunjukkan oleh
                  jarum kompas untuk menghadap ke arah Kiblat
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-background/30 border-primary/20">
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
                4. Untuk hasil terbaik, gunakan di luar ruangan untuk
                menghindari gangguan magnetik.
              </p>
              <p>
                5. Kalibrasi kompas perangkat Anda jika arah yang ditunjukkan
                tidak akurat.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
