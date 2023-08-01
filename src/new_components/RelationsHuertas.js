import React, { useState, useEffect } from 'react'
import { Box, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { Chip } from '@mui/material';
import Select from './Select'
import { columns, array_emojis } from '../config/lists';
import { Bubble } from './DescripcionHuerta'
import RelationViz from './RelationViz';

const SearchBox = props => {
    return (
        <Box
            className="filterBox"
        >
            <Select
                name="Tipo de huerta"
                setFilters={props.setFilters}
                filters={props.filters}
                list={[
                    'Comunitaria',
                    'Organización Privada',
                    'Educativa escolar ',
                ]}
            />
            <Select
                name="Respuestas"
                setFilters={props.setFilters}
                filters={props.filters}
                list={columns.map(c => c.emoji + ' ' + c.title)}
            />
            <Select
                name="Productos"
                setFilters={props.setFilters}
                filters={props.filters}
                list={[]}
            />
            <Select
                name="Siembra"
                setFilters={props.setFilters}
                filters={props.filters}
                list={[]}
            />
            <Select
                name="Emoji"
                setFilters={props.setFilters}
                filters={props.filters}
                list={array_emojis}
            />
        </Box>
    )
}

const RelationsHuertas = props => {
    const { geoJson, classes } = props
    const [selected, setSelected] = useState(null)

    return (
        <Box
            className="relationBox"
        >
            <Box
                className={`dialog_msg small ${classes.openDialog} ${classes.dialog}`}
            >
                <Box
                    className={`inside ${classes.inside}`}
                >
                    {geoJson &&
                        <>
                            {
                                geoJson.features.map((feature, index) => {
                                    return (
                                        <>
                                            <Box
                                                className="header"
                                                style={{ marginBottom: 10 }}
                                                key={index}
                                            >
                                                <Box>
                                                    <h3>
                                                        <div className={`${selected === feature.id ? '' : 'desaturate'} logoTitle icon_${feature['icon']}`}></div>
                                                        <span>{feature.properties['Nombre de la huerta']}</span>
                                                    </h3>
                                                    <Chip
                                                        avatar={<InfoIcon />}
                                                        sx={{ marginLeft: 1, marginBottom: 1 }}
                                                        label={feature.properties['Tipo de huerta']}
                                                    />
                                                </Box>
                                            </Box>
                                            {props.filters['Respuestas'] &&
                                                <Box
                                                    className="body filter"
                                                >
                                                    <Bubble>
                                                        {feature.properties[props.filters['Respuestas']]}
                                                    </Bubble>
                                                </Box>
                                            }
                                        </>
                                    )
                                })
                            }
                        </>
                    }

                </Box>
            </Box>



            {geoJson &&
                <RelationViz
                    filters={props.filters}
                    data={geoJson.features}
                    className="relationViz"
                    setSelected={setSelected}
                />
            }

            <SearchBox
                filters={props.filters}
                setFilters={props.setFilters}
            />

        </Box>
    )
}

export default RelationsHuertas