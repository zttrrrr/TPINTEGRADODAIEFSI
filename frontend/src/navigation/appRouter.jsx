import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from '../layout/mainLayout'

import Home from '../pages/Home/Home';
import MyEvents from "../pages/MyEvents/MyEvents";
import MyLocations from "../pages/MyLocations/MyLocations";
import Landing from "../pages/Landing/Landing";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Results from "../pages/Results/Results";
import EventDetail from "../pages/EventDetail/EventDetail";

import PrivateRoute from "./PrivateRoute";


const AppRouter = () => {
    return (
    <Router>
        <Routes>
            <Route element={<PrivateRoute> <MainLayout/> </PrivateRoute>}>
                <Route path="/home" element={<Home />} />
                <Route path="/myevents" element={<MyEvents />} />
                <Route path="/mylocations" element={<MyLocations />} />
                <Route path="/results" element={<Results/>} />
                <Route path="/eventDetail/:id" element={<EventDetail />} />
            </Route>

            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
        </Routes>
    </Router>
    )
}

export default AppRouter;