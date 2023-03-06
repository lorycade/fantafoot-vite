import { Link } from "react-router-dom";
// import axios from "axios";
// import { useState, useEffect, useContext } from "react";
// import { UserContext } from "../context/UserContext";

function Home() {
  // const { user, setUser } = useContext(UserContext);

  return (
    <>
      <div className="container">
        <div className="row mt-5">
          <div className="col-lg-8">
            <h2>Classifica top 5</h2>
            <div className="leaderboard">
              <div className="line head">
                <div className="cell">Posizione</div>
                <div className="cell">Giocatore</div>
                <div className="cell">Punti</div>
              </div>
              <div className="line body">
                <div className="cell">1</div>
                <div className="cell">Antonio Ricci</div>
                <div className="cell">50</div>
              </div>
              <div className="line body">
                <div className="cell">2</div>
                <div className="cell">Giuseppe Bianchi</div>
                <div className="cell">30</div>
              </div>
              <div className="line body">
                <div className="cell">3</div>
                <div className="cell">Luca Verde</div>
                <div className="cell">10</div>
              </div>
              <div className="line body">
                <div className="cell">4</div>
                <div className="cell">Antonio Ricci</div>
                <div className="cell">50</div>
              </div>
              <div className="line body">
                <div className="cell">5</div>
                <div className="cell">Giuseppe Bianchi</div>
                <div className="cell">30</div>
              </div>
            </div>
            <Link to="/classifica" className="d-inline-block mt-4">
              Vedi tutta la classifica
            </Link>
          </div>
          <div className="col-lg-4">
            <p>vedremo cosa inserire</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
