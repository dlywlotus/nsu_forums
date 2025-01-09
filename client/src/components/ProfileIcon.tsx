import { useRef, useState } from "react";
import getCroppedImageBlob from "../util/getCroppedImageBlob";
import defaultIcon from "../images/defaultProfileIcon.png";
import ImageCropper from "../components/ImageCropper";
import supabase from "../supabase";
import styles from "../styles/ProfileIcon.module.css";
import axios from "axios";
import getSession from "../util/getSession";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import mutateUserDetails from "../util/mutateUserDetails";
import { useUser } from "../Hooks/useUser";
import showError from "../util/showError";

type props = {
  iconURL: string | null;
};

export default function ProfileIcon({ iconURL }: props) {
  const { userId } = useUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<any>(null);
  const [uploadedImg, setUploadedImg] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImg(reader.result);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    } else {
      showError("Please upload a valid image file");
    }
  };

  const mutateProfilePic = async (imageBlob: Blob) => {
    const { token } = await getSession();

    //upload new image / overwrite old one to supabase storage
    const { error: storageError } = await supabase.storage
      .from("profile_icons")
      .upload(`User_${userId}.jpg`, imageBlob, {
        cacheControl: "0",
        upsert: true, // Allow overwriting the existing image
      });

    if (storageError) throw new Error(storageError.message);

    //get imageURL
    const imageURL = supabase.storage
      .from("profile_icons")
      .getPublicUrl(`User_${userId}.jpg`).data.publicUrl;

    //store image url in db
    await axios.put(
      `${import.meta.env.VITE_SERVER_API_URL}/auth_req/edit_user/${userId}`,
      {
        profilePic: imageURL,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const mutation = useMutation({
    mutationFn: mutateProfilePic,
    onMutate: imageBlob => {
      const tempImageURl = URL.createObjectURL(imageBlob);
      const undoFn = mutateUserDetails(
        tempImageURl,
        "ProfilePic",
        queryClient,
        userId
      );
      return undoFn;
    },
    onError: (err, _, undo) => {
      undo && undo();
      showError("Error uploading profile icon");
      console.log(err);
    },
  });

  const onCropComplete = async (img: any, crop: any) => {
    try {
      setIsCropping(false);
      fileInputRef.current.value = "";
      const croppedImgBlob: any = await getCroppedImageBlob(img, crop);
      mutation.mutate(croppedImgBlob);
    } catch (error) {
      showError("Error uploading profile icon");
      console.log(error);
    }
  };

  return (
    <>
      <div className={styles.profile_pic}>
        <img src={iconURL ?? defaultIcon} alt='default' />
        <input type='file' ref={fileInputRef} onChange={handleImgUpload} />
        <span>Edit image</span>
      </div>

      {isCropping && (
        <ImageCropper imageSrc={uploadedImg} onCropComplete={onCropComplete} />
      )}
    </>
  );
}
