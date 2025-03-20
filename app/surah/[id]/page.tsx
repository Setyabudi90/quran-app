"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Play, Pause, ArrowLeft, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { BackgroundMesh } from "@/components/background-mesh";

interface Ayat {
  id: number;
  surah: number;
  nomor: number;
  ar: string;
  tr: string;
  idn: string;
}

interface SurahNav {
  id: number;
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  deskripsi: string;
  audio: string;
}

interface SurahDetail {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  deskripsi: string;
  audio: string;
  ayat: Ayat[];
  surat_selanjutnya: SurahNav | false;
  surat_sebelumnya: SurahNav | false;
}

export default function SurahDetail() {
  const params = useParams();
  const router = useRouter();
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchSurahDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://quran-api.santrikoding.com/api/surah/${params.id}`
        );
        const data = await response.json();
        setSurah(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching surah detail:", error);
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSurahDetail();
    }
  }, [params.id]);

  useEffect(() => {
    if (surah) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }

      audioRef.current = new Audio(surah.audio);
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener("ended", () =>
            setIsPlaying(false)
          );
        }
      };
    }
  }, [surah]);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const goBack = () => {
    router.back();
  };

  const navigateToSurah = (surahNumber: number) => {
    router.push(`/surah/${surahNumber}`);
  };

  interface Ayat {
    id: number;
    surah: number;
    nomor: number;
    ar: string;
    tr: string;
    idn: string;
  }

  return (
    <>
      <BackgroundMesh />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goBack}
                className="bg-background/20 backdrop-blur-sm border-primary/20 dark:border-white/20 hover:bg-background/30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold text-primary dark:text-white">
                BacaQur'an
              </h1>
            </div>
            <ThemeToggle />
          </div>

          {loading ? (
            <div className="space-y-6">
              <Card className="backdrop-blur-sm bg-background/20 border-primary/20 dark:border-white/30">
                <CardHeader>
                  <Skeleton className="h-8 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>

              {Array.from({ length: 5 }).map((_, index) => (
                <Card
                  key={index}
                  className="backdrop-blur-sm bg-background/20 border-primary/20 dark:border-white/30"
                >
                  <CardContent className="pt-6">
                    <Skeleton className="h-6 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : surah ? (
            <div className="space-y-6">
              <Card className="backdrop-blur-sm bg-background/30 border-primary/20 dark:border-white/25">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">
                        {surah.nama_latin}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {surah.arti} • {surah.jumlah_ayat} Ayat
                      </p>
                    </div>
                    <div className="text-2xl font-arabic">{surah.nama}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-muted-foreground capitalize">
                      Diturunkan di {surah.tempat_turun}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleAudio}
                      className="bg-background/20 backdrop-blur-sm border-primary/20 hover:bg-background/30"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" /> Pause Audio
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" /> Play Audio
                        </>
                      )}
                    </Button>
                  </div>
                  <div
                    className="text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: surah.deskripsi }}
                  />
                </CardContent>
              </Card>

              <div className="space-y-4">
                {surah.ayat.map((ayat: Ayat) => (
                  <Card
                    key={ayat.nomor}
                    className="backdrop-blur-sm bg-background/30 hover:bg-background/40 transition-colors border-primary/20 dark:border-white/30 dark:hover:border-white/40"
                  >
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 dark:bg-white/20 text-primary dark:text-white/30 font-medium text-sm">
                          {ayat.nomor}
                        </div>
                      </div>
                      <p className="text-right text-2xl font-arabic leading-loose mb-4">
                        {ayat.ar}
                      </p>
                      <p
                        className="text-sm text-muted-foreground italic mb-2"
                        dangerouslySetInnerHTML={{ __html: ayat.tr }}
                      />
                      <p
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: ayat.idn }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between items-center mt-8 pt-4 border-t border-primary/10 dark:border-white/15">
                {surah.surat_sebelumnya ? (
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigateToSurah(
                        surah.surat_sebelumnya
                          ? surah.surat_sebelumnya.nomor
                          : 1
                      )
                    }
                    className="bg-background/20 backdrop-blur-sm border-primary/20 dark:border-white/25 hover:bg-background/30 flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <div className="flex flex-col items-start text-left">
                      <span className="text-xs text-muted-foreground">
                        Surah Sebelumnya
                      </span>
                      <span>{surah.surat_sebelumnya.nama_latin}</span>
                    </div>
                  </Button>
                ) : (
                  <div></div>
                )}

                {surah.surat_selanjutnya ? (
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigateToSurah(
                        surah.surat_selanjutnya
                          ? surah.surat_selanjutnya.nomor
                          : 1
                      )
                    }
                    className="bg-background/20 backdrop-blur-sm border-primary/20 hover:bg-background/30 flex items-center gap-2 dark:border-white/25"
                  >
                    <div className="flex flex-col items-end text-right">
                      <span className="text-xs text-muted-foreground">
                        Surah Selanjutnya
                      </span>
                      <span>{surah.surat_selanjutnya.nama_latin}</span>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Surah tidak ditemukan</p>
              <Button
                variant="outline"
                className="mt-4 bg-background/20 backdrop-blur-sm border-primary/20 hover:bg-background/30"
                onClick={goBack}
              >
                Kembali ke Daftar Surah
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
