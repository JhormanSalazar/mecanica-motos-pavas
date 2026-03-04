import { Box, Button, Chip, Card } from "@mui/material";
import { Eye, Edit } from "lucide-react";
import { DataGrid } from "@mui/x-data-grid";
import { formatDate } from "../utils/formatDate";

function buildColumns(onViewDetail, onEditService) {
  return [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "pilot",
      headerName: "Piloto",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.row.pilot?.name || "Sin Asignar",
    },
    {
      field: "type",
      headerName: "Tipo",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "ALISTAMIENTO" ? "primary" : "warning"}
          size="small"
          variant="outlined"
        />
      ),
    },
    { field: "hours", headerName: "Horas", width: 100 },
    {
      field: "state",
      headerName: "Estado",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value === "TERMINADO" ? "Terminado" : "En Proceso"}
          color={params.value === "TERMINADO" ? "success" : "warning"}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Fecha Creación",
      width: 200,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: "updatedAt",
      headerName: "Fecha Actualización",
      width: 200,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 300,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            gap: 0.5,
          }}
        >
          <Button
            startIcon={<Eye size={16} />}
            variant="outlined"
            size="small"
            onClick={() => onViewDetail(params.row)}
          >
            Ver Detalle
          </Button>
          {params.row.state === "EN_PROCESO" && (
            <Button
              startIcon={<Edit size={16} />}
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => onEditService(params.row)}
            >
              Editar
            </Button>
          )}
        </Box>
      ),
    },
  ];
}

export default function WorkLogsTable({
  logs,
  loading,
  onViewDetail,
  onEditService,
}) {
  const columns = buildColumns(onViewDetail, onEditService);

  return (
    <Card sx={{ width: "100%" }}>
      <Box sx={{ overflowX: "auto" }}>
        <DataGrid
          rows={logs}
          columns={columns}
          loading={loading}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          localeText={{
            noRowsLabel: "No hay servicios registrados.",
            MuiTablePagination: { labelRowsPerPage: "Filas por pagina:" },
          }}
        />
      </Box>
    </Card>
  );
}
