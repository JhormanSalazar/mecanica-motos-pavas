import { Box, IconButton, Tooltip, Card } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Trash2, Pencil } from "lucide-react";
import { actionsCellSx, tableCardSx, tableOverflowSx } from "../styles/pilotsStyles";

export default function PilotsTable({ pilots, onEdit, onDelete }) {
  const columns = [
    { field: "name", headerName: "Nombre", flex: 1, minWidth: 150 },
    { field: "bikeType", headerName: "Moto", flex: 1, minWidth: 130 },
    {
      field: "phone",
      headerName: "Telefono",
      width: 140,
      renderCell: (params) => params.value || "-",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => params.value || "-",
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={actionsCellSx}>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(params.row); }}>
              <Pencil size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => { e.stopPropagation(); onDelete(params.row.id); }}
            >
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Card sx={tableCardSx}>
      <Box sx={tableOverflowSx}>
        <DataGrid
          onRowClick={(params) => onEdit(params.row)}
          rows={pilots}
          columns={columns}
          sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          localeText={{
            noRowsLabel: "No hay pilotos registrados.",
            MuiTablePagination: { labelRowsPerPage: "Filas por pagina:" },
          }}
        />
      </Box>
    </Card>
  );
}
