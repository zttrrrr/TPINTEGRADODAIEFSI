import { useState } from "react";
import InputText from "../inputText/inputText";

import { useNavigate } from "react-router-dom";
import "./searchBar.css";


const SearchBar = () => {

    const navigate = useNavigate();

    const [filtros, setFiltros] = useState({
        name: "",
        startDate: "",
        tag: ""
    });

    const handleChange = (e) => {
        setFiltros({ ...filtros, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate("/results", { state: { filtros } });
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
        <InputText
            placeholder="Buscar por nombre"
            value={filtros.name}
            onChange={handleChange}
            name="name"
        />
        <InputText
            placeholder="Buscar por fecha de inicio"
            value={filtros.startDate}
            onChange={handleChange}
            name="startDate"
        />
        <InputText
            placeholder="Buscar por descripción"
            value={filtros.tag}
            onChange={handleChange}
            name="tag"
        />

        <button type="submit" className="search-btn">
            Buscar
        </button>
        </form>
    );
};

export default SearchBar;
