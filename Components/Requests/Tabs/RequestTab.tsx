import React, { useState } from "react";
import dynamic from "next/dynamic";
import { GetUserResult, GetUserVariables } from "../../../types/Queries";
import { GET_USER_RECEIVED_REQUESTS } from "../../../apollo/query/userQuery";
import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";
import { Box, CircularProgress } from "@mui/material";

const RequestList = dynamic(() => import("../Lists/RequestList"));
const DeleteDialog = dynamic(
  () => import("../../Wrapper/Dialogs/DeleteRequestDialog")
);
const AcceptDialog = dynamic(
  () => import("../../Wrapper/Dialogs/AcceptRequestDialog")
);

//  Set parameter "requests" as optional for now
const RequestTab = () => {
  const { data: session } = useSession();
  const {
    data: { getUser } = {},
    fetchMore: moreRequests,
    loading,
  } = useQuery<GetUserResult, GetUserVariables>(GET_USER_RECEIVED_REQUESTS, {
    variables: {
      name: session?.user?.name as string,
      limit: 10,
    },
    skip: !session,
  });
  const [openDelete, setOpenDelete] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [targetId, setTargetId] = useState("");

  const handleCloseDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.value === "accept") {
      setTargetId("");
      setOpenAccept(false);
    } else {
      setTargetId("");
      setOpenDelete(false);
    }
  };

  const handleOpenDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.value === "accept") {
      setTargetId(e.currentTarget.id);
      setOpenAccept(true);
    } else {
      setTargetId(e.currentTarget.id);
      setOpenDelete(true);
    }
  };

  return (
    <>
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <RequestList
          requests={getUser?.receivedConfessionRequests}
          moreRequests={moreRequests}
          handleOpenDialog={handleOpenDialog}
          hasActiveChat={Boolean(getUser?.activeChat)}
        />
      )}

      <DeleteDialog
        open={openDelete}
        handleClose={handleCloseDialog}
        requestID={targetId}
      />
      <AcceptDialog
        open={openAccept}
        handleClose={handleCloseDialog}
        requestID={targetId}
      />
    </>
  );
};

export default RequestTab;
