import React from 'react'
import { initializeApp } from "firebase/app"
import { firebaseConfig } from "../../database/firebaseConfig";
import { getFirestore, doc, updateDoc, collection, addDoc } from "firebase/firestore";

const UnitUserSect = ({ userData, setProfileState, setUserData }) => {
  initializeApp(firebaseConfig);

  const db = getFirestore();
  const colRefNotif = collection(db, "notifications");

  const handleDetailUpdate = () => {
    const docRef = doc(db, "userlogs", userData?.id);

    updateDoc(docRef, {
      name: userData?.name,
      userName: userData?.userName,
      balance: typeof userData?.balance === "number" ? userData?.balance : parseInt(userData?.balance || "0"),
      bonus: typeof userData?.bonus === "number" ? userData?.bonus : parseInt(userData?.bonus || "0"),
      accountStatus: userData?.accountStatus,
      authStatus: "seen"
    }).then(() => {
      // Push a notification to the user if balance was updated
      if (userData?.idnum) {
        addDoc(colRefNotif, {
          message: `Your account has been updated by admin.`,
          dateTime: new Date().toISOString(),
          idnum: userData?.idnum,
          status: "unseen"
        });
      }
      setProfileState("Users");
    });
  };

  return (
    <div className="profileMainCntn">
      <div className="profileEditableDisplay">
        <h2>User Details</h2>
        <div className="theFormField">
          <div className="unitInputField">
            <label htmlFor="name">Full Name</label>
            <input type="text" value={userData?.name} onChange={(e) => { setUserData({ ...userData, name: e.target.value }) }} />
          </div>
          <div className="unitInputField">
            <label htmlFor="name">UserName</label>
            <input type="text" value={userData?.userName} onChange={(e) => { setUserData({ ...userData, userName: e.target.value }) }} />
          </div>
          <div className="unitInputField">
            <label htmlFor="name">User Email</label>
            <input type="text" disabled value={userData?.email} />
          </div>

          {/* BALANCE CONTROL — Admin can modify */}
          <div className="unitInputField" style={{ border: "1px solid #0672CD", borderRadius: "8px", padding: "8px" }}>
            <label htmlFor="balance" style={{ color: "#0672CD", fontWeight: "700" }}>💰 Balance (USD) — EDITABLE</label>
            <input
              type="number"
              value={userData?.balance ?? 0}
              onChange={(e) => { setUserData({ ...userData, balance: parseInt(e.target.value || "0") }) }}
              style={{ color: "#0672CD", fontWeight: "700" }}
            />
          </div>

          {/* BONUS CONTROL — Admin can modify */}
          <div className="unitInputField" style={{ border: "1px solid #00e676", borderRadius: "8px", padding: "8px" }}>
            <label htmlFor="bonus" style={{ color: "#00e676", fontWeight: "700" }}>🎁 Bonus (USD) — EDITABLE</label>
            <input
              type="number"
              value={userData?.bonus ?? 0}
              onChange={(e) => { setUserData({ ...userData, bonus: parseInt(e.target.value || "0") }) }}
              style={{ color: "#00e676", fontWeight: "700" }}
            />
          </div>

          {/* ACCOUNT STATUS — Admin can modify */}
          <div className="unitInputField" style={{ border: "1px solid #ffab00", borderRadius: "8px", padding: "8px" }}>
            <label htmlFor="accountStatus" style={{ color: "#ffab00", fontWeight: "700" }}>📋 Account Status — EDITABLE</label>
            <select
              value={userData?.accountStatus}
              onChange={(e) => { setUserData({ ...userData, accountStatus: e.target.value }) }}
              style={{ color: "#ffab00", fontWeight: "700", background: "transparent", border: "none", width: "100%", padding: "8px 0" }}
            >
              <option value="No Active Plan">No Active Plan</option>
              <option value="Silver Plan">Silver Plan</option>
              <option value="Gold Plan">Gold Plan</option>
              <option value="Diamond Plan">Diamond Plan</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div className="unitInputField">
            <label htmlFor="name">Account Cryptic Id.</label>
            <input type="text" disabled value={userData?.id} />
          </div>
          <div className="unitInputField">
            <label htmlFor="name">Account Register Id.</label>
            <input type="text" disabled value={userData?.idnum} />
          </div>
          <div className="unitInputField">
            <label htmlFor="name">Joined on</label>
            <input type="text" disabled value={userData?.date ? new Date(userData?.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "N/A"} />
          </div>

        </div>

        <div className="flex-align-jusc">
          <button type="button" onClick={handleDetailUpdate}>Update User</button>
        </div>
      </div>
    </div>
  )
}

export default UnitUserSect
