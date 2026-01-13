'use client';
import { UploadCloud } from 'lucide-react';
import { useState, useId } from 'react';

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const id = useId();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };


  return (
    <label
      htmlFor={id}
      className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 transition-colors hover:bg-muted/50"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <UploadCloud className="h-12 w-12 text-muted-foreground" />
      <p className="mt-4 text-sm font-semibold text-foreground">
        {file ? file.name : 'Drag and drop your file here'}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {file ? `${(file.size / 1024).toFixed(1)} KB` : 'CSV or XLSX, up to 10MB'}
      </p>
      <input
        id={id}
        type="file"
        className="absolute inset-0 h-full w-full opacity-0"
        onChange={handleFileChange}
        accept=".csv,.xlsx"
      />
    </label>
  );
}
