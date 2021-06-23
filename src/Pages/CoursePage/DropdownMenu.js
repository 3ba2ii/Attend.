import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { ReactComponent as CalendarIcon } from 'assets/icons/calender.svg';
import { ReactComponent as LapIcon } from 'assets/icons/lap.svg';
import { ReactComponent as LeftArrowIcon } from 'assets/icons/left_arrow.svg';
import { ReactComponent as MultipleReports } from 'assets/icons/multiple_reports.svg';
import { ReactComponent as PeriodIcon } from 'assets/icons/period.svg';
import { ReactComponent as ReportIcon } from 'assets/icons/report.svg';
import { ReactComponent as RightArrowIcon } from 'assets/icons/right_arrow.svg';
import { ReactComponent as SumIcon } from 'assets/icons/sum.svg';
import React, { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { CSSTransition } from 'react-transition-group';
import './dropdown_menu.css';
import { extractGroupsName } from './getGroupsName';
const headers = [
  { label: 'Index', key: 'index' },
  { label: 'Name', key: 'name' },
];

export function DropdownMenu({ lectures, sections }) {
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const [state, setState] = useState({
    __typename: null,
    meetingType: null,
    selectedMeeting: null,
  });
  const [downloadedData, setDownloadedData] = useState(null);
  const [reportName, setReportName] = useState('');

  const dropdownRef = useRef(null);

  const handleChangeMeetings = (e) => {
    setState({ ...state, selectedMeeting: e?.target?.value });
  };

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  function DropdownItem(props) {
    return (
      <a
        href='#'
        className='menu-item'
        onClick={() => {
          props.goToMenu && setActiveMenu(props.goToMenu);
          props.onSelectAction && props.onSelectAction();
        }}
      >
        {props.leftIcon && (
          <span className='icon-button'>{props.leftIcon}</span>
        )}
        {props.children}
        {props.rightIcon && (
          <span className='icon-right'>{props.rightIcon}</span>
        )}
      </a>
    );
  }
  useEffect(() => {
    try {
      const { __typename, selectedMeeting } = state;
      let exportedData;
      if (__typename === 'Lecture') {
        exportedData = lectures.filter((l) => l.id === selectedMeeting);
      } else {
        exportedData = sections.filter((s) => s.id === selectedMeeting);
      }

      exportedData.map(({ attendances, ...rest }) => {
        exportedData = attendances.map(({ student }, index) => {
          if (student?.StudentNameInArabic)
            return {
              name: student?.StudentNameInArabic,
              index: index + 1,
              ...rest,
            };
        });
      });
      setDownloadedData(exportedData);
    } catch (e) {
      console.error(e.message);
    }
  }, [state]);

  return (
    <div
      className='dropdown'
      style={{ height: menuHeight + 40 }}
      ref={dropdownRef}
    >
      <CSSTransition
        in={activeMenu === 'main'}
        unmountOnExit
        timeout={500}
        classNames='menu-primary'
        onEnter={calcHeight}
      >
        <div className='menu'>
          <h6>Select Report</h6>
          <DropdownItem
            goToMenu='secondary'
            leftIcon={<ReportIcon />}
            rightIcon={<RightArrowIcon />}
            onSelectAction={() => {
              setState({ ...state, __typename: 'Lecture' });
            }}
          >
            Lecture
          </DropdownItem>
          <DropdownItem
            goToMenu='secondary'
            leftIcon={<LapIcon />}
            rightIcon={<RightArrowIcon />}
            onSelectAction={() => {
              setState({ ...state, __typename: 'Section' });
            }}
          >
            Section
          </DropdownItem>
        </div>
      </CSSTransition>
      {/* Second MENU ITEMS */}
      <CSSTransition
        in={activeMenu === 'secondary'}
        unmountOnExit
        timeout={500}
        classNames='menu-secondary'
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
              setState({ ...state, meetingType: 'single' });
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
              setState({ ...state, meetingType: 'multiple' });
            }}
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
              setState({ ...state, meetingType: 'period' });
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
            onSelectAction={() => {
              setState({ ...state, meetingType: 'period' });
            }}
          >
            <div className='select-report-type-wrapper'>
              <span>Monthly Report</span>
              <p>Report includes all the {state.__typename}s for a month</p>
            </div>
          </DropdownItem>
          <DropdownItem
            leftIcon={<SumIcon />}
            rightIcon={<RightArrowIcon />}
            onSelectAction={() => {
              setState({ ...state, meetingType: 'sum' });
            }}
          >
            <div className='select-report-type-wrapper'>
              <span>Overall Year Report</span>
              <p>Report includes attendances for all the {state.__typename}s</p>
            </div>
          </DropdownItem>
        </div>
      </CSSTransition>
      {/* Third MENU ITEMS */}
      {/* 

 */}
      <CSSTransition
        in={activeMenu === 'third-menu'}
        unmountOnExit
        timeout={500}
        classNames='menu-third'
        onEnter={calcHeight}
      >
        <div className='menu report-option-menu'>
          <DropdownItem leftIcon={<LeftArrowIcon />} goToMenu='secondary'>
            <h6>Report Options</h6>
          </DropdownItem>

          <form className={`extract-report-form`}>
            <MultipleSelect
              multiple={state.meetingType === 'multiple'}
              __typename={state.__typename}
              data={state.__typename === 'Lecture' ? lectures : sections}
              onChange={handleChangeMeetings}
            />
            <div className='report-option-space-between'>
              <label htmlFor='report-name'>Report Name</label>
              <TextField
                id='name'
                variant='outlined'
                size='small'
                name='name'
                value={reportName}
                onChange={(e) => {
                  setReportName(e.target.value);
                }}
              />
            </div>

            {/* 
            <div className='report-option-space-between'>
              <label htmlFor='report-name'>Include Grades</label>
              <Switch
                checked={true}
                color='primary'
                name='includeGrades'
                id='includeGrades'
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>
            <div className='report-option-space-between'>
              <label htmlFor='report-name'>Include Absent Students</label>
              <Switch
                checked={false}
                color='primary'
                name='absentStudents Name'
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>
            <div className='report-option-space-between'>
              <label htmlFor='report-name'>
                Include Student Attendance Rate
              </label>
              <Switch
                checked={false}
                color='primary'
                name='studentAttendanceChecked'
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div> */}

            <CSVLink
              filename={reportName || 'Attendance Report'}
              data={downloadedData || []}
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
  );
}

