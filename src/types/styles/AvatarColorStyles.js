import { makeStyles } from '@material-ui/core/styles';
import { deepOrange, deepPurple } from '@material-ui/core/colors';

export const useStyles = makeStyles((theme) => ({
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

  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));
