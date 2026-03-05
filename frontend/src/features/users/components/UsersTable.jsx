import { Box, Card, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Pencil, Trash2 } from "lucide-react";
import { actionsCellSx, cardSx } from "../styles/usersStyles";

function getColumns(onEdit, onDelete) {
  return [
    { field: "id", headerName: "ID", width: 80 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "role", headerName: "Rol", width: 140 },
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
}

export default function UsersTable({ users, onEdit, onDelete }) {
  const columns = getColumns(onEdit, onDelete);

  return (
    <Card sx={cardSx}>
      <DataGrid
        rows={users}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        localeText={{
          noRowsLabel: "No hay usuarios registrados.",
          MuiTablePagination: { labelRowsPerPage: "Filas por página:" },
        }}
      />
    </Card>
  );
}
