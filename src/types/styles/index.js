import { makeStyles } from '@material-ui/core/styles';
import { deepOrange, deepPurple } from '@material-ui/core/colors';

const drawerWidth = 240;
const appBarHeight = 64;

export const addLecturerPageStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(12),

    '& .MuiTextField-root': {
      width: '100%',
      margin: theme.spacing(2, 2, 2, 0),

      [theme.breakpoints.up('md')]: {
        margin: theme.spacing(1.5, 5, 2, 0),
        width: '35ch',
      },
      [theme.breakpoints.up('lg')]: {
        width: '50ch',
      },
      [theme.breakpoints.up('xl')]: {
        width: '70ch',
      },
    },
  },
  textField: {
    width: '100%',
    margin: theme.spacing(2, 2, 2, 0),

    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(1.5, 5, 2, 0),
      width: '35ch',
    },
    [theme.breakpoints.up('lg')]: {
      width: '50ch',
    },
    [theme.breakpoints.up('xl')]: {
      width: '70ch',
    },
  },
}));

export const importFormsStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(15),

    '& .MuiTextField-root': {
      width: '100%',
      margin: theme.spacing(2, 2, 2, 0),

      [theme.breakpoints.up('md')]: {
        margin: theme.spacing(1.5, 5, 2, 0),
        width: '50ch',
      },
      [theme.breakpoints.up('lg')]: {
        width: '60ch',
      },
      [theme.breakpoints.up('xl')]: {
        width: '80ch',
      },
    },
  },
}));

export const drawerStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    display: 'flex',
    backgroundColor: '#fff',

    borderBottom: '1px solid #EBEFF2',
    justifyContent: 'center',

    height: appBarHeight,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      backgroundColor: 'white',
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    color: '#334d6e',
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },

  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    maxWidth: `30ch`,

    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: '100%',
      maxWidth: `60ch`,
    },
    color: '#90A0B7',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  content: {
    width: '100%',

    [theme.breakpoints.up('sm')]: {
      width: `calc(100vw - ${drawerWidth}px)`,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

export const avatarStyles = makeStyles((theme) => ({
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },

  lightBlue: {
    color: theme.palette.getContrastText('#DBEAF7'),
    backgroundColor: '#DBEAF7',
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontSize: '.9rem',
  },
}));

export const uploadedGroupsModalStyles = makeStyles((theme) => ({
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
export const AssignLecturersPageStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(8),

    '& .MuiTextField-root': {
      width: '100%',
      margin: theme.spacing(2, 2, 2, 0),

      [theme.breakpoints.up('md')]: {
        margin: theme.spacing(1.5, 5, 2, 0),
        width: '50ch',
      },
      [theme.breakpoints.up('lg')]: {
        width: '60ch',
      },
      [theme.breakpoints.up('xl')]: {
        width: '80ch',
      },
    },
  },
}));

export const snackbarStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export const limitTagsStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
  center: {
    width: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}));

export const areYouSureModalStyles = makeStyles((theme) => ({
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
    width: '80%',
    [theme.breakpoints.up('md')]: {
      width: '50%',
    },
    [theme.breakpoints.up('lg')]: {
      width: '35%',
    },
    [theme.breakpoints.up('xl')]: {
      width: '25%',
    },
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
      outline: 'none',
    },
  },
}));

export const transitionFormatModalStyle = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    outline: 'none',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(8),
    borderRadius: 20,
  },
}));

export const multiTextFieldStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '40ch',
    },
  },
}));
