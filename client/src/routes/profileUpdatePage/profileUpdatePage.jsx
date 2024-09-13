import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const { username, email, avatar } = currentUser?.user || {};
  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" defaultValue={email} />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button>Update</button>
        </form>
      </div>
      <div className="sideContainer">
        <img src={avatar || "/noavatar.png"} alt="" className="avatar" />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
