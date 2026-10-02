const ngrok = require("@ngrok/ngrok");

async function forwardToApp() {
    const forwarder = await ngrok.forward({
        addr: "localhost:8085",
        authtoken_from_env: false,
        authtoken: "3Ix2woOBCbadr6xhstUV87jTt75_NCcsZmMmQZf89BFQR71t",
        domain: "elevating-humbly-starry.ngrok-free.dev",
    });
    console.log(`Available at: ${forwarder.url()}`);
}

forwardToApp();
