# Expressjs template

This template is being used for the HZ HBO-ICT classes about microservices. In order to work with this template please take the following steps:

1. Install or update Node and NPM. For Windows users you might consider [Chocolaty](https://chocolatey.org) and for Mac users obviously [Brew](https://brew.sh). These are both package managers that will help you install and update all kinds of packages via the CLI. Highly recommended.
2. Clone this repo and open to the newly created folder
3. Run `npm install` to install all the packages mentioned in package.json
4. Run `npm run dev` to start the server.
5. Open your browser and go to `localhost:3010` and you will see 'hi' formatted as JSON

One note on running the command `npm run dev`. We use nodemon to monitor the node server and to restart the server automatically. If we use `node start.js` we have to restart the server ourselves. You could install the nodemon package globally, but in this repo we installed it locally. On Windows it might be a problem to execute the `npm run dev` command because of some security reasons. You probably have to execute the following command `Set-ExecutionPolicy RemoteSigned`. If you want to learn more about these policies please read the [Microsoft documentation](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-7.2).

## Modules

We use ES6 module system to import and export modules.

## Variables.env

We save credentials to other services in a `variables.env` file. This file is included in this template. However, it is common use not to include it in a public repository. There are some default key value pairs included to demonstrate its working.

## Ports

You can change the ports of your server via `variables.env`
