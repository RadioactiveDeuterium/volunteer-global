import TitleBar from "../components/TitleBar";
import IndHeader from "../components/IndHeader";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import app from "../utils/axiosConfig";
import { ROUTES } from "../utils/constants";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import Modal from "react-modal";
import reduxActions from "../redux/actions";

const localizer = momentLocalizer(moment);

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function ManageIndividualSchedule() {
  const { positionID } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.indAccountReducer.isLoggedIn);
  const userPositionLinks = useSelector(
    (state) => state.indAccountReducer.userPositionLinks
  );
  const [position, setPosition] = useState(null);
  const [userPositionLink, setUserPositionLink] = useState(null);
  const [events, setEvents] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [requiresRefresh, setRequiresRefresh] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(false);
  const [selectedEventFlag, setSelectedEventFlag] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) navigate(ROUTES.INDIVIDUAL_HOME);
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (requiresRefresh) {
      console.log("REFRESH");
      dispatch(reduxActions.indAccountActions.updateUserPositionLinks());
    }
  }, [requiresRefresh, dispatch]);

  // get position on load
  useEffect(() => {
    const url = `/api/positions/${positionID}`;
    app.get(url).then((data) => setPosition(data.data.position));
  }, [positionID]);

  // get userPositionLink after position fetched
  useEffect(() => {
    const active = userPositionLinks.find(
      (link) => link.PositionID === position?._id
    );
    setUserPositionLink(active);
  }, [position, userPositionLinks]);

  // get all timeslots for position on load
  useEffect(() => {
    const url = `/api/timeSlots/byPosition/${positionID}`;
    app.get(url).then((data) => {
      const slots = data.data.timeSlots;
      const events = slots.map((slot) => {
        var title = "Volunteer Shift";
        var flag = false;
        if (userPositionLink?.TimeSlotIDs?.find((item) => item === slot._id)) {
          title += " YOUR TIMESLOT";
          flag = true;
        }
        return {
          start: moment(slot.DateTime).toDate(),
          end: moment(slot.DateTime).add(slot.Length, "seconds").toDate(),
          title: title,
          id: slot._id,
          isMyTimeslot: flag,
        };
      });
      setEvents(events);
      if (requiresRefresh) setRequiresRefresh(false);
    });
  }, [positionID, requiresRefresh, userPositionLink]);

  const onEventSelect = (data) => {
    setSelectedEventId(data.id);
    setSelectedEventFlag(data.isMyTimeslot);
    setModalOpen(true);
  };

  const addTimeslot = async () => {
    const url = `/api/manage/addTimeslot/${userPositionLink._id}`;
    const body = { timeslotID: selectedEventId };
    await app.post(url, body);
    setRequiresRefresh(true);
    setModalOpen(false);
  };

  const removeTimeslot = async () => {
    const url = `/api/manage/removeTimeslot/${userPositionLink._id}`;
    const body = { timeslotID: selectedEventId };
    await app.post(url, body);
    setRequiresRefresh(true);
    setModalOpen(false);
  };

  return (
    <>
      <IndHeader />
      <TitleBar
        content={`Manage Schedule: ${position ? position.Title : ""}`}
      />
      {events && (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={onEventSelect}
        />
      )}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Example Modal"
        style={modalStyles}
      >
        {selectedEventFlag ? (
          <button
            className="flex mx-auto mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={removeTimeslot}
          >
            Remove Timeslot
          </button>
        ) : (
          <button
            className="flex mx-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={addTimeslot}
          >
            Add Timeslot
          </button>
        )}
        <button
          className="flex mx-auto mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={() => setModalOpen(false)}
        >
          Close
        </button>
      </Modal>
    </>
  );
}

export default ManageIndividualSchedule;
