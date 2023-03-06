import { useEffect, useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
// import { UserContext } from "../../context/UserContext";

function ModalTeamName({ isOpen, openEvent, userData, jwt }) {
  const [show, setShow] = useState(false);
  const [newSquadName, setNewSquadName] = useState("");
  // const { user, setUser } = useContext(UserContext);

  const handleClose = () => {
    setShow(false);
    openEvent(false);
    setNewSquadName("")
  };

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  const handleChangeName = () => {
    axios
      .put(
        import.meta.env.VITE_API_URL + "/api/users/" + user.id,
        {
          teamName: newSquadName,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((response) => {
        
        setUser(response.data)
        // localStorage.setItem('user', JSON.stringify(response.data))
        handleClose()
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
        // if (error.response.status == 400) {
        //   setError('Email o Password errate');
        // }
      });
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modifica nome squadra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          La tua squadra si chiama: <strong>{userData.teamName}</strong>
        </p>
        <p className="mt-4">Inserisci qui sotto il nuovo nome</p>
        <div className="form-floating mb-3">
          <input
            type="text"
            value={newSquadName}
            onChange={(event) => setNewSquadName(event.target.value)}
            className="form-control"
            id="squad-name"
            placeholder="Nome squadra"
          />
          <label htmlFor="squad-name">
           Nome squadra
          </label>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annulla
        </Button>
        <Button variant="primary" onClick={() => handleChangeName()} disabled={!newSquadName}>
          Modifica
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalTeamName;
