import Option from "../option/Option";
import Select from "react-select";

import "./CustomSelect.css";

const CustomSelect = ({value, onChange, placeholder, options}) => {
  console.log(options,placeholder)
  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      isClearable={true}
      components={{ Option }}
      placeholder={placeholder}
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
        }),
      }}
    />
  );
};

export default CustomSelect;
