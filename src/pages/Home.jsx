import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div className="container my-5 text-center">
        <h1>Questa pagina avrà dei contenuti in futuro</h1>
        <p>Guardati la <Link to="/classifica" className="d-inline-block mt-4">classifica</Link></p>
      </div>
    </>
  );
}

export default Home;
