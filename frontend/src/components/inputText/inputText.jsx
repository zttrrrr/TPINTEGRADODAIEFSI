import "./inputText.css"

const InputText = ({ placeholder, value, onChange, name }) => {
  return (
    <div className="input-text-container">
      <input
        type="text"
        className="input-text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
      />
    </div>
  );
};
export default InputText