import { useState, useEffect } from "react";
import './LaunchTracker.css';

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches";

function LaunchTracker() {
  const [luanches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const launchesPerPage = 10;

  useEffect(() => {
    fetch(SPACEX_API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setLaunches(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      }, []);
  });

  const indexOfLastLuanch = currentPage * launchesPerPage;
  const indexOfFirstLaunch = indexOfLastLuanch - launchesPerPage;
  const currentLuanches = luanches.slice(indexOfFirstLaunch, indexOfLastLuanch);
  const totalPages = Math.ceil(luanches.length / launchesPerPage);
  
  const HandleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top:0,
      // behavior: 'smooth',
    });
  };
  return (
    <div>
      <h1 className="title">SpaceX Launch Tracker</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error:{error}</p>}

      <ul className="launches-list">
        {currentLuanches.map((launch) => {
          return (
            <li className="launch-item" key={launch.id}>
              <h2>{launch.name}</h2>
              <p>Date: {new Date(launch.date_utc).toLocaleDateString()}</p>
              <p>Rocket: {launch.rocket} </p>
              <p>launch Site: {launch.launchpad}</p>
              <p>
                Details:{" "}
                {launch.details
                  ? launch.details
                  : "No details available for this luanch!"}
              </p>
              <a
                href={launch.links.webcast}
                target="blank"
                rel="noopener noreferrer"
              >
                Watch Launch
              </a>
            </li>
          );
        })}
      </ul>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => {
            return (
              <button
                className="pagination-button"
                key={pageNumber}
                onClick={() => HandleClick(pageNumber)}
                disabled={pageNumber === currentPage}
              >
                {pageNumber}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}

export default LaunchTracker;
