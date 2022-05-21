import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMount } from "react-use";
import instanciaAxios from "src/utils/instancia-axios";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { makeStyles } from "@mui/styles";
import { AgGridReact } from "ag-grid-react";
import { AddCircleOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { SelectRenderer } from "../GridCellRenderers";
import { isEmpty } from "lodash";

const useStyles = makeStyles({
  cardHeader: {
    paddingTop: "10px",
    paddingBottom: "10px",
  },
  item: {
    paddingTop: "5px !important",
  },
  cardContent: {
    paddingTop: "15px",
    paddingBottom: "15px",
  },
  grid: {
    "& .ag-cell": {
      height: "100% !important",
    },
  },
});

export const Detalle = (props) => {
  const { formData, isEdit } = props;
  const classes = useStyles();
  const router = useRouter();
  const [gridData, setGridData] = useState([]);
  const [gridApi, setGridApi] = useState();
  const [clientes, setClientes] = useState([]);
  const [tipoPagos, setTipoPagos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [tipoTrabajos, setTipoTrabajos] = useState([]);

  const obtenerSelectData = async () => {
    const requests = [
      instanciaAxios.get(`/cliente`),
      instanciaAxios.get(`/tipo-pago`),
      instanciaAxios.get(`/empleado`),
      instanciaAxios.get(`/tipo-trabajo`),
    ];
    const [cliente, tipoPago, empleados, tipoTrabajos] = await Promise.all(requests);
    setClientes(cliente.data);
    setTipoPagos(tipoPago.data);
    setEmpleados(empleados.data);
    setTipoTrabajos(tipoTrabajos.data);
  };

  const formik = useFormik({
    initialValues: {
      tipoPagoId: formData?.tipoPagoId,
      clienteId: formData?.clienteId,
      empleadoId: formData?.empleadoId,
    },
    validationSchema: Yup.object({
      tipoPagoId: Yup.number().required("Forma de pago es requerido"),
      clienteId: Yup.number().required("Cliente es requerido"),
      empleadoId: Yup.number().required("Empleado es requerido"),
    }),
    onSubmit: async (data) => {
      try {
        let respuesta = null;
        const rowData = getRowData();
        if (isEdit) {
          respuesta = await instanciaAxios.patch(`/detalle-factura/` + formData.id, {
            detalle: data,
            servicios: rowData,
          });
        } else {
          respuesta = await instanciaAxios.post(`/detalle-factura/`, {
            detalle: data,
            servicios: rowData,
          });
        }
        if (!isEdit) {
          router.push("/trabajos/" + respuesta.data.id);
        }
      } catch (error) {
        console.log({ error });
      }
    },
  });

  const getRowData = () => {
    const rowData = [];
    gridApi.forEachNode((node) => {
      rowData.push(node.data);
    });
    return rowData;
  };

  useMount(() => {
    obtenerSelectData();
    if (!isEmpty(formData)) {
      setGridData(formData.trabajosRealizados.map((item) => ({ ...item, isNewRow: false })));
    }
  });

  const columnDefs = useMemo(
    () => [
      { field: "cantidad" },
      { field: "precio" },
      {
        field: "tipoTrabajoId",
        headerName: "Servicio",
        cellRenderer: "selectRenderer",
        editable: false,
        cellRendererParams: {
          options: tipoTrabajos.map((tipo) => ({ label: tipo.nombre, value: tipo.id })),
        },
      },
      {
        field: "subTotal",
        valueGetter: (params) => {
          const data = params.data;
          const val = parseFloat(data.precio ?? 0) * parseFloat(data.cantidad ?? 0);
          return isNaN(val) ? 0 : val.toFixed(2);
        },
      },
    ],
    [tipoTrabajos]
  );

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card sx={{ borderRadius: 0 }}>
          <CardContent classes={{ root: classes.cardContent }}>
            <Grid container spacing={3}>
              <Grid item md={4} xs={12} classes={{ item: classes.item }}>
                <TextField
                  fullWidth
                  label="Clientes"
                  name="clienteId"
                  select
                  value={formik.values.clienteId}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.clienteId && formik.errors.clienteId)}
                  helperText={formik.touched.clienteId && formik.errors.clienteId}
                  onBlur={formik.handleBlur}
                  margin="dense"
                  variant="standard"
                  disabled={isEdit}
                >
                  {clientes.map((option) => (
                    <MenuItem value={option.id}>{option.nombre}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={4} xs={12} classes={{ item: classes.item }}>
                <TextField
                  fullWidth
                  label="Forma de pago"
                  name="tipoPagoId"
                  select
                  value={formik.values.empresaId}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.tipoPagoId && formik.errors.tipoPagoId)}
                  helperText={formik.touched.tipoPagoId && formik.errors.tipoPagoId}
                  onBlur={formik.handleBlur}
                  margin="dense"
                  variant="standard"
                  disabled={isEdit}
                >
                  {tipoPagos.map((option) => (
                    <MenuItem value={option.id}>{option.nombre}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={4} xs={12} classes={{ item: classes.item }}>
                <TextField
                  fullWidth
                  label="Empleado"
                  name="empleadoId"
                  select
                  value={formik.values.empleadoId}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.empleadoId && formik.errors.empleadoId)}
                  helperText={formik.touched.empleadoId && formik.errors.empleadoId}
                  onBlur={formik.handleBlur}
                  margin="dense"
                  variant="standard"
                  disabled={isEdit}
                >
                  {empleados.map((option) => (
                    <MenuItem value={option.id}>{option.nombre}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              {/* <Grid item md={6} xs={12} classes={{ item: classes.item }}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  type="text"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.nombre && formik.errors.nombre)}
                  helperText={formik.touched.nombre && formik.errors.nombre}
                  onBlur={formik.handleBlur}
                  margin="dense"
                  variant="standard"
                />
              </Grid>
              <Grid item md={6} xs={12} classes={{ item: classes.item }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Fecha"
                    name="fecha"
                    value={formik.values.fecha}
                    onChange={(val) => {
                      formik.setFieldValue("fecha", val);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="fecha"
                        fullWidth
                        margin="dense"
                        disabled
                        variant="standard"
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid> */}
            </Grid>
          </CardContent>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              p: 2,
            }}
          >
            <Button color="primary" variant="contained" type="submit">
              Guardar
            </Button>
          </Box>
        </Card>
      </form>

      <div
        className={"ag-theme-alpine " + classes.grid}
        style={{ height: 400, width: "100%", marginTop: 15 }}
      >
        <div>
          <Button
            startIcon={<AddCircleOutlined />}
            sx={{ mr: 1 }}
            onClick={() => {
              gridApi.applyTransaction({ add: [{ isNewRow: true }] });
            }}
          >
            Agregar fila
          </Button>
        </div>
        <AgGridReact
          rowData={gridData}
          rowHeight={30}
          headerHeight={30}
          columnDefs={columnDefs}
          defaultColDef={{
            editable: true,
          }}
          components={{
            selectRenderer: SelectRenderer,
          }}
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
            setGridApi(params.api);
          }}
        />
      </div>
    </>
  );
};
