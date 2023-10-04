import PropTypes from 'prop-types';

export default function FacebookIcon({ className, ...rest }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
      {...rest}
    >
      <g clip-path="url(#clip0_106_18)">
        <path
          d="M30 15C30 6.71556 23.2844 0 15 0C6.71556 0 0 6.71556 0 15C0 22.4867 5.48444 28.6933 12.6556 29.8178V19.3356H8.84667V15H12.6556V11.6956C12.6556 7.93556 14.8956 5.86 18.3222 5.86C19.9644 5.86 21.68 6.15333 21.68 6.15333V9.84444H19.7889C17.9244 9.84444 17.3444 11 17.3444 12.1867V15H21.5044L20.84 19.3356H17.3444V29.8178C24.5156 28.6933 30 22.4867 30 15Z"
          fill="#4676ED"
        />
        <path
          d="M20.8378 19.3355L21.5022 15H17.3444V12.1867C17.3444 11 17.9244 9.84443 19.7889 9.84443H21.68V6.15332C21.68 6.15332 19.9644 5.85999 18.3222 5.85999C14.8956 5.85999 12.6556 7.93554 12.6556 11.6955V15H8.84666V19.3355H12.6556V29.8178C13.42 29.9378 14.2022 30 15 30C15.7978 30 16.58 29.9378 17.3444 29.8178V19.3355H20.8378Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_106_18">
          <rect width="30" height="30" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

FacebookIcon.propTypes = {
  className: PropTypes.string,
};
