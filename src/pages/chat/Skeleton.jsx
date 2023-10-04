
const SkeletonChatBox = () => {
  return Array(3)
    .fill((index) => (
      <div
        key={index}
        className="overflow-hidden animate-puls flex items-center justify-start gap-[16px] px-[16px] h-[72px]"
      >
        <div className="w-[45px] h-[45px] rounded-full bg-gray-200"></div>
        <div>
          <div className="h-[16px] w-[50px] bg-slate-200 rounded-md"></div>
          <div className="h-[16px] w-[100px] bg-slate-200 mt-2 rounded-md"></div>
        </div>
      </div>
    ))
    .map((item, index) => item(index));
};
export default SkeletonChatBox;
