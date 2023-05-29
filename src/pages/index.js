import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { CustomerListResults } from '../components/customer/customer-list-results';
import { CustomerListToolbar } from '../components/customer/customer-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { customers } from '../__mocks__/customers';
import { useEffect, useState } from 'react';
import instanciaAxios from 'src/utils/instancia-axios';
import { toast } from 'react-toastify';

let timer = null;

const Customers = () => {
  const [clientes,setClientes]=useState([]);

  useEffect(() => {
    obtenerClientes();
  },[])

  const obtenerClientes = async (textBuscar = "") => {
    try {
      const clientes = await instanciaAxios.get("/cliente",{
        params:{
          filtro: textBuscar
        }
      });
      setClientes(clientes.data);
      if(clientes.data.length === 0){
        toast.warning("No se encontraron clientes")
      }
    } catch (error) {
      toast.error("Error al obtener los clientes")
    }
  }

  const onBuscar = (evento) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      obtenerClientes(evento.target.value);
    }, 800);
  };

  return (
    <>
      <Head>
        <title>
          Clientes
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={false}>
          <CustomerListToolbar refrescar={obtenerClientes} onBuscar={onBuscar} />
          <Box sx={{ mt: 3 }}>
            <CustomerListResults clientes={clientes} refrescar={obtenerClientes} />
          </Box>
        </Container>
      </Box>
    </>
  )
};
Customers.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Customers;
