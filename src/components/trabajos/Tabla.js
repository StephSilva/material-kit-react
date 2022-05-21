import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import instanciaAxios from "src/utils/instancia-axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export const Tabla = ({ informacion, refrescar, ...rest }) => {
  const router = useRouter();
  const [limit, setLimit] = useState(25);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const borrar = async (id) => {
    try {
      await instanciaAxios.delete(`/detalle-factura/${id}`);
      toast.success("Trabajo borrado correctamente");
      refrescar();
    } catch (error) {
      toast.error("Error al borrar trabajo");
    }
  };

  const getTotal = () => 0;

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Empleado</TableCell>
                <TableCell>Forma de Pago</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {informacion.slice(page * limit, (limit + page * limit)).map((fila) => (
                <TableRow hover>
                  <TableCell>{fila.cliente.nombre}</TableCell>
                  <TableCell>{fila.empleado.nombre}</TableCell>
                  <TableCell>{fila.tipoPago.nombre}</TableCell>
                  <TableCell>{getTotal()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => router.push(`/trabajos/${fila.id}`)}>
                      <EditIcon style={{ color: "blue" }} />
                    </IconButton>
                    <IconButton onClick={() => borrar(fila.id)}>
                      <DeleteIcon style={{ color: "red" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={informacion.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      {/* <EditarClienteModal id={editarCliente} open={abrirModal} handleClose={handleClose} /> */}
    </Card>
  );
};

Tabla.propTypes = {
  informacion: PropTypes.array.isRequired,
  refrescar: PropTypes.func.isRequired,
};
