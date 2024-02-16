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
      <Container className="mt-3 " style={{ width: "30%" }}>
                   
            {user && (
              <Card bg="header" className="text-center">
                <Card.Body>
                  <Row><Col>
                  <Figure className="bg-border-color overflow-hidden my-auto ml-2 p-1" style={{ height: "100px", width: "100px" }}>
                    <Figure.Image src={user.profile_image} style={{ borderRadius: "0%", height: "100%", width: "auto", objectFit: "cover" }} />
                  </Figure></Col>
                  <Col>
                  <Card.Text className="mb-3">{user.username}</Card.Text>
                  <Card.Text className="mb-3">{user.email}</Card.Text>
                  <Card.Text className="mb-3">{user.zipcode}</Card.Text>
                  </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
          
            {user && (
              <Card className="mt-3" style={{ width: "50%" }}>
                <Card.Body>
                  <Figure className="bg-border-color overflow-hidden my-auto  p-1" style={{ height: "100px", width: "100px" }}>
                    <Figure.Image src={user.dog.images && user.dog.images[0]} style={{ borderRadius: "0%", height: "100%", width: "auto", objectFit: "cover" }} />
                  </Figure>
                  <Card.Text className="mb-3">{user.dog.name}</Card.Text>
                  <Card.Text className="mb-3">{user.dog.breed}</Card.Text>
                  <Card.Text className="mb-3">{user.dog.size}</Card.Text>
                </Card.Body>
              </Card>
            )}
          
        {state.user && state.user.username === params.uname && (
          <div className="mt-3">
            <Button
              variant="primary"
              className="d-inline-block"
              style={{ border: "none", color: "white", display: "inline-block" }}
              onClick={() => navigate(`/profile/u/${params.uname}/edit`)}
            >
              Edit Profile
            </Button>
          </div>
        )}
      </Container>
    </>
  );
}
