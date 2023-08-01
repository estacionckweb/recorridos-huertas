import React, { useState, useEffect } from "react";

import { Box, IconButton } from '@mui/material';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

import { Chip } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff';

import { columns } from "../config/lists";

import ImageMason from "./ImageMason";


export const Bubble = props => {
    return (
        <Box
            className="bubble"
        >
            <Box
                className="bubble_header"
            >
                <h4>Reproducir el audio <SpatialAudioOffIcon /></h4>
            </Box>
            {props.children}
        </Box>
    )
}

const DescripcionHuerta = props => {
    const [columnSelected, setColumnSelected] = useState(0)

    const { geoJson, selectedPoint, Selected, open, classes, selectNext, selectPrev } = props

    return (
        <>
            {geoJson && selectedPoint !== null &&
                <>
                    {selectedPoint >= 0 &&
                        <Box
                            className={!open ? `dialog_msg ${classes.openDialog} ${classes.dialog}` : `dialog_msg ${classes.dialog}`}
                        >
                            <Box
                                className={`inside ${classes.inside}`}
                            >
                                <Box
                                    className="header"
                                >
                                    <nav>
                                        <IconButton
                                            onClick={() => { Selected(null) }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                        <Box>
                                            <IconButton
                                                onClick={selectPrev}
                                            >
                                                <ArrowBackIosNewIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={selectNext}
                                            >
                                                <ArrowForwardIosIcon />
                                            </IconButton>
                                        </Box>
                                    </nav>
                                    <Box>
                                        <h3>
                                            <div className={`logoTitle icon_${geoJson.features[selectedPoint]['icon']}`}></div>
                                            <span>{selectedPoint !== null ? geoJson.features[selectedPoint].properties['Nombre de la huerta'] : ''}</span>
                                        </h3>
                                        <Chip
                                            avatar={<InfoIcon />}
                                            sx={{ marginLeft: 1, marginBottom: 1 }}
                                            label={selectedPoint !== null ? geoJson.features[selectedPoint].properties['Tipo de huerta'] : ''}
                                        />
                                    </Box>
                                </Box>
                                <Box
                                    className={classes.chips}
                                >
                                    {columns.map((column, index) => {
                                        const value = geoJson.features[selectedPoint].properties[column.title]
                                        if (value !== '') {
                                            return (
                                                <Chip
                                                    avatar={<>{column.emoji}</>}
                                                    sx={{ marginLeft: 1, marginBottom: 1, paddingLeft: 1 }}
                                                    className={columnSelected === index ? 'selected' : ''}
                                                    label={`${column.title}`}
                                                    onClick={() => { setColumnSelected(index) }}
                                                />
                                            )
                                        }
                                    })}

                                </Box>
                                <Box
                                    className="body"
                                >
                                    <Bubble>
                                        {/* <h4>{columns[columnSelected].title}</h4> */}
                                        <p>{geoJson.features[selectedPoint].properties[columns[columnSelected].title]}</p>
                                    </Bubble>
                                </Box>
                            </Box>
                            <Box
                                className={`gallery ${classes.inside}`}
                            >
                                <Masonry columns={1} spacing={1}>
                                    {
                                        // create an array of 10 items
                                        Array.from({ length: 10 }).map((_, index) => (
                                            <ImageMason srcOri={`${process.env.PUBLIC_URL}/imgs/web/01/resized_${index}.jpg`} src={`${process.env.PUBLIC_URL}/imgs/web/01/resized_small_${index}.jpg`} />
                                        ))
                                    }
                                </Masonry>
                            </Box>

                        </Box>
                    }
                </>

            }
        </>

    )
}

export default DescripcionHuerta;