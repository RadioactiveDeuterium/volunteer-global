import TitleBar from "../components/TitleBar";
import OrgHeader from "../components/OrgHeader";
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
import Loader from "../components/Loader";
import DateTimePicker from "react-datetime-picker";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import Modal from "react-modal";

const DnDCalendar = withDragAndDrop(Calendar);
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

function ManagePositionSchedule() {
  const { positionID } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.orgAccountReducer.isLoggedIn);
  const [position, setPosition] = useState(null);
  const [volunteerDetails, setVolunteerDetails] = useState(null);
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newDate, setNewDate] = useState(new Date());
  const [requiresRefresh, setRequiresRefresh] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(false);
  const [selectedNames, setSelectedNames] = useState([]);

  const calcSignedUp = (slot, details) => {
    var count = 0;
    var names = [];
    if (details) {
      for (var detail of details) {
        if (detail.TimeSlotIDs.find((item) => item === slot._id)) {
          count++;
          names.push(detail.user.Name);
        }
      }
    }
    return [count, names];
  };

  useEffect(() => {
    if (!isLoggedIn) navigate(ROUTES.ORGANIZATION_HOME);
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const url = `/api/positions/${positionID}`;
    app.get(url).then((data) => {
      setPosition(data.data.position);
      setVolunteerDetails(data.data.volunteerDetails);
    });
  }, [positionID]);

  useEffect(() => {
    const url = `/api/timeSlots/byPosition/${positionID}`;
    app.get(url).then((data) => {
      const slots = data.data.timeSlots;
      const events = slots.map((slot) => {
        const [count, names] = calcSignedUp(slot, volunteerDetails);
        return {
          start: moment(slot.DateTime).toDate(),
          end: moment(slot.DateTime).add(slot.Length, "seconds").toDate(),
          title: "Volunteer Shift | Signed Up:" + count,
          id: slot._id,
          names: names,
        };
      });
      setEvents(events);
      if (requiresRefresh) setRequiresRefresh(false);
    });
  }, [positionID, requiresRefresh, volunteerDetails]);

  const createNew = () => {
    setLoading(true);
    const url = "api/timeSlots/";
    const body = {
      positionID: positionID,
      dateTime: newDate.getTime(),
      length: 3600,
    };
    app
      .post(url, body)
      .then(() => {
        //todo refresh events
        setLoading(false);
        setRequiresRefresh(true);
      })
      .catch((err) => {
        setLoading(false);
        alert(`Error saving: ${err}`);
      });
  };

  const onEventUpdate = (data) => {
    const url = `api/timeSlots/${data.event.id}`;
    const body = {
      dateTime: data.start.getTime(),
      length: moment(data.end).unix() - moment(data.start).unix(),
    };
    app.patch(url, body).then(() => {
      setRequiresRefresh(true);
    });
  };

  const onEventSelect = (data) => {
    setSelectedEventId(data.id);
    setSelectedNames(data.names);
    setModalOpen(true);
  };

  const onDeleteEvent = () => {
    const url = `/api/timeSlots/${selectedEventId}`;
    app.delete(url).then(() => {
      setModalOpen(false);
      setRequiresRefresh(true);
    });
  };

  return (
    <>
      <OrgHeader />
      <TitleBar
        content={`Manage Schedule: ${position ? position.Title : ""}`}
      />
      {events && (
        <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onEventDrop={onEventUpdate}
          onEventResize={onEventUpdate}
          onSelectEvent={onEventSelect}
          resizable
        />
      )}
      <div className="mx-auto w-fit pt-4">
        <DateTimePicker onChange={setNewDate} value={newDate} />
      </div>
      <button
        className="flex mx-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={createNew}
      >
        {loading && <Loader />}
        Create New Time Slot
      </button>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Example Modal"
        style={modalStyles}
      >
        <p className="font-bold">Volunteers signed up:</p>
        {selectedNames.map((item) => (
          <p>{item}</p>
        ))}
        <button
          className="flex mx-auto mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onDeleteEvent}
        >
          Delete Shift
        </button>
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

export default ManagePositionSchedule;
