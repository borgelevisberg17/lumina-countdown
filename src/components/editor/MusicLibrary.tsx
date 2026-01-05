import { useState } from "react";
import {
  Music,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Check,
  Search,
  Library,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface MusicTrack {
  id: string;
  name: string;
  artist: string;
  duration: number;
  mood: string;
  url?: string;
  isCustom?: boolean;
}

const ROYALTY_FREE_TRACKS: MusicTrack[] = [
  { id: "1", name: "Happy Moments", artist: "Studio Vibes", duration: 120, mood: "uplifting" },
  { id: "2", name: "Emotional Journey", artist: "Cinematic Sounds", duration: 180, mood: "emotional" },
  { id: "3", name: "Energy Rush", artist: "Beat Masters", duration: 90, mood: "energetic" },
  { id: "4", name: "Peaceful Dreams", artist: "Ambient Waves", duration: 150, mood: "calm" },
  { id: "5", name: "Epic Adventure", artist: "Orchestra Pro", duration: 200, mood: "cinematic" },
  { id: "6", name: "Summer Vibes", artist: "Tropical Sound", duration: 110, mood: "uplifting" },
  { id: "7", name: "Deep Thoughts", artist: "Lo-Fi Beats", duration: 140, mood: "emotional" },
  { id: "8", name: "Night Drive", artist: "Synthwave Co", duration: 160, mood: "energetic" },
  { id: "9", name: "Sunrise Meditation", artist: "Zen Music", duration: 190, mood: "calm" },
  { id: "10", name: "Victory Theme", artist: "Game Audio", duration: 130, mood: "cinematic" },
];

interface MusicLibraryProps {
  selectedTrack: MusicTrack | null;
  onSelectTrack: (track: MusicTrack | null) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export function MusicLibrary({
  selectedTrack,
  onSelectTrack,
  volume,
  onVolumeChange,
}: MusicLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [customTracks, setCustomTracks] = useState<MusicTrack[]>([]);
  const [activeTab, setActiveTab] = useState("library");

  const filteredTracks = ROYALTY_FREE_TRACKS.filter(
    (track) =>
      track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.mood.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      toast.error("Selecione um arquivo de áudio válido");
      return;
    }

    const newTrack: MusicTrack = {
      id: crypto.randomUUID(),
      name: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Minha Música",
      duration: 0,
      mood: "custom",
      url: URL.createObjectURL(file),
      isCustom: true,
    };

    setCustomTracks((prev) => [...prev, newTrack]);
    onSelectTrack(newTrack);
    toast.success("Música adicionada!");
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getMoodEmoji = (mood: string) => {
    const moods: Record<string, string> = {
      uplifting: "🎉",
      emotional: "💫",
      energetic: "⚡",
      calm: "🌊",
      cinematic: "🎬",
      custom: "🎵",
    };
    return moods[mood] || "🎵";
  };

  const togglePlay = (trackId: string) => {
    setPlayingId(playingId === trackId ? null : trackId);
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mx-0 mb-3">
          <TabsTrigger value="library" className="text-xs">
            <Library className="w-3 h-3 mr-1" />
            Biblioteca
          </TabsTrigger>
          <TabsTrigger value="upload" className="text-xs">
            <Upload className="w-3 h-3 mr-1" />
            Minha Música
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="flex-1 flex flex-col mt-0 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar músicas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>

          {/* Track List */}
          <ScrollArea className="flex-1 -mx-4 px-4">
            <div className="space-y-1.5">
              {filteredTracks.map((track) => (
                <div
                  key={track.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all group",
                    selectedTrack?.id === track.id
                      ? "bg-primary/20 ring-1 ring-primary"
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => onSelectTrack(track)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay(track.id);
                    }}
                  >
                    {playingId === track.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{track.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.artist}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getMoodEmoji(track.mood)}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(track.duration)}
                    </span>
                    {selectedTrack?.id === track.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="upload" className="flex-1 flex flex-col mt-0 space-y-3">
          {/* Upload Area */}
          <label className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Upload sua música</p>
            <p className="text-xs text-muted-foreground mt-1">
              MP3, WAV, M4A até 50MB
            </p>
          </label>

          {/* Custom Tracks */}
          {customTracks.length > 0 && (
            <ScrollArea className="flex-1">
              <div className="space-y-1.5">
                {customTracks.map((track) => (
                  <div
                    key={track.id}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all",
                      selectedTrack?.id === track.id
                        ? "bg-primary/20 ring-1 ring-primary"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => onSelectTrack(track)}
                  >
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                      <Music className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{track.name}</p>
                      <Badge variant="secondary" className="text-[10px]">
                        Minha música
                      </Badge>
                    </div>
                    {selectedTrack?.id === track.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {customTracks.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <p className="text-sm">Nenhuma música enviada</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Volume Control */}
      {selectedTrack && (
        <div className="pt-3 border-t border-border mt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => onVolumeChange(volume > 0 ? 0 : 70)}
            >
              {volume > 0 ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={([v]) => onVolumeChange(v)}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-8">
              {volume}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 truncate">
            <Music className="w-3 h-3 inline mr-1" />
            {selectedTrack.name}
          </p>
        </div>
      )}
    </div>
  );
}
