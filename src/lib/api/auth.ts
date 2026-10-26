import { apiClient } from "@/lib/api/api-client";
import {
  ProfilePictureUploadRequest,
  ProfilePictureUploadResponse,
  ProfilePictureResponse,
  ProfilePictureUploadRequestDto,
  ProfilePictureUploadResponseDto,
  ProfilePictureResponseDto,
  fromProfilePictureUploadRequest,
  toProfilePictureUploadResponse,
  toProfilePictureResponse,
} from "./types/auth";

export const authApi = {
  /**
   * Request a signed upload URL to Supabase storage for profile picture.
   * POST /api/v1/auth/profile-picture/upload-url
   */
  requestProfilePictureUploadUrl: async (
    contentType: "image/jpeg" | "image/png" | "image/webp",
    token: string,
    onRefresh: () => Promise<string | null>,
  ): Promise<ProfilePictureUploadResponse> => {
    const body: ProfilePictureUploadRequestDto =
      fromProfilePictureUploadRequest({
        contentType,
      });

    const response = await apiClient.post<ProfilePictureUploadResponseDto>(
      "/auth/profile-picture/upload-url",
      body,
      token,
      { onRefresh, skipSessionExpired: true },
    );

    return toProfilePictureUploadResponse(response);
  },

  /**
   * Directly uploads the image file binary to the signed Supabase Storage URL.
   */
  uploadImageToSignedUrl: async (
    signedUrl: string,
    file: File | Blob,
    contentType: string,
  ): Promise<void> => {
    const res = await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": contentType,
      },
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      throw new Error(
        `Failed to upload image to storage (${res.status}): ${errorText || res.statusText}`,
      );
    }
  },

  /**
   * Confirms the upload with backend so the URL is persisted on the user record.
   * POST /api/v1/auth/profile-picture/confirm-upload
   */
  confirmProfilePictureUpload: async (
    token: string,
    onRefresh: () => Promise<string | null>,
  ): Promise<ProfilePictureResponse> => {
    const response = await apiClient.post<ProfilePictureResponseDto>(
      "/auth/profile-picture/confirm-upload",
      undefined,
      token,
      { onRefresh, skipSessionExpired: true },
    );

    return toProfilePictureResponse(response);
  },

  /**
   * Full end-to-end profile picture upload flow:
   * 1. Request signed upload URL from backend
   * 2. Upload file binary directly to Supabase Storage signed URL
   * 3. Confirm upload with backend
   * Returns the final public profile picture URL.
   */
  uploadProfilePicture: async (
    file: File,
    token: string,
    onRefresh: () => Promise<string | null>,
  ): Promise<string> => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"] as const;
    const fileType = file.type as (typeof validTypes)[number];

    if (!validTypes.includes(fileType)) {
      throw new Error(
        "Unsupported image type. Only JPEG, PNG, and WebP images are supported.",
      );
    }

    // 1. Request signed upload URL
    const uploadDetails = await authApi.requestProfilePictureUploadUrl(
      fileType,
      token,
      onRefresh,
    );

    // 2. Upload directly to Supabase storage signed URL
    await authApi.uploadImageToSignedUrl(
      uploadDetails.signedUrl,
      file,
      fileType,
    );

    // 3. Confirm upload with backend
    const confirmation = await authApi.confirmProfilePictureUpload(
      token,
      onRefresh,
    );

    return confirmation.profilePicture;
  },
};

