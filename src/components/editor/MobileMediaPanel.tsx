import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, X, GripVertical, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  caption: string;
}

interface MobileMediaPanelProps {
  photos: UploadedPhoto[];
  maxPhotos: number;
  selectedPhotoId: string | null;
  onPhotosChange: (photos: UploadedPhoto[]) => void;
  onPhotoSelect: (id: string | null) => void;
  onUpdateCaption: (id: string, caption: string) => void;
}

export function MobileMediaPanel({
  photos,
  maxPhotos,
  selectedPhotoId,
  onPhotosChange,
  onPhotoSelect,
  onUpdateCaption,
}: MobileMediaPanelProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remaining = maxPhotos - photos.length;
      if (remaining <= 0) {
        toast.warning(`Limite de ${maxPhotos} fotos atingido`);
        return;
      }

      const newPhotos = acceptedFiles
        .slice(0, remaining)
        .map((file) => ({
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
          caption: "",
        }));

      if (acceptedFiles.length > remaining) {
        toast.warning(`Apenas ${remaining} fotos adicionadas (limite: ${maxPhotos})`);
      }

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

  const selectedPhoto = photos.find((p) => p.id === selectedPhotoId);

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium">
          {isDragActive ? "Solte aqui" : "Adicionar fotos"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {photos.length}/{maxPhotos} fotos
        </p>
      </div>

      {/* Selected photo edit */}
      {selectedPhoto && (
        <div className="p-4 rounded-xl bg-muted/50 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={selectedPhoto.preview}
              alt="Selecionada"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedPhoto.file.name}</p>
              <Input
                placeholder="Adicionar legenda..."
                value={selectedPhoto.caption}
                onChange={(e) => onUpdateCaption(selectedPhoto.id, e.target.value)}
                className="mt-2 h-8 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Photos grid */}
      <ScrollArea className="h-48">
        <div className="grid grid-cols-4 gap-2">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden cursor-pointer ring-2 transition-all",
                selectedPhotoId === photo.id
                  ? "ring-primary"
                  : "ring-transparent hover:ring-primary/50"
              )}
              onClick={() => onPhotoSelect(photo.id)}
            >
              <img
                src={photo.preview}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Index badge */}
              <div className="absolute top-1 left-1 w-5 h-5 rounded bg-background/80 flex items-center justify-center">
                <span className="text-[10px] font-bold">{index + 1}</span>
              </div>

              {/* Selected check */}
              {selectedPhotoId === photo.id && (
                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}

              {/* Remove button */}
              <button
                className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-destructive/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(photo.id);
                }}
              >
                <X className="w-3 h-3 text-destructive-foreground" />
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {photos.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
          <p className="text-sm">Nenhuma foto adicionada</p>
        </div>
      )}
    </div>
  );
}
