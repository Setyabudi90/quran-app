import { ChevronLeft, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface SurahHeaderProps {
  surah: {
    nama_latin: string;
    arti: string;
    nama: string;
  };
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onToggleAudio: () => void;
  onSeekAudio: (time: number) => void;
  onGoBack: () => void;
}

export default function surahHeader({
  surah,
  isPlaying,
  currentTime,
  duration,
  onToggleAudio,
  onSeekAudio,
  onGoBack,
}: SurahHeaderProps) {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      if (currentScrollPos > 100) {
        setVisible(true);
        return;
      }

      setVisible(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return `${hours > 0 ? hours + ":" : ""}${
      hours > 0 ? String(minutes).padStart(2, "0") : minutes
    }:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="backdrop-blur-md bg-background/80 border-b border-primary/10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onGoBack}
                className="text-foreground"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex flex-col">
                <span className="font-medium">{surah.nama_latin}</span>
                <span className="text-xs text-muted-foreground">
                  {surah.arti}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleAudio}
                className="text-primary"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <div className="hidden md:flex items-center gap-2 w-64">
                <span className="text-xs text-muted-foreground w-10">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => onSeekAudio(Number(e.target.value))}
                  className="w-full h-1.5 bg-primary/20 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-muted-foreground w-10">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>

          <div className="md:hidden pb-2 px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => onSeekAudio(Number(e.target.value))}
                className="w-full h-1.5 bg-primary/20 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-muted-foreground">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
