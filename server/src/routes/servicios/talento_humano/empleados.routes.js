import { Router } from "express";
import { validacionForm } from "../../../middlewares/validacionForms.js";
import {
  ingresarEmpleado,
  getAllEmpleados,
  deleteAll,
  ingresarAllEmpleado,
  getVacacionesEmpleado,
  getCargosEmpleados,
  getAreas,
  createAreas,
  createCargos,
  getCargos,
  createCargoEmpleado,
  updateOne,
  diasVacacionesById,
} from "../../../controllers/services/talento_humano/empleados.controllers.js";
import { veryfyToken } from "../../../middlewares/auth.js";

const empleadosRouter = Router();

empleadosRouter.post("/emp", validacionForm, ingresarEmpleado);
empleadosRouter.get("/emp", getAllEmpleados);
empleadosRouter.get("/emp/vacaciones", getVacacionesEmpleado);
empleadosRouter.get("/emp/cargos", getCargosEmpleados);
empleadosRouter.post(
  "/emp/:ci_em/cargosEmp",
  validacionForm,
  createCargoEmpleado,
);
empleadosRouter.delete("/emp/:id/:modelo", deleteAll);
empleadosRouter.post(
  "/emp/:ci_em/:modelo",
  validacionForm,
  ingresarAllEmpleado,
);
empleadosRouter.get("/areas", getAreas);
empleadosRouter.post("/areas", validacionForm, createAreas);
empleadosRouter.post("/cargos", validacionForm, createCargos);
empleadosRouter.get("/cargos", getCargos);
empleadosRouter.put("/update-one", validacionForm, veryfyToken, updateOne);
empleadosRouter.get("/emp/dias-vacaciones/:ci_em", diasVacacionesById);

export default empleadosRouter;
