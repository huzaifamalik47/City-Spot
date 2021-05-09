import { render } from "@testing-library/react";
import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Col,
  InputGroup,
  Row,
  Button,
  Jumbotron,
  Alert,
  Badge,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { MapPicker } from "../Maps/MapPicker";
import fire from "../../../config";
import Spinner from "../Spinner/Spinner";

import LinearProgress from "@material-ui/core/LinearProgress";
import { useAuth } from "../.././AuthContext";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";
import emailjs from "emailjs-com";
import FreeSolo from "./VendorName";
export default function RegisterNewVendor() {
  function FormExample() {
    const [validated, setValidated] = useState(false);
    const [image, setImage] = useState(null);
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    const { addVendor, currentUser } = useAuth();
    const nameRef = useRef();
    const numRef = useRef();
    const cityRef = useRef();
    const latRef = useRef();
    const lngRef = useRef();
    const imgRef = useRef();
    const catRef = useRef();

    const [url, setUrl] = useState("");
    const [error, setError] = useState("");
    const [vDetails, setVDetails] = useState([]);
    const [lat, setLat] = useState("");
    const [vendors, setVendors] = useState([]);

    const [lng, setLng] = useState("");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      fetchData();
    }, []);
    if (loading) {
      return (
        <div className="App">
          <Spinner />
        </div>
      );
    }

    const fetchData = () => {
      const ref = fire.firestore().collection("Vendor");
      setLoading(true);
      ref.onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        });
        setVendors(items);
        setLoading(false);
      });
    };

    const handleImageChange = (e) => {
      if (e.target.files[0]) {
        setImage(e.target.files[0]);
      }
    };
    function sendEmail() {
      emailjs
        .send(
          "service_2xxoloj",
          "template_j2ydnii",
          {
            username: currentUser.displayName,
            useremail: currentUser.email,
          },
          "user_wg0oAcutEshfBeupCEV0E"
        )
        .then((v) => {
          console.log(v.status);
        });
    }
    const handleUpload = () => {
      const uploadTask = fire
        .storage()
        .ref(`VendorImages/${nameRef.current.value}/${image.name}`)
        .put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          fire
            .storage()
            .ref(`VendorImages/${nameRef.current.value}`)
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              setUrl(url);

              const data = {
                id: uuidv4(),
                name: nameRef.current.value,
                lat: lat,
                lng: lng,
                number: numRef.current.value,
                image: url,
                city: cityRef.current.value,
                date: new Date().toDateString(),
                category: catRef.current.value,
                avgrating: 0,
                totalreviews: 0,
                fiverating: 0,
                fourrating: 0,
                threerating: 0,
                tworating: 0,
                onerating: 0,
              };
              addVendor(data);
              sendEmail();
              setError("Vendor Registered");
              nameRef.current.value = "";
              numRef.current.value = "";
              cityRef.current.value = "";
              // history.push("/allvendors");
            });
        }
      );
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
      }
      if (nameRef.current.value) {
        handleUpload();
      }

      setValidated(true);
    };
    const sendDataToParent1 = (lat) => {
      // the callback. Use a better name
      //   console.log(lat);
      setLat(lat);
    };
    const sendDataToParent2 = (lng) => {
      // the callback. Use a better name
      //   console.log(lng);
      setLng(lng);
    };

    return (
      <Jumbotron>
        <Alert variant="success">
          <Alert.Heading>Note</Alert.Heading>
          <hr />
          <p>
            To avoid duplication, check to see if the Vendor is already
            registered.
          </p>
        </Alert>
        {error && <Alert variant="primary">{error}</Alert>}

        <h1>
          Register New Vendor <Badge variant="secondary">New</Badge>
        </h1>
        <Form noValidate validated={validated}>
          <Form.Row>
            <Form.Group as={Col} controlId="validationCustom01">
              <FreeSolo vendorData={vendors} />
              <Form.Label>Vendor Name</Form.Label>
              <Form.Control
                name="name"
                // value={vDetails.name}
                ref={nameRef}
                // onChange={(e) => setVDetails({ name: e.target.value })}
                required
                type="text"
                placeholder="Name"
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="validationCustom02">
              <Form.Label>Contact Information</Form.Label>
              <Form.Control
                name="number"
                ref={numRef}
                // value={vDetails.number}
                // onChange={(e) => setVDetails({ number: e.target.value })}
                required
                type="text"
                placeholder="Phone Number"
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="validationCustom03">
              <Form.Label>City</Form.Label>
              <Form.Control
                name="city"
                type="text"
                ref={cityRef}
                // onChange={(e) => setVDetails({ city: e.target.value })}
                // value={vDetails.city}
                placeholder="City"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid city.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="validationCustom03">
              <Form.Label>Category</Form.Label>
              <Form.Control
                name="Category"
                type="text"
                ref={catRef}
                // onChange={(e) => setVDetails({ city: e.target.value })}
                // value={vDetails.city}
                placeholder="Category"
                required
                as="select"
              >
                <option>Food</option>
                <option>Finance</option>
                <option>Shopping</option>
                <option>Automotive</option>
                <option>Home Services</option>
                <option>Other</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Please provide a valid category.
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="validationCustom03">
              <Form.Label>Vendor Images</Form.Label>
              <Form.File
                id="custom-file"
                name="image"
                ref={imgRef}
                // value={vDetails.image}
                onChange={(e) => handleImageChange(e)}
                label="Custom file input"
                custom
              />
              <LinearProgress
                variant="buffer"
                value={progress}
                color="secondary"
                valueBuffer={progress}
              />
            </Form.Group>
          </Form.Row>
          <Form.Group>
            <Form.Check
              label="Agree to terms and conditions"
              feedback="You must agree before submitting."
            />
          </Form.Group>
          <Button type="submit" onClick={handleSubmit}>
            Submit form
          </Button>
        </Form>
        <MapPicker
          sendDataToParent1={sendDataToParent1}
          sendDataToParent2={sendDataToParent2}
        />
      </Jumbotron>
    );
  }

  return (
    <>
      <FormExample />
    </>
  );
}
