import { getLinkId } from "./get-link-id.js"

const prepareInsertTabsVariables = async (tabs, PACKAGE_NAME, CONTAINER_LINK_ID) => {
  const containTypeLinkId = await getLinkId(GQL_URL, GQL_TOKEN, "@deep-foundation/core", "Contain");
  const browserExtensionLinkId = CONTAINER_LINK_ID;
  const tabTypeLinkId = await getLinkId(GQL_URL, GQL_TOKEN, PACKAGE_NAME, "Tab");
  const urlTypeLinkId = await getLinkId(GQL_URL, GQL_TOKEN, PACKAGE_NAME, "TabUrl");
  const titleTypeLinkId = await getLinkId(GQL_URL, GQL_TOKEN, PACKAGE_NAME, "TabTitle");
  const activeTypeLinkId = await getLinkId(GQL_URL, GQL_TOKEN, PACKAGE_NAME, "Active");
  const links = tabs.map((tab) => ({
    type_id: tabTypeLinkId,
    number: { data: { value: tab.id } },
    in: {
      data: [
        {
          type_id: containTypeLinkId,
          from_id: browserExtensionLinkId,
        },
      ],
    },
    out: {
      data: [
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: urlTypeLinkId,
              string: { data: { value: tab.url } },
            },
          },
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: titleTypeLinkId,
              string: { data: { value: tab.title } },
            },
          },
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: activeTypeLinkId,
              string: { data: { value: tab.active ? "true" : "false" } },
            },
          },
        },
      ],
    },

  }));

  return links;
};

const insertTabs = async (newTabs, GQL_URL, GQL_TOKEN) => {
  const requestPayload = {
    query: `
      mutation InsertLinks($links: [links_insert_input!]!) {
        insert_links(objects: $links) {
          returning {
            id
          }
        }
      }
      `,
    variables: { links: newTabs },
  };

  const response = await fetch(GQL_URL, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Authorization": `Bearer ${GQL_TOKEN}`,
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(requestPayload),
  });
  const responseData = await response.json();
  return responseData.data;
};

export const executeInsertTabs = async (tabs, GQL_URL, GQL_TOKEN, PACKAGE_NAME, CONTAINER_LINK_ID) => {
  const tabsData = await prepareInsertTabsVariables(tabs, PACKAGE_NAME, CONTAINER_LINK_ID);
  const existingTabs = await checkExistingTabs(tabs, PACKAGE_NAME);

  const newTabs = tabsData.filter(
    (tab) => !existingTabs.some((existingTab) => existingTab.number.value === tab.number.data.value)
  );
  console.log({ newTabs })
  if (newTabs.length) {
    await insertTabs(newTabs, GQL_URL, GQL_TOKEN);
  } else {
    console.log("No new tabs to insert.");
  }
};

const checkExistingTabs = async (tabs, PACKAGE_NAME, GQL_URL, GQL_TOKEN) => {
  const tabIds = tabs.map((tab) => tab.id);
  const tabTypeLinkId = await getLinkId(GQL_URL, GQL_TOKEN, PACKAGE_NAME, "Tab");

  const requestPayload = {
    query: `
      query getTabsByIds($tabIds: [bigint!]) {
        links(where: {type_id: {_eq: ${tabTypeLinkId}}, number: {value: {_in: $tabIds}}}) {
          number {
            value
          }
        }
      }
    `,
    variables: {
      tabIds: tabIds,
    },
  };

  const response = await fetch(GQL_URL, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Authorization": `Bearer ${GQL_TOKEN}`,
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(requestPayload),
  });

  const responseData = await response.json();
  return responseData.data.links;
};