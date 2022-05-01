import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import GridCatalogo from "../Grid/GridCatalogo";

const catalogoColumnas = [
  {
    field: "nombre",
    with: "100%",
  },
];

export const Catalogos = (props) => {
  return (
    <form {...props}>
      <Card>
        <CardHeader subheader="Administracion catalogos" title="Catalogos" />
        <Divider />
        <CardContent sx={{ minHeight: 300, height: "fit-content", padding: "16px" }}>
          <Grid container spacing={3} wrap="wrap">
            <Grid
              item
              md={4}
              sm={6}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
              xs={12}
            >
              <Typography color="textPrimary" gutterBottom variant="h6">
                Tipos de empleado
              </Typography>
              <GridCatalogo columnas={catalogoColumnas} endpoint={"/tipo-empleado"} />
            </Grid>
            <Grid
              item
              md={4}
              sm={6}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
              xs={12}
            >
              <Typography color="textPrimary" gutterBottom variant="h6">
                Roles
              </Typography>
              <GridCatalogo columnas={catalogoColumnas} endpoint={"/rol"} />
            </Grid>
            <Grid
              item
              md={4}
              sm={6}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
              xs={12}
            >
              <Typography color="textPrimary" gutterBottom variant="h6">
                Tipos de trabajo
              </Typography>
              <GridCatalogo columnas={catalogoColumnas} endpoint={"/tipo-trabajo"} />
            </Grid>
          </Grid>
          <Grid container spacing={3} wrap="wrap" sx={{ marginTop: "25px", marginBottom: "25px" }}>
            <Grid
              item
              md={4}
              sm={6}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
              xs={12}
            >
              <Typography color="textPrimary" gutterBottom variant="h6">
                Tipos de pago
              </Typography>
              <GridCatalogo columnas={catalogoColumnas} endpoint={"/tipo-pago"} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};
