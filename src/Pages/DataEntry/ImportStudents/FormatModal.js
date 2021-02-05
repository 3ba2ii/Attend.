import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import excelFileScreenshot from '../../../assets/excelsheet.png';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    outline: 'none',

    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(8),
    borderRadius: 20,
  },
}));

export default function TransitionsModal({ handleOpen, handleClose, open }) {
  const classes = useStyles();

  return (
    <div>
      <Modal
        aria-labelledby='How to format the excel file?'
        aria-describedby='Excel file formation'
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id='transition-modal-title'>How to format the excel file?</h2>
            <p id='transition-modal-description'>
              Please format the excel file to only include these following
              headers <br />
              <b> 'اسم الطالب ,الرقم القومي ,الايميل, ID' </b>to allow the
              system to store the data in a correct way.
            </p>
            <div className='excel-sheet-screenshot-container'>
              <img
                src={excelFileScreenshot}
                alt={'excel-sheet'}
                className='excel-sheet-screenshot'
              />
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
