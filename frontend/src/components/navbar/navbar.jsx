import NavButtonText from "../navButtonText/NavButtonText";
import "./navbar.css"

import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const NavBar = () => {
    
    const {setUser} = useContext(AuthContext);
    
    const handleLogout = () => {
        setUser(null); // Clear user state
        localStorage.removeItem("user"); // Remove user from local storage
    }

    return (
        <>
            <div className="navbar">   
                <NavButtonText name={"/home"} text={"Home"} ></NavButtonText>
                <NavButtonText name={"/myevents"} text={"My events"} ></NavButtonText>
                <NavButtonText name={"/mylocations"} text={"My locations"} ></NavButtonText>
                <NavButtonText name={"/"} text={"Log Out"} onClick={handleLogout}  className="logout"></NavButtonText>
            </div>

        </>
    )
}
//                <ButtonText name={"/persona/:id"} text={"Persona"} ></ButtonText>
export default NavBar