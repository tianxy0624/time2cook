import "./menu.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function Menu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    dispatch({
      type: "LOGOUT",
    });
    Cookies.set("user", "");
    navigate("/");
  };
  return (
    <div className="menu">
      <span>Profile</span>
      <hr />
      <span onClick={() => logout()}>Logout</span>
    </div>
  );
}
