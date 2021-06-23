import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function AccordionComponent({ title, children }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <g clip-path='url(#clip0)'>
                <path
                  d='M7.40902 8.59082L11.999 13.1708L16.589 8.59082L17.999 10.0008L11.999 16.0008L5.99902 10.0008L7.40902 8.59082Z'
                  fill='#334D6E'
                />
              </g>
              <defs>
                <clipPath id='clip0'>
                  <rect
                    width='24'
                    height='24'
                    fill='white'
                    transform='translate(23.999 0.000732422) rotate(90)'
                  />
                </clipPath>
              </defs>
            </svg>
          }
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography className={classes.heading}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
}
