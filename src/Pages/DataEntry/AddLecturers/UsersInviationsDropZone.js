import { useMutation } from '@apollo/client';
import {
  CREATE_INVITATION,
  UPDATE_INVITATION_DATE,
} from 'api/mutations/createInvitation';
import excelFileScreenshot from 'assets/excelsheet.png';
import TransitionsModal from 'components/Modals/FormatModal';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { handleSubmitInvitationForm } from 'utlis/helpers/invtiationOperations/invitationOperations';
import DropzoneContainer from '../../../components/Dropzone/Dropzone';
import { DataTablePreview } from './DataTablePreview';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

export function DropZone({
  departments,
  roles,
  currentUsersEmail,
  userInvitations,
  setOpenSnackbar,
  setSnackbarType,
}) {
  const {
    authedUser: { LecturerNameInEnglish, id },
  } = useSelector((state) => state?.authReducer);

  const [openModal, setOpenModal] = useState(false);
  const [xlsxFile, setFile] = useState(null);
  const [fileFormatError, setFileFormatError] = useState(false);
  const [createInvitation, { loading }] = useMutation(CREATE_INVITATION);
  const [updateInvitationDate, { loading: updateLoading }] = useMutation(
    UPDATE_INVITATION_DATE
  );
  const handleClose = () => {
    setOpenModal(false);
  };
  const handleSubmitFile = async (e) => {
    if (!xlsxFile) return;
    e.preventDefault();
    try {
      //1- Map over all the xlsx File
      //2- Check if there was previous invitation for that user
      //3- if an invitation exists; just add
      await xlsxFile.forEach(async ({ Email, Department, Role }) => {
        await handleSubmitInvitationForm({
          departments,
          roles,
          department: Department,
          email: Email,
          selectedRole: Role,
          userInvitations,
          userID: id,
          LecturerNameInEnglish,
          createInvitation,
          updateInvitationDate,
        });
      });
      setSnackbarType('success');
    } catch (err) {
      console.error(err.message);
      setSnackbarType('error');
    } finally {
      setOpenSnackbar(true);
    }
  };
  return (
    <section className='form-excel-wrapper'>
      <div style={{ width: '400px' }}>
        <TransitionsModal
          handleClose={handleClose}
          open={openModal}
          description={
            <>
              Please format the excel file to only include these following
              headers <br />
              <b> 'اسم الطالب ,الرقم القومي ,الايميل, ID' </b>to allow the
              system to store the data in a correct way.
            </>
          }
          title={'How to format the excel file?'}
          exampleImage={
            <img
              src={excelFileScreenshot}
              alt={'excel-sheet'}
              className='excel-sheet-screenshot'
            />
          }
        />
      </div>
      <div className='form-uploader-xlsx-container'>
        <header>
          <h3>Format the excel file correctly and upload it</h3>
          <span
            className='show-formation-of-excel-file'
            onClick={() => {
              setOpenModal(true);
            }}
          >
            How to format the excel file?
          </span>
        </header>
        <DropzoneContainer
          {...{
            setFile,
            setFileFormatError,
            fileFormatError,
            propsToCheck: 'users-invitation',
          }}
        />
      </div>
      {xlsxFile && (
        <div className='preview-accordion-container'>
          <Accordion elevation={0}>
            <AccordionSummary
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <div className='flex-show-preview'>
                <span>Show Preview</span>
                <div className='icons8-expand-arrow'></div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <DataTablePreview
                headers={['Email', 'Department', 'Role', 'Status']}
                data={xlsxFile}
                departments={departments}
                currentUsersEmail={currentUsersEmail}
                setFileFormatError={setFileFormatError}
              />
            </AccordionDetails>
          </Accordion>
        </div>
      )}
      <div
        className='invitation-btn-container excel-invitations-btn'
        style={{ marginTop: '1rem' }}
      >
        <button
          type='submit'
          className='invitation-btn'
          disabled={fileFormatError || loading || updateLoading}
          onClick={handleSubmitFile}
        >
          <span>Send Invitations</span>
        </button>
      </div>
    </section>
  );
}
