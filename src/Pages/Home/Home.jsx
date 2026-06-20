import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

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

const Home = () => {
  const dispatch = useDispatch();

  const [selectedContinent, setSelectedContinent] =
    useState("Asia");

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

  return (
    <div className="home">
      {/* HERO SECTION */}

      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>
              Discover Amazing Tours Around
              The World
            </h1>

            <p>
              Find unforgettable experiences,
              adventures, cultural trips and
              activities at your favorite
              destinations.
            </p>

            <Link
              to="/search"
              className="hero-btn"
            >
              Explore Tours
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}

      <section className="featured">
        <div className="section-title">
          <div>
            <h2>
              Featured Destinations
            </h2>

            <p>
              Handpicked experiences for your
              next adventure.
            </p>
          </div>

          <Link to="/search">
            View All
          </Link>
        </div>

        {loading ? (
          <h3 className="loading">
            Loading destinations...
          </h3>
        ) : !featuredDestinations?.length ? (
          <h3 className="loading">
            No destinations available
          </h3>
        ) : (
          <Swiper
            modules={[
              Navigation,
              Autoplay,
            ]}
            navigation
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            spaceBetween={24}
            loop={
              featuredDestinations.length >
              3
            }
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="featured-slider"
          >
            {featuredDestinations.map(
              (destination) => (
                <SwiperSlide
                  key={destination._id}
                >
                  <DestinationCard
                    destination={
                      destination
                    }
                  />
                </SwiperSlide>
              )
            )}
          </Swiper>
        )}
      </section>

      {/* POPULAR DESTINATIONS */}

      <section className="featured">
        <div className="section-title">
          <div>
            <h2>
              Popular in{" "}
              {selectedContinent}
            </h2>

            <p>
              Explore trending destinations
              by continent.
            </p>
          </div>
        </div>

        <div className="continent-tabs">
          {continents.map(
            (continent) => (
              <button
                key={continent}
                className={
                  selectedContinent ===
                  continent
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
            )
          )}
        </div>

        {loading ? (
          <h3 className="loading">
            Loading destinations...
          </h3>
        ) : !popularDestinations?.length ? (
          <h3 className="loading">
            No popular destinations
            available
          </h3>
        ) : (
          <Swiper
            modules={[
              Navigation,
              Autoplay,
            ]}
            navigation
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
            }}
            spaceBetween={24}
            loop={
              popularDestinations.length >
              3
            }
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="featured-slider"
          >
            {popularDestinations.map(
              (destination) => (
                <SwiperSlide
                  key={destination._id}
                >
                  <DestinationCard
                    destination={
                      destination
                    }
                  />
                </SwiperSlide>
              )
            )}
          </Swiper>
        )}
      </section>

      {/* GLOBAL MAP */}

      <section className="global-map-section">
        <div className="section-title center">
          <h2>Explore the World</h2>

          <p>
            Discover unforgettable
            destinations across continents.
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
    </div>
  );
};

export default Home;