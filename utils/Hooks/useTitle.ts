import { useEffect, useState } from "react";

const useTitle = ({
  notifSeen,
  chatSeen,
}: {
  notifSeen: boolean | undefined;
  chatSeen: boolean | undefined;
}) => {
  const defaultTitle = `${notifSeen ? "" : "(!)"} Anonylove`;
  const newMsgTitle = `${notifSeen ? "" : "(!)"} New Message!`;
  const [title, setTitle] = useState(defaultTitle);
  const notifTitle = chatSeen ? defaultTitle : newMsgTitle;

  useEffect(() => {
    let headTimer: NodeJS.Timer;
    headTimer = setInterval(() => {
      if (title === defaultTitle) {
        setTitle(chatSeen ? defaultTitle : newMsgTitle);
      } else {
        setTitle(defaultTitle);
      }
    }, 1000);

    if (notifSeen && chatSeen) {
      clearInterval(headTimer);
      setTitle(defaultTitle);
    }
    return () => clearInterval(headTimer);
  }, [chatSeen, notifSeen, defaultTitle, notifTitle, title]);

  return { title };
};

export default useTitle;
