import PropTypes from 'prop-types';

export default function NoImage({ className, ...rest }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
      {...rest}
    >
      <circle cx="30" cy="30" r="30" fill="#D9D9D9" />
      <path
        d="M30 16C31.8565 16 33.637 16.7375 34.9497 18.0503C36.2625 19.363 37 21.1435 37 23C37 24.8565 36.2625 26.637 34.9497 27.9497C33.637 29.2625 31.8565 30 30 30C28.1435 30 26.363 29.2625 25.0503 27.9497C23.7375 26.637 23 24.8565 23 23C23 21.1435 23.7375 19.363 25.0503 18.0503C26.363 16.7375 28.1435 16 30 16ZM30 33.5C37.735 33.5 44 36.6325 44 40.5V44H16V40.5C16 36.6325 22.265 33.5 30 33.5Z"
        fill="white"
      />
    </svg>
  );
}

NoImage.propTypes = {
  className: PropTypes.string,
};
