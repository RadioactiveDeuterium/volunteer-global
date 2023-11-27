import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div class="h-screen flex flex-col items-center justify-center bg-purple-200">
      <h1 class="text-7xl text-center">Volunteer Global</h1>
      <div className="flex flex-col sm:flex-row">
        <button
          type="button"
          onClick={() => navigate(ROUTES.VOLUNTEER_HOME)}
          class="px-4 py-2 m-4 border border-transparent text-lg leading-6 font-medium rounded-md text-white bg-rose-600 hover:bg-rose-500 focus:border-rose-700 active:bg-rose-700 center"
        >
          I'm a Volunteer
        </button>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ORGANIZATION_HOME)}
          class="px-4 py-2 m-4 border border-transparent text-lg leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:border-blue-700 active:bg-blue-700 center"
        >
          I'm an Organization
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
