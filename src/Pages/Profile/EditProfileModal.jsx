import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateProfile } from "../../redux/thunks/authThunk";

import "./EditProfileModal.css";

const EditProfileModal = ({
  user,
  onClose,
}) => {
  const dispatch = useDispatch();

  const { loading } =
    useSelector(
      (state) => state.auth
    );

  const [name, setName] =
    useState(user?.name || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      updateProfile({
        name,
      })
    );

    onClose();
  };

  return (
    <div className="epm-overlay">
      <div className="epm-modal">

        <div className="epm-header">
          <h2>Edit Profile</h2>

          <button
            className="epm-close"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="epm-form"
        >

          <div className="epm-field">
            <label>
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              required
            />
          </div>

          <div className="epm-actions">

            <button
              type="button"
              className="epm-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="epm-save"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default EditProfileModal;