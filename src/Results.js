import "./Home.css";
import { useSelector } from "react-redux";
import { useState, useRef } from "react";
import Menu from "./Menu";
import { useNavigate } from "react-router-dom";
import "./results.css";
import Recipe from "./Recipe";

export default function Results() {
  const data = JSON.parse(localStorage.getItem("results"));
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state }));
  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState("");

  const menuHandler = () => {
    if (menu == true) {
      setMenu(false);
    } else {
      setMenu(true);
    }
  };

  const backHandler = () => {
    setShow("");
  };

  const homeHandler = () => {
    navigate("/");
  };

  return (
    <div>
      <div className="navibar">
        <img
          className="menu_icon"
          src="menu_icon.png"
          alt="menu"
          onClick={menuHandler}
        />
        {show == "" ? (
          <img
            className="home_icon"
            src="home_icon.webp"
            alt=""
            onClick={() => homeHandler()}
          />
        ) : (
          <img
            className="back_icon"
            src="back_icon.png"
            alt=""
            onClick={() => backHandler()}
          />
        )}

        <div className="userInfo">
          <span className="userName">{user.userName}</span>
          <img className="avatar_icon" src="avatar_icon.png" alt="avatar" />
        </div>
      </div>
      <div className="body">
        {menu && <Menu />}
        {show == "" ? (
          <div>
            <p className="result_title">Search Results:</p>
            <div className="results">
              {data.map((d, i) => {
                const top = Math.floor(i / 4);
                const idx = i % 4;
                return (
                  <Recipe
                    key={i}
                    img={d.picture_link}
                    value={d.title}
                    left={idx * 270}
                    top={top * 270}
                    setShow={setShow}
                    item={d}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div className="detail">
            <p className="result_title_detail">{show.title + ":"}</p>
            <div className="detail_img">
              <div className="recipe_detail">
                <img src={show.picture_link} alt="" />
              </div>
              <div className="instruction">
                <p className="result_title_detail">Instruction:</p>
                <p>{show.instructions}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
