import React, { useEffect } from 'react';
import { Button, Text, Stack, Input } from '@chakra-ui/react';
import { PACKAGE_NAME } from '../package-name';
import { useContainer } from '../hooks/use-container';

export function BrowserExtension({deep}) {

  const containerLinkId = useContainer(deep);

  useEffect(() => {
    chrome.storage.sync.set({ CONTAINER_LINK_ID: containerLinkId, PACKAGE_NAME: PACKAGE_NAME, GQL_URL: `https://${process.env.NEXT_PUBLIC_GQL_PATH}`, GQL_TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYWRtaW4iXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYWRtaW4iLCJ4LWhhc3VyYS11c2VyLWlkIjoiMzc2In0sImlhdCI6MTY3OTkzNTMyOH0.LmDNulSTSSrm7gKno3E1sBLAhz5TKi-SFBl9oFNfs-k" },
      () => { console.log("Settings saved"); });
  }, [])

  // const getTabs = async () => {
  //   if (typeof (window) === "object") {
  //     const tabs = await chrome.tabs.query({});
  //     setTabs(tabs);
  //   }
  // }

  // const getHistory = async () => {
  //   if (typeof (window) === "object") {
  //     const history = await chrome.history.search({ text: '', maxResults: 10 });
  //     setHistory(history);
  //   }
  // }

  // useEffect(() => {
  //   const upload = async (tabs) => {
  //     await uploadTabs(deep, containerLinkId, tabs);
  //     setTabs([]);
  //   }
  //   if (tabs.length > 0) upload(tabs);
  // }, [tabs])

  // useEffect(() => {
  //   const upload = async (history) => {
  //     await uploadHistory(deep, containerLinkId, history);
  //     setHistory([]);
  //   }
  //   if (history.length > 0) upload(history);
  // }, [history])

  const handleUploadHistory = () => {
    chrome.runtime.sendMessage({ action: "uploadHistory" });
  };

  const handleUploadTabs = () => {
    chrome.runtime.sendMessage({ action: "uploadTabs" });
  };

  return (
    <>
      <Stack>
        <Text suppressHydrationWarning>CONTAINER LINK ID: {containerLinkId ?? " "}
        </Text>
        <Button onClick={handleUploadHistory}>UPLOAD HISTORY</Button>
        <Button onClick={handleUploadTabs}>SUBSCRIBE TABS</Button>
      </Stack>
      <Stack spacing={3}>
        <Input placeholder='extra small size' size='sm' />
        <Input placeholder='extra small size' size='sm' />
      </Stack>
      {/* {tabs?.map((tab) => (<Tab type="tab" key={tab.id} id={tab.id} favIconUrl={tab.favIconUrl} title={tab.title} url={tab.url} />))} */}
    </>
  )
}

