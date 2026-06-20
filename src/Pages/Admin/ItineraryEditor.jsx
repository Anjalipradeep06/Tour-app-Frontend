// Repeatable list editor for the Tour model's itinerary array:
// [{ day, title, description }]
const ItineraryEditor = ({ days, onChange }) => {
  const addDay = () => {
    const nextDayNumber = days.length + 1;
    onChange([
      ...days,
      { day: nextDayNumber, title: "", description: "" },
    ]);
  };

  const updateDay = (index, field, value) => {
    const updated = days.map((d, i) =>
      i === index ? { ...d, [field]: value } : d
    );
    onChange(updated);
  };

  const removeDay = (index) => {
    onChange(days.filter((_, i) => i !== index));
  };

  return (
    <div className="tf-field">
      <div className="tf-itinerary-header">
        <label className="tf-label">Itinerary</label>
        <button type="button" className="tf-btn tf-btn--ghost" onClick={addDay}>
          + Add day
        </button>
      </div>

      {days.length === 0 && (
        <p className="tf-empty-hint">No itinerary days added yet.</p>
      )}

      <div className="tf-itinerary-list">
        {days.map((d, index) => (
          <div key={index} className="tf-itinerary-row">
            <div className="tf-itinerary-day-badge">Day {d.day}</div>

            <div className="tf-itinerary-fields">
              <input
                type="text"
                className="tf-input"
                placeholder="Day title (e.g. Arrival in Tokyo)"
                value={d.title}
                onChange={(e) => updateDay(index, "title", e.target.value)}
              />
              <textarea
                className="tf-textarea"
                placeholder="What happens this day?"
                value={d.description}
                onChange={(e) =>
                  updateDay(index, "description", e.target.value)
                }
                rows={2}
              />
            </div>

            <button
              type="button"
              className="tf-icon-btn tf-icon-btn--danger"
              onClick={() => removeDay(index)}
              aria-label={`Remove day ${d.day}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryEditor;