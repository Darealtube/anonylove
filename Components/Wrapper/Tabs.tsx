import { TabContext, TabList } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useState, SyntheticEvent, ReactNode } from "react";
import styles from "../../styles/AppWrap.module.css";

const Tabs = ({
  children,
  hasActiveChat,
}: {
  children: ReactNode;
  hasActiveChat: boolean;
}) => {
  const [tab, setTab] = useState("chat");
  const handleTabChange = (
    _event: SyntheticEvent<Element, Event>,
    tab: string
  ) => {
    setTab(tab);
  };

  return (
    <>
      <TabContext value={tab}>
        <Box sx={{ borderColor: "divider" }} className={styles.tabs}>
          <TabList onChange={handleTabChange} centered>
            <Tab label="Chats" value="chat" />
            <Tab label="Requests" value="request" disabled={hasActiveChat} />
          </TabList>
        </Box>
        {children}
      </TabContext>
    </>
  );
};

export default Tabs;
