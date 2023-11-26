const LoadingLayout = () => {
  return (
    <>
      <div className="grid grid-cols-2 gap-x-4">
        <div className="skeleton rounded-lg px-2 py-1 mb-4 font-bold text-center flex flex-row items-center gap-4 justify-center h-[33px]"></div>
        <div className="skeleton rounded-lg px-2 py-1 mb-4 font-bold text-center flex flex-row items-center gap-4 justify-center h-[33px]"></div>
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        {Array.from(Array(10).keys()).map((i) => (
          <div className="skeleton h-[58px] items-center bg-gray-800 rounded-lg border px-2 py-1 mb-4 text-sm gap-1"></div>
        ))}
      </div>
    </>
  );
};

export default LoadingLayout;
