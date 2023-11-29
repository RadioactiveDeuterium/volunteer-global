import { ROUTES } from "./utils/constants";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import OrganizationHome from "./pages/OrganizationHome";
import CreatePosition from "./pages/CreatePosition";
import ManagePosition from "./pages/ManagePosition";
import ManagePositionSchedule from "./pages/ManagePositionSchedule";

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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
