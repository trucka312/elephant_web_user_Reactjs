import PropTypes from "prop-types";

export default function SendIcon({ className, ...rest }) {
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
      <g clipPath="url(#clip0_386_21)">
        <path
          d="M0.328494 22.9047C0.131283 23.8109 0.827065 24.1946 1.47267 23.9051L23.2924 12.7167H23.2946C23.5549 12.5699 23.706 12.3054 23.706 12.0003C23.706 11.6949 23.5549 11.4302 23.2946 11.2835H23.2924L1.47267 0.0949195C0.827065 -0.194579 0.131283 0.189165 0.328494 1.09544C0.341839 1.15683 1.6318 6.90286 2.33316 10.0279L13.7234 12.0002L2.33316 13.9722C1.6318 17.0971 0.34178 22.8433 0.328494 22.9047Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_386_21">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

SendIcon.propTypes = {
  className: PropTypes.string,
};
