import Head from "next/head";
import { Box, Container } from "@mui/material";
import { CustomerListResults } from "../../components/customer/customer-list-results";
import { DashboardLayout } from "../../components/dashboard-layout";
import { useEffect, useState } from "react";
import instanciaAxios from "src/utils/instancia-axios";
import { toast } from "react-toastify";
import { Toolbar } from "src/components/Toolbar";
import { Tabla } from "src/components/trabajos/Tabla";
import { useRouter } from "next/router";

const Customers = () => {
  const [clientes, setClientes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const clientes = await instanciaAxios.get("/detalle-factura");
      setClientes(clientes.data);
    } catch (error) {
      console.log({ error });
    }
  };

  const onBuscar = () => {};

  return (
    <>
      <Head>
        <title>Trabajos realizados</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 10,
        }}
      >
        <Container maxWidth={false}>
          <Toolbar
            titulo="Trabajos"
            textoBoton="Agregar nuevo trabajo"
            clickBoton={() => router.push("/trabajos/create")}
            textoBusqueda="Buscar"
            onBuscar={onBuscar}
            soloBuscar
          />
          <Box sx={{ mt: 3 }}>
            <Tabla informacion={clientes} refrescar={obtenerClientes} />
          </Box>
        </Container>
      </Box>
    </>
  );
};
Customers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Customers;
