import { Input } from "@/components/ui/input";
import { Bell, Menu, Search } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import UserProfileButton from "./UserProfileButton";

interface HeaderProps {
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
}

const Header = ({ setMobileOpen }: HeaderProps) => {
  const [search, setSearch] = useState("");

  return (
    <header className="h-16 border-b flex items-center justify-between px-4 md:px-6">
      {/* Mobile menu button */}
      <button
        className="md:hidden p-2 rounded"
        onClick={() => setMobileOpen(true)}
      >
        <Menu />
      </button>

      <div className="flex w-full items-center justify-between">
        <div className="left relative">
          <Search
            size={18}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          />
          <Input
            type="text"
            placeholder="Search..."
            className="w-64 sm:w-96 pl-3 pr-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></Input>
        </div>
        <div className="right flex items-center justify-center">
          {/* Notification Bell */}
          <div className="">
            <Bell size={18} />
          </div>
          {/* User Profile */}
          <UserProfileButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
