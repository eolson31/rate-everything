import { NextResponse } from "next/server";
import { json } from "stream/consumers";

// Server Side Event
type SSEClient = {
    send: (data: string) => void;
    close: () => void;
}

let clients: SSEClient[] = [];

export function GET(request: Request) {
    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();
            const send = (data : string) => {
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            };

            // Register client when it connects
            const client: SSEClient = {
                send,
                close: () => controller.close()
            }
            clients.push(client);

            // Initial ping
            send(JSON.stringify({ message: 'connected' }));

            // Remove client when it disconnects
            request.signal.addEventListener('abort', () => {
                clients = clients.filter((client) => client.send !== send);
                controller.close()
            });
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
        },
    });
}

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
