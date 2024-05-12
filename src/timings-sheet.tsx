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
            <p>{`${Number(timing).toFixed(4)}ms`}</p>
          </div>
        ))}
    </div>
  );
};

export default TimingSheet;
