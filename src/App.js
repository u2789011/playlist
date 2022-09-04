import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import Web3Modal from "web3modal"; //web3連接
import { ethers } from "ethers"; //JS函式庫

const web3Modal = new Web3Modal({
  network: "rinkeby",
  providerOptions: {},
}); //指定區塊鏈

function App() {
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState("oxo");
  const [balance, setBalance] = useState(100);
  const [messsage, setMesssage] = useState("Hi");
  const [paidMsg, setPaidMsg] = useState("Hello");

  useEffect(() => {
    async function init() {
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const ensAddress = await provider.lookupAddress(address);
      const contractAddr = "0x0";
      const abi = [];
      const contract = new ethers.Contract(contractAddr, abi, signer);

      let msg = await contract.message();
      let paidMsg = await contract.retrievePaidMsg();
      setAddress(address);
      setBalance(ethers.utils.formatEther(balance) + " ETH"); // this is big number// only available in mainnet
      setMesssage(msg);
      setPaidMsg(paidMsg);
    }
    init();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hi!{address}</p>
        <p>you have{balance}</p>
        <p>{messsage}</p>
        <p>{paidMsg}</p>
        <button
          onClick={() => {
            async function store() {
              let tx = await contract.store("Free fish!");
              await tx.wait();
              let _msg = await contract.message();
              setMesssage(_msg);
            }
            store();
          }}
        ></button>
        <button
          onClick={() => {
            async function storePaid() {
              // https://docs.ethers.io/v5/api/utils/display-logic/#utils-formatEther
              let payEtherAmount = ethers.utils.parseEther("1.0");
              let tx = await contract.storePaidMsg("This is a Fish!", {
                value: payEtherAmount,
              });
              await tx.wait();
              let _paidMsg = await contract.retrievePaidMsg();
              setMesssage(_paidMsg);
            }
            storePaid();
          }}
        ></button>
      </header>
    </div>
  );
}

export default App;
