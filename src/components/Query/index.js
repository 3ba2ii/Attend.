import { useQuery } from '@apollo/client';
import SpinnerElement from '../Spinner/spinner';

const Query = ({ children, query, variables }) => {
  const { data, loading, error, refetch } = useQuery(query, {
    variables: variables,
  });

  if (loading) {
    return (
      <div className='center-spinner'>
        <SpinnerElement />
      </div>
    );
  }

  if (error) return `Error! ${error.message}`;
  return children({ data, refetch });
};
export default Query;
