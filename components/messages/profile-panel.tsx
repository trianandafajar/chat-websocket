"use client";

import { useEffect, useRef, useState } from "react";
import {
  Mail,
  X,
  AtSign,
  User,
  Camera,
  LogOut,
  Check,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Avatar } from "./avatar";
import { useMyProfile } from "./my-profile-context";

async function fileToCompressedDataUrl(
  file: File,
  maxSize = 256,
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * ratio);
  const h = Math.round(bitmap.height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.85);
}

interface Profile {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  bio: string | null;
  isOnline?: boolean;
  lastSeen?: string | null;
}

interface ProfilePanelProps {
  userId: string | null;
  isSelf: boolean;
  onClose?: () => void;
}

export function ProfilePanel({ userId, isSelf, onClose }: ProfilePanelProps) {
  const { update } = useSession();
  const { refresh: refreshMyProfile } = useMyProfile();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [picture, setPicture] = useState("");
  const [pictureChanged, setPictureChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setSuccess(false);
    setShowLogoutConfirm(false);

    const url = isSelf ? "/api/profile" : `/api/users/${userId}`;

    fetch(url, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Profile) => {
        if (cancelled) return;
        setProfile(data);
        setName(data.name ?? "");
        setBio(data.bio ?? "");
        setPicture(data.picture ?? "");
        setPictureChanged(false);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load profile");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, isSelf]);

  const hasChanges =
    !!profile &&
    isSelf &&
    (name.trim() !== (profile.name ?? "") ||
      bio.trim() !== (profile.bio ?? "") ||
      pictureChanged);

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Image too large (max 8MB)");
      return;
    }
    try {
      setError(null);
      const dataUrl = await fileToCompressedDataUrl(file, 256);
      setPicture(dataUrl);
      setPictureChanged(true);
    } catch {
      setError("Failed to read image");
    }
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload: Record<string, string> = {
        name: name.trim(),
        bio: bio.trim(),
      };
      if (pictureChanged) payload.picture = picture;

      const res = await fetch("/api/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Failed to update");
      }

      const updated: Profile = await res.json();
      setProfile(updated);
      setPicture(updated.picture ?? "");
      setPictureChanged(false);
      setSuccess(true);

      await update({ name: updated.name });
      await refreshMyProfile();

      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () =>
    signOut({ redirect: true, callbackUrl: "/" });

  if (!userId) return null;

  const initial = (name || profile?.name || "?").charAt(0).toUpperCase();
  const displayName = isSelf ? name : profile?.name ?? "Unknown User";
  const previewSrc = isSelf
    ? picture || profile?.picture || ""
    : profile?.picture || "";

  return (
    <aside className="hidden md:flex w-[300px] shrink-0 border-l border-border bg-card/40 flex-col">
      <div className="flex items-center justify-between px-4 py-6 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">
          {isSelf ? "Your Profile" : "Profile"}
        </h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted transition cursor-pointer"
            aria-label="Hide profile"
            title="Hide"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center px-6 py-6 border-b border-border">
          <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
          <div className="mt-3 h-5 w-32 rounded bg-muted animate-pulse" />
          <div className="mt-2 h-4 w-40 rounded bg-muted animate-pulse" />
        </div>
      ) : showLogoutConfirm ? (
        <div className="p-6">
          <h4 className="text-base font-semibold text-foreground">Sign out?</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            You&apos;ll need to sign in again to access your messages.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(false)}
              className="cursor-pointer px-4 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      ) : !profile ? (
        <div className="flex-1 flex items-center justify-center px-6 py-10 text-sm text-muted-foreground text-center">
          {error ?? "Profile unavailable"}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="flex flex-col items-center px-6 py-6 border-b border-border bg-gradient-to-br from-white to-blue-50">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/15 ring-4 ring-primary/20 flex items-center justify-center text-3xl font-semibold text-primary overflow-hidden">
                {previewSrc ? (
                  <Avatar
                    name={displayName}
                    picture={previewSrc}
                    size={96}
                    className="!ring-0 !border-0"
                  />
                ) : (
                  initial
                )}
              </div>

              {isSelf ? (
                <>
                  <button
                    type="button"
                    onClick={handlePickFile}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary hover:bg-accent text-primary-foreground flex items-center justify-center border-2 border-white shadow cursor-pointer transition"
                    title="Change photo"
                    aria-label="Change photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </>
              ) : (
                profile.isOnline && (
                  <span className="absolute bottom-0.5 right-0.5 w-5 h-5 rounded-full bg-green-500 border-2 border-white" />
                )
              )}
            </div>

            <h4 className="mt-3 text-base font-semibold text-foreground text-center">
              {displayName ?? "Unknown User"}
            </h4>
            <p
              className={`mt-0.5 text-xs flex items-center gap-1 ${
                isSelf
                  ? "text-muted-foreground font-mono"
                  : profile.isOnline
                    ? "text-green-600 font-medium"
                    : "text-muted-foreground"
              }`}
            >
              {isSelf ? (
                <>
                  <AtSign className="w-3 h-3" />
                  {profile.email}
                </>
              ) : profile.isOnline ? (
                "● Active now"
              ) : (
                "Offline"
              )}
            </p>
          </div>

          <div className="p-4 space-y-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4" /> Profile updated
              </div>
            )}

            {isSelf ? (
              <>
                <div className="space-y-1.5">
                  <label
                    htmlFor="profile-name"
                    className="block text-xs font-semibold text-foreground"
                  >
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="profile-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      maxLength={50}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="profile-bio"
                      className="block text-xs font-semibold text-foreground"
                    >
                      Bio
                    </label>
                    <span className="text-[10px] text-muted-foreground">
                      {bio.length}/200
                    </span>
                  </div>
                  <textarea
                    id="profile-bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell people about yourself..."
                    maxLength={200}
                    rows={3}
                    className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-foreground resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full pl-9 pr-3 py-2 text-sm bg-muted text-muted-foreground border border-border rounded-lg cursor-not-allowed"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {profile.bio && (
                  <div>
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                      About
                    </p>
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                    Email
                  </p>
                  <p className="text-sm text-foreground flex items-center gap-2 min-w-0">
                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                    Username
                  </p>
                  <p className="text-sm text-foreground flex items-center gap-2 min-w-0">
                    <AtSign className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="truncate">
                      {profile.email?.split("@")[0] ?? "—"}
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>

          {isSelf && (
            <div className="px-4 py-3 border-t border-border bg-card/40 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
