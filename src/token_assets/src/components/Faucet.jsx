import React, { useState } from "react";
import {token,canisterId,createActor} from "../../../declarations/token";
import { AuthClient } from "@dfinity/auth-client";



function Faucet(props) {
  const [isDisabled, setDisabeled] = useState(false);
  const [buttonText, setText] = useState("Claim");

  async function handleClick(event) {
    setDisabeled(true);

    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();

    const authCanister = createActor(canisterId,{
      agentOptions :{
        identity,
      },
    });

    const result = await authCanister.payOut();
    setText(result);

  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free DigitalMint Coins here! Claim 10,000 DigitalMint Coins to {props.userPrincipal}.</label>
      <p className="trade-buttons">
        <button id="btn-payout" onClick={handleClick} disabled ={isDisabled}>
          {buttonText}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