const useStyles = makeStyles(() => ({
  formControl: {
    minWidth: 120,
    width: '100%',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {},
  noLabel: {},
}));

export default function MultipleSelect({
  __typename,
  multiple,
  data,
  onChange,
}) {
  const classes = useStyles();
  const [selectedMeeting, setSelectedMeeting] = useState('');

  const handleChange = (e) => {
    setSelectedMeeting(e.target.value);
    onChange(e);
  };
  const [state, setState] = useState({
    age: '',
    name: 'hai',
  });

  return (
    <FormControl
      variant='outlined'
      className={classes.formControl}
      size='small'
      required
    >
      <InputLabel htmlFor='filled-age-native-simple'>{__typename}</InputLabel>
      <Select
        required
        native
        multiple={multiple}
        value={state.age}
        id='meetings'
        onChange={handleChange}
        value={selectedMeeting}
        inputProps={{
          name: 'age',
          id: 'filled-age-native-simple',
        }}
      >
        <option key='nothing' value={''}></option>
        {data.map(({ id, LectureNumber, SectionNumber, groups }) => {
          const groupsName = extractGroupsName(
            groups.map((g) => g.GroupNumber)
          );
          return (
            <option key={id} value={id}>{`${__typename} ${
              LectureNumber || SectionNumber
            } - ${groupsName}`}</option>
          );
        })}
      </Select>
    </FormControl>
  );
}
