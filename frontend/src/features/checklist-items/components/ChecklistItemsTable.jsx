import { Box, IconButton, Chip, Card, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Pencil, Trash2 } from "lucide-react";
import {
  tableCardSx,
  tableOverflowSx,
  actionsCellSx,
  chipSx,
} from "../styles/checklistItemsStyles";

export default function ChecklistItemsTable({
  items,
  onEdit,
  onDelete,
  onToggleActive,
}) {
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Nombre", flex: 1, minWidth: 200 },
    {
      field: "isActive",
      headerName: "Estado",
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Activo" : "Inactivo"}
          color={params.value ? "success" : "default"}
          size="small"
          onClick={() => onToggleActive(params.row)}
          sx={chipSx}
        />
      ),
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
            <IconButton size="small" onClick={() => onEdit(params.row)}>
              <Pencil size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(params.row.id)}
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
          rows={items}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          localeText={{
            noRowsLabel: "No hay items registrados.",
            MuiTablePagination: { labelRowsPerPage: "Filas por pagina:" },
          }}
        />
      </Box>
    </Card>
  );
}
