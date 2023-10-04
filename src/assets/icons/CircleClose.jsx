import PropTypes from "prop-types";

export default function CircleClose({ className, ...rest }) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
      {...rest}
    >
      <path
        d="M12.3999 24.4C5.76461 24.4 0.399902 19.0353 0.399902 12.4C0.399902 5.76473 5.76461 0.400024 12.3999 0.400024C19.0352 0.400024 24.3999 5.76473 24.3999 12.4C24.3999 19.0353 19.0352 24.4 12.3999 24.4ZM12.3999 1.81179C6.54108 1.81179 1.81167 6.5412 1.81167 12.4C1.81167 18.2588 6.54108 22.9883 12.3999 22.9883C18.2587 22.9883 22.9881 18.2588 22.9881 12.4C22.9881 6.5412 18.2587 1.81179 12.3999 1.81179Z"
        fill="currentColor"
      />
      <path
        d="M17.541 6.26025L18.5391 7.25908L7.2591 18.5391L6.26099 17.541L17.541 6.26025Z"
        fill="currentColor"
      />
      <path
        d="M7.2591 6.26025L18.5391 17.5403L17.541 18.5391L6.26099 7.25908L7.2591 6.26025Z"
        fill="currentColor"
      />
    </svg>
  );
}

CircleClose.propTypes = {
  className: PropTypes.string,
};
