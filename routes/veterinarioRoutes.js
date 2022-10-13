import express from "express";
import { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword } from "../controllers/veterinarioControllers.js";
import checkAuth from "../middlewere/authMiddlewere.js";
const router = express.Router();

//Area publica
router.post("/", registrar)
router.get(`/confirm/:token`, confirmar)
router.post(`/login`, autenticar)
router.post("/forgot-password", olvidePassword)
router.get("/forgot-password/:token", comprobarToken)
router.post("/forgot-password/:token", nuevoPassword)

//Area privada
router.get("/perfil", checkAuth, perfil)
router.put("/perfil/:id", checkAuth, actualizarPerfil)
router.put("/update-password", checkAuth, actualizarPassword)

export default router;