import { TabContext, TabList } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useState, SyntheticEvent, ReactNode } from "react";
import styles from "../../styles/AppWrap.module.css";

const Tabs = ({ children }: { children: ReactNode }) => {
  const [tab, setTab] = useState("request");
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
            <Tab label="Requests" value="request" sx={{ color: "#f6f7f8" }} />
            <Tab
              label="Your Requests"
              value="yourRequest"
              sx={{ color: "#f6f7f8" }}
            />
          </TabList>
        </Box>
        {children}
      </TabContext>
    </>
  );
};

export default Tabs;
