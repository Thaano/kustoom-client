const ErrorMsg = ({ children }) => {
  return (
    <div className="bg-red-500 px-5 py-2 rounded-lg text-center">
      {children}
    </div>
  );
};

export default ErrorMsg;
