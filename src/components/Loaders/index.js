import React from 'react';
import ContentLoader from 'react-content-loader';

export const UserWithAvatarLoader = (props) => (
  <ContentLoader
    speed={2}
    width={props?.width || '100%'}
    height={props?.height || '100%'}
    viewBox={`0 0 ${props?.width || '100%'} ${props?.height || '100%'} `}
    backgroundColor='#f3f3f3'
    foregroundColor='#ecebeb'
    {...props}
  >
    <rect x='48' y='8' rx='3' ry='3' width='88' height='6' />
    <rect x='48' y='26' rx='3' ry='3' width='52' height='6' />
    <circle cx='20' cy='20' r='20' />
  </ContentLoader>
);
