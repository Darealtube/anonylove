import { TabPanel } from "@mui/lab";
import { Container } from "@mui/material";
import Head from "next/head";
import Tabs from "../../Components/Requests/Tabs";
import dynamic from "next/dynamic";

const RequestTab = dynamic(
  () => import("../../Components/Requests/Tabs/RequestTab")
);
const YourRequestTab = dynamic(
  () => import("../../Components/Requests/Tabs/YourRequestTab")
);

const Requests = () => {
  return (
    <>
      <Head>
        <title>AnonyLove | Home</title>
        <meta name="description" content="Face the Fear of Confession" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container sx={{ height: "100%", pt: 4, pb: 4 }}>
        <Tabs>
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
        </Tabs>
      </Container>
    </>
  );
};

export default Requests;
