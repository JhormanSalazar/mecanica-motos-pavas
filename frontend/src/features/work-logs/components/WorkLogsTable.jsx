import { Box, IconButton, Chip, Card } from "@mui/material";
import { Eye } from "lucide-react";
import { DataGrid } from "@mui/x-data-grid";
import { cardSx, tableContainerSx, actionsCellSx } from "../styles/workLogsStyles";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getColumns(onSelectLog) {
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
        <Box sx={actionsCellSx}>
          <IconButton
            onClick={(e) => { e.stopPropagation(); onSelectLog(params.row); }}
            aria-label={`Ver servicio ${params.row.id}`}
            sx={{
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 1,
              minWidth: 40,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            size="small"
          >
            <Eye size={16} />
          </IconButton>
        </Box>
      ),
    },
  ];
}

export default function WorkLogsTable({ logs, loading, onSelectLog }) {
  const columns = getColumns(onSelectLog);

  return (
    <Card sx={cardSx}>
      <Box sx={tableContainerSx}>
        <DataGrid
          rows={logs}
          columns={columns}
          onRowClick={(params) => onSelectLog(params.row)}
          sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
          loading={loading}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          localeText={{
            noRowsLabel: "No hay servicios registrados.",
            MuiTablePagination: { labelRowsPerPage: "Filas por pagina:" },
          }}
        />
      </Box>
    </Card>
  );
}
