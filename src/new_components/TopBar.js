import React from 'react';

import { AppBar, Toolbar, Typography, Stack, Box } from '@mui/material';

const TopBar = props => {
    return (
        <AppBar>
            <Toolbar>
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                    Recorridos de huertas
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default TopBar