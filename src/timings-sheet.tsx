import "./timings-sheet.css";

const TimingSheet = (props) => {
  const { timings } = props;
  return (
    <div className="timings-sheet">
      {timings.length ? <h4>Timings</h4> : null}
      {timings
        .sort((a, b) => a - b)
        .map((timing) => (
          <div className="timing">
            <p>{`${timing}ms`}</p>
          </div>
        ))}
    </div>
  );
};

export default TimingSheet;
