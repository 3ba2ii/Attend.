import notFound from '../../assets/404.png';
const PageNotFound = () => {
  return (
    <main>
      <div>
        <img src={notFound} alt={'404'} />
      </div>
      <header>Page Not Found</header>
    </main>
  );
};

export default PageNotFound;
