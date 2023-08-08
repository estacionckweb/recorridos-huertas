import React from 'react';

import { AppBar, Toolbar, Typography, Stack, Box, Button } from '@mui/material';

const active = {outline: 'none', color: '#2a2617', backgroundColor: '#90c20d', fontWeight: '600', fontSize: 12, textTransform: 'uppercase', borderRadius: 5, marginRight: 1 }
const inactive = {outline: 'none', color: '#d3cb60', backgroundColor: '#000', fontWeight: '600', fontSize: 12, textTransform: 'uppercase', borderRadius: 5, marginRight: 1 }

const TopBar = props => {
    const { view } = props

    return (
        <AppBar
            className='top-bar'
        >
            <Toolbar>
                <Typography variant='h6' component='div' sx={{ flexGrow: 1, fontWeight: '600', color: ' #d2f200', textTransform: 'uppercase', fontSize: 16 }}>
                    Huertas Redes y Arquitecturas
                </Typography>
                <Button
                    variant='contained'
                    sx={view === 'map' ? active : inactive}
                    onClick={() => props.setView('map')}
                    className='top-bar__button'
                >
                    Mapa geográfico
                </Button>
                <Button
                    variant='contained'
                    sx={view === 'relation' ? active : inactive}
                    onClick={() => props.setView('relation')}
                    className='top-bar__button'
                >
                    Mapa relacional
                </Button>
                {/* <Button>
                    Relacionamiento institucional
                </Button> */}
                <Button
                    variant='contained'
                    onClick={() => props.setView('acerca')}
                    sx={view === 'acerca' ? active : inactive}
                    className='top-bar__button'
                >
                    Acerca de
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default TopBar