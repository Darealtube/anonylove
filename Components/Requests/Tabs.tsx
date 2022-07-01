import { TabContext, TabList } from "@mui/lab";
import { Tab } from "@mui/material";
import { useState, SyntheticEvent, ReactNode } from "react";
import { AnonyTabs } from "../Style/AppWrap/AnonyTabs";

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
        <AnonyTabs>
          <TabList onChange={handleTabChange} centered>
            <Tab label="Requests" value="request" sx={{ color: "#f6f7f8" }} />
            <Tab
              label="Your Requests"
              value="yourRequest"
              sx={{ color: "#f6f7f8" }}
            />
          </TabList>
        </AnonyTabs>
        {children}
      </TabContext>
    </>
  );
};

export default Tabs;
