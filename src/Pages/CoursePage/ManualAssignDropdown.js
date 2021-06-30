import { useMutation } from '@apollo/client';
import {
  ASSIGN_STUDENT_TO_LECTURE,
  ASSIGN_STUDENT_TO_SECTION,
} from 'api/mutations/assignStudent';
import { ReactComponent as NationalIDIcon } from 'assets/icons/card.svg';
import { ReactComponent as EmailIcon } from 'assets/icons/email.svg';
import { ReactComponent as FullNameIcon } from 'assets/icons/identity.svg';
import { ReactComponent as LapIcon } from 'assets/icons/lap.svg';
import { ReactComponent as LeftArrowIcon } from 'assets/icons/left_arrow.svg';
import { ReactComponent as ReportIcon } from 'assets/icons/report.svg';
import { ReactComponent as RightArrowIcon } from 'assets/icons/right_arrow.svg';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { CoursePageContext } from './CoursePage';
import { DropdownItem } from './DropdownItem';
import { getSelectComponentOptions } from './ExportReportDropdown';
import { SelectComponent } from './SelectComponent';

export const ManualAssignDropdown = ({ setOpenAssignStudentMenu }) => {
  const { studentsData, processedLectures, processedSections } =
    useContext(CoursePageContext);

  const {
    authedUser: {
      role: { name },
    },
  } = useSelector((state) => state.authReducer);

  const isLecturer = useMemo(() => name !== 'Teacher Assistant', [name]);

  const [assignStudentToLecture, { loading }] = useMutation(
    ASSIGN_STUDENT_TO_LECTURE,
    {
      onCompleted(_) {
        window.location.reload();
      },
      onError(err) {
        console.error(err);
      },
    }
  );

  const [assignStudentToSection, { loading: sectionLoading }] = useMutation(
    ASSIGN_STUDENT_TO_SECTION,
    {
      onCompleted(_) {
        window.location.reload();
      },
      onError(err) {
        console.error(err);
      },
    }
  );

  const dropdownMenuRef = useRef();
  const [state, setState] = useState({
    __assignBy: null,
    __typename: null,
    students: {},
    meetings: [],
  });

  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const [identifier, setIdentifer] = useState('');
  const [identifierError, setIdentifierError] = useState('');

  function calcHeight(el) {
    const height =
      (el
        ? el.offsetHeight
        : dropdownMenuRef?.current?.firstChild?.offsetHeight) + 40;
    setMenuHeight(height);
  }
  const handleStateChange = (effectedField, newValue) => {
    setState({ ...state, [effectedField]: newValue });
  };

  const handleMeetingSelection = (values) => {
    let data;
    if (Array.isArray(values)) {
      data = values.map(({ info }) => info);
    } else {
      const { info } = values;
      data = [info];
    }

    setState({ ...state, meetings: data, students: {} });
    setIdentifer('');
  };
  const handleIdentifierChange = (e) => {
    setIdentifer(e.target.value);
  };
  const validateInput = () => {
    switch (state.__assignBy) {
      case 'full-name':
        const regexp = new RegExp(/^[\u0621-\u064A\s\p{N}]+$/);

        if (!regexp.test(identifier.trim())) {
          setIdentifierError('The name must only include arabic characters');
          return;
        } else if (identifier.length < 8) {
          setIdentifierError('The name must be more than 8 characters');
          return;
        }
        setIdentifierError('');
        break;
      case 'national-id':
        const regexpNat = new RegExp(/^\d+$/);

        if (!regexpNat.test(identifier.trim())) {
          setIdentifierError('National must contain digits only');
          return;
        }
        if (identifier.trim().length !== 14) {
          setIdentifierError('National ID must 14 digits');
          return;
        }
        setIdentifierError('');
        break;
      case 'email-address':
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(identifier).toLowerCase().trim())) {
          setIdentifierError('Please provide a valid email address.');
          return;
        }
        setIdentifierError('');
        break;

      default:
        break;
    }
    checkStudentAttendance();
  };

  const checkStudentAttendance = () => {
    try {
      const { meetings } = state;
      const { attendances } = meetings?.[0];

      const attendedStudentsInfo = attendances.map(({ student }) => {
        const studentInfo = studentsData?.[student?.id];
        return studentInfo;
      });

      const allStudentsInfo = Object.values(studentsData);

      var isAttended;
      var isFound;
      setIdentifierError('');
      switch (state.__assignBy) {
        case 'full-name':
          isAttended = attendedStudentsInfo.some(
            ({ StudentNameInArabic }) =>
              StudentNameInArabic.toLowerCase().trim() ===
              identifier.toLowerCase().trim()
          );
          if (isAttended) {
            setIdentifierError(
              `Student has already attended this ${state.__typename}`
            );
            return;
          }
          isFound = allStudentsInfo.some(
            ({ StudentNameInArabic }) =>
              StudentNameInArabic.toLowerCase().trim() ===
              identifier.toLowerCase().trim()
          );
          if (!isFound) {
            setIdentifierError(`Student is not recognized`);
            return;
          }
          break;
        case 'national-id':
          isAttended = attendedStudentsInfo.some(
            ({ NationalID }) =>
              NationalID.toLowerCase().trim() === identifier.trim()
          );

          if (isAttended) {
            setIdentifierError(
              `Student has already attended this ${state.__typename}`
            );
            return;
          }
          isFound = allStudentsInfo.some(
            ({ NationalID }) =>
              NationalID.toLowerCase().trim() === identifier.trim()
          );
          if (!isFound) {
            setIdentifierError(`Student is not recognized`);
            return;
          }
          break;

        case 'email-address':
          isAttended = attendedStudentsInfo.some(
            ({ StudentOfficialEmail }) =>
              StudentOfficialEmail.toLowerCase().trim() === identifier.trim()
          );

          if (isAttended) {
            setIdentifierError(
              `Student has already attended this ${state.__typename}`
            );
            return;
          }
          isFound = allStudentsInfo.some(
            ({ StudentOfficialEmail }) =>
              StudentOfficialEmail.toLowerCase().trim() === identifier.trim()
          );
          if (!isFound) {
            setIdentifierError(`Student is not recognized`);
            return;
          }
        default:
          break;
      }
    } catch (e) {
      console.error(e.message);
    }
  };
  const handleAddStudent = (e) => {
    e.preventDefault();
    let studentInfo = {};
    Object.entries(studentsData).forEach(
      ([key, { StudentNameInArabic, StudentOfficialEmail, NationalID }]) => {
        if (
          [StudentNameInArabic, StudentOfficialEmail, NationalID].includes(
            identifier
          )
        )
          studentInfo = {
            [key]: {
              StudentNameInArabic,
              StudentOfficialEmail,
              NationalID,
              id: key,
            },
          };
        return;
      }
    );

    setState({ ...state, students: { ...state.students, ...studentInfo } });
  };
  const handleDeleteStudent = (id) => {
    let newStudentsList = state.students;
    delete newStudentsList[id];

    setState({ ...state, students: newStudentsList });
  };
  const assignStudents = async (e) => {
    e.preventDefault();
    if (Boolean(identifierError) && !state.students.length) return;
    try {
      const { __typename, students, meetings } = state;
      const addedStudentsIDs = Object.keys(students);
      const meetingID = meetings?.[0].id;

      if (__typename === 'Lecture') {
        addedStudentsIDs.forEach(async (id) => {
          await assignStudentToLecture({
            variables: {
              timestamp: new Date(),
              student: id,
              lecture: meetingID,
            },
          });
        });
      } else if (__typename === 'Section') {
        addedStudentsIDs.forEach(async (id) => {
          await assignStudentToSection({
            variables: {
              timestamp: new Date(),
              student: id,
              section: meetingID,
            },
          });
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    calcHeight();
  }, [state.students]);
  return (
    <div
      className='dropdown'
      ref={dropdownMenuRef}
      style={{
        height: menuHeight,
        overflowY: 'auto',
      }}
    >
      <CSSTransition
        in={activeMenu === 'main'}
        unmountOnExit
        timeout={500}
        classNames={'menu-primary'}
        onEnter={calcHeight}
      >
        <div className='menu'>
          <DropdownItem setActiveMenu={setActiveMenu}>
            <h6>Assignment Options</h6>
          </DropdownItem>
          <DropdownItem
            setActiveMenu={setActiveMenu}
            goToMenu='secondary'
            leftIcon={<FullNameIcon />}
            rightIcon={<RightArrowIcon />}
            onSelectAction={() => handleStateChange('__assignBy', 'full-name')}
          >
            Full Name
          </DropdownItem>
          <DropdownItem
            setActiveMenu={setActiveMenu}
            goToMenu='secondary'
            leftIcon={<NationalIDIcon />}
            rightIcon={<RightArrowIcon />}
            onSelectAction={() =>
              handleStateChange('__assignBy', 'national-id')
            }
          >
            National ID
          </DropdownItem>
          <DropdownItem
            setActiveMenu={setActiveMenu}
            goToMenu='secondary'
            leftIcon={<EmailIcon />}
            rightIcon={<RightArrowIcon />}
            onSelectAction={() =>
              handleStateChange('__assignBy', 'email-address')
            }
          >
            Email Address
          </DropdownItem>
        </div>
      </CSSTransition>
      <CSSTransition
        in={activeMenu === 'secondary'}
        unmountOnExit
        timeout={500}
        classNames={'menu-secondary'}
        onEnter={calcHeight}
      >
        <div className='menu'>
          <DropdownItem
            setActiveMenu={setActiveMenu}
            leftIcon={<LeftArrowIcon />}
            goToMenu='main'
          >
            <h6>Assign Student To</h6>
          </DropdownItem>

          {isLecturer && (
            <DropdownItem
              setActiveMenu={setActiveMenu}
              goToMenu='third-menu'
              leftIcon={<ReportIcon />}
              rightIcon={<RightArrowIcon />}
              onSelectAction={() => handleStateChange('__typename', 'Lecture')}
            >
              Lecture
            </DropdownItem>
          )}
          <DropdownItem
            setActiveMenu={setActiveMenu}
            goToMenu='third-menu'
            leftIcon={<LapIcon />}
            rightIcon={<RightArrowIcon />}
            onSelectAction={() => handleStateChange('__typename', 'Section')}
          >
            Section
          </DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'third-menu'}
        unmountOnExit
        timeout={500}
        classNames={'menu-third'}
        onEnter={calcHeight}
        onEntered={() => {
          setState({ ...state, students: {}, meetings: [] });
          setIdentifer('');
          setIdentifierError('');
        }}
      >
        <div className='menu'>
          <DropdownItem
            setActiveMenu={setActiveMenu}
            leftIcon={<LeftArrowIcon />}
            goToMenu='secondary'
          >
            <h6>Fill the required fields</h6>
          </DropdownItem>
          <form className={`manual-assign-form`}>
            <SelectComponent
              {...{
                options: getSelectComponentOptions(
                  state,
                  processedLectures,
                  processedSections
                ),
                isMulti: false,
                __typename: state.__typename,
                handleChange: handleMeetingSelection,
              }}
            />
            <div className='assign-input-field-container'>
              <input
                name={state.__assignBy}
                className='report-name-input-field'
                placeholder={`Please add the students' ${state.__assignBy}`}
                value={identifier}
                onChange={handleIdentifierChange}
                onBlur={validateInput}
                className={`assign-by-input-field ${
                  identifierError && 'input-field-error'
                }`}
              />
              <button
                className='assign-students-button'
                disabled={
                  Boolean(identifierError) ||
                  !Boolean(state?.meetings?.length) ||
                  identifier === ''
                }
                onClick={handleAddStudent}
              >
                <svg
                  width='35'
                  height='35'
                  viewBox='0 0 35 35'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <rect
                    width='35'
                    height='35'
                    rx='17.5'
                    fill='#367DD8'
                    fillOpacity='0.19'
                  />
                  <path
                    d='M25 18.3176H19.4549V24H16.5451V18.3176H11V15.6824H16.5451V10H19.4549V15.6824H25V18.3176Z'
                    fill='#367DD8'
                  />
                </svg>
              </button>
              <CSSTransition
                in={Boolean(identifierError)}
                unmountOnExit
                timeout={300}
                classNames={'identifier-error'}
              >
                <span className='identifier-error'>{identifierError}</span>
              </CSSTransition>
            </div>
            {}
            {ThirdMenu(state, handleDeleteStudent)}
            <button
              type='submit'
              className='save-changes-button'
              disabled={
                !Boolean(state?.meetings?.length) ||
                identifier === '' ||
                !Boolean(Object.keys(state?.students)?.length) ||
                loading ||
                sectionLoading
              }
              onClick={assignStudents}
            >
              <div className='icons8-share-rounded-white'></div>
              <span>Save Changes</span>
            </button>
          </form>
        </div>
      </CSSTransition>
    </div>
  );
};
function ThirdMenu(state, handleDeleteStudent) {
  try {
    return (
      <CSSTransition
        in={true}
        unmountOnExit
        timeout={300}
        classNames={'identifier-error'}
      >
        <>
          {Object.keys(state.students)?.length ? (
            <ol className='identifiers-list'>
              {Object.values(state.students).map(
                ({ StudentNameInArabic, id }, index) => (
                  <li key={id + index}>
                    <span>
                      {index + 1}.{'  '}
                      {StudentNameInArabic}
                    </span>
                    <button
                      onClick={() => {
                        handleDeleteStudent(id);
                      }}
                    >
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <rect
                          width='24'
                          height='24'
                          rx='12'
                          fill='#E47C67'
                          fillOpacity='0.19'
                        />
                        <path d='M16 11V13H8V11H16Z' fill='#E47C67' />
                      </svg>
                    </button>
                  </li>
                )
              )}
            </ol>
          ) : (
            ''
          )}
        </>
      </CSSTransition>
    );
  } catch (e) {
    return <div>an error occurred</div>;
  }
}
