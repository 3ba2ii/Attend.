import Checkbox from '@material-ui/core/Checkbox';
import { ReactComponent as CalendarIcon } from 'assets/icons/calender.svg';
import { ReactComponent as LapIcon } from 'assets/icons/lap.svg';
import { ReactComponent as LeftArrowIcon } from 'assets/icons/left_arrow.svg';
import { ReactComponent as MultipleReports } from 'assets/icons/multiple_reports.svg';
import { ReactComponent as PeriodIcon } from 'assets/icons/period.svg';
import { ReactComponent as ReportIcon } from 'assets/icons/report.svg';
import { ReactComponent as RightArrowIcon } from 'assets/icons/right_arrow.svg';
import { ReactComponent as SumIcon } from 'assets/icons/sum.svg';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CSVLink } from 'react-csv';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { CSSTransition } from 'react-transition-group';
import { CoursePageContext } from './CoursePage';
import './dropdown_menu.css';
import { extractGroupsName } from './getGroupsName';

const SelectComponent = ({ options, handleChange, isMulti, __typename }) => {
  const animatedComponents = useMemo(() => makeAnimated(), []);

  return (
    <Select
      options={options}
      className='basic-multi-select'
      classNamePrefix='select'
      components={animatedComponents}
      isMulti={isMulti}
      onChange={handleChange}
      placeholder={`Select ${__typename}...`}
    />
  );
};

