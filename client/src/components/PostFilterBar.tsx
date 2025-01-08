import styles from "../styles/PostFilterBar.module.css";
import { filterOptions } from "./PostDashboard";
import { useState } from "react";

type props = {
  filterRef: React.MutableRefObject<filterOptions>;
  refetch: any;
};

export default function PostFilterBar({ filterRef, refetch }: props) {
  const [filterOptions, setFilterOptions] = useState<filterOptions>({
    sortBy: "new",
    category: "all",
    searchKeyword: "",
  });

  const onSelect = (
    e: React.ChangeEvent<HTMLSelectElement>,
    filterField: string
  ) => {
    setFilterOptions(f => ({ ...f, [filterField]: e.target.value }));
    filterRef.current = {
      ...filterRef.current,
      [filterField]: e.target.value,
    };
    refetch();
  };

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    filterRef.current = {
      ...filterRef.current,
      searchKeyword: filterOptions.searchKeyword.trim(),
    };
    refetch();
  };

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <div className={styles.form_group}>
          <label htmlFor='category'>Category:</label>
          <select
            id='category'
            className={styles.select_menu}
            onChange={e => onSelect(e, "category")}
            value={filterOptions?.category}
          >
            <option value='all'>all</option>
            <option value='romance'>romance</option>
            <option value='studies'>studies</option>
            <option value='campus'>campus</option>
            <option value='others'>others</option>
          </select>
        </div>
        <div className={styles.form_group}>
          <label htmlFor='sortBy'>Sort by:</label>
          <select
            id='sortBy'
            className={styles.select_menu}
            onChange={e => onSelect(e, "sortBy")}
            value={filterOptions?.sortBy}
          >
            <option value='new'>new</option>
            <option value='hot'>hot</option>
          </select>
        </div>
      </div>
      <form className={styles.search_bar} onSubmit={onSearch}>
        <input
          name='query'
          type='text'
          maxLength={25}
          placeholder='Search'
          onChange={e =>
            setFilterOptions(f => ({ ...f, searchKeyword: e.target.value }))
          }
          value={filterOptions.searchKeyword}
        />
        <button className={styles.btn_search}>
          <i className='fa-solid fa-magnifying-glass'></i>
        </button>
      </form>
    </div>
  );
}
