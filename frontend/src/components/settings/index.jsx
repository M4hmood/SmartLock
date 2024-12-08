import React from 'react';
import SideNav from '../sidenav/index';
import Box from '@mui/material/Box';

export default function Settings() {
  return (
    <>
      <Box sx={{ display: "flex"}}>
        <SideNav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: 'auto', marginTop: '64px' }}>
          <Box sx={{textAlign: 'center'}}>
            <img src="https://wpamelia.com/wp-content/uploads/2019/04/vague.jpg" alt="placeholder" />
          </Box>
        </Box>
      </Box>
    </>
  )
}
