"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface AvatarProps {
  name?: string | null;
  picture?: string | null;
  size?: number;
  className?: string;
}

function getInitial(name?: string | null) {
  return name?.trim().charAt(0).toUpperCase() || "?";
}

function isValidPicture(picture?: string | null): boolean {
  if (!picture) return false;
  const trimmed = picture.trim();
  if (!trimmed) return false;
  if (trimmed.includes("via.placeholder.com")) return false;
  return /^(https?:\/\/|data:image\/|\/)/i.test(trimmed);
}

export function Avatar({ name, picture, size = 40, className = "" }: AvatarProps) {
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
  }, [picture]);

  const showImage = isValidPicture(picture) && !errored;
  const initial = getInitial(name);

  return (
    <div
      className={`rounded-full flex items-center justify-center bg-muted text-foreground border border-border font-semibold shrink-0 overflow-hidden ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-label={name ?? "User"}
    >
      {showImage ? (
        <Image
          key={picture}
          src={picture as string}
          alt={name ?? ""}
          className="w-full h-full object-cover"
          onError={() => setErrored(true)}
          width={size}
          height={size}
          unoptimized
        />
      ) : (
        initial
      )}
    </div>
  );
}
