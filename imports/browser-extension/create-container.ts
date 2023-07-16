import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from './package-name';
import { LinkName } from "./link-name";

/**
 * Creates a new container for the camera records.
 * @param {DeepClient} deep - The DeepClient object instance.
 * @returns {Promise<number>} A Promise that resolves with the ID of the new container.
 */
export async function createContainer(deep: DeepClient): Promise<number> {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain"); // Retrieve the link ID for the "Contain" type.
  const containerTypeLinkId = await deep.id(PACKAGE_NAME, "BrowserExtension"); // Retrieve the link ID for the "BrowserExtension" type.

  const { data: [{ id: containerLinkId = undefined } = {}] = [] } = await deep.select({ type_id: containerTypeLinkId }); // Check if a container link already exists for the "BrowserExtension" type.

  if (!containerLinkId) {
    const { data: [{ id: newContainerLinkId }] } = await deep.insert({
      type_id: containerTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: deep.linkId,
          string: { data: { value: "BrowserExtension" } },
        }
      }
    }); // Create a new container link for the "Camera" type.

    return newContainerLinkId; // Return the ID of the new container.
  } else {
    alert("Container link already exists!"); // If a container link already exists, show an alert.
    return containerLinkId; // Return the existing container link ID.
  }
}