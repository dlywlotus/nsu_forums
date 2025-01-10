import styles from "../styles/PostFilterBar.module.css";
import { filterOptions } from "./PostDashboard";
import { useState } from "react";
import SelectMenu from "./SelectMenu";

type props = {
  filterRef: React.MutableRefObject<filterOptions>;
  refetch: any;
};

const categoryOptions = [
  { value: "all", label: "all" },
  { value: "romance", label: "romance" },
  { value: "studies", label: "studies" },
  { value: "campus", label: "campus" },
  { value: "others", label: "others" },
];

const sortByOptions = [
  { value: "likes", label: "likes" },
  { value: "new", label: "new" },
];

export default function PostFilterBar({ filterRef, refetch }: props) {
  const [input, setInput] = useState("");

  const onSelect = (option: any, id: string) => {
    filterRef.current = {
      ...filterRef.current,
      [id]: option.value,
    };

    refetch();
  };

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    filterRef.current = {
      ...filterRef.current,
      searchKeyword: input.trim(),
    };
    refetch();
  };

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <div className={styles.label}>Category:</div>
        <SelectMenu
          options={categoryOptions}
          onChange={onSelect}
          id={"category"}
        />
        <div className={styles.label}>Sort by:</div>
        <SelectMenu options={sortByOptions} onChange={onSelect} id={"sortBy"} />
      </div>
      <form className={styles.search_bar} onSubmit={onSearch}>
        <input
          name='query'
          type='text'
          maxLength={25}
          placeholder='Search'
          onChange={e => setInput(e.target.value)}
          value={input}
        />
        <button className={styles.btn_search}>
          <i className='fa-solid fa-magnifying-glass'></i>
        </button>
      </form>
    </div>
  );
}
