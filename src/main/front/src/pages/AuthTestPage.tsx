import { useState } from "react";
import useAuthStore from "../store/authStore";
import { useFetchBe } from "../tools/api";

function AuthTestPage() {
  const { jwtToken, refreshToken, setJwtToken, setRefreshToken } =
    useAuthStore();

  const [newJwtToken, setNewJwtToken] = useState(jwtToken || "");
  const [newRefreshToken, setNewRefreshToken] = useState(refreshToken || "");
  const [myInfo, setMyInfo] = useState(null);

  const fetchBe = useFetchBe();

  console.log("AuthTestPage jwtToken:", jwtToken);
  return (
    <div>
      <h1>Test Page</h1>
      <p>JWT Token: {jwtToken}</p>
      <p>Refresh Token: {refreshToken}</p>
      <div>
        {/* Input of new jwt token and refresh token */}
        <input
          type="text"
          placeholder="New JWT Token"
          value={newJwtToken}
          onChange={(e) => setNewJwtToken(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Refresh Token"
          value={newRefreshToken}
          onChange={(e) => setNewRefreshToken(e.target.value)}
        />
        <button
          onClick={() => {
            setJwtToken(newJwtToken);
            setRefreshToken(newRefreshToken);
          }}
        >
          Update Tokens
        </button>
      </div>
      <div>
        {/* Get My Info */}
        <button
          onClick={async () => {
            try {
              const info = await fetchBe("/v1/user/profile", {
                onUnauthorized: () => {},
              });
              setMyInfo(info);
            } catch (error) {
              console.error("Error fetching my info:", error);
            }
          }}
        >
          Get My Info
        </button>
        {myInfo && (
          <div>
            <h2>My Info</h2>
            <pre>{JSON.stringify(myInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthTestPage;
