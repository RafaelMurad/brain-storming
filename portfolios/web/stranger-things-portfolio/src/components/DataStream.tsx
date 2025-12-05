export const DataStream = () => {
  return (
    <>
      {/* Subtle vertical data streams */}
      <div className="data-stream animate-data-flow" style={{ right: '10%' }} />
      <div className="data-stream animate-data-flow" style={{ right: '30%', animationDelay: '1s' }} />
      <div className="data-stream animate-data-flow" style={{ right: '70%', animationDelay: '2s' }} />
    </>
  );
};
