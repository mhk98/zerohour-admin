import { Input, WindmillContext } from "@windmill/react-ui";
import { BellIcon, MenuIcon, MoonIcon, SearchIcon } from "../icons";
import React, { useContext, useEffect, useState } from "react";
import { SidebarContext } from "../context/SidebarContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Link } from "react-router-dom/cjs/react-router-dom";
export default function Header() {
  const image = localStorage.getItem("image");
  const { mode, toggleMode } = React.useContext(WindmillContext);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const history = useHistory();
  // Toggle notification dropdown
  const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);

  // Toggle profile dropdown
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const { toggleSidebar } = useContext(SidebarContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };

  console.log("image", image);

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const id = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/user/${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUser(data.data);
      } catch (error) {
        setIsError(true);
        console.error("Error fetching the user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow">
      {/* Logo or Brand */}
      {/* <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">Windmill</h1> */}
      {/* <!-- Mobile hamburger --> */}
      <button
        className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-brandRed"
        onClick={toggleSidebar}
        aria-label="Menu"
      >
        <MenuIcon className="w-6 h-6" aria-hidden="true" />
      </button>
      {/* Search Input */}
      <div className="flex justify-center flex-1 lg:mr-32">
        <div className="relative w-full max-w-xl mr-6 focus-within:text-brandRed">
          <div className="absolute inset-y-0 flex items-center pl-2">
            <SearchIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <Input
            className="pl-8 text-gray-700"
            placeholder="Search for projects"
            aria-label="Search"
          />
        </div>
      </div>

      {/* Icons and Avatar */}
      <div className="flex items-center space-x-4">
        {/* <button onClick={toggleMode} className="text-brandRed focus:outline-none">
          <MoonIcon className="w-5 h-5" />
        </button> */}

        {/* Notification Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={toggleNotification}
            className="text-brandRed focus:outline-none"
          >
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full" />
          </button>
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <ul className="py-2 text-sm text-gray-800 dark:text-gray-200">
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  New comment on your post
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  Someone liked your project
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  You have a new follower
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Profile Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={toggleProfile}
            className="text-brandRed focus:outline-none"
          >
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={
                user?.image && user?.image !== "null"
                  ? `http://localhost:5000${user?.image}`
                  : "https://i.pravatar.cc/300"
              }
              alt="User avatar"
            />
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <ul className="py-2 text-sm text-gray-800 dark:text-gray-200">
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <Link to="/app/profile">Profile</Link>
                </li>
                {/* <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Settings</li> */}
                <li
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
