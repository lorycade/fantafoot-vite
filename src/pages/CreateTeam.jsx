import { useContext, useState, useEffect } from "react";
// import { UserContext } from "../context/UserContext";
// import { Link } from "react-router-dom"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateStepper from "../components/create-stepper/CreateStepper";

// import playerImg from "../assets/user.png";

function CreateTeam() {
  return (
    <>
      <div className="container mb-5">
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
