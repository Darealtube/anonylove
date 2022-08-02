import { useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext } from "react";
import {
  ACCEPT_END_CHAT_REQUEST,
  END_CHAT_REQUEST,
} from "../../apollo/mutation/chatMutation";
import { ErrorContext } from "../ErrorProvider";
import { AnonyButton } from "../Style/Global/AnonyButton";

const EndButton = ({
  requestLatest,
  chatId,
  confessedTo,
  attempts,
}: {
  requestLatest: boolean | undefined;
  chatId: string | undefined;
  confessedTo: boolean;
  attempts: number | undefined;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const errorHandler = useContext(ErrorContext);
  const [requestEndChat] = useMutation(END_CHAT_REQUEST, {
    onError: (err) => errorHandler(err.message),
  });
  const [autoAcceptEndChat] = useMutation(ACCEPT_END_CHAT_REQUEST, {
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
        anonymous: confessedTo ? false : true,
        sender: session?.user?.id,
      },
    });
  };

  const autoAcceptEnd = () => {
    autoAcceptEndChat();
  };

  const buttonOp = attempts === 3 ? autoAcceptEnd : requestEnd;

  return (
    <>
      <AnonyButton
        onClick={buttonOp}
        disabled={requestLatest}
        sx={{ color: "white" }}
      >
        End Chat
      </AnonyButton>
    </>
  );
};

export default EndButton;
