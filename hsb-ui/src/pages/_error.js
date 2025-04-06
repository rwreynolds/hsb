function Error({ statusCode }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Something went wrong</h1>
      {statusCode ? (
        <p>An error {statusCode} occurred on the server.</p>
      ) : (
        <p>An error occurred on the client.</p>
      )}
      <p>Please try refreshing the page or come back later.</p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
