import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
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
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import instanciaAxios from 'src/utils/instancia-axios';
import { toast } from "react-toastify"
import EditarClienteModal from './EditarCliente';

export const CustomerListResults = ({ clientes, refrescar, ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(25);
  const [editarCliente, setEditarCliente] = useState(null);
  const [abrirModal, setAbrirModal] = useState(false);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = clientes.map((customer) => customer.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const editar = (id) => {
    setEditarCliente(id);
    setAbrirModal(true);
  }

  const borrar = async (id) => {
    try {
      await instanciaAxios.delete(`/cliente/${id}`);
      toast.success("Cliente dado de baja correctamente")
      refrescar();
    } catch (error) {
      toast.error("Error al dar de baja al cliente")
    }
  }

  const handleClose = () => {
    setAbrirModal(false);
    setEditarCliente(null);
    refrescar();
  }

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === clientes.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0
                      && selectedCustomerIds.length < clientes.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Nombre
                </TableCell>
                <TableCell>
                  Ruc
                </TableCell>
                <TableCell>
                  Telefono
                </TableCell>
                <TableCell>
                  Fecha Creacion
                </TableCell>
                <TableCell>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.slice(page * limit, (limit + page * limit)).map((cliente) => (
                <TableRow
                  hover
                  key={cliente.id}
                  selected={selectedCustomerIds.indexOf(cliente.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(cliente.id) !== -1}
                      onChange={(event) => handleSelectOne(event, cliente.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {cliente.nombre}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {cliente.ruc}
                  </TableCell>
                  <TableCell>
                    {cliente.telefono}
                  </TableCell>
                  <TableCell>
                    {format(new Date(cliente.fechaCreacion), "dd-MM-yyyy")}
                  </TableCell>
                  <TableCell>
                    <Button
                      startIcon={(<EditIcon style={{ color: "blue" }} onClick={() => editar(cliente.id)} />)}
                      sx={{ mr: 1 }}
                    />
                    <Button
                      startIcon={(<DeleteIcon style={{ color: "red" }} onClick={() => borrar(cliente.id)} />)}
                      sx={{ mr: 1 }}
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
        count={clientes.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <EditarClienteModal id={editarCliente} open={abrirModal} handleClose={handleClose} />
    </Card>
  );
};

CustomerListResults.propTypes = {
  clientes: PropTypes.array.isRequired,
  refrescar: PropTypes.func.isRequired
};
