import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Home from "./Home";

export default function UnloggedinRoute() {
  // if the user exists then access the outlet, otherwise render the login page
  const { user } = useSelector((state) => ({ ...state }));
  return user ? <Home /> : <Outlet />;
}
