import { useMutation } from '@apollo/client';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import {
  CREATE_INVITATION,
  UPDATE_INVITATION_DATE,
} from 'api/mutations/createInvitation';
import DropZoneContainer from 'components/Dropzone/Dropzone';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { handleSubmitInvitationForm } from 'utlis/helpers/invtiationOperations/invitationOperations';
import { DataTablePreview } from './DataTablePreview';

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

  const [xlsxFile, setXLSXFile] = useState(null);
  const [fileFormatError, setFileFormatError] = useState(false);
  const [createInvitation, { loading }] = useMutation(CREATE_INVITATION);
  const [updateInvitationDate, { loading: updateLoading }] = useMutation(
    UPDATE_INVITATION_DATE
  );

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
      <div style={{ width: '400px' }}></div>
      <div className='form-uploader-xlsx-container'>
        <header>
          <h3>
            Download{' '}
            <a
              href='https://docs.google.com/spreadsheets/d/1yMOsonkn8ivy3QZPP2GG6N31KQN2pgnO87keC9QY9ng/copy'
              target='_blank'
              rel='noreferrer'
            >
              this template
            </a>
            , fill it, and upload
          </h3>
        </header>

        <DropZoneContainer
          {...{
            setXLSXFile,
            setFileFormatError,
            propsToCheck: 'invitations-props',
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
