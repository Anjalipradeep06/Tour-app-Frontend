import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDestinations } from "../../redux/thunks/destinationThunk";
import DestinationFormModal from "./DestinationFormModal";
import "./ManageTours.css";
import "./ManageDestinations.css";

const ManageDestinations = () => {
  const dispatch = useDispatch();
  const { allDestinations = [], loading, total = 0 } = useSelector(
    (state) => state.destinations
  );

  const [search, setSearch] = useState("");
  const [continent, setContinent] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getAllDestinations({ search, continent: continent || undefined }));
  }, [dispatch, search, continent]);

  return (
    <div className="admin-shell">
      <div className="admin-header mt-header">
        <div>
          <p className="admin-eyebrow">Admin</p>
          <h1>Destinations</h1>
        </div>
        <button className="mt-create-btn" onClick={() => setShowModal(true)}>
          + Create Destination
        </button>
      </div>

      <div className="mt-search-row">
        <input
          type="text"
          placeholder="Search destinations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={continent} onChange={(e) => setContinent(e.target.value)}>
          <option value="">All continents</option>
          <option value="Africa">Africa</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="North America">North America</option>
          <option value="South America">South America</option>
          <option value="Australia">Australia</option>
          <option value="Antarctica">Antarctica</option>
        </select>
      </div>

      {loading && allDestinations.length === 0 ? (
        <div className="mt-table-state">Loading destinations…</div>
      ) : allDestinations.length === 0 ? (
        <div className="mt-table-state">No destinations found.</div>
      ) : (
        <div className="md-grid">
          {allDestinations.map((d) => (
            <div className="md-card" key={d._id}>
              <img src={d.bannerImage} alt={d.name} className="md-card-img" />
              <div className="md-card-body">
                <h3>{d.name}</h3>
                <p className="md-card-sub">
                  {d.country} · {d.continent}
                </p>
                {d.isFeatured && <span className="mt-featured-badge">Featured</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && allDestinations.length > 0 && (
        <p className="mt-total-count">
          Showing {allDestinations.length} of {total} destination{total !== 1 ? "s" : ""}
        </p>
      )}

      {showModal && <DestinationFormModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default ManageDestinations;