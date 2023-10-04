import PropTypes from "prop-types";

export default function CircleThreeDot({ className, ...rest }) {
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
      <path
        d="M12 24C5.36471 24 0 18.6353 0 12C0 5.36471 5.36471 0 12 0C18.6353 0 24 5.36471 24 12C24 18.6353 18.6353 24 12 24ZM12 1.41176C6.14118 1.41176 1.41176 6.14118 1.41176 12C1.41176 17.8588 6.14118 22.5882 12 22.5882C17.8588 22.5882 22.5882 17.8588 22.5882 12C22.5882 6.14118 17.8588 1.41176 12 1.41176Z"
        fill="currentColor"
      />
      <circle cx="7.5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

CircleThreeDot.propTypes = {
  className: PropTypes.string,
};
