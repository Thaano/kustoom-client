const Button = ({ children, onClick = () => {}, ...otherProps }) => {
  return (
    <button
      type="button"
      className="bg-gray-900 border hover:bg-gray-800 hover:text-white rounded-lg p-3 py-2 flex flex-row items-center gap-2"
      onClick={onClick}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default Button;
