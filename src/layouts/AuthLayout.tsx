import _bg from "@/assets/Auth/bg.png";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-screen h-screen flex overflow-hidden">
      {/* Left side */}
      <div className="flex-1 flex items-center justify-center bg-gray-900 text-white">
        <img
          src={_bg}
          alt="Background"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
