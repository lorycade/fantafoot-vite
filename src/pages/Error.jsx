import { Link } from "react-router-dom";
import Header from "../components/header/header";

function Error() {
  return (
    <>
      <Header />
      <main>
        <div className="my-5 text-center">
          <h1>404</h1>
          <h2>Sembra ci sia stato un'errore, torna alla home</h2>
          <Link to="/">Home</Link>
        </div>
      </main>
    </>
  );
}

export default Error;
