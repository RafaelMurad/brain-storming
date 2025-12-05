export const LightBeam = () => {
  return (
    <>
      {/* Subtle light beam sweeps across the screen */}
      <div className="light-beam animate-beam-sweep" style={{ left: '20%' }} />
      <div className="light-beam animate-beam-sweep" style={{ left: '60%', animationDelay: '5s' }} />
      <div className="light-beam animate-beam-sweep" style={{ left: '80%', animationDelay: '10s' }} />
    </>
  );
};
