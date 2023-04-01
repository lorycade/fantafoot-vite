import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateStepper from "../components/create-stepper/CreateStepper";

// import playerImg from "../assets/user.png";

function CreateTeam() {
  const jwt = localStorage.getItem("jwt");
  const history = useNavigate()

  useEffect(() => {
    if (!jwt) {
      history('/')
    }
  }, [])

  return (
    <>
      <div className="container-lg mb-5">
        <div className="row mt-40 fx-center">
          <div className="col-12">
            <h2 className="follow-title t-bold text-center">Crea Squadra</h2>
          </div>
        </div>
      </div>
      <CreateStepper />
    </>
  );
}

export default CreateTeam;
