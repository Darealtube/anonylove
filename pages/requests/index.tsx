import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Container, Tab } from "@mui/material";
import dynamic from "next/dynamic";
import { useState, SyntheticEvent } from "react";
import { AnonyTabs } from "../../Components/Style/AppWrap/AnonyTabs";

const RequestTab = dynamic(
  () => import("../../Components/Requests/Tabs/RequestTab")
);
const YourRequestTab = dynamic(
  () => import("../../Components/Requests/Tabs/YourRequestTab")
);

const Requests = () => {
  const [tab, setTab] = useState("request");
  const handleTabChange = (
    _event: SyntheticEvent<Element, Event>,
    tab: string
  ) => {
    setTab(tab);
  };
  return (
    <>
      <Container sx={{ height: "100%", pt: 4, pb: 4 }}>
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
          <TabPanel value="request">
            <Container sx={{ zIndex: 1 }}>
              <RequestTab />
            </Container>
          </TabPanel>

          <TabPanel value="yourRequest">
            <Container sx={{ zIndex: 1 }}>
              <YourRequestTab />
            </Container>
          </TabPanel>
        </TabContext>
      </Container>
    </>
  );
};

export default Requests;
