import React, { useState } from "react";
import {canisterId,createActor} from "../../../declarations/token";
import { Principal } from "@dfinity/principal";
import { AuthClient } from "@dfinity/auth-client";

function Transfer() {
  
  const [recieversId, setId] = useState("");
  const [transferedAmount, setAmount] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isHidden , setHidden] = useState(true);
  async function handleClick() {
    isHidden(true);
    setDisabled(true);
    const reciever = Principal.fromText(recieversId);
    const finalAmount = Number(transferedAmount);
    
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const authCanister = createActor(canisterId,{
      agentOptions:{
        identity,
      },
    });

    const result = await authCanister.transfer(reciever, finalAmount);
    setFeedback(result);
    isHidden(false);
    setDisabled(false);
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                value={recieversId}
                onChange={(e)=> setId(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                value={transferedAmount}
                onChange={(e)=>setAmount(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button id="btn-transfer" onClick={handleClick} disabled = {isDisabled} >
            Transfer
          </button>
        </p>
        <p hidden ={isHidden}>{feedback}</p>
      </div>
    </div>
  );
}

export default Transfer;
