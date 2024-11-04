import { Button } from '@mui/material'
import { ArrowLeftIcon } from '@mui/x-date-pickers'
import React from 'react'
import { Link } from 'react-router-dom'

export default function BackButton() {
  return (
    <Link to='/' className='back-button-container'>
      <Button variant='contained' style={{ fontWeight: 'bold' }} startIcon={<ArrowLeftIcon />}>
        Back to Home
      </Button>
    </Link>
  )
}
