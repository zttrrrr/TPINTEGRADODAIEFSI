import { Router } from "express";
import UserService from "../services/user-service.js";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.post("/register", async (req, res) => {
    const { first_name, last_name, username, password } = req.body;
    const result = await UserService.register({ first_name, last_name, username, password });
    if (result.success) {
        return res.status(StatusCodes.CREATED).json(result);
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json(result);
    }
});

router.post("/login", async (req, res) => {

    console.log("BODY:", req.body);
    const { username, password } = req.body;
    const result = await UserService.login({ username, password });
    if (result.status === 200) {
        return res.status(StatusCodes.OK).json(result.body);
    } else if (result.status === 400) {
        return res.status(StatusCodes.BAD_REQUEST).json(result.body);
    } else {
        return res.status(StatusCodes.UNAUTHORIZED).json(result.body);
    }
});

export default router; 