import { useQuery } from '@apollo/client';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import { GET_ACADEMIC_YEARS } from 'api/queries/getAcademicYears';
import AreYouSureModal from 'components/Modals/AreYouSureModal';
import SpinnerElement from 'components/Spinner/spinner';
import React, { useCallback, useEffect, useState } from 'react';
import { uploadedGroupsModalStyles } from 'types/styles';

export default function UploadedGroupsModal({ handleClose, open }) {
  const classes = uploadedGroupsModalStyles();
  const { data, loading, error, refetch } = useQuery(GET_ACADEMIC_YEARS);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [selectedGroupToDelete, setSelectedGroupToDelete] = useState({});
  const values = data?.groupsConnection?.values;

  const handleOpenConfirmationModal = useCallback(
    ({ GroupNumber, academic_year, id, groupTitle }) => {
      setSelectedGroupToDelete({
        GroupNumber,
        ...academic_year,
        id,
        groupTitle,
      });
      setOpenConfirmationModal(true);
    },
    [setSelectedGroupToDelete, setOpenConfirmationModal]
  );

  const handleCloseConfirmationModal = useCallback(() => {
    setOpenConfirmationModal(false);
  }, [setOpenConfirmationModal]);

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
              <div>{GroupList(values, handleOpenConfirmationModal)}</div>
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
function GroupList(values, handleOpenConfirmationModal) {
  return (
    <div className='uploaded-groups-modal-header-container'>
      <header className='uploaded-groups-modal-header'>
        <h4>Uploaded Groups</h4>
        <p>
          This is a <span>danger area</span> so please be sure about what you
          are doing here
          <br /> any change occurs here will affect the database and the whole
          stored data.
        </p>
      </header>
      <ul className='list-container'>
        {values.map(({ id, GroupNumber, academic_year, students }) => {
          let groupTitle = `${academic_year?.AcademicYearInArabic} - Group ${GroupNumber}`;
          let groupStudentsCount = students?.length;

          if (!groupStudentsCount) return null;
          return (
            <li className='group=container' key={id}>
              <div className='group-container-info'>
                <span id='group-title'>{groupTitle}</span>
                <span id='group-students-count'>
                  <div className='icons8-group'></div>
                  <span>
                    {groupStudentsCount} Student{groupStudentsCount > 1 && 's'}
                  </span>
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
                <div
                  className='icons8-trash'
                  style={{ cursor: 'pointer' }}
                ></div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
