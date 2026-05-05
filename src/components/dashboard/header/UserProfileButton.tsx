import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut, User } from "lucide-react";
import { useMeQuery } from "@/hooks/queries/useUser.queries";
import { getInitials } from "@/utils/helpers";
import { useLogoutMutation } from "@/hooks/mutations/useAuth.mutations";
import Loader from "@/utils/Loader";
import { useNavigate } from "react-router";
import { ROUTE_PATHS } from "@/routes/route-paths";

const UserProfileButton = () => {
  const { data, isLoading } = useMeQuery();
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();

  const user = data?.data;

  const name = user?.name || "User";
  const email = user?.email || "guest@example.com";
  const avatar = user?.avatar;

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate(ROUTE_PATHS.login);
  };

  return (
    <DropdownMenu>
      {/* Trigger */}
      <DropdownMenuTrigger asChild>
        <button
          className="ml-4 flex items-center gap-2 rounded-full hover:bg-gray-100 p-1 transition"
          disabled={isLoading}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={avatar || ""} alt={name} />
            <AvatarFallback className="bg-primary text-white text-xs">
              {isLoading ? "..." : getInitials(name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      {/* Content */}
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 animate-in fade-in zoom-in-95"
      >
        {/* User Info */}
        <div className="flex items-center gap-3 p-2">
          <Avatar className="w-9 h-9">
            <AvatarImage src={avatar || ""} alt={name} />
            <AvatarFallback className="bg-primary text-white">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>

          <div className="leading-tight max-w-32">
            {isLoading ? (
              <>
                <p className="text-sm font-medium animate-pulse">Loading...</p>
                <p className="text-xs text-gray-400">please wait</p>
              </>
            ) : (
              <>
                <p className="font-medium text-sm capitalize truncate">
                  {name}
                </p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
              </>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2 cursor-pointer">
          <User size={16} />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2 cursor-pointer">
          <Settings size={16} />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="gap-2 text-red-500 focus:text-red-600 cursor-pointer font-medium data-highlighted:bg-red-50 dark:data-highlighted:bg-red-900/10"
          onClick={handleLogout}
        >
          <LogOut size={16} color="red" />
          <Loader
            isLoading={logoutMutation.isPending}
            loadedText="Logout"
            loadingText="logging out"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileButton;
