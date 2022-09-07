import { useQuery } from "@apollo/client";
import { TabContext, TabList } from "@mui/lab";
import { Box, CircularProgress, Container, Tab } from "@mui/material";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, SyntheticEvent } from "react";
import { GET_PROFILE_SENT_REQUESTS } from "../../apollo/query/userQuery";
import { AnonyTabs } from "../../Components/Style/AppWrap/AnonyTabs";
import { GetProfileResult, GetProfileVariables } from "../../types/Queries";

const YourRequestList = dynamic(
  () => import("../../Components/Requests/Lists/YourRequestList")
);
const DeleteDialog = dynamic(
  () => import("../../Components/Requests/Dialogs/DeleteRequestDialog")
);

const YourRequests = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    data: { getProfile } = {},
    fetchMore: moreRequests,
    loading,
  } = useQuery<GetProfileResult, GetProfileVariables>(
    GET_PROFILE_SENT_REQUESTS,
    {
      variables: {
        profileId: session?.user?.id as string,
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
          <Box display="flex" justifyContent="center" alignItems="center">
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
      </Container>
    </>
  );
};

export default YourRequests;
