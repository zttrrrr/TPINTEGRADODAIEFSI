import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (user) {
      return children;  
    }
    else{
        return <Navigate to="/" />
    }
}

export default PrivateRoute;