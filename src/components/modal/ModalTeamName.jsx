import { useEffect, useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

function ModalTeamName({ isOpen, openEvent, userData, jwt }) {
  const [show, setShow] = useState(false);
  const [newSquadName, setNewSquadName] = useState("");
  const { user, setUser } = useContext(UserContext);

  const handleClose = () => {
    setShow(false);
    openEvent(false);
    setNewSquadName("")
  };

  useEffect(() => {
    console.log("arriavato", isOpen);
    setShow(isOpen);
  }, [isOpen]);

  const handleChangeName = () => {
    axios
      .put(
        "http://localhost:1337/api/users/" + user.id,
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
        console.log("data", response);
        
        // console.log("User token", response.data.jwt);
        setUser(response.data)
        localStorage.setItem('user', JSON.stringify(response.data))
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
          La tua squadra si chiama: <strong>{user.teamName}</strong>
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
