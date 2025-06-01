import { useState } from "react";
import useAuthStore from "../store/authStore";
import { useFetchBe } from "../tools/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function AuthTestPage() {
  const { jwtToken, refreshToken, setJwtToken, setRefreshToken } =
    useAuthStore();

  const [newJwtToken, setNewJwtToken] = useState(jwtToken || "");
  const [newRefreshToken, setNewRefreshToken] = useState(refreshToken || "");

  const fetchBe = useFetchBe();

  const queryClient = useQueryClient();
  const { data: myData } = useQuery({
    queryKey: ["myData"],
    queryFn: () => fetchBe("/v1/user/profile"),
  });

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
              await queryClient.invalidateQueries({ queryKey: ["myData"] });
            } catch (error) {
              console.error("Error fetching my data:", error);
            }
          }}
        >
          Get My Info
        </button>
        {myData && (
          <div>
            <h2>My Info</h2>
            <pre>{JSON.stringify(myData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthTestPage;
