import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Figure,
  Modal,
  Row,
  Col,
  ListGroup,
  Badge,
} from "react-bootstrap";
//import { useApiFetch } from "../../util/api";
import { useProvideAuth } from "../../hooks/useAuth";
import UploadFile from "../UploadFile/UploadFile";
import { useRequireAuth } from "../../hooks/useRequireAuth";
//import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
//import AvatarPicker from "../AvatarPicker/AvatarPicker";
import api from "../../../utils/api.utils";
import { useNavigate, useParams } from "react-router-dom";
//import api from "../../util/api";
import { toast } from "react-toastify";
import AvatarPicker from "../AvatarPicker/AvatarPicker";

const EditProfile = (props) => {
  const { state } = useProvideAuth();

  const [user, setUser] = useState();
  //const [loading, setLoading] = useState(true);
  const [uploadImageType, setUploadImageType] = useState("")
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    password: "",
    currentPassword: "",
    confirmPassword: "",
    //firstName: "",
    //lastName: "",
    email: "",
    zipcode: "",
    dogName: "",
    dogBreed: "",
    dogSize: "",
    dogPhoto: "",
    dogPhotoChanged: false,
    //city: "",
    //state: "",
    profile_image: "",
    profile_image_changed: false,
    isSubmitting: false,
    errorMessage: null,
  });
  const [validated, setValidated] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  //const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  //const [avatarChanged, setAvatarChanged] = useState(false);

  let navigate = useNavigate();
  let params = useParams();

  useEffect(() => {
    if (user) {
      setData((prevData) => ({
        ...prevData,
        // firstName: user.firstName,
        // lastName: user.lastName,
        email: user.email,
        // city: user.city,
        // state: user.state,
        zipcode: user.zipcode,
        dogName: user.dog.name,
        dogBreed: user.dog.breed,
        dogSize: user.dog.size,
        dogImages: user.dog.images || [],
        profile_image: user.profile_image,
      }));
    }
  }, [user]);

  // const usStates = [
  //   "AL",
  //   "AK",
  //   "AZ",
  //   "AR",
  //   "CA",
  //   "CO",
  //   "CT",
  //   "DE",
  //   "FL",
  //   "GA",
  //   "HI",
  //   "ID",
  //   "IL",
  //   "IN",
  //   "IA",
  //   "KS",
  //   "KY",
  //   "LA",
  //   "ME",
  //   "MD",
  //   "MA",
  //   "MI",
  //   "MN",
  //   "MS",
  //   "MO",
  //   "MT",
  //   "NE",
  //   "NV",
  //   "NH",
  //   "NJ",
  //   "NM",
  //   "NY",
  //   "NC",
  //   "ND",
  //   "OH",
  //   "OK",
  //   "OR",
  //   "PA",
  //   "RI",
  //   "SC",
  //   "SD",
  //   "TN",
  //   "TX",
  //   "UT",
  //   "VT",
  //   "VA",
  //   "WA",
  //   "WV",
  //   "WI",
  //   "WY",
  // ];

  const {
    state: { isAuthenticated },
  } = useRequireAuth();

  const toggleModal = () => setShowModal(!showModal);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userResponse = await api.get(`/users/${params.uname}`);
        setUser(userResponse.data);

        setData({
          ...data,
          email: userResponse.data.email,
          zipcode: userResponse.data.zipcode,
          dogName: userResponse.data.dog.name,
          dogBreed: userResponse.data.dog.breed,
          dogSize: userResponse.data.dog.size,
        });
      } catch (err) {
        console.error(err.message);
      }
    };
    getUser();
  }, [params.uname]);

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
    if (
      event.target.name === "currentPassword" ||
      event.target.name === "password" ||
      event.target.name === "confirmPassword"
    ) {
      setPasswordChanged(true);
    }
  };

  const handleDogNameChange = (event) => {
    setData({
      ...data,
      dogName: event.target.value,
    });
  };

  const handleDogBreedChange = (event) => {
    setData({
      ...data,
      dogBreed: event.target.value,
    });
  };

  const handleDogSizeChange = (event) => {
    setData({
      ...data,
      dogSize: event.target.value,
    });
  };

  const handleUpdatePassword = async (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const form = document.getElementById("passwordForm"); // Add an ID to your form
    if (form && form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });

    try {
      const {
        user: { uid, username },
      } = state;
      console.log(data.password, uid, username);
      setValidated(false);

      // write code to call edit user endpoint 'users/:id'
      api
        .put(`/users/${username}`, {
          currentPassword: data.currentPassword,
          password: data.password,
          confirmPassword: data.confirmPassword,
        })
        .then((response) => {
          console.log("password correct", response.data);
          setData({
            ...data,
            isSubmitting: false,
            password: "",
            currentPassword: "",
            confirmPassword: "",
          });
          toast.success(
            `Without pain, without sacrifice, we would have nothing.`
          );
          //setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setData({
            ...data,
            isSubmitting: false,
            errorMessage: error.message,
          });
          toast.error("We strayed from the formula, and we paid the price.");
        });

      setData({
        ...data,
        isSubmitting: false,
        password: "",
        currentPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: error.message,
      });
    }
  };

  // const updateAvatar = async () => {
  //   try {
  //     const response = await api.put(`/users/${params.uname}/avatar`, {
  //       profile_image: profileImage,
  //     });
  //     console.log("Avatar Updated", response.data);
  //     setProfileImage(response.data.profile_image);
  //     setAvatarChanged(false);
  //     toast.success(`Successfully updated the Avatar`);
  //   } catch (error) {
  //     console.log("Error with Avatar upload", error);
  //     toast.error(`Error updating avatar: ${error.message}`);
  //   }
  // };
  const addDog = () => {
    setUserProfile({
      ...userProfile,
      dog: [...userProfile.dog, { name: "", breed: "", size: "" }],
    });
  };
  const deleteDog = (index) => {
    const updateDog = userProfile.dog.filter((_, i) => i !== index);
    setUserProfile({
      ...userProfile,
      dog: updateDog,
    });
  };

  const handleSubmitAll = async () => {
    const updatedUser = {
      ...user,
      email: data.email,
      zipcode: data.zipcode,
      dog: {
        ...user.dog,
        name: data.dogName,
        breed: data.dogBreed,
        size: data.dogSize,
      },
    };

    if (passwordChanged) {
      try {
        await handleUpdatePassword();
        setPasswordChanged(false);
      } catch (error) {
        // Handle password update error
      }
    }

    // if (avatarChanged) {
    //   try {
    //     await updateAvatar();
    //     setAvatarChanged(false);
    //   } catch (error) {
    //     // Handle avatar update error
    //   }
    // }

    try {
      await api.put(`/users/${params.uname}`, updatedUser);
      toast.success("Profile updated successfully");
      // If username is part of userDetails and it's changed, handle it appropriately
    } catch (error) {
      toast.error("Failed to update profile");
    }

    navigate(`/profile/u/${user.username}`); // Ensure user.username is updated if username changes
  };

  // if (!isAuthenticated) {
  //   return <LoadingSpinner full />;
  // }

  // if (loading) {
  //   return <LoadingSpinner full />;
  // }

  const handleShowUploadModal = (imageType) => {
    setUploadImageType(imageType); // Set the image type when showing the upload modal
    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
  };

  const handleUpload = async (path) => {
    try {
      const updatedUserData = { ...user };
  
      if (uploadImageType === "profile") {
        updatedUserData.profile_image = path; // Update profile image if type is "profile"
        await api.put(`/users/${params.uname}/avatar`, {
          profile_image: path,
        });
      } else if (uploadImageType === "dog") {
        updatedUserData.dog.images = [path]; // Update dog photo if type is "dog"
        await api.put(`/users/${params.uname}/dog/images`, {
          imgUrls: updatedUserData.dog.images,
        });
      }
  
      setUser(updatedUserData); // Update user state with the new photo URL
  
      // Update data state based on image type
      setData({
        ...data,
        profile_image: uploadImageType === "profile" ? path : data.profile_image,
        dogPhoto: uploadImageType === "dog" ? path : data.dogPhoto,
        profile_image_changed: uploadImageType === "profile",
        dogPhotoChanged: uploadImageType === "dog",
      });
  
      handleCloseUploadModal();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleProfileUpload = async (path) => {
    try {
      const updatedUserData = { ...user };
      updatedUserData.profile_image = path; // Update the profile image URL directly

      await api.put(`/users/${params.uname}/avatar`, {
        // Call the correct API endpoint for updating the profile image
        profile_image: path, // Send the profile image URL in the request body
      });

      setUser(updatedUserData); // Update the user state with the new photo URL

      setData({
        ...data,
        profile_image: path,
        profile_image_changed: true,
      });

      handleCloseUploadModal();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleAvatarSelection = (avatar) => {
    console.log("Selected Avatar:", avatar);
    setData({
      ...data,
      profile_image: avatar,
    });
    setShowAvatarOptions(false);
  };

  const handleBackToAvatarOptions = () => {
    setShowAvatarOptions(true);
  };
  const [showAvatarOptions, setShowAvatarOptions] = useState(true);
  //const [showUploadModal, setShowUploadModal] = useState(false);
  return (
    <>
      <Container fluid className="p-3" style={{ width: "50%" }}>
        <div className="text-center">
          <h1>Edit Profile</h1>
        </div>
        <Container animation="false">
          <Row>
            <Col>
              <Card className="mt-3 p-3">
                <Form>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      value={data.email}
                      onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mt-3" controlId="zipcode">
                    <Form.Label>Zip Code</Form.Label>
                    <Form.Control
                      type="text"
                      value={data.zipcode}
                      onChange={(e) =>
                        setData({ ...data, zipcode: e.target.value })
                      }
                    />
                  </Form.Group>
                </Form>
              </Card>
              <Card className="mt-3 p-3">
                <Form
                  id="passwordForm"
                  noValidate
                  validated={validated}
                  onSubmit={handleUpdatePassword}
                >
                  <Form.Group>
                    <Form.Label htmlFor="password">Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="currentPassword"
                      required
                      value={data.currentPassword}
                      onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Current Password is required
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mt-2">
                    <Form.Label htmlFor="password">New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      required
                      value={data.password}
                      onChange={handleInputChange}
                    />
                    <Form.Text id="passwordHelpBlock" muted>
                      Must be 8-20 characters long.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      Confirm Password is required
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mt-2">
                    <Form.Label htmlFor="password">
                      Confirm New Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      required
                      value={data.confirmPassword}
                      onChange={handleInputChange}
                    />
                    <Form.Text id="passwordHelpBlock" muted></Form.Text>
                    <Form.Control.Feedback type="invalid">
                      Confirm Password is required
                    </Form.Control.Feedback>
                  </Form.Group>

                  {data.errorMessage && (
                    <span className="form-error">{data.errorMessage}</span>
                  )}
                </Form>
              </Card>
            </Col>
            <Col>
              {showAvatarOptions ? (
                <>
                  {/* Avatar Picker */}
                  <Form.Group controlId="formAvatar" className="mt-3">
                    <Form.Label
                      style={{ fontWeight: "bold" }}
                      className="d-flex align-items-start"
                    >
                      Now one last thing, you can either choose an avatar:
                    </Form.Label>
                    <AvatarPicker
                      selectedAvatar={data.profile_image}
                      onSelectAvatar={handleAvatarSelection}
                      disabled={!!data.profile_image}
                    />
                  </Form.Group>

                  {/* Upload Button */}
                  <Form.Group controlId="formImg" className="mt-3">
                    <Form.Label
                      style={{ fontWeight: "bold" }}
                      className="d-flex align-items-start"
                    >
                      Or you can upload your own images here:
                    </Form.Label>
                    <Button
                      style={{ marginBottom: "20px" }}
                      variant="primary"
                      onClick={() => handleShowUploadModal("profile")}
                      className="mt-3"
                    >
                      Upload Profile Image
                    </Button>
                  </Form.Group>

                  {/* Upload Modal */}
                  <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>Upload File</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <UploadFile
                        onUpload={handleProfileUpload}
                        handleClose={handleCloseUploadModal}
                      />
                    </Modal.Body>
                  </Modal>
                </>
              ) : (
                <div className="mt-3">
                  <p style={{ fontWeight: "bold" }}>
                    Profile Image Chosen Successfully!
                  </p>
                  <img
                    src={data.profile_image}
                    alt="Chosen Avatar"
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                  <br />
                  <p style={{ fontWeight: "bold", marginTop: "20px" }}>
                    Want to choose a different image?
                  </p>

                  {/* Button to go back to avatar options */}
                  <Button
                    style={{ marginBottom: "20px" }}
                    variant="primary"
                    onClick={handleBackToAvatarOptions}
                  >
                    Edit Profile Image
                  </Button>
                </div>
              )}

              <Card className="mt-3 p-3">
                <Form>
                  <Form.Group controlId="dogName">
                    <Form.Label>Dog's Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={data.dogName}
                      onChange={handleDogNameChange}
                    />
                  </Form.Group>
                  <Form.Group className="mt-3" controlId="dogBreed">
                    <Form.Label>Dog's Breed</Form.Label>
                    <Form.Control
                      type="text"
                      value={data.dogBreed}
                      onChange={handleDogBreedChange}
                    />
                  </Form.Group>
                  <Form.Group className="mt-3" controlId="dogSize">
                    <Form.Label>Dog's Size</Form.Label>
                    <Form.Control
                      as="select"
                      name="size"
                      value={data.dogSize}
                      onChange={handleDogSizeChange}
                    >
                      <option value="">Select Size</option>
                      <option value="small">Small (22 lbs or less)</option>
                      <option value="medium">Medium (23 lbs - 57 lbs)</option>
                      <option value="large">Large (58 lbs or more)</option>
                    </Form.Control>
                  </Form.Group>
                </Form>
                <Form.Label className="mt-3">Dog's Photo</Form.Label>
                <Row className="justify-content-center">
                  <Col xs="auto">
                    <Button
                      className="m-3"
                      onClick={() => handleShowUploadModal("dog")}
                    >
                      Upload Dog Photo
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
        <div className="text-center m-3">
          <Button
            variant="secondary"
            style={{ border: "none", color: "white" }}
            onClick={handleSubmitAll}
          >
            Submit All
          </Button>
        </div>
      </Container>

      <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
        <Modal.Header closeButton>
        <Modal.Title>
      Upload {uploadImageType === "profile" ? "Profile" : "Dog"} Photo
    </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UploadFile
            handleClose={handleCloseUploadModal}
            onUpload={handleUpload}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditProfile;
