import React, { useEffect, useState } from 'react';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { createContainer } from '../create-container';

// Hook to manage the container link for audio records.
// Parameters:
// - deep: The DeepClient object used for communication.
// Returns: The container link ID.
export const useContainer = (deep: DeepClient) => {
    const [containerLinkId, setContainerLinkId] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (!containerLinkId) {
            const initializeContainerLink = async () => {
                setContainerLinkId(await createContainer(deep)); // Create a new container for audio records and set the container link ID.
            };
            initializeContainerLink(); // Initialize the container link.
        }
    }, [deep]);
    console.log(containerLinkId);
    return containerLinkId as number; // Return the container link ID.
};