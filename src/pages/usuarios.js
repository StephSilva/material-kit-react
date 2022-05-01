import Head from "next/head";
import { Box, Container } from "@mui/material";
import { Toolbar } from "../components/Toolbar";
import { DashboardLayout } from "../components/dashboard-layout";
import { useEffect, useState } from "react";
import instanciaAxios from "src/utils/instancia-axios";
import { toast } from "react-toastify";
import { TablaDeUsuarios } from "src/components/usuarios/TablaDeUsuarios";
import CrearUsuario from "src/components/usuarios/CrearUsuario";
import EditarUsuario from "src/components/usuarios/EditarUsuario";

let timer = null;

const Usuarios = () => {
  const [informacion, setInformacion] = useState([]);
  const [abrirCrearUsuario, setAbrirCrearUsuario] = useState(false);
  const [abrirEditarUsuario, setAbrirEditarUsuario] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    obtenerInformacion();
  }, []);

  const obtenerInformacion = async (textBuscar = "") => {
    try {
      const respuesta = await instanciaAxios.get("/usuario?nombre=" + textBuscar);
      setInformacion(respuesta.data);
      if (respuesta.data.length === 0) {
        toast.warning("No se encontraron usuarios");
      }
    } catch (error) {
      toast.error("Error al obtener usuarios");
    }
  };

  const onBuscar = (evento) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      obtenerInformacion(evento.target.value);
    }, 800);
  };

  return (
    <>
      <Head>
        <title>Clientes</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Toolbar
            titulo="Usuarios"
            textoBoton="Agregar usuario"
            clickBoton={() => setAbrirCrearUsuario(true)}
            textoBusqueda="Buscar"
            onBuscar={onBuscar}
            soloBuscar
          />
          <Box sx={{ mt: 3 }}>
            <TablaDeUsuarios
              editar={(id) => {
                setAbrirEditarUsuario(true);
                setUsuarioSeleccionado(id);
              }}
              informacion={informacion}
              refrescar={obtenerInformacion}
            />
          </Box>
        </Container>
        {abrirCrearUsuario && (
          <CrearUsuario
            open={abrirCrearUsuario}
            handleClose={() => {
              setAbrirCrearUsuario(false);
              obtenerInformacion();
            }}
          />
        )}
        {abrirEditarUsuario && (
          <EditarUsuario
            id={usuarioSeleccionado}
            open={abrirEditarUsuario}
            handleClose={() => {
              setAbrirEditarUsuario(false);
              obtenerInformacion();
            }}
          />
        )}
      </Box>
    </>
  );
};
Usuarios.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Usuarios;
