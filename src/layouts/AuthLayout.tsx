// import _bg from "@/assets/Auth/bg.png";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center overflow-hidden p-3">
      <div>
        {children}
      </div>
    </div>
  );
};
