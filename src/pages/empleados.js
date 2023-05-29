import Head from "next/head";
import { Box, Container } from "@mui/material";
import { Toolbar } from "../components/Toolbar";
import { DashboardLayout } from "../components/dashboard-layout";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TablaDeUsuarios } from "src/components/empleados/Tabla";
import CrearUsuario from "src/components/empleados/Crear";
import EditarUsuario from "src/components/empleados/Editar";
import instanciaAxios from "src/utils/instancia-axios";

let timer = null;

const Empleados = () => {
  const [informacion, setInformacion] = useState([]);
  const [abrirCrear, setabrirCrear] = useState(false);
  const [abrirEditar, setabrirEditar] = useState(false);
  const [seleccionado, setseleccionado] = useState(null);

  useEffect(() => {
    obtenerInformacion();
  }, []);

  const obtenerInformacion = async (textBuscar = "") => {
    try {
      const respuesta = await instanciaAxios.get("/empleado",{
        params:{
          filtro: textBuscar
        }
      });
      setInformacion(respuesta.data);
      if (respuesta.data.length === 0) {
        toast.warning("No se encontraron empleados");
      }
    } catch (error) {
      toast.error("Error al obtener empleados");
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
        <title>Empleado</title>
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
            titulo="Empleado"
            textoBoton="Agregar empleado"
            clickBoton={() => setabrirCrear(true)}
            textoBusqueda="Buscar"
            onBuscar={onBuscar}
            soloBuscar
          />
          <Box sx={{ mt: 3 }}>
            <TablaDeUsuarios
              editar={(id) => {
                setabrirEditar(true);
                setseleccionado(id);
              }}
              informacion={informacion}
              refrescar={obtenerInformacion}
            />
          </Box>
        </Container>
        {abrirCrear && (
          <CrearUsuario
            open={abrirCrear}
            handleClose={() => {
              setabrirCrear(false);
              obtenerInformacion();
            }}
          />
        )}
        {abrirEditar && (
          <EditarUsuario
            id={seleccionado}
            open={abrirEditar}
            handleClose={() => {
              setabrirEditar(false);
              obtenerInformacion();
            }}
          />
        )}
      </Box>
    </>
  );
};
Empleados.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Empleados;
