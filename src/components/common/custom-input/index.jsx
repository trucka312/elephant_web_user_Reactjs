import { Input } from "antd";
import { useState } from "react";
import PropTypes from "prop-types";

const CustomInput = ({
  onChange,
  name,
  disabled,
  value,
  type = "text",
  placeholder,
  validate,
  index,
  prefix,
  ...props
}) => {
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const errorMessage = validate(e, index);
    setError(errorMessage);

    if (onChange) {
      onChange(e, index);
    }
  };

  return (
    <div className="flex flex-col">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        status={error && "error"}
        type={type}
        name={name}
        disabled={disabled}
        prefix={prefix}
        {...props}
      />
      {error && (
        <span style={{ color: "red" }} className="text-[13px]">
          {error}
        </span>
      )}
    </div>
  );
};

export default CustomInput;

CustomInput.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  validate: PropTypes.func,
  index: PropTypes.number,
  prefix: PropTypes.node,
};
