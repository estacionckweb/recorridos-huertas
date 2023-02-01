import React from 'react';

import { Box } from '@mui/material';
import TopBar from './TopBar';
import BaseMap from '../components/BaseMap';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
        },
    },
    typography: {
        fontSize: 11,
    },
    components: {
        MuiToolbar: {
            styleOverrides: {
                root: {
                    '@media (min-width: 600px)': {
                        minHeight: '50px',
                    },
                    height: '50px',
                }
            }
        }
    }
});

const MapContainer = props => {
    return (
        <ThemeProvider theme={darkTheme}>
            <Box>
                <TopBar />
                <BaseMap />
            </Box>
        </ThemeProvider>
    )
}

export default MapContainer