# Project: persistence-service

## Goal

This project is here to demonstrate various topics covered in SENG8070. There
are many branches in this project and each of them will cover a different topic.

## Getting started

### Requirements

You will need NPM and Node installed on your local machine. It is highly
recommended that you use a environment manager. The environment manager will
prevent pollution of your local system.

#### Quickest Way

This can take some time to setup and understand how to use. For the quickest
start, navigate to the [Download Page of Nodejs](https://nodejs.org/en/download/),
download the correct package for your system, and install.

#### Industry Standard Way

##### Linux/macOs

I highly recommend [NVM](https://github.com/nvm-sh/nvm).
Read about the details on the NVM project page.

###### Windows

Setting up development for Windows is a little bit more complicated. There are
three (3) pieces of technology you will most likely need:

1. terminal
2. SSH
3. git

For the terminal, I would recommend zsh or bash. Here is a tutorial on [setting
up zsh on your Windows Machine](https://dev.to/zinox9/installing-zsh-on-windows-37em).

On top of that, you will likely need to setup [SSH](https://docs.microsoft.com/en-us/windows/terminal/tutorials/ssh)
and [git](https://git-scm.com/download/win). Please consult the documentation
I've linked above to set those pieces of technology up.

After that, the Environment Manager I recommend for Windows is [nvm-windows](https://github.com/coreybutler/nvm-windows).

### Starting Development

Validate that you have Node and NPM:

```bash
node -v
```

```bash
npm -v
```

If you have them installed, you will be given the version number.

Install the required dependencies:

```bash
npm install
```

Start the development environment:

```bash
npm start
```

### Tests

Run tests with:

```bash
npm run test
```

#### Docker & docker-compose

---

The [official website](https://docs.docker.com/get-docker/) contains instructions
for all operating systems.

in most cases, compose (docker-compose) comes with the Docker installation.
However, if you're looking for a different version or troubleshooting tips, you
can head to the [official documentation for compose](https://docs.docker.com/compose/install/).

### Starting Development

Validate that you have Node and NPM:

```bash
node -v
```

```bash
npm -v
```

### Using docker compose

These commands are to be ran in the docker compose directory.

#### Build the Image

```bash
docker-compose build
```

#### Run the image

```bash
docker-compose up -d
```

#### Build and Run the image

```bash
docker-compose up -d --build
```

#### Configuring .env file
Managing Database Configuration
Location of .env File:

Path: /persistence-service/.env
Description: This file contains environment variables for configuring your database connection.

Open the .env file located in the /persistence-service directory using a text editor.
Define your database connection settings in this file. 

Accessing Environment Variables in Code:
Ensure your application reads these environment variables. Depending on your technology stack, you may need to use a library or built-in functionality to access these variables. For example, in Node.js, you can use process.env to access them

Security Considerations:
Make sure the .env file is not included in version control (e.g., add it to .gitignore if you're using Git) to prevent sensitive information from being exposed.
Applying Configuration Changes:

After editing the .env file, restart your application or service to apply the new configuration settings.