import { Box, Card, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Trash2, Pencil } from "lucide-react";
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
}

export default function UsersTable({ users, onEdit, onDelete }) {
  const columns = getColumns(onEdit, onDelete);

  return (
    <Card sx={cardSx}>
      <DataGrid
        onRowClick={(params) => onEdit(params.row)}
        rows={users}
        columns={columns}
        sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
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
