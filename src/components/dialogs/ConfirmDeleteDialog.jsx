import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'

function ConfirmDeleteDialog({open,handleClose,deleteHandler,content}) {
  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
            <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>NO</Button>
            <Button color='error' onClick={()=>{deleteHandler();handleClose()}}>YES</Button>
        </DialogActions>
    </Dialog>
  )
}

export default ConfirmDeleteDialog
