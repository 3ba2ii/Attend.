import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import React from 'react';
import excelFileScreenshot from '../../../assets/excelsheet.png';
import { transitionFormatModalStyle } from '../../../types/styles';

export default function TransitionsModal({ handleOpen, handleClose, open }) {
  const classes = transitionFormatModalStyle();

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
