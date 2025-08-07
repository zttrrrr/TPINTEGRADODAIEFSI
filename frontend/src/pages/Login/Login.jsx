import { useState, useContext, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"

import authService from "../../services/authService";
import {AuthContext} from "../../context/AuthContext";

const Login = () => {

    const { setUser, user } = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
      if (user) {
          navigate("/home");
      }
    }, [user, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await authService.login(username, password);
            setUser(response);
            navigate("/home");
        } catch (err) {
           setErrorMessage(err.message)
        }
    };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Login;
