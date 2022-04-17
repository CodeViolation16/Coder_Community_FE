import React, { useEffect } from "react";
import { Card, Container } from "@mui/material";
import Profile from "../features/user/Profile";
import ProfileCover from "../features/user/ProfileCover";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../features/user/userSlice";
import LoadingScreen from "../components/LoadingScreen";
import { resetPosts } from "../features/post/postSlice";

function UserProfilePage() {
  const params = useParams();
  const userId = params.userId;
  const dispatch = useDispatch();
  const { selectedUser, isLoading } = useSelector((state) => state.user);

  useEffect(() => {
    if (userId) {
      dispatch(getUser(userId));
      dispatch(resetPosts());
    }
  }, [dispatch, userId]);

  return (
    <Container>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Card
            sx={{
              mb: 3,
              height: 280,
              position: "relative",
            }}
          >
            {selectedUser && <ProfileCover profile={selectedUser} />}
          </Card>
          {selectedUser && <Profile profile={selectedUser} />}
        </>
      )}
    </Container>
  );
}

export default UserProfilePage;
