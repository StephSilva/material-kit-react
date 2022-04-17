import { Container } from '@mui/material'
import React from 'react'
import PacmanLoader from "react-spinners/PacmanLoader"

export default function IndicadorCarga() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 300,
        }}>
            <PacmanLoader size={25} color={"#4A90E2"} />
            <p style={{ marginTop: 100, marginLeft: -15 }}>Cargando...</p>
        </div>
    )
}
