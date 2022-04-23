import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useFormik } from 'formik';
import instanciaAxios from 'src/utils/instancia-axios';
import * as Yup from 'yup';
import IndicadorCarga from '../IndicadorCarga';
import { makeStyles } from '@mui/styles';
import { toast } from "react-toastify"
import { useMount } from 'react-use';
import { MenuItem } from '@mui/material';

const useStyles = makeStyles({
    root: {
        minWidth: 600,
    }
})

// CrearUsuario es el componente para crear usuario 
export default function EditarUsuario({ id ,open, handleClose }) {
    const classes = useStyles();
    const [cargando, setCargando] = useState(false);
    const [roles, setRoles] = useState([]);
    // useFormik se usa para el manejo de los formularios y validacion
    const formik = useFormik({
        // initialValues: objeto donde se colocan los valores iniciales 
        initialValues: {
            nombre: '',
            nombreUsuario: '',
            contrasenia: '',
            rolId: ''
        },
        // validationSchema: objecto con las validaciones a cada input del formulario
        validationSchema: Yup.object({
            nombre: Yup
                .string()
                .max(255)
                .required(
                    'Nombre es requerido'),
            nombreUsuario: Yup
                .string()
                .max(255)
                .required(
                    'Nombre de usuario es requerido'),
            contrasenia: Yup
                .string()
                .max(255)
                .required(
                    'Contraseña es requerido'),
            rolId: Yup
                .string()
                .max(255)
                .required(
                    'Rol es requerido')
        }),
        // Funcion que se ejecutara cuando los valores del formulario sean validos, 
        // con respecto al validationSchema de arriba
        onSubmit: async (data) => {
            try {
                setCargando(true);
                await instanciaAxios.patch(`/usuario/`+id, data);
                toast.success("Usuario editado correctamente");
                formik.setValues({
                    nombre: "",
                    nombreUsuario: "",
                    contrasenia: "", 
                    rolId : ''
                })
                handleClose();
            } catch (error) {
                toast.error("Error al editar usuario");
            } finally {
                setCargando(false);
            }
        }
    });

    // useMount se usa para ejecutar codigo al cargar el componente
    useMount(async () => {
        try {
            // Se piden los roles
            const respuestaUsuario = await instanciaAxios.get('/usuario/'+id)
            const usuario = respuestaUsuario.data;
            formik.setValues({
                nombre: usuario.nombre,
                nombreUsuario: usuario.nombreUsuario,
                contrasenia: usuario.contrasenia,
                rolId: usuario.rolId,
            })
            const respuesta = await instanciaAxios.get("/rol")
            setRoles(respuesta.data)
        } catch (error) {
            toast.error("Error al obtener roles");
        }
    })

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Editar usuario</DialogTitle>
            {cargando ? <div className={classes.root}><IndicadorCarga /></div> : <form onSubmit={formik.handleSubmit}>
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
                        error={Boolean(formik.touched.nombreUsuario && formik.errors.nombreUsuario)}
                        helperText={formik.touched.nombreUsuario && formik.errors.nombreUsuario}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.nombreUsuario}
                        margin="dense"
                        name="nombreUsuario"
                        label="Nombre de usuario"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        error={Boolean(formik.touched.contrasenia && formik.errors.contrasenia)}
                        helperText={formik.touched.contrasenia && formik.errors.contrasenia}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.contrasenia}
                        margin="dense"
                        name="contrasenia"
                        label="Contraseña"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        error={Boolean(formik.touched.rolId && formik.errors.rolId)}
                        helperText={formik.touched.rolId && formik.errors.rolId}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.rolId}
                        margin="dense"
                        name="rolId"
                        label="Rol"
                        select
                        fullWidth
                        variant="standard"
                    >
                        {/* se recorren los roles y se devuelven como opciones del select */}
                        {roles.map(rol => {
                            return <MenuItem value={rol.id}>{rol.nombre}</MenuItem>
                        })}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type='submit'>Guardar</Button>
                </DialogActions>
            </form>}

        </Dialog>
    );
}