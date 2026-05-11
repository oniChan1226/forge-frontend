import { Input } from "@/components/ui/input";
import { Bell, Sun, Moon, Menu, Search } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import UserProfileButton from "./UserProfileButton";
import { useTheme } from "@/hooks/custom/use-theme";

interface HeaderProps {
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
}

const Header = ({ setMobileOpen }: HeaderProps) => {
  const [search, setSearch] = useState("");
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b flex items-center justify-between px-2 sm:px-4 md:px-6">
      {/* Mobile menu button */}
      <button
        className="lg:hidden p-2 rounded"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={20}/>
      </button>

      <div className="flex w-full items-center justify-between">
        <div className="left relative">
          <Search
            size={18}
            className="absolute hidden sm:block left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground"
          />
          <Input
            type="text"
            placeholder="Search projects, tasks or people"
            className="w-fit sm:w-96 lg:w-125 sm:pr-3 sm:pl-10 rounded-sm!"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></Input>
        </div>
        <div className="right flex items-center justify-center gap-x-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className=""
          >
            {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {/* Notification Bell */}
          <div className="relative ">
            <Bell size={20} />
          </div>
          {/* User Profile */}
          <UserProfileButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
