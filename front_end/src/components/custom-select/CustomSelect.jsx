import Option from "../option/Option";
import Select from "react-select";

import "./CustomSelect.css";

// TODO: https://react-select.com/async
const CustomSelect = ({ value, onChange, onInputChange, placeholder, options, disabled }) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      onInputChange={onInputChange}
      isClearable={true}
      isDisabled={disabled}
      components={{ Option }}
      placeholder={disabled ? "Loading..." : placeholder}
      styles={{
        container: (provided, state) => ({
          ...provided,
          display: "flex",
          flex: 1,
          marginLeft: "8px",
          marginRight: "8px",
        }),
        control: (provided, state) => ({
          ...provided,
          display: "flex",
          flex: 1,
          borderRadius: "8px",
        }),
      }}
    />
  );
};

export default CustomSelect;
