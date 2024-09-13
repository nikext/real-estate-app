import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import apiRequest from "../../../../api/lib/apiRequest";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const { username, email, avatar } = currentUser || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      setError(null);
      const res = await apiRequest.put(`/users/${currentUser?.id}`, {
        username,
        email,
        password,
      });
      updateUser(res.data);
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
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
          {error && <p className="error">{error}</p>}
        </form>
      </div>
      <div className="sideContainer">
        <img src={avatar || "/noavatar.png"} alt="" className="avatar" />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
