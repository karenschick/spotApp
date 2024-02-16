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
     

      

      <EditProfile />
    </>
  );
};

export default EditAddPage;
