import { useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext } from "react";
import {
  ACCEPT_END_CHAT_REQUEST as FORCE_END_CHAT,
  END_CHAT_REQUEST,
} from "../../apollo/mutation/chatMutation";
import { ChatStatus } from "../../types/models";
import { ErrorContext } from "../ErrorProvider";
import { AnonyButton } from "../Style/Global/AnonyButton";

const EndButton = ({
  chatStatus,
  chatId,
}: {
  chatStatus: ChatStatus;
  chatId: string | undefined;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const errorHandler = useContext(ErrorContext);
  const [requestEndChat] = useMutation(END_CHAT_REQUEST, {
    onError: (err) => errorHandler(err.message),
  });
  // IF THE OTHER PERSON HAS REJECTED THE REQUEST A THIRD TIME, THE NEXT REQUEST IS FORCEDLY ACCEPTED
  // THIS IS IN ORDER TO HANDLE THE EVENTS OF HARASSMENT BETWEEN PEOPLE
  const [forceEndChat] = useMutation(FORCE_END_CHAT, {
    variables: { chat: chatId },
    onError: (err) => errorHandler(err.message),
    onCompleted: () => {
      router.replace("/reveal");
    },
  });

  const requestEnd = () => {
    requestEndChat({
      variables: {
        chat: chatId,
        requester: session?.user?.id,
      },
    });
  };

  const autoAcceptEnd = () => {
    forceEndChat();
  };

  const buttonOp = chatStatus.endAttempts === 3 ? autoAcceptEnd : requestEnd;

  return (
    <>
      <AnonyButton
        onClick={buttonOp}
        disabled={chatStatus.endRequesting || chatStatus.chatEnded}
        sx={{ color: "white" }}
      >
        End Chat
      </AnonyButton>
    </>
  );
};

export default EndButton;
