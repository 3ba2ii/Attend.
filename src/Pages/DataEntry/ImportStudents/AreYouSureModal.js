import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React from 'react';

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
    padding: theme.spacing(5),
    borderRadius: 20,
    width: '80%',
    [theme.breakpoints.up('md')]: {
      width: '40%',
    },
    [theme.breakpoints.up('lg')]: {
      width: '30%',
    },
    [theme.breakpoints.up('xl')]: {
      width: '20%',
    },
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
}));

export default function AreYouSureModal({
  handleOpen,
  handleClose,
  open,
  groupInfo,
}) {
  const classes = useStyles();
  const { groupTitle, id, AcademicYearInArabic, GroupNumber } = groupInfo;
  const [fieldText, setFieldText] = React.useState('');

  console.log(`🚀 ~ file: AreYouSureModal.js ~ line 40 ~ fieldText`, fieldText);
  return (
    <div>
      <Modal
        aria-labelledby='confirmation=modal'
        aria-describedby='confirmation=modal'
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
          <div className={classes.paper + ' confirmation-modal-container'}>
            <h3 id='confirmation-modal-title'>Are you absolutely sure?</h3>
            <p id='confirmation-modal-description'>
              This action <b>cannot</b> be undone. This will permanently delete
              the <b>{groupTitle}</b> group along with all the students,
              courses, and lecturer that are associated to this table. <br />
              <br />
              Please type <b>{groupTitle}</b> to confirm.
            </p>
            <form className={classes.root} noValidate autoComplete='off'>
              <TextField
                id='outlined-basic'
                label=''
                variant='outlined'
                onChange={(e) => setFieldText(e.target.value)}
              />
              <button
                className='submit-delete-group-btn'
                disabled={fieldText !== groupTitle}
              >
                I understand the consequences, delete this group
              </button>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
