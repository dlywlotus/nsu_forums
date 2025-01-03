import styles from "../styles/AuthInputField.module.css";

type input = {
  username: string;
  email: string;
  password: string;
};

type props = {
  label: string;
  inputType: keyof input;
  input: input;
  setInput: React.Dispatch<React.SetStateAction<input>>;
};

export default function AuthInputField({
  label,
  inputType,
  input,
  setInput,
}: props) {
  return (
    <>
      <div className={styles.label}>{label}</div>
      <input
        onChange={e => {
          setInput(input => {
            return { ...input, [inputType]: e.target.value };
          });
        }}
        value={input[inputType]}
        type={inputType === "username" ? "text" : inputType}
      />
    </>
  );
}
