import React, { useState } from "react";
import dynamic from "next/dynamic";
import { GetUserResult, GetUserVariables } from "../../../types/Queries";
import { GET_USER_SENT_REQUESTS } from "../../../apollo/query/userQuery";
import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";
import { Box, CircularProgress } from "@mui/material";

const YourRequestList = dynamic(() => import("../Lists/YourRequestList"));
const DeleteDialog = dynamic(() => import("../../Wrapper/Dialogs/DeleteRequestDialog"));

//  Set parameter "requests" as optional for now
const YourRequestTab = () => {
  const { data: session } = useSession();
  const {
    data: { getUser } = {},
    fetchMore: moreRequests,
    loading,
  } = useQuery<GetUserResult, GetUserVariables>(GET_USER_SENT_REQUESTS, {
    variables: {
      name: session?.user?.name as string,
      limit: 10,
    },
  });
  const [openDelete, setOpenDelete] = useState(false);
  const [targetId, setTargetId] = useState("");

  const handleCloseDialog = () => {
    setTargetId("");
    setOpenDelete(false);
  };

  const handleOpenDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTargetId(e.currentTarget.id);
    setOpenDelete(true);
  };

  return (
    <>
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <YourRequestList
          requests={getUser?.sentConfessionRequests}
          moreRequests={moreRequests}
          handleOpenDialog={handleOpenDialog}
        />
      )}

      <DeleteDialog
        open={openDelete}
        handleClose={handleCloseDialog}
        requestID={targetId}
      />
    </>
  );
};

export default YourRequestTab;
