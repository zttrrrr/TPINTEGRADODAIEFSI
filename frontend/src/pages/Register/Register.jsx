import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

import "../Login/Login.css"; // Reutilizás el mismo CSS del login

const Register = () => {
  
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            navigate("/home");
        }
    }, [user, navigate]);
  
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        password: "",
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.register(formData); 
            const loged = authService.login(formData.username, formData.password); // Automatically log in after registration
            setUser(loged);

            navigate("/home");
        } catch (err) {
            setErrorMessage("Error al registrar usuario");
            console.error(err);
        }
    };

    return (
        <form className="login-container" onSubmit={handleSubmit}>
        <h2>Registrarse</h2>

        <label htmlFor="first_name">Nombre</label>
        <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
        />

        <label htmlFor="last_name">Apellido</label>
        <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
        />

        <label htmlFor="username">Nombre de usuario</label>
        <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
        />

        <label htmlFor="password">Contraseña</label>
        <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
        />

        <button type="submit">Registrarse</button>

        {errorMessage && <p>{errorMessage}</p>}
        </form>
    );
};

export default Register;
