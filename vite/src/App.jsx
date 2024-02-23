import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Logo from "../src/assets/Protutor_Logo.png";
import Logo1 from "../src/assets/success.png";

function App() {
  // const location = useLocation();
  // const Id = new URLSearchParams(location.search).get("email");
  const planId = "SPP001"
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [showCardDetails, setShowCardDetails] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    amount: "",
    phone: "",
    planname: "",
    credit: "",
  });

  const generateTransactionId = () => {
    const uniqueId = uuidv4().replace(/-/g, "");
    const timestamp = Date.now();

    const combinedId = timestamp.toString() + uniqueId;
    const transactionId = combinedId.slice(-11);

    return transactionId;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const sub_id = planId;
      let response;

      if (sub_id.startsWith("SPP")) {
        response = await axios.get(
          `http://localhost:3000/getparentplanId?sub_id=${sub_id}`
        );
      } else if (sub_id.startsWith("SPT")) {
        response = await axios.get(
          `http://localhost:3000/gettutorplanId?sub_id=${sub_id}`
        );
      } else if (sub_id.startsWith("SPS")) {
        response = await axios.get(
          `http://localhost:3000/getstudentplanid?sub_id=${sub_id}`
        );
      } else {
        console.error("Invalid sub_id format");
        return;
      }
      //console.log(response);
      const { fname, email, plancost, plan_name, count } = response.data;
      setUserData({
        name: fname,
        email: email,
        amount: plancost,
        planname: plan_name,
        credit: count,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handlePayment = async () => {
    if (userData.amount === "") {
      alert("Please enter amount");
      return;
    }

    try {
      const options = {
        key: "rzp_test_6cNn6KMffozSlf",
        key_secret: "SnYdnBbooGTuzQfK1txNflzI",
        amount: userData.amount * 100,
        currency: "INR",
        name: "Hackwit Technologies",
        description: "Razorpay testing",
        handler: async (response) => {
          setPaymentResponse(response);
          console.log("Payment successful:", response);

          const transactionId = generateTransactionId();
          //console.log(transactionId);
          try {
            let updateResponse;
            if (response.razorpay_payment_id) {
              const sub_id = planId;
              let apiUrl;
              if (sub_id.startsWith("SPP")) {
                apiUrl = `http://localhost:3000/updateparentplan?sub_id=${sub_id}`;
              } else if (sub_id.startsWith("SPT")) {
                apiUrl = `http://localhost:3000/updatestudentplan?sub_id=${sub_id}`;
              } else if (sub_id.startsWith("SPS")) {
                apiUrl = `http://localhost:3000/updatetutorplan?sub_id=${sub_id}`;
              } else {
                console.log("Invalid subscription ID format:", sub_id);
                return;
              }
              updateResponse = await axios.put(apiUrl, {
                sub_id: sub_id,
                tnx_id: transactionId,
                status: "paid",
              });
              console.log("Transaction ID updated:", updateResponse.data);
            } else {
              console.log("Payment was not successful, status not updated.");
            }
          } catch (error) {
            console.error("Error updating transaction ID:", error);
          }
        },
        prefill: {
          name: userData.name,
          email: userData.email,
          contact: userData.phone,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setShowCardDetails(false);
    } catch (error) {
      console.error("Razorpay error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="landing-container">
      {!paymentResponse && (
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
        </div>
      )}
      {!paymentResponse ? (
        <div className="card">
          <h2>Welcome to Our Platform</h2>
          <p>
            Plan Cost: <span>$ {userData.amount}</span>{" "}
          </p>
          <p>
            Plan : <span>{userData.planname} plan</span>{" "}
          </p>
          <p>
            Credits : <span>{userData.credit}</span>{" "}
          </p>
          <button
            className="action-button"
            type="submit"
            onClick={handlePayment}
          >
            Pay Now
          </button>
        </div>
      ) : (
        <div className="payment-details">
          <div className="logo-container">
            <img src={Logo1} alt="Logo" className="logo" />
          </div>
          <p className="success">
            {paymentResponse.razorpay_payment_id
              ? "Payment successful!"
              : "Payment failed."}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
