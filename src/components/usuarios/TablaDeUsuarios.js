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
// import EditarClienteModal from './EditarCliente';

export const TablaDeUsuarios = ({ informacion, refrescar, editar, ...rest }) => {
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
      await instanciaAxios.delete(`/usuario/${id}`);
      toast.success("Usuario dado de baja correctamente");
      refrescar();
    } catch (error) {
      toast.error("Error al dar de baja al usuario");
    }
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Nombre de usuario</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Fecha Creacion</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {informacion.slice(page * limit, (limit + page * limit)).map((fila) => (
                <TableRow hover>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Typography color="textPrimary" variant="body1">
                        {fila.nombre}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{fila.nombreUsuario}</TableCell>
                  <TableCell>{fila.rol.nombre}</TableCell>
                  <TableCell>{format(new Date(fila.fechaCreacion), "dd-MM-yyyy")}</TableCell>
                  <TableCell>
                    <Button
                      startIcon={<EditIcon style={{ color: "blue" }} />}
                      onClick={() => editar(fila.id)}
                      sx={{ mr: 1 }}
                    />
                    <Button
                      startIcon={<DeleteIcon style={{ color: "red" }} />}
                      sx={{ mr: 1 }}
                      onClick={() => borrar(fila.id)}
                    />
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

TablaDeUsuarios.propTypes = {
  informacion: PropTypes.array.isRequired,
  refrescar: PropTypes.func.isRequired,
};
