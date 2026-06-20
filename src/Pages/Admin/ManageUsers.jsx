import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllUsers,
  softDeleteUser,
  restoreUser,
} from "../../redux/thunks/adminUserThunk";
import { resetAdminUserError } from "../../redux/slices/adminUserSlice";

import "./ManageTours.css";
import "./ManageUsers.css";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const ManageUsers = () => {
  const dispatch = useDispatch();

  const { users, loading, actionLoading, actionTargetId, error, count } =
    useSelector((state) => state.adminUsers);

  const { user: currentUser } = useSelector((state) => state.auth);

  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  useEffect(() => {
    dispatch(getAllUsers({ includeDeleted: includeDeleted || undefined }));
  }, [dispatch, includeDeleted]);

  const handleDeactivate = () => {
    if (confirmTarget) {
      dispatch(softDeleteUser(confirmTarget));
      setConfirmTarget(null);
    }
  };

  const handleRestore = (id) => {
    dispatch(restoreUser(id));
  };

  return (
    <div className="admin-shell">
      <div className="admin-header mt-header">
        <div>
          <p className="admin-eyebrow">Admin</p>
          <h1>Users</h1>
        </div>

        <label className="mu-toggle-row">
          <input
            type="checkbox"
            checked={includeDeleted}
            onChange={(e) => setIncludeDeleted(e.target.checked)}
          />
          Show deactivated users
        </label>
      </div>

      {error && (
        <div className="admin-error-banner">
          <span>{error}</span>
          <button onClick={() => dispatch(resetAdminUserError())}>✕</button>
        </div>
      )}

      <div className="mt-table-section">
        <div className="mt-table-wrap">
          {loading && users.length === 0 ? (
            <div className="mt-table-state">Loading users…</div>
          ) : users.length === 0 ? (
            <div className="mt-table-state">No users found.</div>
          ) : (
            <table className="mt-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u._id === currentUser?._id;
                  const isBusy = actionLoading && actionTargetId === u._id;

                  return (
                    <tr key={u._id}>
                      <td>
                        <span className="mt-table-primary">{u.name}</span>
                        {isSelf && (
                          <span className="mu-you-badge">You</span>
                        )}
                      </td>
                      <td>{u.email}</td>
                      <td className="mu-role-cell">{u.role}</td>
                      <td>{formatDate(u.createdAt)}</td>
                      <td>
                        <span
                          className={`admin-status ${
                            u.isDeleted
                              ? "admin-status--cancelled"
                              : "admin-status--confirmed"
                          }`}
                        >
                          {u.isDeleted ? "Deactivated" : "Active"}
                        </span>
                      </td>
                      <td>
                        {isSelf ? (
                          <span className="mu-no-action">—</span>
                        ) : u.isDeleted ? (
                          <button
                            className="tf-btn tf-btn--ghost"
                            onClick={() => handleRestore(u._id)}
                            disabled={isBusy}
                          >
                            {isBusy ? "…" : "Restore"}
                          </button>
                        ) : (
                          <button
                            className="mt-delete-btn"
                            onClick={() => setConfirmTarget(u._id)}
                            disabled={isBusy}
                          >
                            {isBusy ? "…" : "Deactivate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {!loading && users.length > 0 && (
          <p className="mt-total-count">
            Showing {users.length} of {count} user{count !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {confirmTarget && (
        <div className="tf-overlay" role="dialog" aria-modal="true">
          <div className="mt-confirm-modal">
            <h3>Deactivate this user?</h3>
            <p>
              They'll be signed out and blocked from logging in. You can
              restore their account anytime from this page.
            </p>
            <div className="tf-modal-footer">
              <button
                className="tf-btn tf-btn--secondary"
                onClick={() => setConfirmTarget(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="mt-delete-btn mt-delete-btn--confirm"
                onClick={handleDeactivate}
                disabled={actionLoading}
              >
                {actionLoading ? "Deactivating…" : "Deactivate user"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;