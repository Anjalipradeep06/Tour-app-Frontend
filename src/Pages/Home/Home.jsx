import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import {
  FaGlobeAmericas,
  FaHeadset,
  FaShieldAlt,
  FaStar,
  FaSearch,
} from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";

import {
  getFeaturedDestinations,
  getPopularDestinations,
} from "../../redux/thunks/destinationThunk";

import DestinationCard from "../../Components/DestinationCard/DestinationCard";

import "./Home.css";

const continents = [
  "Asia",
  "Europe",
  "Africa",
  "North America",
  "South America",
  "Australia",
];

const trustItems = [
  {
    icon: <FaStar />,
    title: "4.8 Average Rating",
    description:
      "Thousands of verified traveler reviews.",
  },
  {
    icon: <FaGlobeAmericas />,
    title: "500+ Experiences",
    description:
      "Curated tours across iconic destinations.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure Payments",
    description:
      "Safe booking with trusted payment methods.",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 Support",
    description:
      "Dedicated assistance whenever you need it.",
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedContinent, setSelectedContinent] =
    useState("Asia");

  // NEW: controlled value for the hero search input
  const [heroSearch, setHeroSearch] = useState("");

  const {
    featuredDestinations,
    popularDestinations,
    loading,
  } = useSelector(
    (state) => state.destinations
  );

  useEffect(() => {
    dispatch(getFeaturedDestinations());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getPopularDestinations(
        selectedContinent
      )
    );
  }, [dispatch, selectedContinent]);

  // NEW: navigate to /search carrying the typed value as a `search`
  // query param — same key SearchBar already uses internally, so
  // SearchTours can pick it up with zero translation logic.
  const handleHeroSearch = (e) => {
    e.preventDefault();

    const trimmed = heroSearch.trim();

    if (trimmed) {
      navigate(`/search?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/search");
    }
  };

  return (
    <main className="home">
      {/* HERO */}

      <section className="hero">
        <div className="home-hero-overlay">
          <div className="home-hero-content">
            <span className="home-hero-badge">
              Trusted by 50,000+ travelers
            </span>

            <h1>
              Discover extraordinary experiences
              around the world
            </h1>

            <p>
              Book curated tours, adventures,
              cultural experiences, and hidden
              gems in the world's most iconic
              destinations.
            </p>

            <form
              className="hero-search"
              onSubmit={handleHeroSearch}
            >
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
              />

              <button
                type="submit"
                className="search-btn"
              >
                <FaSearch />

                <span>
                  Search Experiences
                </span>
              </button>
            </form>

            <div className="hero-actions">
              <Link
                to="/search"
                className="hero-btn primary"
              >
                Explore Tours
              </Link>

              <Link
                to="/search"
                className="hero-btn secondary"
              >
                View Destinations
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <strong>50K+</strong>
                <span>Travelers</span>
              </div>

              <div>
                <strong>500+</strong>
                <span>Experiences</span>
              </div>

              <div>
                <strong>4.8★</strong>
                <span>Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}

      <section className="trust-section">
        <div className="trust-grid">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="trust-card"
            >
              <div className="trust-icon">
                {item.icon}
              </div>

              <h3>{item.title}</h3>

              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}

      <section className="section">
        <div className="section-header">
          <div>
            <span className="section-label">
              Featured
            </span>

            <h2>Featured Destinations</h2>

            <p>
              Handpicked destinations designed
              for unforgettable journeys.
            </p>
          </div>

          <Link
            to="/search"
            className="section-link"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <p className="loading">
            Loading destinations...
          </p>
        ) : !featuredDestinations?.length ? (
          <p className="loading">
            No destinations available.
          </p>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={
              featuredDestinations.length > 3
            }
            spaceBetween={28}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 3,
              },
            }}
            className="destination-slider"
          >
            {featuredDestinations.map(
              (destination) => (
                <SwiperSlide
                  key={destination._id}
                >
                  <DestinationCard
                    destination={destination}
                  />
                </SwiperSlide>
              )
            )}
          </Swiper>
        )}
      </section>

      {/* POPULAR */}

      <section className="section">
        <div className="section-header">
          <div>
            <span className="section-label">
              Trending
            </span>

            <h2>
              Popular in {selectedContinent}
            </h2>

            <p>
              Explore top-rated destinations
              across every continent.
            </p>
          </div>
        </div>

        <div className="continent-tabs">
          {continents.map((continent) => (
            <button
              key={continent}
              className={
                selectedContinent === continent
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedContinent(
                  continent
                )
              }
            >
              {continent}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="loading">
            Loading destinations...
          </p>
        ) : !popularDestinations?.length ? (
          <p className="loading">
            No popular destinations available.
          </p>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
            }}
            loop={
              popularDestinations.length > 3
            }
            spaceBetween={28}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 3,
              },
            }}
            className="destination-slider"
          >
            {popularDestinations.map(
              (destination) => (
                <SwiperSlide
                  key={destination._id}
                >
                  <DestinationCard
                    destination={destination}
                  />
                </SwiperSlide>
              )
            )}
          </Swiper>
        )}
      </section>

      {/* MAP */}

      <section className="map-section">
        <div className="section-header center">
          <span className="section-label">
            Explore
          </span>

          <h2>Explore the World</h2>

          <p>
            Discover experiences across every
            continent.
          </p>
        </div>

        <div className="map-container">
          <iframe
            title="Global Travel Map"
            src="https://maps.google.com/maps?q=20,0&z=2&output=embed"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
};

export default Home;