# 🚀📦 Tappy Tanks 🔋🚀

A Multiplayer Tanks Game built with Babylon.js, Node.js, Socket.io & Webpack and Typescript.

Mobile controls using custom HTML tags and ➡️⬅️⬆️⬇️ movement controls on desktop.

![Multiplayer Web Tanks Game](/screenshot.jpeg)

## Installation

-  Create a .env file in the root of the project and populate it with the following variables from .env.example

```bash
PORT='3030' # used for webpack-dev-server or node serve $PORT
API_URI='http://localhost:3000' # uses for api requests such as /session etc. recommend using private IP for local-network testing
API_WS_URI='ws://localhost:3000' # uses for connecting to ws server, recommend using private IP for local-network testing
```

-  Installation

```bash
npm i
```

## Usage

```bash
npm run dev
```

Server will be available at localhost:$PORT or localhost:3030 by default

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

