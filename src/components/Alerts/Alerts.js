import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import React from 'react';
import { snackbarStyles } from '../../types/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

export default function CustomizedSnackbars({
  type,
  message,
  open,
  handleClose,
}) {
  const classes = snackbarStyles();

  return (
    <div className={classes.root}>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={type}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
