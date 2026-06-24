import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllUsers,
  softDeleteUser,
  restoreUser,
} from "../../redux/thunks/adminUserThunk";

import { resetAdminUserError } from "../../redux/slices/adminUserSlice";

import "./ManageUsers.css";

const PAGE_SIZE = 8;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const ManageUsers = () => {
  const dispatch = useDispatch();

  const {
    users = [],
    loading,
    actionLoading,
    actionTargetId,
    error,
    count,
  } = useSelector((state) => state.adminUsers);

  const { user: currentUser } = useSelector((state) => state.auth);

  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      getAllUsers({
        includeDeleted: includeDeleted || undefined,
      })
    );
  }, [dispatch, includeDeleted]);

  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => u.role !== "admin")
      .filter((u) =>
        `${u.name} ${u.email}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [users, search]);

  // Reset to page 1 whenever the filtered set changes (new search, toggle, etc.)
  useEffect(() => {
    setCurrentPage(1);
  }, [search, includeDeleted]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / PAGE_SIZE)
  );

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const goPrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const activeUsers = users.filter((u) => !u.isDeleted).length;
  const inactiveUsers = users.filter((u) => u.isDeleted).length;
  const admins = users.filter((u) => u.role === "admin").length;

  const deactivate = () => {
    dispatch(softDeleteUser(confirmTarget));
    setConfirmTarget(null);
  };

  return (
    <div className="admin-shell">

      <div className="mu-header">

        <div>
          <p className="admin-eyebrow">Meridian Admin</p>
          <h1>User Management</h1>
          <span>Manage platform members & administrators.</span>
        </div>

        <label className="mu-switch">

          <input
            type="checkbox"
            checked={includeDeleted}
            onChange={(e) =>
              setIncludeDeleted(e.target.checked)
            }
          />

          <span>Show Deactivated</span>

        </label>

      </div>

      {error && (
        <div className="admin-error-banner">
          <span>{error}</span>

          <button
            onClick={() => dispatch(resetAdminUserError())}
          >
            ✕
          </button>
        </div>
      )}

      <div className="mu-stats">

        <div className="mu-stat">
          <h2>{count}</h2>
          <p>Total Users</p>
        </div>

        <div className="mu-stat">
          <h2>{activeUsers}</h2>
          <p>Active</p>
        </div>

        <div className="mu-stat">
          <h2>{inactiveUsers}</h2>
          <p>Deactivated</p>
        </div>

        <div className="mu-stat">
          <h2>{admins}</h2>
          <p>Admins</p>
        </div>

      </div>

      <div className="mu-toolbar">

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="mu-table-card">

        {loading ? (
          <div className="mu-empty">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="mu-empty">
            No users found.
          </div>
        ) : (

          <table className="mu-table">

            <thead>

              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
                <th></th>
              </tr>

            </thead>

            <tbody>

              {paginatedUsers.map((u) => {

                const busy =
                  actionLoading &&
                  actionTargetId === u._id;

                return (

                  <tr key={u._id}>

                    <td>

                      <div className="mu-user">

                        <div className="mu-avatar">
                          {u.name.charAt(0).toUpperCase()}
                        </div>

                        <div>

                          <strong>
                            {u.name}

                            {u._id === currentUser?._id &&
                              " (You)"}

                          </strong>

                          <span>{u.email}</span>

                        </div>

                      </div>

                    </td>

                    <td>

                      <span
                        className={`mu-role ${u.role}`}
                      >
                        {u.role}
                      </span>

                    </td>

                    <td>
                      {formatDate(u.createdAt)}
                    </td>

                    <td>

                      <span
                        className={
                          u.isDeleted
                            ? "admin-status admin-status--cancelled"
                            : "admin-status admin-status--confirmed"
                        }
                      >
                        {u.isDeleted
                          ? "Deactivated"
                          : "Active"}
                      </span>

                    </td>

                    <td>

                      {u._id !== currentUser?._id && (

                        u.isDeleted ? (

                          <button
                            className="mu-restore"
                            disabled={busy}
                            onClick={() =>
                              dispatch(restoreUser(u._id))
                            }
                          >
                            Restore
                          </button>

                        ) : (

                          <button
                            className="mu-delete"
                            disabled={busy}
                            onClick={() =>
                              setConfirmTarget(u._id)
                            }
                          >
                            Deactivate
                          </button>

                        )

                      )}

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        )}

        {!loading && filteredUsers.length > 0 && totalPages > 1 && (
          <div className="admin-pagination">
            <button
              className="admin-page-btn"
              onClick={goPrev}
              disabled={currentPage === 1}
            >
              ← Prev
            </button>
            <span className="admin-page-info">
              Page {currentPage} of {totalPages}{" "}
              <span className="admin-page-total">
                ({filteredUsers.length} total)
              </span>
            </span>
            <button
              className="admin-page-btn"
              onClick={goNext}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}

      </div>

      {confirmTarget && (

        <div className="mu-overlay">

          <div className="mu-modal">

            <h2>Deactivate User?</h2>

            <p>
              This user won't be able to log in until restored.
            </p>

            <div className="mu-modal-buttons">

              <button
                onClick={() =>
                  setConfirmTarget(null)
                }
              >
                Cancel
              </button>

              <button
                className="danger"
                onClick={deactivate}
              >
                Confirm
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default ManageUsers;