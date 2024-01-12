import React, { useState, useEffect } from "react";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  Input,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { fDate } from "../../utils/formatTime";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostReaction from "./PostReaction";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import { useSelector, useDispatch } from "react-redux";
import { deletePost, editPost, getPosts } from "./postSlice";
import { eachDayOfIntervalWithOptions } from "date-fns/fp";

import ConfirmationDialog from "./confirm";

function PostCard({ post, userId, page }) {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [input, setInput] = useState(false);
  const [text, setText] = useState(post.content);
  const handleOpenConfirmation = () => {
    setIsConfirmationOpen(true);
  };
  const handleCloseConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  const handleConfirmAction = () => {
    // Implement your logic for the confirmed action here
    // e.g., delete post, submit form, etc.
    // Then close the confirmation dialog
    setIsConfirmationOpen(false);
    deleteComment();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const dispatch = useDispatch();

  function deleteComment() {
    dispatch(deletePost(post._id));
    dispatch(getPosts({ userId, page }));
  }

  function edit() {
    dispatch(editPost(post._id, text));
    dispatch(getPosts({ userId, page }));
  }

  // useEffect(() => {
  //   window.addEventListener("keypress", edit);
  //   return () => {
  //     window.removeEventListener("keypress", edit);
  //   };
  // }, [])

  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={
          <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
        }
        title={
          <Link
            variant="subtitle2"
            color="text.primary"
            component={RouterLink}
            sx={{ fontWeight: 600 }}
            to={`/user/${post.author._id}`}
          >
            {post?.author?.name}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          <div>
            {input && (
              <div>
                <button onClick={() => edit()}>Submit</button>
                <button onClick={() => setInput(false)}>Cancel</button>{" "}
              </div>
            )}
            <IconButton sx={{ fontSize: 30 }} onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  /* Add your edit logic here */ handleClose();
                  setInput(true);
                }}
              >
                Edit
              </MenuItem>

              <MenuItem
                onClick={() => {
                  /* Add your delete logic here */
                  // deleteComment();
                  handleClose();
                  handleOpenConfirmation();
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </div>
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        {input ? (
          <Input
            value={text}
            onChange={(e) => {
              console.log(e);
              setText(e.target.value);
            }}
          />
        ) : (
          <Typography>{post.content}</Typography>
        )}

        {post.image && (
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: 300,
              "& img": { objectFit: "cover", width: 1, height: 1 },
            }}
          >
            <img src={post.image} alt="post" />
          </Box>
        )}

        <PostReaction post={post} />
        <CommentList postId={post._id} />
        <CommentForm postId={post._id} />
      </Stack>
      <div>
        {/* Your component content */}

        <ConfirmationDialog
          open={isConfirmationOpen}
          onClose={handleCloseConfirmation}
          onConfirm={handleConfirmAction}
          title="Confirmation"
        />
      </div>
    </Card>
  );
}

export default PostCard;
