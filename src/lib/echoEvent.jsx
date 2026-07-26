export function connectRealtimeStore(getStore, setStore, options = {}) {
    const { channelName, modelType } = options;

    if (typeof window === "undefined" || !window.Echo || !channelName || !modelType) return;

    window.Echo.private(channelName)
        .listen('.model.broadcasted', (event) => {
            if (event.model_type !== modelType) return;

            const eventData = event.data ?? {};
            const eventId = event.id ?? eventData.id;
            const currentItems = typeof getStore === "function" ? getStore() : [];
            const safeItems = Array.isArray(currentItems) ? currentItems : [];

            switch (event.action) {
                case 'created':
                    setStore([...safeItems, eventData]);
                    break;

                case 'updated':
                    if (eventId == null) return;
                    setStore(
                        safeItems.map((item) =>
                            item.id === eventId ? { ...item, ...eventData } : item
                        )
                    );
                    break;

                case 'deleted':
                    if (eventId == null) return;
                    setStore(safeItems.filter((item) => item.id !== eventId));
                    break;
            }
        });
}

export function disconnectRealtimeStore(channelName) {
    if (typeof window !== "undefined" && window.Echo?.leave) {
        window.Echo.leave(channelName);
    }
}