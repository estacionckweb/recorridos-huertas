import React from "react";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

import logo_huertas from "../assets/logo_huertas.png";
import board from "../assets/board.png";
import ventana from "../assets/ventana.png";
import maiz from "../assets/maiz.png";

const useStyles = makeStyles({
    img: {
        width: "400px",
        height: "auto",
        marginRight: "50px",
    },
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    btn: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgba(39,241,255,0.05)",
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "10px",
        cursor: "pointer",
        position: "relative",
        width: "400px",

        "&:hover": {
            backgroundColor: "rgba(39,241,255,0.1)",

            "& img": {
                transform: "scale(1.2)",
            }
        }
    },
    btnImg: {
        width: "100px",
        height: "100px",
        marginRight: "10px",
        backgroundColor: "#031a2c",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #27f1ff",

        "& img": {
            transition: "all 0.3s ease",
        }
    },
    btnTxt: {
        width: "calc(100% - 100px)",
    }
})

const Btn = props => {
    const classes = useStyles()
    return (
        <Box className={classes.btn}>
            <Box className={classes.btnImg}>
                <img src={props.img} alt={props.alt} style={props.styleImg} />
            </Box>
            <Box className={classes.btnTxt}>{props.txt}</Box>
        </Box>
    )
}

const Description = () => {
    const classes = useStyles()
    return (
        <Box className={classes.root}>
            <Box className={classes.img}>
                <img src={logo_huertas} alt="logo_huertas" />
            </Box>

            <Box>
                <Btn
                    img={board}
                    alt="logo_huertas"
                    txt="Conoce y aprende más sobre el proyecto"
                />
                <Btn
                    img={ventana}
                    alt="logo_huertas"
                    txt="Entra en contacto con las huertas cercanas a ti explorando el mapa"
                    styleImg={{
                        width: "65px",
                        height: "auto",
                    }}
                />
                <Btn
                    img={maiz}
                    alt="logo_huertas"
                    txt="Explora contenido en el archivo que hemos compartido en nuestro blog"
                    styleImg={{
                        width: "50px",
                        height: "auto",
                    }}
                />
            </Box>
        </Box>
    )
}

export default Description