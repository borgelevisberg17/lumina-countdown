import { useState, useRef } from "react";
import { GripVertical, Plus, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  caption: string;
}

interface EditorTimelineProps {
  photos: UploadedPhoto[];
  selectedPhotoId: string | null;
  onPhotosChange: (photos: UploadedPhoto[]) => void;
  onPhotoSelect: (id: string | null) => void;
  duration: number;
}

export function EditorTimeline({
  photos,
  selectedPhotoId,
  onPhotosChange,
  onPhotoSelect,
  duration,
}: EditorTimelineProps) {
  const [zoom, setZoom] = useState(1);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const photoDuration = photos.length > 0 ? duration / photos.length : 3;
  const baseWidth = 80;
  const photoWidth = baseWidth * zoom;

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== id) {
      setDragOverId(id);
    }
  };

  const handleDragEnd = () => {
    if (draggedId && dragOverId) {
      const draggedIndex = photos.findIndex((p) => p.id === draggedId);
      const dropIndex = photos.findIndex((p) => p.id === dragOverId);

      if (draggedIndex !== -1 && dropIndex !== -1) {
        const newPhotos = [...photos];
        const [removed] = newPhotos.splice(draggedIndex, 1);
        newPhotos.splice(dropIndex, 0, removed);
        onPhotosChange(newPhotos);
      }
    }
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const timeMarkers = [];
  const interval = zoom >= 2 ? 5 : zoom >= 1 ? 10 : 15;
  for (let i = 0; i <= duration; i += interval) {
    timeMarkers.push(i);
  }

  return (
    <div className="h-40 md:h-48 bg-card border-t border-border flex flex-col">
      {/* Timeline Controls */}
      <div className="h-10 border-b border-border flex items-center justify-between px-3 md:px-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {photos.length} fotos
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Slider
            value={[zoom]}
            min={0.5}
            max={3}
            step={0.25}
            onValueChange={([v]) => setZoom(v)}
            className="w-16 md:w-24"
          />
          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => setZoom(Math.min(3, zoom + 0.25))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Time Ruler */}
      <div className="h-6 border-b border-border/50 relative overflow-hidden shrink-0">
        <div
          className="absolute top-0 left-0 h-full flex"
          style={{ width: photos.length * photoWidth + 100 }}
        >
          {timeMarkers.map((time) => (
            <div
              key={time}
              className="absolute top-0 h-full flex flex-col items-center"
              style={{ left: (time / duration) * (photos.length * photoWidth) }}
            >
              <div className="h-2 w-px bg-border" />
              <span className="text-[10px] text-muted-foreground">
                {formatTime(time)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Track */}
      <ScrollArea className="flex-1" ref={timelineRef}>
        <div className="h-full p-2 md:p-3 flex items-center gap-1 min-w-max">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              draggable
              onDragStart={(e) => handleDragStart(e, photo.id)}
              onDragOver={(e) => handleDragOver(e, photo.id)}
              onDragEnd={handleDragEnd}
              onDragLeave={handleDragLeave}
              onClick={() => onPhotoSelect(photo.id)}
              className={cn(
                "relative group cursor-grab active:cursor-grabbing rounded-lg overflow-hidden transition-all shrink-0",
                "border-2",
                selectedPhotoId === photo.id
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent hover:border-primary/50",
                dragOverId === photo.id && "border-secondary scale-105",
                draggedId === photo.id && "opacity-50"
              )}
              style={{
                width: photoWidth,
                height: "100%",
                maxHeight: 80,
              }}
            >
              <img
                src={photo.preview}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Index */}
              <div className="absolute top-1 left-1 w-5 h-5 rounded bg-background/80 flex items-center justify-center">
                <span className="text-[10px] font-bold">{index + 1}</span>
              </div>

              {/* Duration label */}
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-background/80">
                <span className="text-[10px]">{photoDuration.toFixed(1)}s</span>
              </div>

              {/* Drag handle */}
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-5 h-5 text-foreground drop-shadow-lg" />
              </div>
            </div>
          ))}

          {/* Add placeholder */}
          {photos.length === 0 && (
            <div className="h-full flex items-center justify-center text-muted-foreground px-8">
              <Plus className="w-5 h-5 mr-2" />
              <span className="text-sm">Adicione fotos para criar a timeline</span>
            </div>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
