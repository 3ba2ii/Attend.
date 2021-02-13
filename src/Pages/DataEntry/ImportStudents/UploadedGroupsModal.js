import { useQuery } from '@apollo/client';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';
import React, { useEffect, useState } from 'react';
import { GET_ACADEMIC_YEARS } from '../../../api/queries/getAcademicYears';
import SpinnerElement from '../../../components/Spinner/spinner';
import AreYouSureModal from './AreYouSureModal';

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
    minWidth: '50%',
    minHeight: '80%',
    width: '90%',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),

      width: '50%',
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(7),

      width: '40%',
    },
    [theme.breakpoints.up('xl')]: {
      padding: theme.spacing(8),

      width: '30%',
    },
  },
}));

export default function UploadedGroupsModal({ handleOpen, handleClose, open }) {
  const classes = useStyles();
  const { data, loading, error, refetch } = useQuery(GET_ACADEMIC_YEARS);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [selectedGroupToDelete, setSelectedGroupToDelete] = useState({});
  const values = data?.groupsConnection?.values;

  const handleOpenConfirmationModal = ({
    GroupNumber,
    academic_year,
    id,
    groupTitle,
  }) => {
    setSelectedGroupToDelete({ GroupNumber, ...academic_year, id, groupTitle });
    setOpenConfirmationModal(true);
  };

  const handleCloseConfirmationModal = () => {
    setOpenConfirmationModal(false);
  };

  useEffect(() => {
    refetch();
  }, [refetch]);
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <Modal
        aria-labelledby='Uploaded Groups'
        aria-describedby='Uploaded Groups'
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
          <div className={classes.paper + ' uploaded-groups-modal'}>
            {loading ? (
              <div className='center-spinner'>
                <SpinnerElement />
              </div>
            ) : (
              <div className='uploaded-groups-modal-header-container'>
                <header className='uploaded-groups-modal-header'>
                  <h3>Uploaded Groups</h3>
                  <p>
                    This is a <span>danger area</span> so please be sure about
                    what you are doing here
                    <br /> any change occurs here will affect the database and
                    the whole stored data.
                  </p>
                </header>
                <ul className='list-container'>
                  {values.map(
                    ({ id, GroupNumber, academic_year, students }) => {
                      let groupTitle = `${academic_year?.AcademicYearInArabic} - Group ${GroupNumber}`;
                      let groupStudentsCount = students?.length;

                      if (!groupStudentsCount) return null;
                      return (
                        <li className='group=container' key={id}>
                          <div className='group-container-info'>
                            <span id='group-title'>{groupTitle}</span>
                            <span id='group-students-count'>
                              <GroupOutlinedIcon fontSize={'small'} />
                              {groupStudentsCount} Students
                            </span>
                          </div>
                          <div
                            className='on-hover-red'
                            onClick={() =>
                              handleOpenConfirmationModal({
                                GroupNumber,
                                academic_year,
                                id,
                                groupTitle,
                              })
                            }
                          >
                            <DeleteOutlineOutlinedIcon
                              style={{
                                color: '#eb5d63',
                                cursor: 'pointer',
                              }}
                            />
                          </div>
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
            )}
          </div>
        </Fade>
      </Modal>
      {openConfirmationModal && (
        <AreYouSureModal
          handleClose={handleCloseConfirmationModal}
          handleOpen={handleOpenConfirmationModal}
          open={openConfirmationModal}
          groupInfo={selectedGroupToDelete}
          refetch={refetch}
        />
      )}
    </div>
  );
}