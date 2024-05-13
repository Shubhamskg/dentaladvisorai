import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'doa',
    headerName: 'Date of Appointment',
    description: 'This column has a value getter and is not sortable.',
    type:'date',
    editable:true,
    sortable: true,
    width: 160,
  },
];
const date=new Date()
const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 ,doa:date},
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 ,doa:date},
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31,doa:date },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 ,doa:date},
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 56,doa:date },
  { id: 6, lastName: 'Melisandre', firstName: 'Shubham', age: 150,doa:date },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 ,doa:date},
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36,doa:date },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 ,doa:date},
];

export default function DataGridDemo() {
  return (
    <Box sx={{ height: '85vh', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 9,
            },
          },
        }}
        pageSizeOptions={[9]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
