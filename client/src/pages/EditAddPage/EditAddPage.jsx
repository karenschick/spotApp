import React, { useState, useEffect, useRef } from "react";
import { Button, Container, Card, Row, Col, Figure } from "react-bootstrap";
import { useProvideAuth } from "../../hooks/useAuth";
//import { useApiFetch } from "../../util/api";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/api.utils";
//import api from "../../util/api";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import EditProfile from "../../components/EditProfile/EditProfile";

const EditAddPage = () => {
  const { state } = useProvideAuth();
  //const { error, isLoading, response } = useApiFetch("/albums");
  const [user, setUser] = useState();
  //const [loading, setLoading] = useState(true);
  // const [validated, setValidated] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  // const [open, setOpen] = useState(false);
  // const [data, setData] = useState({
  //   password: "",
  //   currentPassword: "",
  //   confirmPassword: "",
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   city: "",
  //   state: "",
  //   isSubmitting: false,
  //   errorMessage: null,
  // });
  const [profileImage, setProfileImage] = useState("");
  // const [passwordChanged, setPasswordChanged] = useState(false);
  // const [avatarChanged, setAvatarChanged] = useState(false);
  // const [albumChanged, setAlbumChanged] = useState(false);
  // const [displayedAlbums, setDisplayedAlbums] = useState([]);
  // const addAlbumSubmitRef = useRef(null);

  let navigate = useNavigate();
  let params = useParams();
  const {
    state: { isAuthenticated },
  } = useRequireAuth();

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

  function capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <>
      <Button
        variant="outline-info"
        onClick={() => {
          navigate(`/u/${user.username}`);
        }}
        style={{ border: "none", color: "black" }}
        className="mt-3 mb-3"
      >
        Go Back
      </Button>

      <Container>
        <Card
          bg="header"
          className="text-center justify-content-center align-items-center mt-3"
          // style={{width:"50%"}}
        >
          <Card.Body>
            <Row className="align-items-center">
              <Col xs="auto">
                <Figure
                  className="bg-border-color overflow-hidden my-auto ml-2 p-1"
                  style={{ height: "100px", width: "100px" }}
                >
                  {user && (
                    <Figure.Image
                      src={user.profile_image}
                      style={{
                        borderRadius: "0%",
                        height: "100%",
                        width: "auto",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Figure>
              </Col>
              <Col xs="auto ">
                <h2>{capitalizeFirstLetter(state.user?.username)}</h2>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>

      <EditProfile />
    </>
  );
};

export default EditAddPage;
