import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { GetUserResult, GetUserVariables } from "../../../types/Queries";
import { GET_USER_SENT_REQUESTS } from "../../../apollo/query/userQuery";
import { useSession } from "next-auth/react";
import { useQuery, useSubscription } from "@apollo/client";
import { NEW_SENT_REQUEST_SUBSCRIPTION } from "../../../apollo/subscription/messageSub";
import { NewSentRequestData } from "../../../types/Subscriptions";

const YourRequestList = dynamic(() => import("../Lists/YourRequestList"));
const DeleteDialog = dynamic(() => import("../Dialogs/DeleteRequestDialog"));

//  Set parameter "requests" as optional for now
const YourRequestTab = () => {
  const { data: session } = useSession();
  const { data } = useSubscription(NEW_SENT_REQUEST_SUBSCRIPTION);
  const {
    data: { getUser } = {},
    fetchMore: moreRequests,
    subscribeToMore,
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

  useEffect(() => {
    /* subscribeToMore({
      document: NEW_SENT_REQUEST_SUBSCRIPTION,
      updateQuery: (
        prev,
        { subscriptionData }: { subscriptionData: NewSentRequestData }
      ) => {
        if (!subscriptionData.data) return prev;
        const newRequest = subscriptionData.data.newSentRequest;

        const idAlreadyExists =
          prev?.getUser?.sentConfessionRequests?.edges.filter((item) => {
            return item.node._id === newRequest._id;
          }).length > 0;

        if (!idAlreadyExists) {
          return Object.assign({}, prev, {
            getUser: {
              ...prev?.getUser,
              sentConfessionRequests: {
                ...prev?.getUser?.sentConfessionRequests,
                edges: [
                  { _typename: "RequestEdge", node: newRequest },
                  ...prev?.getUser?.sentConfessionRequests?.edges,
                ],
              },
            },
          });
        } else {
          return prev;
        }
      },
    }); */
  }, [subscribeToMore]);

  return (
    <>
      {getUser?.sentConfessionRequests && (
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
