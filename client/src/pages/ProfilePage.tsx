import styles from "../styles/ProfilePage.module.css";
import { useState } from "react";
import getCroppedImageBlob from "../util/getCroppedImageBlob";
import defaultIcon from "../images/defaultProfileIcon.png";
import ImageCropper from "../components/ImageCropper";
import { useUser } from "../Hooks/useUser";
import supabase from "../supabase";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ProfilePage() {
  const [uploadedImg, setUploadedImg] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const { userId } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImg(reader.result);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const onCropComplete = async (img: any, crop: any) => {
    try {
      setIsLoading(true);
      const croppedImgBlob: any = await getCroppedImageBlob(img, crop);

      setUploadedImg(URL.createObjectURL(croppedImgBlob));
      setIsCropping(false);
      setIsLoading(false);

      //upload new image / overwrite old one
      const { error: storageError } = await supabase.storage
        .from("profile_icons")
        .upload(`User_${userId}.jpg`, croppedImgBlob, {
          cacheControl: "0",
          upsert: true, // Allow overwriting the existing image
        });

      if (storageError) throw new Error(storageError.message);
    } catch (error) {
      setIsLoading(false);
      alert("Error uploading profile icon");
      console.log(error);
    }
  };

  return (
    <>
      <div className={styles.profile_pic}>
        <img
          className={styles.saved_icon}
          src={
            uploadedImg ??
            supabase.storage
              .from("profile_icons")
              .getPublicUrl(`User_${userId}.jpg`).data.publicUrl
          }
        />
        <img className={styles.default_icon} src={defaultIcon} alt='default' />
        <input type='file' onChange={handleImgUpload} />
        <span>Edit image</span>
      </div>

      {isCropping && (
        <ImageCropper imageSrc={uploadedImg} onCropComplete={onCropComplete} />
      )}
      {isLoading && <LoadingSpinner isLoading={isLoading} />}
    </>
  );
}
