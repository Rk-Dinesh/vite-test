import React, { useState } from "react";
import "./App.css";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [amount, setAmount] = useState("");
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [showCardDetails, setShowCardDetails] = useState(true);

  const handlesubmit = (e) => {
    e.preventDefault();
    if (amount === "") {
      alert("please enter amount");
    } else {
      var options = {
        key: "rzp_test_6cNn6KMffozSlf",
        key_secret: "SnYdnBbooGTuzQfK1txNflzI",
        amount: amount * 100,
        currency: "INR",
        name: "Hackwit Technologies",
        description: "Razorpay testing",
        handler: (response) => {
          setPaymentResponse(response);
          console.log("Payment successful:", response);
        },
        prefill: {
          name: " testcheck",
          email: "kumar@example.com",
          contact: "7708209937",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      try {
        var pay = new window.Razorpay(options);
        pay.open();
        setShowCardDetails(false);
      } catch (error) {
        console.error("Razorpay error:", error);
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      <div>
        <h1>Razorpay Test</h1>
        <br />

        <Form>
          <Row className="align-items-center">
            <Col sm={4} className="my-1 ">
              <Form.Label htmlFor="inlineFormInputAmount" visuallyHidden>
                Name
              </Form.Label>
              <Form.Control
                id="inlineFormInputAmount"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Col>

            <Col xs="auto" className="my-1">
              <Button type="submit" onClick={handlesubmit}>
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
        <br />
        {showCardDetails && (
          <>
            <p style={{ fontWeight: "bold", textAlign: "left" }}>
              TEST CARD : Mastercard : 5267 3181 8797 5449
            </p>
            <p style={{ fontWeight: "bold", textAlign: "left" }}>
              TEST CARD : : 4111 1111 1111 1111
            </p>
          </>
        )}

        {paymentResponse && (
          <div>
            <p style={{ fontWeight: "bolder" }}>Payment Response:</p>
            <p>Payment ID: {paymentResponse.razorpay_payment_id}</p>
            <p>Order ID: {paymentResponse.razorpay_order_id}</p>
            <p>Payment ID: {paymentResponse.razorpay_payment_id}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
