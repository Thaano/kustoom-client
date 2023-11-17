const Button = ({ children, onClick = () => {} }) => {
  return (
    <button
      type="button"
      className="bg-gray-900 border border-[1px] hover:bg-gray-800 hover:text-white rounded-lg px-5 py-2"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
