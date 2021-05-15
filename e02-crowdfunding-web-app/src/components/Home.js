import React, { useEffect, useState } from "react";
import WalletLogin from "./WalletLogin";
import { Heading } from "@chakra-ui/layout";

import { useElrondContext, useElrondDispatch } from "../context";
import axios from "axios";
import { Button } from "@chakra-ui/button";
import Denominate from "./Denominate";
import { addresses } from "../contracts";

import { useNavigate } from "react-router-dom";
const crowdAddress = addresses.crowdfunding_testnet;

async function getBalance(address) {
  const baseUrl = "https://testnet-api.elrond.com/accounts/";
  const fullUrl = baseUrl.concat(address);
  const account = await axios(fullUrl);
  const { balance } = account.data;
  return balance;
}

const Home = () => {
  const { address } = useElrondContext();
  const elrondDispatch = useElrondDispatch();
  const [myFunds, setMyFunds] = useState(0);
  const [crowdFunds, setCrowdFunds] = useState(0);

  useEffect(async () => {
    getBalance(address).then((balance) => {
      setMyFunds(balance);
    });
  }, []);

  useEffect(async () => {
    getBalance(crowdAddress).then((balance) => {
      setCrowdFunds(balance);
    });
  }, []);

  const navigate = useNavigate();

  const logOut = () => {
    console.log("Time to logout");
    elrondDispatch({ type: "logout" });
  };

  return (
    <div style={{ padding: 20 }}>
      <Heading>Hello Elrond Crowdfund</Heading>
      <div>You are now connected to your wallet</div>
      <div>Elrond address: {address}</div>
      <div>
        My Balance:
        <Denominate value={myFunds} showLastNonZeroDecimal={true} />
      </div>
      <div>
        Crowd balance:
        <Denominate value={crowdFunds} showLastNonZeroDecimal={true} />
      </div>
      <div style={{ padding: 20 }}>
        <Button onClick={() => logOut()} margin="2">
          Close Wallet
        </Button>
        <Button onClick={() => navigate("/sendfunds")}>Send funds</Button>
      </div>
    </div>
  );
};

export default Home;
