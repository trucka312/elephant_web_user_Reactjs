import PropTypes from "prop-types";

export default function ListIcon({ className, ...rest }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
      {...rest}
    >
      <rect
        x="0.6"
        y="0.6"
        width="22.8"
        height="22.8"
        rx="2.4"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M18.3 8H5.7C5.3136 8 5 7.776 5 7.5C5 7.224 5.3136 7 5.7 7H18.3C18.6864 7 19 7.224 19 7.5C19 7.776 18.6864 8 18.3 8Z"
        fill="currentColor"
      />
      <path
        d="M18.3 13H5.7C5.3136 13 5 12.776 5 12.5C5 12.224 5.3136 12 5.7 12H18.3C18.6864 12 19 12.224 19 12.5C19 12.776 18.6864 13 18.3 13Z"
        fill="currentColor"
      />
      <path
        d="M18.3 18H5.7C5.3136 18 5 17.776 5 17.5C5 17.224 5.3136 17 5.7 17H18.3C18.6864 17 19 17.224 19 17.5C19 17.776 18.6864 18 18.3 18Z"
        fill="currentColor"
      />
    </svg>
  );
}

ListIcon.propTypes = {
  className: PropTypes.string,
};
