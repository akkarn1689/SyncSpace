import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import {
  User,
  Users, // For Groups
  MessageCircle, // For Chat
  Bell // For Notifications
} from 'lucide-react';
import SearchUsers from './SearchUsers';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const NavigationLinks = ({ className }) => (
    <div className={className}>
      <Link
        to="/groups"
        className="text-white hover:text-gray-400 transition-colors flex items-center gap-2"
      >
        <Users size={20} />
        Groups
      </Link>
      <Link
        to="/chat"
        className="text-white hover:text-gray-400 transition-colors flex items-center gap-2"
      >
        <MessageCircle size={20} />
        Chat
      </Link>
      <Link
        to="/notifications"
        className="text-white hover:text-gray-400 transition-colors flex items-center gap-2"
      >
        <Bell size={20} />
        Notifications
      </Link>
    </div>
  );

  return (
    <nav className="sticky">
      <div className="lg:mx-auto lg:w-[100%] lg:px-[5%] border-b sm:mx-6">
        <div className="flex items-center justify-between h-16">
          {/* Left section with brand */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex justify-start items-center text-xl font-bold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 m-2"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
              SyncSpace
            </Link>
          </div>

          <div className="flex justify-center items-center space-x-8">
            <SearchUsers />
          </div>

          {/* Right section with auth menu */}
          <div className="flex items-center">
            {/* Navigation links - visible on md and larger screens */}
            <NavigationLinks className="hidden md:flex items-center space-x-6 mr-6" />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="space-x-2">
                    <User className="h-5 w-5" />
                    <span>{user?.username || 'Menu'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="" align="end">
                  {/* Navigation links - visible on small screens only */}
                  <div className="md:hidden">
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link to="/groups" className="flex items-center gap-2">
                        <Users size={18} />
                        Groups
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link to="/chat" className="flex items-center gap-2">
                        <MessageCircle size={18} />
                        Chat
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link to="/notifications" className="flex items-center gap-2">
                        <Bell size={18} />
                        Notifications
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User size={18} />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;