import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDestination } from "../../redux/thunks/destinationThunk";
import { resetDestinationActionState } from "../../redux/slices/destinationSlice";
import TagListInput from "./TagListInput";
import "./TourFormModal.css";

const CONTINENTS = [
  "Africa", "Asia", "Europe", "North America",
  "South America", "Australia", "Antarctica",
];

const emptyForm = {
  name: "",
  country: "",
  continent: "",
  description: "",
  activities: [],
  latitude: "",
  longitude: "",
  isFeatured: false,
  isPopular: false,
};

const DestinationFormModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { actionLoading, actionError } = useSelector(
    (state) => state.destinations
  );

  const [form, setForm] = useState(emptyForm);
  const [bannerImage, setBannerImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [bannerPreview, setBannerPreview] = useState(null);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0] || null;
    setBannerImage(file);
    setBannerPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleGalleryChange = (e) => {
    setGalleryImages(Array.from(e.target.files || []));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      createDestination({
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        bannerImage,
        galleryImages,
      })
    ).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(resetDestinationActionState());
        onClose();
      }
    });
  };

  return (
    <div className="tf-overlay" role="dialog" aria-modal="true">
      <div className="tf-modal">
        <div className="tf-modal-header">
          <h2>Create Destination</h2>
          <button className="tf-close-btn" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="tf-form">
          {actionError && <div className="tf-error">{actionError}</div>}

          <div className="tf-grid">
            <div className="tf-field">
              <label>Name</label>
              <input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                required
              />
            </div>

            <div className="tf-field">
              <label>Country</label>
              <input
                value={form.country}
                onChange={(e) => setField("country", e.target.value)}
                required
              />
            </div>

            <div className="tf-field">
              <label>Continent</label>
              <select
                value={form.continent}
                onChange={(e) => setField("continent", e.target.value)}
                required
              >
                <option value="" disabled>
                  Select continent
                </option>
                {CONTINENTS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="tf-field">
              <label>Rating handled by reviews — n/a</label>
            </div>

            <div className="tf-field">
              <label>Latitude</label>
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => setField("latitude", e.target.value)}
                required
              />
            </div>

            <div className="tf-field">
              <label>Longitude</label>
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => setField("longitude", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="tf-field">
            <label>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              required
            />
          </div>

          <div className="tf-field">
            <label>Activities</label>
            <TagListInput
              values={form.activities}
              onChange={(activities) => setField("activities", activities)}
              placeholder="Add an activity…"
            />
          </div>

          <div className="tf-grid">
            <div className="tf-field">
              <label>Banner Image</label>
              <input type="file" accept="image/*" onChange={handleBannerChange} required />
              {bannerPreview && (
                <img src={bannerPreview} alt="Banner preview" className="tf-image-preview" />
              )}
            </div>

            <div className="tf-field">
              <label>Gallery Images</label>
              <input type="file" accept="image/*" multiple onChange={handleGalleryChange} />
              {galleryImages.length > 0 && (
                <span className="tf-file-count">{galleryImages.length} file(s) selected</span>
              )}
            </div>
          </div>

          <div className="tf-grid">
            <label className="tf-checkbox-row">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setField("isFeatured", e.target.checked)}
              />
              Featured
            </label>

            <label className="tf-checkbox-row">
              <input
                type="checkbox"
                checked={form.isPopular}
                onChange={(e) => setField("isPopular", e.target.checked)}
              />
              Popular
            </label>
          </div>

          <div className="tf-modal-footer">
            <button
              type="button"
              className="tf-btn tf-btn--secondary"
              onClick={onClose}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button type="submit" className="tf-btn tf-btn--primary" disabled={actionLoading}>
              {actionLoading ? "Saving…" : "Create Destination"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DestinationFormModal;