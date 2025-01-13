import supabase from "../supabase";
import defaultIcon from "../images/defaultProfileIcon.svg";

const getIcon = (profilePic: string | null) => {
  return profilePic
    ? supabase.storage.from("profile_icons").getPublicUrl(profilePic).data
        .publicUrl
    : defaultIcon;
};

export default getIcon;
