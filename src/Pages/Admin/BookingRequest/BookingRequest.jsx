import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";

import {
  FaCalendarAlt,
  FaUsers,
  FaCreditCard,
  FaShieldAlt,
  FaBolt,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { toast } from "react-toastify";

import {
  createBooking,
  checkAvailability,
} from "../../../redux/thunks/bookingThunk";

import { getTourById } from "../../../redux/thunks/tourThunk";
import { resetBookingState } from "../../../redux/slices/bookingSlice";

import "./BookingRequest.css";

// ---------- Date helpers (module-level, no component re-creation) ----------

// Normalize any date-ish value to a "YYYY-MM-DD" string using LOCAL date
// parts (not toISOString, which can shift the day across timezones).
const toDateKey = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const BookingRequest = () => {
  const { tourId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    error,
    success,
    selectedBooking,
    availability,
  } = useSelector((state) => state.booking);

  const { selectedTour: tour } = useSelector(
    (state) => state.tours
  );

  const [formData, setFormData] = useState({
    bookingDate: "",
    participants: 1,
    specialRequirements: "",
    paymentMethod: "stripe",
  });

  const [formError, setFormError] = useState("");

  // NEW: shown when the user clicks a date that admin has NOT registered
  // as a valid start date for this tour.
  const [dateNotAvailable, setDateNotAvailable] = useState(false);

  // NEW: which month/year the calendar is currently displaying.
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed

  useEffect(() => {
    if (tourId) {
      dispatch(getTourById(tourId));
    }
  }, [dispatch, tourId]);

  // LIVE AVAILABILITY CHECK — fires once a departure date is selected
  useEffect(() => {
    if (
      !tourId ||
      !formData.bookingDate ||
      !formData.participants
    )
      return;

    dispatch(
      checkAvailability({
        tourId,
        date: formData.bookingDate,
        participants: formData.participants,
      })
    );
  }, [
    dispatch,
    tourId,
    formData.bookingDate,
    formData.participants,
  ]);

  // SUCCESS
  useEffect(() => {
    if (success && selectedBooking?._id) {
      toast.success(
        "Booking reserved! Redirecting..."
      );

      const id = selectedBooking._id;

      const timer = setTimeout(() => {
        dispatch(resetBookingState());
        navigate(`/bookings/${id}`);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [
    success,
    selectedBooking,
    navigate,
    dispatch,
  ]);

  // ERROR
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "participants"
          ? Number(value)
          : value,
    }));

    if (formError) setFormError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.bookingDate) {
      return setFormError(
        "Please select a departure date."
      );
    }

    if (dateNotAvailable) {
      return setFormError(
        "Please choose a valid departure date."
      );
    }

    if (
      availability &&
      !availability.isAvailable
    ) {
      return toast.error(
        "Selected tour is not available for the requested travelers."
      );
    }

    dispatch(
      createBooking({
        tourId,
        ...formData,
      })
    );
  };

  // Compute end date from a given start date + tour duration
  // (duration counts the start day itself, e.g. a 5-day trip starting
  // Jun 27 ends Jul 1, not Jul 2)
  const getEndDate = (startDateStr, durationDays) => {
    if (!startDateStr || !durationDays) return null;

    const start = new Date(startDateStr);
    const end = new Date(start);
    end.setDate(start.getDate() + (durationDays - 1));

    return end;
  };

  const formatDisplayDate = (date) =>
    date
      ? date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;

  const selectedEndDate = getEndDate(
    formData.bookingDate,
    tour?.duration
  );

  // Memoized so this only produces a new array reference when
  // tour?.startDates itself changes (the `|| []` fallback would
  // otherwise create a brand-new array on every render).
  const availableStartDates = useMemo(
    () => tour?.startDates || [],
    [tour?.startDates]
  );

  // NEW: Set of valid admin-registered start dates, keyed as "YYYY-MM-DD"
  // for fast lookup when rendering dots and validating clicks.
  const validStartDateKeys = useMemo(() => {
    const set = new Set();
    availableStartDates.forEach((d) => set.add(toDateKey(d)));
    return set;
  }, [availableStartDates]);

  const totalAmount =
    (tour?.price || 0) *
    formData.participants;

  // ---------- Calendar grid construction ----------

  // Builds a flat array of cells for the visible month, padded with nulls
  // for leading/trailing blanks so the grid aligns to weekday columns.
  const calendarCells = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstOfMonth.getDay(); // 0 = Sunday
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells = [];

    for (let i = 0; i < startWeekday; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(new Date(viewYear, viewMonth, day));
    }

    return cells;
  }, [viewYear, viewMonth]);

  const goToPrevMonth = () => {
    setViewMonth((prev) => {
      if (prev === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const goToNextMonth = () => {
    setViewMonth((prev) => {
      if (prev === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  // A date counts as "in range" if it falls between the selected start
  // date and the computed end date (inclusive), so the full package
  // duration lights up automatically the moment a valid date is clicked.
  const isInSelectedRange = (date) => {
    if (!formData.bookingDate || !selectedEndDate || dateNotAvailable) {
      return false;
    }

    const dayKey = toDateKey(date);
    const startKey = toDateKey(formData.bookingDate);
    const endKey = toDateKey(selectedEndDate);

    return dayKey >= startKey && dayKey <= endKey;
  };

  const isPastDate = (date) => {
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    return date < startOfToday;
  };

  const handleDayClick = (date) => {
    if (isPastDate(date)) return; // ignore clicks on past days

    const dayKey = toDateKey(date);

    if (formError) setFormError("");

    if (!validStartDateKeys.has(dayKey)) {
      // Admin has not registered this date as a valid departure.
      setDateNotAvailable(true);
      setFormData((prev) => ({ ...prev, bookingDate: "" }));
      return;
    }

    // Valid admin-registered start date — select it. The existing
    // availability-check useEffect picks this up automatically, and
    // selectedEndDate recalculates from tour.duration on the next render,
    // which is what drives the automatic range highlight below.
    setDateNotAvailable(false);
    setFormData((prev) => ({ ...prev, bookingDate: dayKey }));
  };

  const isViewingCurrentMonth =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();

  return (
    <div className="booking-request-page">
      <div className="booking-request-container">
        <div className="booking-request-header">
          <Link to={`/tour/${tourId}`}>
            ← Back to experience
          </Link>

          <h1>Complete your booking</h1>
        </div>

        <div className="booking-request-layout">
          {/* LEFT */}

          <div className="booking-form-card">
            <h2>Traveler details</h2>

            {formError && (
              <div className="form-alert error">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  <FaCalendarAlt />
                  Departure date
                </label>

                {/* NEW: custom calendar replacing the dropdown */}
                <div className="booking-calendar">
                  <div className="booking-calendar-header">
                    <button
                      type="button"
                      className="cal-nav-btn"
                      onClick={goToPrevMonth}
                      disabled={isViewingCurrentMonth}
                      aria-label="Previous month"
                    >
                      <FaChevronLeft />
                    </button>

                    <span className="cal-month-label">
                      {MONTH_NAMES[viewMonth]} {viewYear}
                    </span>

                    <button
                      type="button"
                      className="cal-nav-btn"
                      onClick={goToNextMonth}
                      aria-label="Next month"
                    >
                      <FaChevronRight />
                    </button>
                  </div>

                  <div className="booking-calendar-weekdays">
                    {WEEKDAY_LABELS.map((label, idx) => (
                      <span key={`${label}-${idx}`}>{label}</span>
                    ))}
                  </div>

                  <div className="booking-calendar-grid">
                    {calendarCells.map((date, idx) => {
                      if (!date) {
                        return (
                          <div
                            key={`blank-${idx}`}
                            className="cal-cell cal-cell-blank"
                          />
                        );
                      }

                      const dayKey = toDateKey(date);
                      const isValidStart = validStartDateKeys.has(dayKey);
                      const isSelectedStart =
                        formData.bookingDate &&
                        dayKey === toDateKey(formData.bookingDate);
                      const inRange = isInSelectedRange(date);
                      const past = isPastDate(date);

                      const classNames = ["cal-cell"];
                      if (past) classNames.push("cal-cell-past");
                      if (inRange) classNames.push("cal-cell-in-range");
                      if (isSelectedStart) classNames.push("cal-cell-selected-start");

                      return (
                        <button
                          type="button"
                          key={dayKey}
                          className={classNames.join(" ")}
                          disabled={past}
                          onClick={() => handleDayClick(date)}
                        >
                          <span className="cal-cell-daynum">
                            {date.getDate()}
                          </span>

                          {isValidStart && (
                            <span className="cal-cell-dot" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="booking-calendar-legend">
                    <span>
                      <i className="legend-dot" /> Departure available
                    </span>
                    <span>
                      <i className="legend-range" /> Package days
                    </span>
                  </div>
                </div>

                {dateNotAvailable && (
                  <p className="no-dates-msg">
                    No booking available for this date. Please pick a date
                    marked with a dot above.
                  </p>
                )}

                {availableStartDates.length === 0 && (
                  <p className="no-dates-msg">
                    No upcoming departure dates available for this tour.
                  </p>
                )}

                {formData.bookingDate && tour?.duration && !dateNotAvailable && (
                  <p className="date-range-hint">
                    {tour.duration}-day trip:{" "}
                    {formatDisplayDate(
                      new Date(formData.bookingDate)
                    )}{" "}
                    → {formatDisplayDate(selectedEndDate)}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>
                  <FaUsers />
                  Number of travelers
                </label>

                <input
                  type="number"
                  name="participants"
                  min="1"
                  max={tour?.availableSlots || 20}
                  value={formData.participants}
                  onChange={handleChange}
                />
              </div>

              {/* AVAILABILITY CARD */}

              {availability && !dateNotAvailable && (
                <div
                  style={{
                    marginBottom: "20px",
                    padding: "15px",
                    borderRadius: "10px",
                    background:
                      availability.isAvailable
                        ? "#eafaf1"
                        : "#fff1f0",
                    border:
                      availability.isAvailable
                        ? "1px solid #52c41a"
                        : "1px solid #ff4d4f",
                  }}
                >
                  <strong>
                    {availability.isAvailable
                      ? "✅ Tour Available"
                      : "❌ Not Available"}
                  </strong>

                  <p
                    style={{
                      marginTop: "8px",
                    }}
                  >
                    Remaining Slots:{" "}
                    {
                      availability.remainingSlots
                    }
                  </p>

                  {!availability.isAvailable && (
                    <p>
                      Requested:{" "}
                      {
                        availability.requested
                      }
                    </p>
                  )}
                </div>
              )}

              <div className="form-group">
                <label>
                  <FaCreditCard />
                  Payment method
                </label>

                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="stripe">
                    Pay online (Stripe)
                  </option>

                  <option value="cod">
                    Pay later
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Special requirements
                </label>

                <textarea
                  name="specialRequirements"
                  rows="5"
                  value={
                    formData.specialRequirements
                  }
                  onChange={handleChange}
                  placeholder="Dietary needs, accessibility requests, pickup details..."
                />
              </div>

              <button
                type="submit"
                className="reserve-btn"
                disabled={
                  loading?.action ||
                  success ||
                  !formData.bookingDate ||
                  dateNotAvailable ||
                  (availability &&
                    !availability.isAvailable)
                }
              >
                {success
                  ? "Reserved ✓"
                  : loading?.action
                  ? "Reserving..."
                  : availability &&
                    !availability.isAvailable
                  ? "Unavailable"
                  : "Reserve now"}
              </button>
            </form>
          </div>

          {/* RIGHT */}

          <aside className="booking-summary-card">
            {tour && (
              <>
                <img
                  src={
                    tour.destination
                      ?.bannerImage ||
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={tour.title}
                />

                <div className="summary-content">
                  <h3>{tour.title}</h3>

                  <p>
                    ₹
                    {Number(
                      tour.price
                    ).toLocaleString(
                      "en-IN"
                    )}
                    <span>
                      {" "}
                      / traveler
                    </span>
                  </p>

                  <div className="summary-row">
                    <span>Travelers</span>

                    <strong>
                      {formData.participants}
                    </strong>
                  </div>

                  <div className="summary-row">
                    <span>Duration</span>

                    <strong>
                      {tour.duration} days
                    </strong>
                  </div>

                  {formData.bookingDate && selectedEndDate && !dateNotAvailable && (
                    <div className="summary-row">
                      <span>Dates</span>

                      <strong>
                        {formatDisplayDate(
                          new Date(formData.bookingDate)
                        )}{" "}
                        – {formatDisplayDate(selectedEndDate)}
                      </strong>
                    </div>
                  )}

                  <div className="summary-row total">
                    <span>Total</span>

                    <strong>
                      ₹
                      {Number(
                        totalAmount
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div className="trust-list">
                    <div>
                      <FaShieldAlt />
                      Secure booking
                    </div>

                    <div>
                      <FaBolt />
                      Instant confirmation
                    </div>

                    <div>
                      <FaCheckCircle />
                      Free cancellation*
                    </div>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookingRequest;