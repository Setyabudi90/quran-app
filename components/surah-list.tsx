"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { MapPin, Search, SortAsc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { PrayerTimesModal } from "./prayer-times-modal";

interface Surah {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  audio: string;
}

type SortOption = "nomor" | "nama_latin" | "tempat_turun" | "jumlah_ayat";

export default function SurahList() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("nomor");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showPrayerTimes, setShowPrayerTimes] = useState(false);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch(
          "https://quran-api.santrikoding.com/api/surah"
        );
        const data = await response.json();
        setSurahs(data);
        setFilteredSurahs(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching surah data:", error);
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  useEffect(() => {
    if (surahs.length === 0) return;

    let filtered = [...surahs];
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (surah) =>
          surah.nama_latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          surah.arti.toLowerCase().includes(searchQuery.toLowerCase()) ||
          surah.nomor.toString().includes(searchQuery)
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "nomor") {
        comparison = a.nomor - b.nomor;
      } else if (sortBy === "jumlah_ayat") {
        comparison = a.jumlah_ayat - b.jumlah_ayat;
      } else if (sortBy === "nama_latin") {
        comparison = a.nama_latin.localeCompare(b.nama_latin);
      } else if (sortBy === "tempat_turun") {
        comparison = a.tempat_turun.localeCompare(b.tempat_turun);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    setFilteredSurahs(filtered);
  }, [searchQuery, surahs, sortBy, sortDirection]);

  const handleSort = (option: SortOption) => {
    console.log("Sorting by:", option, "Current sort:", sortBy, sortDirection);
    if (sortBy === option) {
      const newDirection = sortDirection === "asc" ? "desc" : "asc";
      console.log("Toggling direction to:", newDirection);
      setSortDirection(newDirection);
    } else {
      console.log("Setting new sort option:", option);
      setSortBy(option);
      setSortDirection("asc");
    }
  };

  const getSortLabel = () => {
    const labels = {
      nomor: "Nomor Surah",
      nama_latin: "Nama Surah",
      tempat_turun: "Tempat Turun",
      jumlah_ayat: "Jumlah Ayat",
    };
    return labels[sortBy];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-slate-100 text-slate-950" />
          <Input
            className="pl-10 py-3 backdrop-blur-sm bg-background/30 border-primary/20 dark:border-white/10 hover:bg-background/40"
            placeholder="Cari surah berdasarkan nama atau arti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-background/20 backdrop-blur-sm border-primary/20 dark:border-white/30 hover:bg-background/30"
              >
                <SortAsc className="h-4 w-4 mr-2" />
                Urut: {getSortLabel()} (
                {sortDirection === "asc" ? "A-Z" : "Z-A"})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Urutkan Berdasarkan</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSort("nomor")}>
                Nomor Surah{" "}
                {sortBy === "nomor" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("nama_latin")}>
                Nama Surah{" "}
                {sortBy === "nama_latin" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("tempat_turun")}>
                Tempat Turun{" "}
                {sortBy === "tempat_turun" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("jumlah_ayat")}>
                Jumlah Ayat{" "}
                {sortBy === "jumlah_ayat" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            className="bg-background/20 backdrop-blur-sm border-primary/20 dark:border-white/30 hover:bg-background/30"
            onClick={() => setShowPrayerTimes(true)}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Waktu Sholat
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <Card
                key={index}
                className="overflow-hidden backdrop-blur-sm bg-background/30 border-primary/20 dark:border-white/20"
              >
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))
          : filteredSurahs.map((surah) => (
              <Link href={`/surah/${surah.nomor}`} key={surah.nomor}>
                <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer h-full backdrop-blur-sm bg-background/30 hover:bg-background/40 border-primary/20 hover:border-primary/40 dark:border-white/20 dark:hover:border-white/40">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 dark:bg-white/10 text-primary font-medium text-sm  dark:text-white">
                          {surah.nomor}
                        </div>
                        <CardTitle className="text-xl">
                          {surah.nama_latin}
                        </CardTitle>
                      </div>
                      <div className="text-xl font-arabic">{surah.nama}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{surah.arti}</span>
                      <span className="capitalize">{surah.tempat_turun}</span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {surah.jumlah_ayat} Ayat
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>
      <PrayerTimesModal
        isOpen={showPrayerTimes}
        onClose={() => setShowPrayerTimes(false)}
      />
    </div>
  );
}
