import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../../redux/thunks/notificationThunk";

import "./NotificationBell.css";

const POLL_INTERVAL_MS = 30000;
const DROPDOWN_PREVIEW_LIMIT = 5;

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
  });
};

const NotificationBell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const [open, setOpen] = useState(false);

  const { notifications, unreadCount, loading } = useSelector(
    (state) => state.notification
  );

  // Poll unread count regardless of dropdown state
  useEffect(() => {
    dispatch(getUnreadCount());

    const interval = setInterval(() => {
      dispatch(getUnreadCount());
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [dispatch]);

  // Fetch preview list only when opened
  useEffect(() => {
    if (open) {
      dispatch(getNotifications({ page: 1, limit: DROPDOWN_PREVIEW_LIMIT }));
    }
  }, [open, dispatch]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleBellClick = () => {
    setOpen((prev) => !prev);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification._id));
    }
    setOpen(false);
  };

  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    dispatch(markAllAsRead());
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate("/notifications");
  };

  const previewList = notifications.slice(0, DROPDOWN_PREVIEW_LIMIT);

  return (
    <div className="notif-bell-wrapper" ref={wrapperRef}>
      <button
        className="notif-bell-trigger"
        onClick={handleBellClick}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unreadCount > 0 && (
          <span className="notif-bell-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown" role="menu">
          <div className="notif-dropdown-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button
                className="notif-mark-all-btn"
                onClick={handleMarkAllAsRead}
                disabled={loading.action}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="notif-dropdown-list">
            {loading.list && previewList.length === 0 ? (
              <div className="notif-dropdown-state">Loading…</div>
            ) : previewList.length === 0 ? (
              <div className="notif-dropdown-state">
                You're all caught up.
              </div>
            ) : (
              previewList.map((n) => (
                <button
                  key={n._id}
                  className={`notif-item ${n.isRead ? "" : "notif-item--unread"}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <span className="notif-item-dot" aria-hidden="true" />
                  <span className="notif-item-body">
                    <span className="notif-item-title">{n.title}</span>
                    <span className="notif-item-message">{n.message}</span>
                    <span className="notif-item-time">
                      {timeAgo(n.createdAt)}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>

          <button className="notif-view-all-btn" onClick={handleViewAll}>
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;