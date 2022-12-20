import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const userPool = new CognitoUserPool({
  UserPoolId: "us-east-1_rkSQOV9l9",
  ClientId: "537dvhvcp3juj1om1qpa6uqcfj",
});

const verifyInfos = {
  email: "",
  code: "",
};

function Activate() {
  const navigate = useNavigate();
  const [code, setcode] = useState(verifyInfos);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setcode({ ...code, [name]: value });
  };

  const userData = {
    Username: code.email,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);
  const verify = () => {
    cognitoUser.confirmRegistration(code.code, true, function (err, result) {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      } else {
        navigate("/");
        console.log("call result: " + result);
      }
    });
  };

  return (
    <div className="site-wrapper white">
      <div className="site-wrapper-inner">
        <div className="homepage-logo">
          <img src="/logo.png" />
        </div>
        <div className="loginbox">
          <div className="loginform">
            <h3
              style={{
                marginLeft: "17px",
                marginTop: "0",
                marginBottom: "20px",
              }}
            >
              Time to Cook!
            </h3>
            <div>
              <label>Email</label>
              <input
                name="email"
                placeholder="Email"
                onChange={changeHandler}
              />
            </div>
            <div>
              <label>Code</label>
              <input name="code" placeholder="Code" onChange={changeHandler} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <button
                style={{
                  background: "rgb(182, 240, 240)",
                  borderRadius: "5px",
                  marginTop: "10px",
                  height: "30px",
                  width: "200px",
                }}
                id="submit"
                onClick={() => verify()}
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

export default Activate;
