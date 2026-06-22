import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ImageUpload({ value, onChange, className }) {
  const [preview, setPreview] = useState(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Silakan pilih file gambar.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file harus kurang dari 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onChange?.(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        id="image-upload-input"
      />

      {preview ? (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <img
            src={preview}
            alt="Pratinjau"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-xl bg-slate-900 text-rose-500 border border-slate-700 shadow-md hover:scale-105 hover:bg-slate-800 transition-all duration-200"
              aria-label="Hapus gambar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center h-48 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-slate-200 hover:border-primary/40 hover:bg-slate-50'
          )}
        >
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-sm group-hover:scale-110 transition-transform">
              <Upload className="h-5.5 w-5.5 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold">
                <span className="text-primary font-bold">Klik untuk mengunggah</span> atau seret dan lepas
              </p>
              <p className="text-[10px] font-medium text-slate-400 mt-1">PNG, JPG, WEBP (maks. 5MB)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
