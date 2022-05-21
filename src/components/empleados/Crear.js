import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import instanciaAxios from "src/utils/instancia-axios";
import * as Yup from "yup";
import IndicadorCarga from "../IndicadorCarga";
import { makeStyles } from "@mui/styles";
import { toast } from "react-toastify";
import { useMount } from "react-use";
import { MenuItem } from "@mui/material";

const useStyles = makeStyles({
  root: {
    minWidth: 600,
  },
});

// CrearUsuario es el componente para crear usuario
export default function CrearUsuario({ open, handleClose }) {
  const classes = useStyles();
  const [cargando, setCargando] = useState(false);
  const [tiposEmpleados, setTiposEmpleados] = useState([]);
  // useFormik se usa para el manejo de los formularios y validacion
  const formik = useFormik({
    // initialValues: objeto donde se colocan los valores iniciales
    initialValues: {
      nombre: "",
      apellido: "",
      telefono: "",
      cedula: "",
      tipoEmpleadoId: "",
    },
    // validationSchema: objecto con las validaciones a cada input del formulario
    validationSchema: Yup.object({
      nombre: Yup.string().max(255).required("Nombre es requerido"),
      apellido: Yup.string().max(255).required("Apellido es requerido"),
      telefono: Yup.string().max(255).required("Telefono es requerido"),
      cedula: Yup.string().max(255).required("cedula es requerido"),
      tipoEmpleadoId: Yup.string().max(255).required("Tipo de Empleado es requerido"),
    }),
    // Funcion que se ejecutara cuando los valores del formulario sean validos,
    // con respecto al validationSchema de arriba
    onSubmit: async (data) => {
      try {
        setCargando(true);
        await instanciaAxios.post(`/empleado`, data);
        toast.success("Empleado creado correctamente");
        formik.setValues({
          nombre: "",
          apellido: "",
          telefono: "",
          rolId: "",
        });
        handleClose();
      } catch (error) {
        toast.error("Error al crear empleado");
      } finally {
        setCargando(false);
      }
    },
  });

  // useMount se usa para ejecutar codigo al cargar el componente
  useMount(async () => {
    try {
      // Se piden los roles
      const respuesta = await instanciaAxios.get("/tipo-empleado");
      setTiposEmpleados(respuesta.data);
    } catch (error) {
      toast.error("Error al obtener tipos de empleados");
    }
  });

  console.log({ values: formik.values, errors: formik.errors, isValid: formik.isValid });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Crear Empleado</DialogTitle>
      {cargando ? (
        <div className={classes.root}>
          <IndicadorCarga />
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              error={Boolean(formik.touched.nombre && formik.errors.nombre)}
              helperText={formik.touched.nombre && formik.errors.nombre}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.nombre}
              autoFocus
              margin="dense"
              name="nombre"
              label="Nombre"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              error={Boolean(formik.touched.apellido && formik.errors.apellido)}
              helperText={formik.touched.apellido && formik.errors.apellido}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.apellido}
              margin="dense"
              name="apellido"
              label="Apellido"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              error={Boolean(formik.touched.telefono && formik.errors.telefono)}
              helperText={formik.touched.telefono && formik.errors.telefono}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.telefono}
              margin="dense"
              name="telefono"
              label="Telefono"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              error={Boolean(formik.touched.cedula && formik.errors.cedula)}
              helperText={formik.touched.cedula && formik.errors.cedula}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.cedula}
              margin="dense"
              name="cedula"
              label="Cedula"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              error={Boolean(formik.touched.tipoEmpleadoId && formik.errors.tipoEmpleadoId)}
              helperText={formik.touched.tipoEmpleadoId && formik.errors.tipoEmpleadoId}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.tipoEmpleadoId}
              margin="dense"
              name="tipoEmpleadoId"
              label="Tipo de empleado"
              select
              fullWidth
              variant="standard"
            >
              {tiposEmpleados.map((rol) => {
                return <MenuItem value={rol.id}>{rol.nombre}</MenuItem>;
              })}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}
