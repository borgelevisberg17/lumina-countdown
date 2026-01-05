import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, X, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  caption: string;
}

interface EditorSidebarProps {
  photos: UploadedPhoto[];
  maxPhotos: number;
  selectedPhotoId: string | null;
  onPhotosChange: (photos: UploadedPhoto[]) => void;
  onPhotoSelect: (id: string | null) => void;
}

export function EditorSidebar({
  photos,
  maxPhotos,
  selectedPhotoId,
  onPhotosChange,
  onPhotoSelect,
}: EditorSidebarProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPhotos = acceptedFiles
        .slice(0, maxPhotos - photos.length)
        .map((file) => ({
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
          caption: "",
        }));

      onPhotosChange([...photos, ...newPhotos]);
    },
    [photos, maxPhotos, onPhotosChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/gif": [],
    },
    maxSize: 20 * 1024 * 1024,
  });

  const removePhoto = (id: string) => {
    const photo = photos.find((p) => p.id === id);
    if (photo) URL.revokeObjectURL(photo.preview);
    onPhotosChange(photos.filter((p) => p.id !== id));
    if (selectedPhotoId === id) onPhotoSelect(null);
  };

  const clearAll = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.preview));
    onPhotosChange([]);
    onPhotoSelect(null);
  };

  return (
    <div className="w-72 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Mídia</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {photos.length}/{maxPhotos}
          </span>
        </div>

        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all",
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            {isDragActive ? "Solte aqui..." : "Arraste ou clique"}
          </p>
        </div>
      </div>

      {/* Photos list */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={cn(
                "group relative flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all",
                selectedPhotoId === photo.id
                  ? "bg-primary/20 ring-1 ring-primary"
                  : "hover:bg-muted/50"
              )}
              onClick={() => onPhotoSelect(photo.id)}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab" />
              
              <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={photo.preview}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">
                  {photo.file.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {photo.caption || "Sem legenda"}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(photo.id);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}

          {photos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p className="text-xs">Nenhuma foto ainda</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      {photos.length > 0 && (
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={clearAll}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar tudo
          </Button>
        </div>
      )}
    </div>
  );
}