export const DropdownMenuContext = createContext();
export const DropdownMenu = () => {
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const { studentsData, processedLectures, processedSections } =
    useContext(CoursePageContext);
  const [formattedCSVData, setFormattedCSVData] = useState([]);
  const [reportName, setReportName] = useState('');
  const [points, setPoints] = useState('');

  //Data should be formatted like this
  // {name : Ahmed, Course Name : Pattern Recognition, Email: aghonem2011@gmail.com,
  // Lecture 1 : 1, Lecture 2 : 0, Total Attended Lectures: 1, Attendance Rate : 1/3 , Grade: 1 * PPL }
  const [state, setState] = useState({
    __typename: null, //Section or Lecture
    multiplicity: null,
    reportVariety: null,
    meetings: [],
    reportOptions: {
      includeGrading: false,
      includeCourseName: false,
      IncludeAttendanceRates: false,
      includeStudentEmail: false,
    },
  });
  const [headers, setHeaders] = useState([
    { label: 'اسم الطالب', key: 'name' },
  ]);

  const lecturesLength = useMemo(
    () => Object.values(processedLectures).length,
    [processedLectures]
  );
  const sectionsLength = useMemo(
    () => Object.values(processedSections).length,
    [processedSections]
  );
  const studentsDataValues = useMemo(
    () => Object.values(studentsData),
    [studentsData]
  );

  const handleStateChange = (effectedField, newValue) => {
    setState({ ...state, [effectedField]: newValue });
  };
  const handleOptionsChange = (e, option) => {
    setState({
      ...state,
      reportOptions: {
        ...state.reportOptions,
        [option]: e.target.checked,
      },
    });
  };
  const handleMeetingSelection = (values) => {
    let data;
    if (Array.isArray(values)) {
      data = values.map(({ info }) => info);
    } else {
      const { info } = values;
      data = [info];
    }
    setState({ ...state, meetings: data });
  };
  function calcHeight(el) {
    const height = el.offsetHeight + 50;
    setMenuHeight(height);
  }
  useEffect(() => {
    //iterate over students
    let intermediateData = [];
    let _globalTempHeaders = [{ label: 'اسم الطالب', key: 'name' }];
    const { __typename, meetings } = state;
    if (__typename === 'Lecture' && meetings?.length) {
      const meetingsNumbers = meetings
        .map(({ LectureNumber }) => LectureNumber)
        .sort((a, b) => b - a);

      meetingsNumbers.forEach((LectureNumber) => {
        const isFound = _globalTempHeaders.some(
          ({ key }) => key === `lecture${LectureNumber}`
        );
        if (!isFound)
          _globalTempHeaders.splice(1, 0, {
            label: `Lecture ${LectureNumber}`,
            key: `lecture${LectureNumber}`,
          });
      });

      studentsDataValues.forEach(
        ({ StudentNameInArabic, StudentOfficialEmail, course, id }) => {
          const { lectures } = course;
          //these one includes the lecture numbers of the lectures that this student attended
          //we want to find the intersection between selected Lectures and student attended Lectures
          const intersected = [...lectures]
            .filter((value) => meetingsNumbers.includes(value))
            .sort();
          const attended = intersected.length;
          const pointPerLecture = points || 1;
          const grade = pointPerLecture * attended;
          const attendanceRate =
            (lectures.size / lecturesLength).toFixed(1) * 100;

          let tempStudentData = {
            name: StudentNameInArabic,
            email: StudentOfficialEmail,
            attendanceRate: attendanceRate + '%',
            grade,
          };
          meetingsNumbers.forEach((meetingNumber) => {
            tempStudentData['lecture' + meetingNumber] = intersected.includes(
              meetingNumber
            )
              ? '1'
              : '0';
          });
          intermediateData.push(tempStudentData);
        }
      );
    }
    setFormattedCSVData(intermediateData);

    //checking options

    const {
      reportOptions: {
        includeGrading,
        includeCourseName,
        IncludeAttendanceRates,
        includeStudentEmail,
      },
    } = state;
    if (
      includeGrading &&
      !_globalTempHeaders.some(({ key }) => key === `grade`)
    )
      _globalTempHeaders.push({
        key: 'grade',
        label: 'Grade',
      });
    if (
      includeCourseName &&
      !_globalTempHeaders.some(({ key }) => key === `course_name`)
    )
      _globalTempHeaders.push({
        key: 'course_name',
        label: 'Course Name',
      });
    if (
      IncludeAttendanceRates &&
      !_globalTempHeaders.some(({ key }) => key === `attendanceRates`)
    )
      _globalTempHeaders.push({
        key: 'attendanceRate',
        label: 'Overall Attendance Rate',
      });
    if (
      includeStudentEmail &&
      !_globalTempHeaders.some(({ key }) => key === `email`)
    )
      _globalTempHeaders.push({
        key: 'email',
        label: 'Email',
      });
    setHeaders(_globalTempHeaders);
  }, [state, lecturesLength, studentsDataValues, points]);
  return (
    <DropdownMenuContext.Provider value={{ activeMenu, setActiveMenu }}>
      <div
        className='dropdown'
        style={{
          height: menuHeight,
          overflow: 'auto',
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
            <DropdownItem>
              <h6>Report Type</h6>
            </DropdownItem>
            <DropdownItem
              goToMenu='secondary'
              leftIcon={<ReportIcon />}
              rightIcon={<RightArrowIcon />}
              onSelectAction={() => {
                handleStateChange('__typename', 'Lecture');
              }}
            >
              Lecture
            </DropdownItem>
            <DropdownItem
              goToMenu='secondary'
              leftIcon={<LapIcon />}
              rightIcon={<RightArrowIcon />}
              onSelectAction={() => {
                handleStateChange('__typename', 'Section');
              }}
            >
              Section
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
            <DropdownItem leftIcon={<LeftArrowIcon />} goToMenu='main'>
              <h6>Report Type</h6>
            </DropdownItem>
            <DropdownItem
              leftIcon={<ReportIcon />}
              rightIcon={<RightArrowIcon />}
              goToMenu='third-menu'
              onSelectAction={() => {
                handleStateChange('multiplicity', 'single');
                handleStateChange('reportVariety', 'single meeting');
                setState({ ...state, multiplicity: 'single' });
              }}
            >
              <div className='select-report-type-wrapper'>
                <span>Single {state.__typename} Report</span>
                <p>Reports only for a single {state.__typename}</p>
              </div>
            </DropdownItem>
            <DropdownItem
              leftIcon={<MultipleReports />}
              rightIcon={<RightArrowIcon />}
              onSelectAction={() => {
                handleStateChange('multiplicity', 'multiple');
                handleStateChange('reportVariety', 'multiple meetings');
                setState({ ...state, multiplicity: 'multiple' });
              }}
              goToMenu='third-menu'
            >
              <div className='select-report-type-wrapper'>
                <span>Multiple {state.__typename}s Report</span>
                <p>Reports for multiple {state.__typename}s</p>
              </div>
            </DropdownItem>
            <DropdownItem
              leftIcon={<PeriodIcon />}
              rightIcon={<RightArrowIcon />}
              onSelectAction={() => {
                handleStateChange('multiplicity', 'multiple');
                handleStateChange('reportVariety', 'period');
              }}
            >
              <div className='select-report-type-wrapper'>
                <span>Period Report</span>
                <p>Reports for {state.__typename}s in between two dates</p>
              </div>
            </DropdownItem>
            <DropdownItem
              leftIcon={<CalendarIcon />}
              rightIcon={<RightArrowIcon />}
            >
              <div className='select-report-type-wrapper'>
                <span>Monthly Report</span>
                <p>Report includes all the {state.__typename}s for a month</p>
              </div>
            </DropdownItem>
            <DropdownItem leftIcon={<SumIcon />} rightIcon={<RightArrowIcon />}>
              <div className='select-report-type-wrapper'>
                <span>Overall Year Report</span>
                <p>
                  Report includes attendances for all the {state.__typename}s
                </p>
              </div>
            </DropdownItem>
          </div>
        </CSSTransition>

        <CSSTransition
          in={activeMenu === 'third-menu'}
          unmountOnExit
          timeout={500}
          classNames={'menu-third'}
          onEnter={calcHeight}
        >
          <div className='menu'>
            <DropdownItem leftIcon={<LeftArrowIcon />} goToMenu='secondary'>
              <h6>Report Options</h6>
            </DropdownItem>
            <form className={`extract-report-form`}>
              <SelectComponent
                {...{
                  options:
                    state.__typename === 'Lecture'
                      ? Object.values(processedLectures).map(
                          ({
                            id,
                            LectureNumber,
                            LectureName,
                            groups,
                            ...rest
                          }) => {
                            const groupsName = extractGroupsName(
                              groups.map((g) => g.GroupNumber)
                            );
                            return {
                              info: {
                                id,
                                LectureNumber,
                                LectureName,
                                groups,
                                ...rest,
                              },
                              value: id,
                              label: `Lecture ${LectureNumber} - ${groupsName}`,
                            };
                          }
                        )
                      : Object.values(processedSections).map(
                          ({
                            id,
                            SectionNumber,
                            SectionName,
                            groups,
                            ...rest
                          }) => {
                            const groupsName = extractGroupsName(
                              groups.map((g) => g.GroupNumber)
                            );
                            return {
                              value: {
                                id,
                                SectionNumber,
                                SectionName,
                                groups,
                                ...rest,
                              },
                              label: `Section ${SectionNumber} - ${groupsName}`,
                            };
                          }
                        ),
                  isMulti: state.multiplicity === 'multiple',
                  __typename: state.__typename,
                  handleChange: handleMeetingSelection,
                }}
              />

              <div className='report-option-space-between'>
                <input
                  name='report-name'
                  className='report-name-input-field'
                  placeholder='Report Name'
                  onChange={(e) => {
                    setReportName(e.target.value);
                  }}
                />
                <input
                  name='point-label'
                  className='report-name-input-field'
                  type='number'
                  placeholder={`Point Per ${state.__typename}`}
                  onChange={(e) => {
                    setPoints(e.target.value);
                  }}
                />
              </div>
              <div className='options-container'>
                <div>
                  <Checkbox
                    checked={state.reportOptions.includeGrading}
                    color='default'
                    name='includeGrades'
                    id='includeGrades'
                    size='small'
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    onChange={(e) => {
                      handleOptionsChange(e, 'includeGrading');
                    }}
                  />
                  <label htmlFor='report-name'>Include Grades</label>
                </div>

                <div>
                  <Checkbox
                    checked={state.reportOptions.includeCourseName}
                    color='default'
                    name='includeCourseName'
                    id='includeCourseName'
                    size='small'
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    onChange={(e) => {
                      handleOptionsChange(e, 'includeCourseName');
                    }}
                  />
                  <label htmlFor='includeCourseName'>Include Course Name</label>
                </div>
                <div>
                  <Checkbox
                    checked={state.reportOptions.IncludeAttendanceRates}
                    color='default'
                    name='IncludeAttendanceRates'
                    id='IncludeAttendanceRates'
                    size='small'
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    onChange={(e) => {
                      handleOptionsChange(e, 'IncludeAttendanceRates');
                    }}
                  />
                  <label htmlFor='IncludeAttendanceRates'>
                    Include Att. Rates
                  </label>
                </div>
                <div>
                  <Checkbox
                    checked={state.reportOptions.includeStudentEmail}
                    color='default'
                    name='includeStudentEmail'
                    id='includeStudentEmail'
                    size='small'
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    onChange={(e) => {
                      handleOptionsChange(e, 'includeStudentEmail');
                    }}
                  />
                  <label htmlFor='includeStudentEmail'>
                    Include Student Email
                  </label>
                </div>
              </div>
              <CSVLink
                filename={reportName || 'Attendance Report'}
                data={formattedCSVData || []}
                headers={headers}
                type='submit'
              >
                <div className='extract-report-button'>
                  <div className='icons8-share-rounded-white'></div>
                  <span>Extract Report</span>
                </div>
              </CSVLink>
            </form>
          </div>
        </CSSTransition>
      </div>
    </DropdownMenuContext.Provider>
  );
};
export function DropdownItem({
  goToMenu,
  leftIcon,
  rightIcon,
  onSelectAction,
  children,
}) {
  const { setActiveMenu } = useContext(DropdownMenuContext);
  return (
    <a
      href='#'
      className='menu-item'
      onClick={() => {
        goToMenu && setActiveMenu(goToMenu);
        onSelectAction && onSelectAction();
      }}
    >
      {leftIcon && <span className='icon-button'>{leftIcon}</span>}
      {children}
      {rightIcon && <span className='icon-right'>{rightIcon}</span>}
    </a>
  );
}
