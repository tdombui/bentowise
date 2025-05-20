'use client';
import { useState } from 'react';
import Image from 'next/image';

interface Photo {
  id: string;
  image_url: string;
}

export default function JobPhotoGallery({ photos }: { photos: Photo[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (photos.length === 0) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold mb-2">Photos</h2>
      <div className="grid grid-cols-3 gap-4">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setSelectedPhoto(photo.image_url)}
            className="block border rounded overflow-hidden hover:shadow-lg transition"
          >
            <Image
              src={photo.image_url}
              alt="Job Photo"
              width={300}
              height={200}
              className="w-full h-auto object-cover"
            />
          </button>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}  // 👈 Close on backdrop click
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}  // 👈 Prevent close when clicking image or close button
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-2 right-2 text-white text-2xl font-bold"
            >
              &times;
            </button>
            <Image
              src={selectedPhoto}
              alt="Full-size photo"
              width={800}
              height={600}
              className="max-w-full max-h-screen object-contain rounded shadow-lg"
              onClick={() => setSelectedPhoto(null)}  // 👈 Close on image click
            />
          </div>
        </div>
      )}

    </div>
  );
}
