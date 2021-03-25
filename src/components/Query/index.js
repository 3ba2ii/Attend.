import { useQuery } from '@apollo/client';
import SpinnerElement from '../Spinner/spinner';

const Query = ({ children, query, variables, onCompletedFunction }) => {
  const { data, loading, error, refetch } = useQuery(
    query,
    {
      variables: variables,
      onCompleted(data) {
        if (onCompletedFunction) onCompletedFunction(data);
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

  if (error) return `Error! ${error.message}`;
  return children({ data, refetch, loading, error });
};
export default Query;
