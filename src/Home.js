import "./Home.css";
import { useSelector } from "react-redux";
import Option from "./Option";
import { useState, useRef, useEffect } from "react";
import Menu from "./Menu";
import { useNavigate } from "react-router-dom";
import { ingredients } from "./ingredients";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state }));
  const [searchItem, setSearchItem] = useState("");
  const [menu, setMenu] = useState(false);
  const bar = useRef(null);

  const searchHandler = (e) => {
    const { name, value } = e.target;
    setSearchItem(value);
  };

  const menuHandler = () => {
    if (menu == true) {
      setMenu(false);
    } else {
      setMenu(true);
    }
  };

  const searchClickHandler = function () {
    console.log(searchItem);
    // bar.value;
    const prevtag = document.getElementById("search_code");
    if (prevtag != null) {
      prevtag.remove();
    }
    var tag = document.createElement("script");
    tag.async = false;
    tag.type = "text/javascript";
    tag.id = "search_code";
    tag.innerHTML =
      "var sdk = apigClientFactory.newClient({});\
      var resp = sdk.searchGet({ q: '" +
      searchItem +
      "', usr:'" +
      user.userName +
      "' }, {}, {});\
      resp.then(result => {const data  = result.data;\
        console.log(data);\
        localStorage.removeItem('results');\
        localStorage.setItem('results', JSON.stringify(data));\
        document.location.href = 'http://localhost:3000/results';\
        });";
    document.body.appendChild(tag);
  };

  const rcmdHandler = function () {
    const prevtag = document.getElementById("rcmd_code");
    if (prevtag != null) {
      prevtag.remove();
    }
    var tag = document.createElement("script");
    tag.async = false;
    tag.type = "text/javascript";
    tag.id = "rcmd_code";
    tag.innerHTML =
      "var sdk = apigClientFactory.newClient({});\
      var rcmd = sdk.rcmdGet({ usr:'" +
      user.userName +
      "' }, {}, {});\
      rcmd.then(d => {const data  = d.data;\
        console.log(data);\
        localStorage.removeItem('rcmd');\
        localStorage.setItem('rcmd', JSON.stringify(data));\
        document.location.href = 'http://localhost:3000/rcmd';\
        });";
    document.body.appendChild(tag);
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
        <div className="userInfo">
          <span className="userName">{user.userName}</span>
          <img className="avatar_icon" src="avatar_icon.png" alt="avatar" />
        </div>
      </div>
      <div className="body">
        {menu && <Menu />}
        <div className="search">
          <input
            value={searchItem}
            ref={bar}
            onChange={searchHandler}
            placeholder="search ingredients..."
          />
          <img
            className="search_icon"
            src="search_icon.png"
            alt="search"
            onClick={() => searchClickHandler()}
          />
        </div>
        <div className="options">
          <div className="column1">
            {ingredients.slice(0, 3).map((d, i) => {
              return (
                <Option
                  key={i}
                  item={d.item}
                  color={d.color}
                  value={d.value}
                  top={i * 6}
                  searchItem={searchItem}
                  search={setSearchItem}
                  bar={bar}
                />
              );
            })}
          </div>
          <div className="column2">
            {ingredients.slice(3, 6).map((d, i) => {
              return (
                <Option
                  key={i}
                  item={d.item}
                  color={d.color}
                  value={d.value}
                  top={i * 6}
                  searchItem={searchItem}
                  search={setSearchItem}
                  bar={bar}
                />
              );
            })}
          </div>
          <div className="column3">
            {ingredients.slice(6, 9).map((d, i) => {
              return (
                <Option
                  key={i}
                  item={d.item}
                  color={d.color}
                  value={d.value}
                  top={i * 6}
                  searchItem={searchItem}
                  search={setSearchItem}
                  bar={bar}
                />
              );
            })}
          </div>
        </div>
        <div className="recommendation">
          <a onClick={rcmdHandler}>Go to recommendation</a>
        </div>
      </div>
    </div>
  );
}
