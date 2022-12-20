import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import "./login.css";

const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const userPool = new CognitoUserPool({
  UserPoolId: "us-east-1_rkSQOV9l9",
  ClientId: "537dvhvcp3juj1om1qpa6uqcfj",
});
const loginInfos = {
  email: "",
  password: "",
};

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, setlogin] = useState(loginInfos);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setlogin({ ...login, [name]: value });
  };
  const signUp = () => {
    const attributeList = [
      new CognitoUserAttribute({
        Name: "email",
        Value: login.email,
      }),
    ];

    userPool.signUp(
      login.email,
      login.password,
      attributeList,
      null,
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("user name is " + result.user.getUsername());
        console.log("call result: " + result);
      }
    );
    navigate("/activate");
  };

  const signIn = () => {
    const authenticationData = {
      Username: login.email,
      Password: login.password,
    };
    const authenticationDetails =
      new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    console.log(authenticationDetails);
    const userData = {
      Username: login.email,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        var accessToken = result.getAccessToken().getJwtToken();
        /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer */
        var idToken = result.idToken.jwtToken;
        console.log(accessToken, idToken);
        const data = { idToken: idToken, userName: login.email, results: "" };
        // Instantiate aws sdk service objects now that the credentials have been updated.
        // example: var s3 = new AWS.S3();
        console.log("Successfully logged!");
        dispatch({ type: "LOGIN", payload: data }); // dispatch the action object to the userReducer
        Cookies.set("user", JSON.stringify(data));
        navigate("/home");
        console.log(result);
      },

      onFailure: function (err) {
        alert(err.message || JSON.stringify(err));
      },
    });
  };

  return (
    <div className="site-wrapper">
      <div className="site-wrapper-inner">
        <div className="homepage-logo">
          <img src="/logo.png" />
        </div>
        <div className="loginbox">
          <div className="loginform">
            <h3
              style={{
                marginLeft: "35px",
                marginTop: "0",
                marginBottom: "20px",
              }}
            >
              Time to Cook!
            </h3>
            <div>
              <input
                name="email"
                placeholder="Email"
                onChange={changeHandler}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={changeHandler}
              />
            </div>
            <hr />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <button
                style={{
                  background: "rgb(182, 240, 240)",
                  borderRadius: "5px",
                  marginTop: "10px",
                  height: "30px",
                  width: "210px",
                }}
                id="submit"
                onClick={() => signIn()}
              >
                Sign In
              </button>
              <button
                style={{
                  background: "rgb(244, 216, 166)",
                  borderRadius: "5px",
                  marginTop: "10px",
                  height: "30px",
                  width: "210px",
                }}
                id="submit"
                onClick={() => signUp()}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer>copyright © wzxt·2022</footer>
    </div>
  );
}

export default Login;
