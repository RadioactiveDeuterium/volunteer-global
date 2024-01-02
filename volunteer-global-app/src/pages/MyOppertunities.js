import IndHeader from "../components/IndHeader";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TitleBar from "../components/TitleBar";
import { ROUTES } from "../utils/constants";
import { useSelector } from "react-redux";
import MyOppertunityCard from "../components/MyOppertunityCard";

function MyOppertunities() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.indAccountReducer.isLoggedIn);
  const userPositionLinks = useSelector(
    (state) => state.indAccountReducer.userPositionLinks
  );

  useEffect(() => {
    if (!isLoggedIn) navigate(ROUTES.INDIVIDUAL_HOME);
  }, [isLoggedIn, navigate]);

  return (
    <div>
      <IndHeader active={"create"} />
      <TitleBar content={"My Oppertunities"} />
      {userPositionLinks ? (
        <div className="w-2/3 mx-auto">
          {userPositionLinks.map((link) => (
            <MyOppertunityCard
              status={link.Status}
              id={link._id}
              positionTitle={link.position.Title}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default MyOppertunities;
