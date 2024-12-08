import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideNav from '../sidenav/index';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
  randomId,
} from '@mui/x-data-grid-generator';


function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const _id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { _id, firstName: '', lastName: '', username: '', email: '', password: "Test1234", birthdate: '', role: '', isNew: true },
    ]); 
  
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [_id]: { mode: GridRowModes.Edit, fieldToFocus: 'firstName' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add User
      </Button>
    </GridToolbarContainer>
  );
}


export default function Users() {

  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

   // Fetch data from the database
   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3001/Users'); // Replace with your API URL
        const data = response.data;
        setRows(data); // Set the rows with fetched data
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to fetch data only once on mount

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    // Set isNew to false for the row being edited
    setRows((oldRows) => oldRows.map((row) => (row._id === id ? { ...row, isNew: false } : row)));

    // Set the row mode to edit
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleAddUser = async (newRow) => {
    try {
      // Destructure to avoid sending the _id field, assuming it is generated server-side
      const { _id, ...userData } = newRow;
  
      // Make the POST request to add the user
      const response = await axios.post('http://localhost:3001/Users', userData);
      const data = response.data; // Response data from the server, including the new _id
  
      // Update the rows state with the new _id
      // setRows((oldRows) =>
      //   oldRows.map((row) =>
      //     row._id === newRow._id
      //       ? { ...row, _id: data._id, ...userData } // Update the row with the server's _id
      //       : row // Keep other rows unchanged
      //   )
      // );
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleUpdateUser = async (updatedRow) => {
    try {
      const {_id, ...userData } = updatedRow;

      // Make the PUT request to update the user
      const response = await axios.put(`http://localhost:3001/Users/${_id}`, userData);
      const data = response.data; // Response data from the server, including the new _id
      console.log(data);

      // Update the rows state with the new _id
      // setRows((oldRows) =>
      //   oldRows.map((row) =>
      //     row._id === updatedRow._id
      //       ? { ...row, ...userData }//{ ...row, _id: data._id, ...userData } // Update the row with the server's _id
      //       : row // Keep other rows unchanged
      //   )
      // );
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    try {
      axios.delete(`http://127.0.0.1:3001/Users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setRows(rows.filter((row) => row._id !== id));
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row._id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row._id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    try {
      // Example validation for 'firstName' and 'lastName' fields
      if (!newRow.username || !newRow.email) {
        alert('processRowUpdate error: username and email are required');
        return null;  // Returning null will prevent the row update
      }
      //const updatedRow = { ...newRow, isNew: false };
      const updatedRow = { ...newRow };

      if (!updatedRow) {
        return;
      }

      // if the row is new, add it to the database
      if (updatedRow.isNew) {
        handleAddUser(updatedRow);
      } else {
        // if the row is not new, update it in the database
        handleUpdateUser(updatedRow);
      }

      // Update the row in the rows state: replace the old row with the updated row
      setRows(rows.map((row) => (row._id === newRow._id ? updatedRow : row)));
      return updatedRow;
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 200 },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      editable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 140,
      editable: true,
    },
    { 
      field: 'username', 
      headerName: 'Username', 
      width: 130, 
      editable: true },
    {
      field: 'email',
      headerName: 'Email',
      type: 'email',
      width: 250,
      editable: true,
    },
    {
      field: 'birthdate',
      headerName: 'Birthdate',
      type: 'date',
      width: 130,
      editable: true, // Set to true if you want this column to be editable
      valueGetter: (params) => {
        //Ensure params.row.birthdate is converted to a proper date string
        return new Date(params); // Displays as "DD/MM/YYYY"
      },
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['admin', 'user'],
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color='inherit'
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <>
      <Box sx={{ display: "flex"}}>
        <SideNav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: 'auto', marginTop: '64px'}}>
          <Typography variant="h4" gutterBottom color='#667781' sx={{textAlign: 'center'}}>
            User List
          </Typography>
          <Box
            sx={{
              height: 500,
              width: '100%',
              '& .actions': {
                color: 'text.secondary',
              },
              '& .textPrimary': {
                color: 'text.primary',
              },
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row._id}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              slots={{ toolbar: EditToolbar }}
              slotProps={{
                toolbar: { setRows, setRowModesModel },
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  )
}

