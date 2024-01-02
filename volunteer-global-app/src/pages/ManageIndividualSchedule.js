import TitleBar from "../components/TitleBar";
import IndHeader from "../components/IndHeader";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
  const isLoggedIn = useSelector((state) => state.indAccountReducer.isLoggedIn);
  const [position, setPosition] = useState(null);
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newDate, setNewDate] = useState(new Date());
  const [requiresRefresh, setRequiresRefresh] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) navigate(ROUTES.INDIVIDUAL_HOME);
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const url = `/api/positions/${positionID}`;
    app.get(url).then((data) => setPosition(data.data.position));
  }, [positionID]);

  useEffect(() => {
    const url = `/api/timeSlots/byPosition/${positionID}`;
    app.get(url).then((data) => {
      const slots = data.data.timeSlots;
      const events = slots.map((slot) => {
        return {
          start: moment(slot.DateTime).toDate(),
          end: moment(slot.DateTime).add(slot.Length, "seconds").toDate(),
          title: "Volunteer Shift",
          id: slot._id,
        };
      });
      setEvents(events);
      if (requiresRefresh) setRequiresRefresh(false);
    });
  }, [positionID, requiresRefresh]);

  const onEventSelect = (data) => {
    setSelectedEventId(data.id);
    setModalOpen(true);
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
