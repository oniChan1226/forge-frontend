// import _bg from "@/assets/Auth/bg.png";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-screen min-h-screen overflow-auto flex flex-col items-center justify-center p-4">
      {/* Logo Section */}
      <div className="flex flex-col items-center space-y-2">
        <h2 className="font-eb-garamond text-2xl lg:text-3xl font-bold tracking-wide text-primary">
          Forge
        </h2>

        {/* underline accent */}
        <div className="w-12 h-1 rounded-full bg-linear-to-r from-primary via-primary to-transparent" />
      </div>

      {/* Auth Card */}
      <div className="mt-8 w-full flex justify-center ">{children}</div>
    </div>
  );
};
