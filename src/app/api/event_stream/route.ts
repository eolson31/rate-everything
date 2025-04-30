import { Client, clients } from "./server_side_events";

export function GET(request: Request) {
    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();
            const send = (data : string) => {
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            };

            // Register client when it connects
            const client: Client = {
                send,
                close: () => controller.close()
            }
            clients.push(client);

            // Initial ping
            send(JSON.stringify({ message: 'connected' }));

            // Remove client when it disconnects
            request.signal.addEventListener('abort', () => {
                const index = clients.indexOf(client);
                clients.splice(index, 1);
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
