import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../../redux/thunks/notificationThunk";
import { resetNotificationState } from "../../redux/slices/notificationSlice";

import "./Notifications.css";

const PAGE_LIMIT = 20;

const timeAgo = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Notifications = () => {
  const dispatch = useDispatch();

  const { notifications, unreadCount, page, hasMore, loading, error } =
    useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(getNotifications({ page: 1, limit: PAGE_LIMIT }));

    return () => dispatch(resetNotificationState());
  }, [dispatch]);

  const handleLoadMore = () => {
    dispatch(getNotifications({ page: page + 1, limit: PAGE_LIMIT }));
  };

  const handleItemClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification._id));
    }
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <div className="notifications-page">
      <div className="notifications-shell">
        <div className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p className="notifications-subtext">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${
                    unreadCount === 1 ? "" : "s"
                  }`
                : "You're all caught up"}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              className="notifications-mark-all-btn"
              onClick={handleMarkAllAsRead}
              disabled={loading.action}
            >
              Mark all as read
            </button>
          )}
        </div>

        {error && <p className="notifications-error">{error}</p>}

        {loading.list && notifications.length === 0 ? (
          <div className="notifications-empty-state">
            <div className="notifications-spinner" />
            <p>Loading notifications…</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notifications-empty-state">
            <p>No notifications yet.</p>
            <span>We'll let you know when something needs your attention.</span>
          </div>
        ) : (
          <>
            <ul className="notifications-list">
              {notifications.map((n) => (
                <li
                  key={n._id}
                  className={`notifications-item ${
                    n.isRead ? "" : "notifications-item--unread"
                  }`}
                  onClick={() => handleItemClick(n)}
                >
                  <span className="notifications-item-dot" aria-hidden="true" />
                  <div className="notifications-item-body">
                    <span className="notifications-item-title">{n.title}</span>
                    <span className="notifications-item-message">
                      {n.message}
                    </span>
                  </div>
                  <span className="notifications-item-time">
                    {timeAgo(n.createdAt)}
                  </span>
                </li>
              ))}
            </ul>

            {hasMore && (
              <button
                className="notifications-load-more-btn"
                onClick={handleLoadMore}
                disabled={loading.list}
              >
                {loading.list ? "Loading…" : "Load more"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;