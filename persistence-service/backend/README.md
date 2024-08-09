# Project: Persistence Service

## Getting Started

---

### Prerequisite

---

This project is containerized. Please have Docker installed. Instructions are
on the README in the project root.

### Development

---

#### Install

Running this command will install all the dependencies for the backend project.

```bash
npm install
```

#### Start Development Server

Running this command will start the development server. The endpoint is at port 8000.

```bash
npm start
```

#### Build

Running this command will build a production ready version of the project.

```bash
npm run build
```

#### Testing

Running this command will run all the unit tests

```bash
npm run test
```

Running this command will run the unit tests in watch mode (the unit tests will re-run on save)

```bash
npm run test -- --watch
```

#### Build the Image

This command has to be ran from within the backend directory.

```bash
docker build --tag persistence-service .
```

#### Build the Container

This command will build and run the container in detached mode. You will be able to hit the container on port 8000.

```bash
docker run -d --name persistence -p 3000:3000 persistence-service
```

#### Removing the Container

This command will kill the running container and remove it.

```bash
docker rm -f persistence
```
