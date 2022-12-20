import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoggedinRoute from "./LoggedinRoute";
import UnloggedinRoute from "./UnloggedinRoute";
import Login from "./Login.js";
import Home from "./Home.js";
import Activate from "./Activate";
import Results from "./Results";
import loadScripts from "./loadScript";
import Rcmd from "./Rcmd";

function App() {
  loadScripts();

  return (
    <Routes>
      <Route element={<UnloggedinRoute />}>
        <Route path="/" element={<Login />} />
      </Route>
      <Route element={<LoggedinRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/rcmd" element={<Rcmd />} />
      </Route>
      <Route element={<UnloggedinRoute />}>
        <Route path="/activate" element={<Activate />} />
      </Route>
    </Routes>
  );
}

export default App;
