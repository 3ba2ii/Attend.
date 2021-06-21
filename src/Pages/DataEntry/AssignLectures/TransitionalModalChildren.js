import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import { transitionFormatModalStyle } from 'types/styles';

export const TransitionalModalChildren = ({ open, handleClose, children }) => {
  const classes = transitionFormatModalStyle();

  return (
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
        <div className={classes.paper}>{children}</div>
      </Fade>
    </Modal>
  );
};
