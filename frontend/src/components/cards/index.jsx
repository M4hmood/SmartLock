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
      { _id, uidHex: '', cardType: '', owner: '', accessLevel: '', authorized: '', issued: new Date(), expiresAt: '', isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [_id]: { mode: GridRowModes.Edit, fieldToFocus: 'uidHex' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Card
      </Button>
    </GridToolbarContainer>
  );
}

export default function Cards() {

  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

   // Fetch data from the database
   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3001/Cards'); // Replace with your API URL
        const data = await response.json();
        console.log(data);
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
    // Set isNew to false if the row is being edited
    setRows((oldRows) => oldRows.map((row) => (row._id === id ? { ...row, isNew: false } : row)));

    // Set the row mode to edit
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleAddCard = async (newRow) => {
    try {
      // Destructure to avoid sending the _id field, assuming it is generated server-side
      const { _id, uidhex, ...cardData } = newRow;

      const decUid = parseInt(uidhex, 16);
      const uid = { dec: decUid.toString(), hex: uidhex };

      cardData.uid = uid;

  
      // Make the POST request to add the user
      await axios.post('http://localhost:3001/Cards', cardData);

    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleUpdateCard = async (updatedRow) => {
    try {
      // Destructure to avoid sending the _id field, assuming it is generated server-side
      const { _id, ...cardData } = updatedRow;

      // Make the PUT request to update the user
      await axios.put(`http://localhost:3001/Cards/${_id}`, cardData);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    try {
      axios.delete(`http://127.0.0.1:3001/Cards/${id}`);
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

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row._id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    //const updatedRow = { ...newRow, isNew: false };
    const updatedRow = { ...newRow };

    if (newRow.isNew) {
      handleAddCard(updatedRow);
    } else {
      handleUpdateCard(updatedRow);
    }

    // Update the rows state with the updated row
    setRows(rows.map((row) => (row._id === newRow._id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 200 },
    {
      field: 'uidHex',
      headerName: 'Uid Hex',
      width: 120,
      editable: true,
    },
    {
      field: 'cardType',
      headerName: 'Card Type',
      width: 100,
      editable: true,
    },
    {
      field: 'owner',
      headerName: 'Owner',
      width: 180,
      editable: true,
    },
    {
      field: 'accessLevel',
      headerName: 'Access Level',
      width: 140,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['admin', 'guest', 'restricted'],
    },
    { 
      field: 'authorized', 
      headerName: 'Authorized', 
      type: 'boolean',
      width: 120, 
      editable: true,
    },
    {
      field: 'issued',
      headerName: 'Issued',
      type: 'date',
      width: 120,
      editable: true,
      valueGetter: (params) => {
        //Ensure params.row.birthdate is converted to a proper date string
        return new Date(params);
      },
    },
    {
      field: 'expiresAt',
      headerName: 'Expires At',
      type: 'date',
      width: 120,
      editable: true,
      valueGetter: (params) => {
        //Ensure params.row.birthdate is converted to a proper date string
        return new Date(params);
      },
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
            color="blue"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="red"
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
            Card List
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

