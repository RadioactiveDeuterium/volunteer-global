import { ROUTES } from "./utils/constants";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import OrganizationHome from "./pages/OrganizationHome";
import CreatePosition from "./pages/CreatePosition";
import ManagePosition from "./pages/ManagePosition";
import ManagePositionSchedule from "./pages/ManagePositionSchedule";
import IndividualHome from "./pages/IndividualHome";
import ApplyPosition from "./pages/ApplyPosition";
import MyOppertunities from "./pages/MyOppertunities";
import ManageIndividualSchedule from "./pages/ManageIndividualSchedule";

const router = createBrowserRouter([
  {
    path: ROUTES.LANDING_PAGE,
    element: <LandingPage />,
  },
  {
    path: ROUTES.ORGANIZATION_HOME,
    element: <OrganizationHome />,
  },
  {
    path: ROUTES.CREATE_POSTION,
    element: <CreatePosition />,
  },
  {
    path: ROUTES.MANAGE_POSITION,
    element: <ManagePosition />,
  },
  {
    path: ROUTES.MANAGE_POSITION_SCHEDULE,
    element: <ManagePositionSchedule />,
  },
  {
    path: ROUTES.INDIVIDUAL_HOME,
    element: <IndividualHome />,
  },
  {
    path: ROUTES.APPLY_POSITION,
    element: <ApplyPosition />,
  },
  {
    path: ROUTES.INDIVIDUAL_OPPERTUNITIES,
    element: <MyOppertunities />,
  },
  {
    path: ROUTES.INDIVIDUAL_POSITION_SCHEDULE,
    element: <ManageIndividualSchedule />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
