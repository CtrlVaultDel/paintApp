## Basic information
This is a painting application

Functionality:
1. Canvas Size (1-100 for width and height)
2. Tools (Paint, Fill, Line, Box)
3. Sizes (Small, Medium, Large)
4. Colors (Black, White, Blue, Red, Green, Yellow)
5. Clear button with confirmation
6. Copy Canvas (note -> copied JSON to clipboard, must save to JSON file which can be inserted back into the program: #7)
7. Import Canvas (JSON)


## Get started

Install the dependencies...

1. cd paintApp
2. npm install
3. npm run dev
4. Navigate to [localhost:8080](http://localhost:8080). 

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

If you're using [Visual Studio Code](https://code.visualstudio.com/) we recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

## Building and running in production mode

To create and run an optimised version of the app:
1. npm run build
2. npm run start

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).