import { useMutation, useQuery } from '@apollo/client';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { GET_STUDENT_BY_GROUP } from '../../../api/queries/getStudentByGroup';
import { DELETE_STUDENT_BY_GROUP } from '../../../api/mutations/deleteStudent';

import SpinnerElement from '../../../components/Spinner/spinner';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
  },
  paper: {
    outline: 'none',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(5),
    borderRadius: 20,
    width: '80%',
    [theme.breakpoints.up('md')]: {
      width: '50%',
    },
    [theme.breakpoints.up('lg')]: {
      width: '35%',
    },
    [theme.breakpoints.up('xl')]: {
      width: '25%',
    },
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
      outline: 'none',
    },
  },
}));

export default function AreYouSureModal({
  handleOpen,
  handleClose,
  open,
  groupInfo,
  refetch,
}) {
  const classes = useStyles();
  const { groupTitle, id, AcademicYearInArabic, GroupNumber } = groupInfo;
  const [fieldText, setFieldText] = React.useState('');
  const { data, loading, error } = useQuery(GET_STUDENT_BY_GROUP, {
    variables: { group: id },
  });

  const [deleteStudents, { loading: mutationLoading }] = useMutation(
    DELETE_STUDENT_BY_GROUP,
    {
      onCompleted(_) {
        refetch().then(() => {
          handleClose();
        });
      },
      onError(err) {
        console.error(err);
      },
    }
  );

  const deleteStudentsByGroup = async (e) => {
    e.preventDefault();
    const students = data?.students;
    if (!students) return;

    students.forEach(async ({ id }) => {
      await deleteStudents({ variables: { id: id } });
    });
  };
  if (error) return `Error! ${error?.message}`;

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
          {loading ? (
            <div className='center-spinner'>
              <SpinnerElement />
            </div>
          ) : (
            <div className={classes.paper + ' confirmation-modal-container'}>
              <h3 id='confirmation-modal-title'>Are you absolutely sure?</h3>
              <p id='confirmation-modal-description'>
                This action <b>cannot</b> be undone. This will permanently
                delete the <b>{groupTitle}</b> group along with all the
                students, courses, and lecturer that are associated to this
                table. <br />
                <br />
                Please type <b>{groupTitle}</b> to confirm.
              </p>
              <form
                className={classes.root}
                noValidate
                autoComplete='off'
                onSubmit={deleteStudentsByGroup}
              >
                <TextField
                  id='outlined-basic'
                  label=''
                  variant='outlined'
                  onChange={(e) => setFieldText(e.target.value)}
                />
                <button
                  type='submit'
                  className='submit-delete-group-btn'
                  disabled={fieldText !== groupTitle || mutationLoading}
                >
                  {mutationLoading ? (
                    <CircularProgress style={{ color: '#eb5d63' }} size={25} />
                  ) : (
                    <span>
                      I understand the consequences, delete this group
                    </span>
                  )}
                </button>
              </form>
            </div>
          )}
        </Fade>
      </Modal>
    </div>
  );
}