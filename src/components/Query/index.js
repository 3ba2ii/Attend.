import { useQuery } from '@apollo/client';
import BadGatewayPage from 'pages/ErrorPages/502';
import SpinnerElement from '../Spinner/spinner';

const Query = ({
  children,
  query,
  variables,
  onCompletedFunction,
  onErrorFunction,
  errorComponent,
}) => {
  const { data, loading, error, refetch, fetchMore } = useQuery(
    query,
    {
      variables: variables,
      onCompleted(data) {
        if (onCompletedFunction) onCompletedFunction(data, fetchMore);
      },
      onError(e) {
        console.error(e.message);
        if (onErrorFunction) {
          onErrorFunction(e);
        }
      },
    },
    {}
  );

  if (loading) {
    return (
      <div className='center-spinner'>
        <SpinnerElement />
      </div>
    );
  }
  if (error && errorComponent) return errorComponent;

  if (error) return <BadGatewayPage />;
  return children({ data, refetch, loading, error, fetchMore });
};
export default Query;
