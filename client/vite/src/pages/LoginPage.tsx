import { useContext } from "react";
import AuthContext from "../context/AuthContext";

import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);
  return (
    <div>
      <form onSubmit={loginUser}>
        <MDBContainer fluid className="p-3 my-5">
          <MDBRow>
            <MDBCol col="10" md="6">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                className="img-fluid"
                alt="Phone image"
              />
            </MDBCol>

            <MDBCol col="4" md="5">
              <MDBInput
                wrapperClass="mb-4"
                label="email"
                name="email"
                id="formControlLg"
                type="text"
                size="lg"
                style={{ backgroundColor: "white", color: "black" }}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                name="password"
                id="formControlLg"
                type="password"
                size="lg"
                style={{ backgroundColor: "white", color: "black" }}
              />
              <div className="d-flex justify-content-between mx-4 mb-4">
                <MDBCheckbox
                  name="flexCheck"
                  value=""
                  id="flexCheckDefault"
                  label="Remember me"
                  style={{ color: "white" }}
                />
                <a href="!#">Forgot password?</a>
              </div>
              <MDBBtn className="mb-4 w-100" size="lg">
                Sign in
              </MDBBtn>
              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0" style={{  color: "white" }}>OR</p>
              </div>
              <MDBBtn
                className="mb-4 w-100"
                size="lg"
                style={{ backgroundColor: "#3b5998" }}
              >
                <MDBIcon fab icon="facebook-f" className="mx-2" />
                Continue with facebook
              </MDBBtn>
              <MDBBtn
                className="mb-4 w-100"
                size="lg"
                style={{ backgroundColor: "#55acee" }}
              >
                <MDBIcon fab icon="twitter" className="mx-2" />
                Continue with twitter
              </MDBBtn >
              <a style={{  color: "white" }}>Don't have an account?</a> <a href="/signup">SignUp</a>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </form>
    </div>
  );
};

export default LoginPage;
