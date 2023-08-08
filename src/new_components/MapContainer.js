import React, { useState, useEffect } from 'react';

import { Box } from '@mui/material';
import TopBar from './TopBar';
import { BaseMapFC } from '../components/BaseMap';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import config from './../config.json'

import { csv } from 'd3'

import DescripcionHuerta from './DescripcionHuerta';
import RelationsHuertas from './RelationsHuertas';
import Description from './Description';

const useStyles = makeStyles((theme) => ({
    open: { width: '100%', height: '100%', position: 'absolute', top: '0px', bottom: '0px', left: '0px', transition: 'all 0.5s ease' },
    closed: { width: '100%', height: '100%', position: 'absolute', top: '0px', bottom: '0px', left: 'calc(50% - 400px)', transition: 'all 0.5s ease' },
    dialog: {
        width: 'calc(100% - 800px)',
        height: '100%',
        position: 'absolute',
        top: '0px',
        bottom: '0px',
        left: '-100vw',
        transition: 'all 0.5s ease',
        zIndex: 1000,
    },
    openDialog: {
        left: '0px',
    },
    chips: {
        marginTop: '10px',
        '& > *': {
            filter: 'saturate(0)',
            background: 'rgba(255,255,255,.25) !important',
            background: 'rgba(16,16,16,.6) !important',
            border: '1px solid rgba(255,255,255,.3) !important',
            fontSize: '18px !important',
            '&:hover': {
                filter: 'saturate(1)',
                background: 'rgba(16,16,16,.6) !important',
            },
            '& span': {
                fontSize: '13px !important',
            }
        },
        '& > .selected': {
            filter: 'saturate(1)',
            background: 'rgba(16,16,16,.6) !important',
            '& .MuiChip-label': {
                background: 'rgba(255,255,255,.9) !important',
                color: '#333 !important',
                padding: '5px 10px !important',
                borderRadius: '50px !important',
                marginRight: '3px !important',
                fontWeight: 'bold !important',
            }
        }
    },
    inside: {
        paddingRight: '5px',
        '&::-webkit-scrollbar': {
            width: 6,
            height: 6,
        },

        '&::-webkit-scrollbar-button': {
            width: 10,
            height: 10,
        },

        '&::-webkit-scrollbar-thumb': {
            background: '#c5ad62',
            border: '0px none #ffffff',
            borderRadius: 50,
        },

        '&::-webkit-scrollbar-thumb:hover': {
            background: '#c5ad62',
        },

        '&::-webkit-scrollbar-thumb:active': {
            background: '#c5ad62',
        },

        '&::-webkit-scrollbar-track': {
            background: 'rgba(0,0,0,0.25)',
            border: '0px none #ffffff',
            borderRadius: 50,
        },

        '&::-webkit-scrollbar-track:hover': {
            background: 'rgba(0,0,0,0.1)',
        },

        '&::-webkit-scrollbar-track:active': {
            background: 'rgba(0,0,0,0.1)',
        },
    }
}));


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
        },
    },
    typography: {
        fontSize: 11,
        fontFamily: 'Quicksand, sans-serif',
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
    const classes = useStyles();
    const [open, setOpen] = useState(true);
    const [geoJson, setGeoJson] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [selectedPoint, setSelectedPoint] = useState(null)
    const [view, setView] = useState("acerca")
    const [filters, setFilters] = useState({})
    const [activeFilters, setActiveFilters] = useState(false)

    const array_emojis = ["🍎", "🪴", "🌿", "🌱", "🌵", "☘️", "🌰", "🍻", "🌽", "🥬", "🌷", "🤖", "🌱", "🌻"]

    // function to get a random emoji from the array
    function getRandomEmoji() {
        return array_emojis[Math.floor(Math.random() * array_emojis.length)]
    }

    // function to get 5 random emojis from the array
    function getRandomEmojis() {
        let emojis = []
        for (let i = 0; i < 5; i++) {
            emojis.push(getRandomEmoji())
        }
        return emojis
    }

    useEffect(() => {
        csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vQAaSQUSCHBl8YFLJL74OeC72sm3gESxl4n3VHVbBQsJljBKtl_IIUsUlBBKMd-PqoWpsbHFUO_ZEoG/pub?output=csv')
            .then(response => {
                // generate geojson
                let i_ = 0
                const geoJson = {
                    type: 'FeatureCollection',
                    features: response.map((row, index) => {
                        if (i_ === 3) i_ = 0
                        const resp = {
                            type: 'Feature',
                            id: index,
                            icon: '0' + i_,
                            properties: {
                                ...row,
                                'emoji_1': getRandomEmojis()[0],
                                'emoji_2': getRandomEmojis()[0],
                                'emoji_3': getRandomEmojis()[0],
                                'emoji_4': getRandomEmojis()[0],
                                'emoji_5': getRandomEmojis()[0],
                            },
                            geometry: {
                                type: 'Point',
                                coordinates: [parseFloat(row.lon), parseFloat(row.lat)]
                            }
                        }
                        i_++
                        return resp
                    }
                    )
                }

                setLoaded(true)
                setGeoJson(geoJson)
            })
    }, []);

    // function to return filtered geojson
    function getFilteredGeoJson() {
        // if no filters are active, return all geojson
        if (!activeFilters) {
            return geoJson
        } else {
            // if filters are active, return filtered geojson
            const filtered = geoJson.features.filter(feature => {
                // iterate over filters
                // if any filter is active, check if feature matches
                let match = []
                Object.keys(filters).forEach(key => {
                    if (key === 'Tipo de huerta') {
                        if (feature.properties[key] === filters[key]) {
                            match.push(true)
                        }
                    } else if (key === 'Respuestas') {
                        if (feature.properties[filters[key]] !== '') {
                            match.push(true)
                        }
                    } else if (key === 'Emoji') {
                        if (feature.properties['emoji_1'] === filters[key] || feature.properties['emoji_2'] === filters[key] || feature.properties['emoji_3'] === filters[key] || feature.properties['emoji_4'] === filters[key] || feature.properties['emoji_5'] === filters[key]) {
                            match.push(true)
                        }
                    }
                })
                // if all filters match, return feature
                if (match.length === Object.keys(filters).length) {
                    return true
                }
            })
            return {
                type: 'FeatureCollection',
                features: filtered
            }
        }
    }

    useEffect(() => {
        let active = false
        Object.keys(filters).length > 0 ? active = true : active = false
        setActiveFilters(active)
        console.log(active, filters)
    }, [filters])

    function Selected(new_) {
        if (new_ !== null) {
            setSelectedPoint(new_)
            setOpen(false)
        } else {
            setSelectedPoint(new_)
            setOpen(true)
        }
    }

    function selectNext() {
        if (selectedPoint < geoJson.features.length - 1) {
            setSelectedPoint(selectedPoint + 1)
        }
    }

    function selectPrev() {
        if (selectedPoint > 0) {
            setSelectedPoint(selectedPoint - 1)
        }
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <Box>
                <TopBar
                    setView={setView}
                    view={view}
                />
                <Box
                    className={`moveBoxMap ${view}`}
                >


                    <BaseMapFC
                        geoJson={geoJson}
                        center={{ lng: config.centroMapa.lon, lat: config.centroMapa.lat }}
                        updateSelectedPoint={Selected}
                        selectedPoint={selectedPoint}
                        style={open ? classes.open : classes.closed}
                    />

                    <DescripcionHuerta
                        geoJson={geoJson}
                        selectedPoint={selectedPoint}
                        selectNext={selectNext}
                        selectPrev={selectPrev}
                        classes={classes}
                        Selected={Selected}
                        open={open}
                        key={selectedPoint}
                    />

                    <RelationsHuertas
                        geoJson={getFilteredGeoJson()}
                        classes={classes}
                        filters={filters}
                        setFilters={setFilters}
                    />


                </Box>

                {view === 'acerca' &&
                    <Box
                        className={`moveBoxAcerca`}
                    >
                        <Description />
                    </Box>
                }

            </Box>
        </ThemeProvider>
    )
}


export default MapContainer