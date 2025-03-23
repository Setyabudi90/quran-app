"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PrayerTimesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface City {
  id: string;
  name: string;
}

export function PrayerTimesModal({ isOpen, onClose }: PrayerTimesModalProps) {
  const [selectedCity, setSelectedCity] = useState<string>("jakarta");
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const popularCities: City[] = [
    { id: "jakarta", name: "Jakarta" },
    { id: "surabaya", name: "Surabaya" },
    { id: "bandung", name: "Bandung" },
    { id: "medan", name: "Medan" },
    { id: "semarang", name: "Semarang" },
    { id: "makassar", name: "Makassar" },
    { id: "yogyakarta", name: "Yogyakarta" },
    { id: "palembang", name: "Palembang" },
  ];

  const [filteredCities, setFilteredCities] = useState<City[]>(popularCities);

  useEffect(() => {
    if (isOpen && selectedCity) {
      fetchPrayerTimes();
    }
  }, [isOpen, selectedCity, date]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCities(popularCities);
    } else {
      const filtered = popularCities.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [searchQuery]);

  const fetchPrayerTimes = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const mockTimes: Record<string, PrayerTimes> = {
          jakarta: {
            fajr: "04:38",
            sunrise: "05:52",
            dhuhr: "12:04",
            asr: "15:24",
            maghrib: "18:09",
            isha: "19:19",
          },
          surabaya: {
            fajr: "04:21",
            sunrise: "05:35",
            dhuhr: "11:47",
            asr: "15:07",
            maghrib: "17:52",
            isha: "19:02",
          },
          bandung: {
            fajr: "04:42",
            sunrise: "05:56",
            dhuhr: "12:08",
            asr: "15:28",
            maghrib: "18:13",
            isha: "19:23",
          },
          medan: {
            fajr: "05:12",
            sunrise: "06:26",
            dhuhr: "12:38",
            asr: "15:58",
            maghrib: "18:43",
            isha: "19:53",
          },
          semarang: {
            fajr: "04:30",
            sunrise: "05:44",
            dhuhr: "11:56",
            asr: "15:16",
            maghrib: "18:01",
            isha: "19:11",
          },
          makassar: {
            fajr: "04:53",
            sunrise: "06:07",
            dhuhr: "12:19",
            asr: "15:39",
            maghrib: "18:24",
            isha: "19:34",
          },
          yogyakarta: {
            fajr: "04:35",
            sunrise: "05:49",
            dhuhr: "12:01",
            asr: "15:21",
            maghrib: "18:06",
            isha: "19:16",
          },
          palembang: {
            fajr: "04:47",
            sunrise: "06:01",
            dhuhr: "12:13",
            asr: "15:33",
            maghrib: "18:18",
            isha: "19:28",
          },
        };

        setPrayerTimes(mockTimes[selectedCity] || mockTimes.jakarta);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      setLoading(false);
    }
  };

  const formatPrayerName = (name: string): string => {
    const names: Record<string, string> = {
      fajr: "Subuh",
      sunrise: "Terbit",
      dhuhr: "Dzuhur",
      asr: "Ashar",
      maghrib: "Maghrib",
      isha: "Isya",
    };
    return names[name] || name;
  };

  const handleCitySelect = (cityId: string) => {
    setSelectedCity(cityId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Jadwal Waktu Sholat
          </DialogTitle>
          <DialogDescription>
            Lihat jadwal waktu sholat untuk berbagai kota di Indonesia
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="times" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="times">Jadwal</TabsTrigger>
            <TabsTrigger value="cities">Pilih Kota</TabsTrigger>
          </TabsList>

          <TabsContent value="times" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">
                  {popularCities.find((c) => c.id === selectedCity)?.name ||
                    "Jakarta"}
                </span>
              </div>

              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-auto"
              />
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 w-16 bg-muted rounded mb-2"></div>
                      <div className="h-6 w-12 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : prayerTimes ? (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(prayerTimes).map(([key, time]) => (
                  <Card key={key} className="overflow-hidden">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <span className="text-sm text-muted-foreground mb-1">
                        {formatPrayerName(key)}
                      </span>
                      <span className="text-2xl font-semibold">{time}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Tidak ada data waktu sholat
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cities" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari kota..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {filteredCities.map((city) => (
                <Button
                  key={city.id}
                  variant={selectedCity === city.id ? "default" : "outline"}
                  className={selectedCity === city.id ? "bg-primary" : ""}
                  onClick={() => handleCitySelect(city.id)}
                >
                  {city.name}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
