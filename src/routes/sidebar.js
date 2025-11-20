/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  // {
  //   path: "/app/dashboard", // the url
  //   icon: "HomeIcon", // the component being exported from icons/index.js
  //   name: "Dashboard", // name that appear in Sidebar
  //   roles: ["admin", "employee", "superAdmin", "student"],
  // },

  {
    path: "/app/user-management",
    icon: "PeopleIcon",
    name: "User Management",
    roles: ["admin", "superAdmin", "user"],
  },

  {
    path: "/app/news",
    icon: "PeopleIcon",
    name: "News",
    roles: ["admin", "superAdmin", "user"],
  },
  
  {
    path: "/app/profile",
    icon: "PeopleIcon",
    name: "Profile",
    roles: ["admin", "superAdmin", "user"],
  },
];

export default routes;
