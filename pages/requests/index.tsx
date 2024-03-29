import { useQuery } from "@apollo/client";
import { TabContext, TabList } from "@mui/lab";
import { Box, CircularProgress, Container, Tab } from "@mui/material";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, SyntheticEvent } from "react";
import { GET_PROFILE_RECEIVED_REQUESTS } from "../../apollo/query/userQuery";
import { AnonyTabs } from "../../Components/Style/AppWrap/AnonyTabs";
import { GetProfileResult, GetProfileVariables } from "../../types/Queries";

const RequestList = dynamic(
  () => import("../../Components/Requests/Lists/RequestList")
);
const DeleteDialog = dynamic(
  () => import("../../Components/Requests/Dialogs/DeleteRequestDialog")
);
const AcceptDialog = dynamic(
  () => import("../../Components/Requests/Dialogs/AcceptRequestDialog")
);

const Requests = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    data: { getProfile } = {},
    fetchMore: moreRequests,
    loading,
  } = useQuery<GetProfileResult, GetProfileVariables>(
    GET_PROFILE_RECEIVED_REQUESTS,
    {
      variables: {
        profileId: session?.user?.id as string,
        limit: 10,
      },
      skip: !session,
    }
  );
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

  const handleTabChange = (
    _event: SyntheticEvent<Element, Event>,
    tab: string
  ) => {
    router.push(tab);
  };

  return (
    <>
      <Container sx={{ height: "100%", pt: 4, pb: 4 }}>
        <TabContext value={router.pathname}>
          <AnonyTabs>
            <TabList onChange={handleTabChange} centered>
              <Tab
                label="Requests"
                value="/requests"
                sx={{ color: "#f6f7f8" }}
              />
              <Tab
                label="Your Requests"
                value="/requests/yourRequests"
                sx={{ color: "#f6f7f8" }}
              />
            </TabList>
          </AnonyTabs>
        </TabContext>

        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <RequestList
            requests={getProfile?.receivedConfessionRequests}
            moreRequests={moreRequests}
            handleOpenDialog={handleOpenDialog}
            hasActiveChat={Boolean(getProfile?.activeChat)}
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
      </Container>
    </>
  );
};

export default Requests;
