import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import React from 'react';
import excelFileScreenshot from 'assets/excelsheet.png';
import { transitionFormatModalStyle } from 'types/styles';

export default function TransitionsModal({
  handleOpen,
  handleClose,
  open,
  title,
  description,
  exampleImage,
}) {
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
            <h2 id='transition-modal-title'>{title}</h2>
            <p id='transition-modal-description'>{description}</p>
            <div className='excel-sheet-screenshot-container'>
              {exampleImage}
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
