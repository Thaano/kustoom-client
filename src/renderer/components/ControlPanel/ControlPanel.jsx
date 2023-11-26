import RefreshSummoners from './RefreshSummoners';
import CalculateRating from './CalculateRating';
import ShowHideRank from './ShowHideRank';
import Screenshot from './Screenshot';
import GenerateTeams from './GenerateTeams';

const ControlPanel = ({ teamDivRef }) => {
  return (
    <div className="flex flex-row gap-4 pb-2 px-2">
      <RefreshSummoners />

      <CalculateRating />

      <ShowHideRank />

      <GenerateTeams />

      <Screenshot teamDivRef={teamDivRef} />

      {/* <Button
          onClick={(e) => {
            setLoading(!loading);
          }}
        >
          Loading
        </Button> */}
    </div>
  );
};

export default ControlPanel;
