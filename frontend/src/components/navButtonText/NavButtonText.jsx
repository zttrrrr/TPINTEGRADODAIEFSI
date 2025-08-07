import { Link, useNavigate } from "react-router-dom";
import "./navButtonText.css";

const NavButtonText = ({ name, text, onClick, className = ""  }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();       
      onClick();                
      navigate(name);           
    }
  };

  return (
    <Link to={name} onClick={handleClick} className={`nav-button ${className}`}>
      <h1>{text}</h1>
    </Link>
  );
};

export default NavButtonText;
