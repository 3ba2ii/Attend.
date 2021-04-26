import { useMutation } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import React, { useCallback, useState } from 'react';
import { DELETE_STUDENT_BY_GROUP } from 'api/mutations/deleteStudent';
import { GET_STUDENT_BY_GROUP } from 'api/queries/getStudentByGroup';
import Query from 'components/Query';
import { areYouSureModalStyles } from 'types/styles';

export default function AreYouSureModal({
  handleClose,
  open,
  groupInfo,
  refetch,
}) {
  const classes = areYouSureModalStyles();
  const { groupTitle, id } = groupInfo;
  const [fieldText, setFieldText] = useState('');
  const [students, setStudents] = useState([]);
  const [deleteStudents, { loading }] = useMutation(DELETE_STUDENT_BY_GROUP, {
    onCompleted(_) {
      refetch().then(() => {
        handleClose();
      });
    },
    onError(err) {
      console.error(err);
    },
  });
  const fetchStudents = useCallback(
    (data) => setStudents(data?.students || []),
    [setStudents]
  );

  const deleteStudentsByGroup = async (e) => {
    e.preventDefault();
    if (!students) return;

    students.forEach(async ({ id }) => {
      await deleteStudents({ variables: { id: id } });
    });
  };

  return (
    <Query
      query={GET_STUDENT_BY_GROUP}
      variables={{ group: id }}
      onCompletedFunction={fetchStudents}
    >
      {(_) => {
        return (
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
                <h5 id='confirmation-modal-title'>Are you absolutely sure?</h5>
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
                    disabled={fieldText !== groupTitle || loading}
                  >
                    {loading ? (
                      <CircularProgress
                        style={{ color: '#eb5d63' }}
                        size={25}
                      />
                    ) : (
                      <span>
                        I understand the consequences, delete this group
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </Fade>
          </Modal>
        );
      }}
    </Query>
  );
}
