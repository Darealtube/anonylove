import React, { useState } from "react";
import dynamic from "next/dynamic";
import { GetProfileResult, GetProfileVariables } from "../../../types/Queries";
import { GET_PROFILE_SENT_REQUESTS } from "../../../apollo/query/userQuery";
import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";
import { Box, CircularProgress } from "@mui/material";

const YourRequestList = dynamic(() => import("../Lists/YourRequestList"));
const DeleteDialog = dynamic(
  () => import("../../Wrapper/Dialogs/DeleteRequestDialog")
);

//  Set parameter "requests" as optional for now
const YourRequestTab = () => {
  const { data: session } = useSession();
  const {
    data: { getProfile } = {},
    fetchMore: moreRequests,
    loading,
  } = useQuery<GetProfileResult, GetProfileVariables>(
    GET_PROFILE_SENT_REQUESTS,
    {
      variables: {
        id: session?.user?.id as string,
        limit: 10,
      },
    }
  );
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
          requests={getProfile?.sentConfessionRequests}
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
