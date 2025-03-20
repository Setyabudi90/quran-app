"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Surah {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  audio: string;
}

export default function SurahList() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
    if (searchQuery.trim() === "") {
      setFilteredSurahs(surahs);
    } else {
      const filtered = surahs.filter(
        (surah) =>
          surah.nama_latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          surah.arti.toLowerCase().includes(searchQuery.toLowerCase()) ||
          surah.nomor.toString().includes(searchQuery)
      );
      setFilteredSurahs(filtered);
    }
  }, [searchQuery, surahs]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-slate-100 text-slate-950" />
        <Input
          className="pl-10 py-3 backdrop-blur-sm bg-background/30 border-primary/20 dark:border-white/10 hover:bg-background/40"
          placeholder="Cari surah berdasarkan nama atau arti..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
    </div>
  );
}
