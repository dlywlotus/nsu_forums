import styles from "../styles/PostHeader.module.css";
import { post } from "./PostList";
import defaultIcon from "../images/defaultProfileIcon.png";
import { formatDistanceToNowStrict } from "date-fns";
import isBlobUrl from "../util/isBlobURL";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type props = {
  postContent: post;
};

const icon: Record<string, string> = {
  romance: "fa-solid fa-heart",
  studies: "fa-solid fa-book",
  campus: "fa-solid fa-house",
  others: "fa-solid fa-compass",
};

export default function PostHeader({ postContent }: props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const timeElapsed = formatDistanceToNowStrict(
    new Date(postContent.CreatedAt)
  );
  //added date query to stop caching
  const imgUrl = postContent.ProfilePic;
  const iconURl = imgUrl
    ? isBlobUrl(imgUrl)
      ? imgUrl
      : `${imgUrl}?date=${Date.now()}`
    : defaultIcon;

  return (
    <section className={styles.post_upper}>
      <div className={styles.icon}>
        {!isLoaded && <Skeleton circle={true} width={32} height={32} />}
        <img
          src={iconURl}
          onLoad={() => setIsLoaded(true)}
          alt='user_icon'
          data-loaded={isLoaded}
        ></img>
      </div>
      <div className={styles.post_details}>
        <div className={styles.categoryAndTime}>
          <div className={styles.category}>
            <i className={icon[postContent.Category]}></i>
            <span>{postContent.Category}</span>
          </div>
          <span>&middot;</span>
          <span className={styles.time}>{timeElapsed} ago</span>
        </div>
        <div className={styles.name}>
          <span>{postContent.Username}</span>
        </div>
      </div>
    </section>
  );
}
