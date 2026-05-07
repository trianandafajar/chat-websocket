"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, LogOut, User, Mail, Check, AtSign, Camera } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useMyProfile } from "./my-profile-context";

async function fileToCompressedDataUrl(file: File, maxSize = 256): Promise<string> {
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

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  userId?: string | null;
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

export function ProfileModal({ open, onClose, userId }: ProfileModalProps) {
  const { data: authSession, update } = useSession();
  const { refresh: refreshMyProfile } = useMyProfile();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [picture, setPicture] = useState<string>("");
  const [pictureChanged, setPictureChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isReadOnly = !!userId && userId !== authSession?.user?.id;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    setError(null);
    setSuccess(false);
    setShowLogoutConfirm(false);

    const url = isReadOnly ? `/api/users/${userId}` : "/api/profile";

    fetch(url, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data: Profile) => {
        setProfile(data);
        setName(data.name ?? "");
        setBio(data.bio ?? "");
        setPicture(data.picture ?? "");
        setPictureChanged(false);
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [open, userId, isReadOnly]);

  const hasChanges =
    profile &&
    (name.trim() !== (profile.name ?? "") ||
      bio.trim() !== (profile.bio ?? "") ||
      pictureChanged);

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

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
    if (!hasChanges || isReadOnly) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload: Record<string, string> = {
        name: name.trim(),
        bio: bio.trim(),
      };

      if (pictureChanged) {
        payload.picture = picture;
      }

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

      setTimeout(() => {
        setSuccess(false), 2000
        onClose();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/" });
  };

  if (!open || !mounted) return null;

  const initial = (name || profile?.name || "?").charAt(0).toUpperCase();
  const previewSrc = isReadOnly ? profile?.picture || "" : picture || profile?.picture || "";
  const displayName = isReadOnly ? profile?.name ?? "Unknown User" : name;
  const displayBio = isReadOnly ? profile?.bio : bio;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            {isReadOnly ? "Profile" : "Your Profile"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg cursor-pointer hover:bg-muted transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <ProfileSkeleton isReadOnly={isReadOnly} />
        ) : showLogoutConfirm ? (
          <div className="p-6">
            <h4 className="text-base font-semibold text-foreground">Sign out?</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              You'll need to sign in again to access your messages.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="cursor-pointer px-4 py-2.5 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="cursor-pointer px-4 py-2.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Avatar Preview */}
            <div className="flex flex-col items-center px-6 py-6 border-b border-border bg-gradient-to-br from-white to-blue-50">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/15 ring-4 ring-primary/20 flex items-center justify-center text-3xl font-semibold text-primary overflow-hidden">
                  {previewSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewSrc}
                      alt={displayName ?? ""}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    initial
                  )}
                </div>

                {!isReadOnly && (
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
                )}

                {isReadOnly && profile?.isOnline && (
                  <span className="absolute bottom-0.5 right-0.5 w-5 h-5 rounded-full bg-green-500 border-2 border-white" />
                )}
              </div>

              {isReadOnly && (
                <h4 className="mt-3 text-lg font-semibold text-foreground">
                  {displayName}
                </h4>
              )}

              <p className="mt-1 text-sm text-muted-foreground font-mono flex items-center gap-1">
                {isReadOnly ? (
                  <span className={profile?.isOnline ? "text-green-600 font-medium" : ""}>
                    {profile?.isOnline ? "● Active now" : "Offline"}
                  </span>
                ) : (
                  <>
                    <AtSign className="w-3 h-3" />
                    {profile?.email}
                  </>
                )}
              </p>
            </div>

            {/* Form / Read-only info */}
            <div className="p-6 space-y-5">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Profile updated
                </div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="profile-name" className="block text-sm font-semibold text-foreground">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="profile-name"
                    type="text"
                    value={displayName ?? ""}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    maxLength={50}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg transition ${
                      isReadOnly
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    }`}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="profile-bio" className="block text-sm font-semibold text-foreground">
                    Bio
                  </label>
                  {!isReadOnly && (
                    <span className="text-xs text-muted-foreground">{bio.length}/200</span>
                  )}
                </div>
                <textarea
                  id="profile-bio"
                  value={displayBio ?? ""}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={isReadOnly ? "" : "Tell people a little about yourself..."}
                  maxLength={200}
                  rows={3}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                  className={`w-full px-4 py-2.5 text-sm border border-border rounded-lg transition resize-none ${
                    isReadOnly
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  }`}
                />
              </div>

              {/* Email (only for own profile) */}
              {!isReadOnly && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={profile?.email ?? ""}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-muted text-muted-foreground border border-border rounded-lg cursor-not-allowed"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {isReadOnly ? (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-card/40">
                <button
                  onClick={onClose}
                  className="cursor-pointer px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-accent transition"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border bg-card/40">
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="cursor-pointer px-4 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className="cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

function ProfileSkeleton({ isReadOnly }: { isReadOnly: boolean }) {
  return (
    <>
      {/* Avatar block */}
      <div className="flex flex-col items-center px-6 py-6 border-b border-border bg-gradient-to-br from-white to-blue-50">
        <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
        {isReadOnly && (
          <div className="mt-3 h-5 w-32 rounded bg-muted animate-pulse" />
        )}
        <div className="mt-2 h-4 w-40 rounded bg-muted animate-pulse" />
      </div>

      {/* Body fields */}
      <div className="p-6 space-y-5">
        {/* Name field */}
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
        </div>

        {/* Bio field */}
        <div className="space-y-2">
          <div className="h-4 w-12 rounded bg-muted animate-pulse" />
          <div className="h-20 w-full rounded-lg bg-muted animate-pulse" />
        </div>

        {/* Email field (own profile only) */}
        {!isReadOnly && (
          <div className="space-y-2">
            <div className="h-4 w-16 rounded bg-muted animate-pulse" />
            <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border bg-card/40">
        <div className="h-8 w-20 rounded-lg bg-muted animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-20 rounded-lg bg-muted animate-pulse" />
          <div className="h-8 w-28 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
    </>
  );
}
