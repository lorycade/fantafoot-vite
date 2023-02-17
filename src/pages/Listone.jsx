

function Listone() {
  return (
    <div className="container">
        <div className="row mt-40 fx-center">
          <div className="col-12">
            <h2 className="follow-title t-bold text-center">Listone</h2>
          </div>
        </div>
        <div className="filters">
          <div className="form-item">
            <label for="player" class="form-label">Cerca giocatore</label>
            <input type="text" class="form-control" id="player" placeholder="Mario Rossi" />
          </div>
        </div>
        <div className="leaderboard mt-5">
          <div className="line head">
            <div className="cell">Posizione</div>
            <div className="cell">Giocatore</div>
            <div className="cell">Crediti</div>
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
          <div className="line body">
            <div className="cell">6</div>
            <div className="cell">Luca Verde</div>
            <div className="cell">10</div>
          </div>
        </div>
      </div>
  );
}

export default Listone;
