import React, { useState, useEffect } from "react";
import { Container, Card, Button, Figure, Row, Col } from "react-bootstrap";
//import { useApiFetch } from "../util/api";

import { useProvideAuth } from "../hooks/useAuth";
import { useRequireAuth } from "../hooks/useRequireAuth";
//import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
//import Header from "../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api.utils";
//import api from "../util/api";
//import "../custom.scss";

export default function ProfilePage(props) {
  const { state } = useProvideAuth();
  const [user, setUser] = useState();
  //const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState("");

  let navigate = useNavigate();
  let params = useParams();
  const {
    state: { isAuthenticated },
  } = useRequireAuth();

  // function capitalizeFirstLetter(string) {
  //   if (!string) return "";
  //   return string.charAt(0).toUpperCase() + string.slice(1);
  // }

  useEffect(() => {
    const getUser = async () => {
      try {
        const userResponse = await api.get(`/users/${params.uname}`);
        setUser(userResponse.data);
        setProfileImage(userResponse.data.profile_image);
        //setLoading(false);
      } catch (err) {
        console.error(err.message);
      }
    };
    isAuthenticated && getUser();
  }, [params.uname, isAuthenticated]);

  // if (!isAuthenticated) {
  //   return <LoadingSpinner full />;
  // }

  // if (loading) {
  //   return <LoadingSpinner full />;
  // }

  return (
    <>
      {/* <Header /> */}
      <Container className="mt-3" style={{ width: "60%" }}>
        <Card bg="header" className="text-center">
          <Card.Body>
            <Row className="justify-content-center align-items-center mt-3">
              <Col xs={12} sm={4} md={3} lg={2}>
                <Figure
                  className="bg-border-color overflow-hidden my-auto ml-2 p-1"
                  style={{ height: "100px", width: "100px" }}
                >
                  <Figure.Image
                    src={user && user.profile_image}
                    style={{
                      borderRadius: "0%",
                      height: "100%",
                      width: "auto",
                      objectFit: "cover",
                    }}
                  />
                </Figure>
              </Col>
              <Col xs="auto">
                <Card.Text className="mb-3">{user && user.username}</Card.Text>
                <Card.Text className="mb-3">{user && user.email}</Card.Text>
                <Card.Text className="mb-3">{user && user.zipcode}</Card.Text>
              </Col>
            </Row>
            <Row className="justify-content-center align-items-center mt-3">
              <Col xs={12} sm={4} md={3} lg={2}>
                <Figure
                  className="bg-border-color overflow-hidden my-auto ml-2 p-1"
                  style={{ height: "100px", width: "100px" }}
                >
                  <Figure.Image
                  
                    src={user && user.dog.images && user.dog.images[0]}
                    style={{
                      borderRadius: "0%",
                      height: "100%",
                      width: "auto",
                      objectFit: "cover",
                    }}
                  />
                </Figure>
              </Col>
              <Col xs="auto">
                <Card.Text className="mb-3">{user && user.dog.name}</Card.Text>
                <Card.Text className="mb-3">{user && user.dog.breed}</Card.Text>
                <Card.Text className="mb-3">{user && user.dog.size}</Card.Text>
              </Col>
            </Row>
          </Card.Body>

          {state.user && state.user.username === params.uname && (
            <div className="mb-3">
              {" "}
              <Button
                variant="primary"
                className="d-inline-block"
                style={{
                  border: "none",
                  color: "white",
                  display: "inline-block",
                }}
                onClick={() => navigate(`/profile/u/${params.uname}/edit`)}
              >
                Edit Profile
              </Button>
            </div>
          )}
        </Card>
      </Container>
    </>
  );
}
