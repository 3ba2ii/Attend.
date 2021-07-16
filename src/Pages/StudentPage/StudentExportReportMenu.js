import { ReactComponent as ReportIcon } from 'assets/icons/report.svg';
import { ReactComponent as RightArrowIcon } from 'assets/icons/right_arrow.svg';
import { ReactComponent as LeftArrowIcon } from 'assets/icons/left_arrow.svg';
import { ReactComponent as LapIcon } from 'assets/icons/lap.svg';
import { useEffect, useState } from 'react';
import { ReactComponent as SumIcon } from 'assets/icons/sum.svg';
import { DropdownItem } from 'pages/CoursePage/DropdownItem';
import { CSSTransition } from 'react-transition-group';
import { ReactComponent as CalendarIcon } from 'assets/icons/calender.svg';
import { SelectComponent } from 'pages/CoursePage/SelectComponent';
import { CSVLink } from 'react-csv';

export const StudentExportMenu = ({
  studentCourseInfo,
  studentPersonalInfo,
}) => {
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const [formattedCSVData, setFormattedCSVData] = useState([]);

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

  function calcHeight(el) {
    const height = el.offsetHeight + 40;
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

    setState({ ...state, meetings: data });
  };

  useEffect(() => {
    // {name : Ahmed, Course Name : Pattern Recognition, Email: aghonem2011@gmail.com,
    // Lecture 1 : 1, Lecture 2 : 0, Total Attended Lectures: 1, Attendance Rate : 1/3 , Grade: 1 * PPL }

    //{Course Name : Pattern Recognition, Email: aghonem2011@gmail.com, Lecture 1 : 1, Lecture 2 : 0,attendanceRate : 80%}
    const { StudentNameInArabic } = studentPersonalInfo;

    const { meetings, __typename } = state;

    let collectedCSVData = [];
    meetings.forEach(
      ({
        CourseNameInEnglish,
        courseLectures,
        courseSections,
        attendedLectures,
        attendedSections,
      }) => {
        let formattedReport = {
          'Student Name': StudentNameInArabic,
          'Course Name': '',
          Attended: '',
          ['Course ' + __typename + 's']: '',
          'Attendance Rate': '0%',
        };
        formattedReport['Course Name'] = CourseNameInEnglish;

        if (__typename === 'Lecture') {
          [...courseLectures].forEach((LectureNumber) => {
            const hasAttended = attendedLectures.has(LectureNumber) ? '1' : '0';
            formattedReport['Lecture ' + LectureNumber] = hasAttended;
          });

          const attendanceRate = courseLectures?.size
            ? ((attendedLectures.size / courseLectures.size) * 100).toFixed(1)
            : '0';
          formattedReport['Attended'] = attendedLectures.size;
          formattedReport['Attendance Rate'] = attendanceRate + '%';
          formattedReport['Course Lectures'] = courseLectures.size;
        } else if (__typename === 'Section') {
          [...courseSections].forEach((SectionNumber) => {
            const hasAttended = attendedSections.has(SectionNumber) ? '1' : '0';
            formattedReport['Section ' + SectionNumber] = hasAttended;
          });

          const attendanceRate = courseSections?.size
            ? ((attendedSections.size / courseSections.size) * 100).toFixed(1)
            : '0';
          formattedReport['Attended'] = attendedSections.size;
          formattedReport['Attendance Rate'] = attendanceRate + '%';
          formattedReport['Course Sections'] = courseSections.size;
        }

        collectedCSVData.push(formattedReport);
      }
    );
    setFormattedCSVData(collectedCSVData);
  }, [state]);
  return (
    <div
      className='dropdown'
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
            <h6>Report Type</h6>
          </DropdownItem>
          <DropdownItem
            setActiveMenu={setActiveMenu}
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
            setActiveMenu={setActiveMenu}
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
          <DropdownItem
            setActiveMenu={setActiveMenu}
            leftIcon={<LeftArrowIcon />}
            goToMenu='main'
          >
            <h6>Select Courses</h6>
          </DropdownItem>
          <form className={`extract-report-form`}>
            <SelectComponent
              {...{
                options: Object.entries(studentCourseInfo).map(
                  ([key, value]) => {
                    return {
                      info: { key, ...value },
                      value: key,
                      label: key,
                    };
                  }
                ),
                isMulti: true,
                __typename: state.__typename,
                handleChange: handleMeetingSelection,
              }}
            />

            <CSVLink
              filename={'reportName' + '.csv' || 'Attendance Report.csv'}
              data={formattedCSVData || []}
              type='submit'
            >
              <div className='extract-report-button'>
                <div className='icons8-share-rounded-white'></div>
                <span>Export Report</span>
              </div>
            </CSVLink>
          </form>
        </div>
      </CSSTransition>
    </div>
  );
};
