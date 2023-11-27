import { ROUTES } from "./utils/constants";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import OrganizationHome from "./pages/OrganizationHome";

const router = createBrowserRouter([
  {
    path: ROUTES.LANDING_PAGE,
    element: <LandingPage />,
  },
  {
    path: ROUTES.ORGANIZATION_HOME,
    element: <OrganizationHome />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
