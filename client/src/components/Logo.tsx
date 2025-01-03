import styles from "../styles/Logo.module.css";
import { Link } from "react-router-dom";

type props = {};

export default function Logo({}: props) {
  return (
    <Link className={styles.logo} to='/'>
      N<span>SU</span> Forums
    </Link>
  );
}
