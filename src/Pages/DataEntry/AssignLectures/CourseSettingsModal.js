import { useMutation } from '@apollo/client';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { DELETE_COURSE_LECTURER_PREF } from 'api/mutations/deleteCourseLecturerPreference';
import {
  CREATE_COURSE_USER_PREF,
  UPDATE_COURSE_USERS,
} from 'api/mutations/updateCourseUsers';
import { GET_USERS_AND_COURSES_FULL_INFO } from 'api/queries/getUsersFullInfo';
import Query from 'components/Query';
import { useEffect, useRef, useState } from 'react';

const checkUnassignedUsers = ({
  previouslySelectedUsers,
  currentlySelectedUsers,
}) => {
  try {
    const selectedUsersIDs = currentlySelectedUsers.map((user) => user.id);

    return previouslySelectedUsers.filter(
      (u) => !selectedUsersIDs.includes(u.id)
    );
  } catch (err) {
    console.error('CheckUnAssignedUsers Error', err.message);
    throw new Error('Invalid Operation');
  }
};
const unassignUsersAction = async ({
  unassignedUsers,
  deleteCourseLecturerPrefMutation,
}) => {
  unassignedUsers.forEach(async ({ course_lecturer_preferences }) => {
    try {
      await deleteCourseLecturerPrefMutation({
        variables: { id: course_lecturer_preferences[0].id },
      });
    } catch (err) {
      console.error('UnassignUsersAction', err.message);
    }
  });
};
export const SettingsModal = ({ courseID, handleClose }) => {
  const [currentAssignedUsers, setCurrentAssignedUsers] = useState({
    lecturers: [],
    TA: [],
  });
  let refetchRef = useRef(null);

  const [selectedLecturers, setSelectedLecturers] = useState([]);
  const [selectedTAs, setSelectedTAs] = useState([]);

  const [deleteCourseLecturerPrefMutation, { loading }] = useMutation(
    DELETE_COURSE_LECTURER_PREF
  );
  const [
    createCourseUserPref,
    {
      loading: { createUserPrefLoading },
    },
  ] = useMutation(CREATE_COURSE_USER_PREF);
  const [
    updateCourseUsers,
    {
      loading: { updateLoading },
    },
  ] = useMutation(UPDATE_COURSE_USERS, {
    onCompleted(_) {
      refetchRef?.current().then(({ data }) => {
        onDataFetched(data);
      });
      handleClose();
    },
  });

  const onDataFetched = ({ course }, _, refetch) => {
    try {
      if (refetch) {
        refetchRef.current = refetch;
      }
      const lecturers = course.users.filter((u) => u.role.name === 'Lecturer');
      const TA = course.users.filter(
        (u) => u.role.name === 'Teacher Assistant'
      );

      setCurrentAssignedUsers({ lecturers, TA });
    } catch (e) {
      console.error('onDataFetched Error', e.message);
    }
  };
  const onChangeLecturers = (_, newValues) => {
    setSelectedLecturers(newValues);
  };
  const onChangeTAs = (_, newValues) => {
    setSelectedTAs(newValues);
  };
  const handleSavingSettings = async () => {
    try {
      const unAssignedLecturers = checkUnassignedUsers({
        previouslySelectedUsers: currentAssignedUsers.lecturers,
        currentlySelectedUsers: selectedLecturers,
      });

      const unAssignedTAs = checkUnassignedUsers({
        previouslySelectedUsers: currentAssignedUsers.TA,
        currentlySelectedUsers: selectedTAs,
      });

      await unassignUsersAction({
        unassignedUsers: [...unAssignedLecturers, ...unAssignedTAs],
        deleteCourseLecturerPrefMutation,
      });

      const newAssignedUsers = [
        ...selectedLecturers.map((u) => u?.id),
        ...selectedTAs.map((u) => u?.id),
      ];

      const prevAssignedUsers = [
        ...currentAssignedUsers.lecturers.map((u) => u.id),
        ...currentAssignedUsers.TA.map((u) => u.id),
      ];

      await newAssignedUsers.forEach(async (id) => {
        if (!prevAssignedUsers.includes(id))
          await createCourseUserPref({
            variables: {
              course: courseID,
              user: id,
            },
          });
      });

      await updateCourseUsers({
        variables: {
          id: courseID,
          users: newAssignedUsers,
        },
      });
    } catch (e) {
      console.error('handleSavingSettings', e.message);
    }
  };

  useEffect(() => {
    setSelectedLecturers(currentAssignedUsers.lecturers);
    setSelectedTAs(currentAssignedUsers.TA);
  }, [currentAssignedUsers]);

  return (
    <Query
      query={GET_USERS_AND_COURSES_FULL_INFO}
      variables={{
        course: courseID,
      }}
      onCompletedFunction={onDataFetched}
    >
      {({ data: { users, course } }) => {
        return (
          <section className='manipulate-lecturer-container'>
            <button className='icons8-multiply' onClick={handleClose}></button>
            <header className='main-header-container'>
              <h4 className='font-weight600'>Settings</h4>
            </header>
            <form onSubmit={handleSavingSettings}>
              <div>
                <header>
                  <span className='font-weight500'>Lecturers</span>
                </header>
                <Autocomplete
                  onChange={onChangeLecturers}
                  id='multiple-limit-tags-lecturer'
                  options={
                    users.filter((u) => u?.role?.name === 'Lecturer') || []
                  }
                  fullWidth
                  multiple
                  size='small'
                  defaultValue={users.filter((u) => {
                    const courseUsersID = course.users
                      .filter((u) => u?.role?.name === 'Lecturer')
                      .map((u) => u.id);
                    return courseUsersID.includes(u.id);
                  })}
                  getOptionLabel={(user) => user?.LecturerNameInArabic}
                  groupBy={(user) => user.department.DepartmentNameInArabic}
                  renderInput={(params) => (
                    <TextField {...params} variant='outlined' size='small' />
                  )}
                />
              </div>
              <div>
                <header>
                  <span className='font-weight500'>Teacher Assistants</span>
                </header>
                <Autocomplete
                  onChange={onChangeTAs}
                  id='multiple-limit-tags-ta'
                  options={
                    users.filter(
                      (u) => u?.role?.name === 'Teacher Assistant'
                    ) || []
                  }
                  fullWidth
                  multiple
                  size='small'
                  defaultValue={users.filter((u) => {
                    const courseUsersID = course.users
                      .filter((u) => u?.role?.name === 'Teacher Assistant')
                      .map((u) => u.id);
                    return courseUsersID.includes(u.id);
                  })}
                  getOptionLabel={(user) => user?.LecturerNameInArabic}
                  groupBy={(user) => user.department.DepartmentNameInArabic}
                  renderInput={(params) => (
                    <TextField {...params} variant='outlined' size='small' />
                  )}
                />
              </div>
            </form>
            <div className='modify-settings-container'>
              <button
                className='modify-settings-btn'
                onClick={handleSavingSettings}
                disabled={loading || createUserPrefLoading || updateLoading}
              >
                Save
              </button>
            </div>
          </section>
        );
      }}
    </Query>
  );
};
