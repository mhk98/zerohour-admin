import React from "react";
import routes from "../../routes/sidebar";
import { NavLink, Route } from "react-router-dom";
import * as Icons from "../../icons";
import SidebarSubmenu from "./SidebarSubmenu";
import { Button } from "@windmill/react-ui";
import { Link } from "react-router-dom/cjs/react-router-dom";
import logo from "../../assets/img/logo.png";
function Icon({ icon, ...props }) {
  const Icon = Icons[icon];
  return <Icon {...props} />;
}

function SidebarContent() {
  const userRole = localStorage.getItem("role");

  const filteredRoutes = routes.filter((route) =>
    route.roles?.includes(userRole)
  );

  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      <Link
        to="/"
        className="ml-6 flex flex-col justify-center text-lg font-bold text-gray-800 dark:text-gray-200"
      >
        {/* <img src={logo} alt="Logo" className="w-[130px] h-[40px]" /> */}
      <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">Newspaper</h1>

      </Link>

      <ul className="mt-6">
        {filteredRoutes.map((route) =>
          route.routes ? (
            <SidebarSubmenu route={route} key={route.name} />
          ) : (
            <li className="relative px-6 py-3" key={route.name}>
              <NavLink
                exact
                to={route.path}
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                activeClassName="text-gray-800 dark:text-gray-100"
              >
                <Route path={route.path} exact={route.exact}>
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-brandRed rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                </Route>
                <Icon
                  icon={route.icon}
                  className="w-5 h-5"
                  aria-hidden="true"
                />
                <span className="ml-4">{route.name}</span>
              </NavLink>
            </li>
          )
        )}
      </ul>

      <div className="px-6 my-6">
        <Button className="w-full" style={{ backgroundColor: "#C71320" }}>
          <Link
            to="/create-account"
            className="flex items-center justify-center"
          >
            Create account
            <span className="ml-2 text-lg" aria-hidden="true">
              +
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default SidebarContent;
