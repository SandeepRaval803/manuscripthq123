import React, { useState } from "react";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";
import ImageCrop from "./ImageCrop";
import { useAuth } from "@/context/userContext";
import { updateUserDetails } from "@/apiCall/auth";

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(
    "https://apis.manuscripthq.com/api/utility/upload-image",
    { method: "POST", body: formData }
  );
  const data = await res.json();
  return data.imageUrl || null;
};

export default function ProfileImage({ profileUrl, setLoading, loading }) {
  const { token, updateUser } = useAuth();
  const [file, setFile] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setIsCropping(true);
    }
  };

  const getCroppedBlob = async (imageFile, crop) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(imageFile);
    await new Promise((r) => (img.onload = r));
    const canvas = document.createElement("canvas");
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      img,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject()), "image/jpeg");
    });
  };

  const uploadAndNotify = async (croppedBlob) => {
    setLoading(true);
    try {
      const url = await uploadFile(croppedBlob);
      if (url) {
        const res = await updateUserDetails({ profilePicture: url }, token);
        if (res.status !== "success") {
          toast.error(res.message);
        } else {
          updateUser(res.user);
          toast.success("Profile Picture Changed!");
        }
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCropConfirm = async (crop) => {
    setIsCropping(false);
    if (!file || !crop) return;
    try {
      const blob = await getCroppedBlob(file, crop);
      await uploadAndNotify(new File([blob], file.name));
    } catch {
      toast.error("Cropping failed");
    }
  };

  return (
    <div className="relative flex justify-center items-center">
      <div className="w-32 h-32 relative">
        <img
          src={profileUrl || "/images/avatar.jpg"}
          alt="Profile"
          className="rounded-full object-cover w-full h-full border-3 border-[#eaa8f9]"
        />
        <button
          onClick={() => document.getElementById("file-input").click()}
          className="absolute bottom-1 right-1 bg-[#eaa8f9] p-2 rounded-full"
          disabled={loading}
        >
          <Camera size={16} />
        </button>
      </div>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {isCropping && (
        <ImageCrop
          selectedFile={file}
          aspect={1}
          onConfirm={handleCropConfirm}
          onClose={() => setIsCropping(false)}
        />
      )}
    </div>
  );
}
