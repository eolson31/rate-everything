export type Client = {
    send: (data: any) => void;
    close: () => void;
}

export const clients: Client[] = [];

// Update all clients
export function broadcast(data: any) {
    const message = JSON.stringify(data);
    for (const client of clients) {
        try {
            client.send(message);
        } catch (error) {
            console.error("Failed to send message to client", error);
        }
    }
}