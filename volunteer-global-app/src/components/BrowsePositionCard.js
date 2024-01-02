import { ROUTES } from "../utils/constants";
import { useNavigate } from "react-router-dom";

function BrowsePositionCard({
  orgName,
  positionTitle,
  description,
  id,
  alreadyApplied,
}) {
  const navigate = useNavigate();
  return (
    <div className="flex bg-slate-200 p-4 rounded-lg mt-2 items-center justify-center">
      <div className="mr-4">
        <p className="text-3xl whitespace-nowrap">{orgName}</p>
        <p className="text-xl">{positionTitle}</p>
      </div>
      <div className="flex-1">
        <p className="h-full">{description}</p>
      </div>
      {alreadyApplied ? (
        <button
          disabled
          className="flex bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-max mx-4 whitespace-nowrap"
        >
          Already Applied
        </button>
      ) : (
        <button
          className="flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-max mx-4 whitespace-nowrap"
          type="button"
          onClick={() => navigate(`${ROUTES.APPLY_POSITION_STUB}${id}`)}
        >
          Apply
        </button>
      )}
    </div>
  );
}

export default BrowsePositionCard;
