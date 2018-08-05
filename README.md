# Teravoz Challenge

This is a (partial) implementation of the [Terravoz Challenge](https://github.com/teravoz/challenge/blob/master/README.md).

## Problem description

<details>
<summary>Click to read</summary>

Let's suppose you're a developer working for a company with a **call center** operation. There's a receptionist who handles calls and transfers them following some rules:
- first, receptionist answers and asks customer's phone number
- then, searches customer on company's contacts list system
- if not found, registers customer number into contacts list, and then transfers call to extension `900`, which is a call center queue for handling first contact customers. Receptionist does this by **dialing** `*2900` on the phone
- if found, transfers call to extension `901`, which is a call center queue for handling returning customers. Receptionist does this by **dialing** `*2901` on the phone

Such operation is expensive, error-prone and takes a lot of time for a customer to be answered. Your company already uses Teravoz as call center platform provider, meaning that all incoming and outgoing calls goes through Teravoz systems. After reading documentation on https://developers.teravoz.com.br, you noticed a feature called **delegate** that you could use for automating your call center operation. So you decided to integrate your company's system with **Teravoz API**, by replacing receptionist's manual steps like asking customer's phone number by listening to events on a **webhook**, and deciding which queue to transfer calls by making **POST** requests to `/actions` endpoint.

So your **Node.js** application has to do the following:
- Listen to events emitted by Teravoz at `/webhook` endpoint. Events are and come in the following order: `call.new`, `call.standby`, `call.waiting`, `actor.entered`, `call.ongoing`, `actor.left`, `call.finished`. Those are life cycle events of a call.
- When an event of type _call.standby_ arrives, you need to **delegate** that call based on the given criteria above, by POSTing to Teravoz API's `/actions` endpoint
- When app is restarted, it needs to work as if it hasn't at all - returning customers will always be returning customers
- _[bonus 1]_ use of Docker containers
- _[bonus 2]_ a little dashboard in React or other library, showing current active calls

Unfortunately, Teravoz doesn't have a _sandbox_ environment which you could use for interacting with, so you need to mock the required interaction between your application and Teravoz API. For example, you need to simulate **POSTs** to your `/webhook` endpoint.

We're expecting your application to be fully operational and well documented. You don't need to use a database, a plain-text file shall do the job. You can use any library you want.
</details>

## Scope

- [x] Listen to events emitted by Teravoz at `/webhook` endpoint. Events are and come in the following order: `call.new`, `call.standby`, `call.waiting`, `actor.entered`, `call.ongoing`, `actor.left`, `call.finished`. Those are life cycle events of a call.
- [x] When an event of type _call.standby_ arrives, you need to **delegate** that call based on the given criteria above, by POSTing to Teravoz API's `/actions` endpoint
- [x] When app is restarted, it needs to work as if it hasn't at all - returning customers will always be returning customers
- [x] _[bonus 1]_ use of Docker containers
- [ ] _[bonus 2]_ a little dashboard in React or other library, showing current active calls

## High-level solution description

There are 2 services:

- **Teravoz fake API**
    - Generates fake call events and sends them to the other service.
    - Exposes a '/action' endpoint to allow requesting call delegations
- **[Judite](https://www.youtube.com/watch?v=vEaNCoCXcdk)**: 
    - Exposes a '/webhook' endpoint to receive call events
    - Keeps a persistent repository of calling users
    - Delegates calls to the proper queues, regarding if user is new or a returning one

### Communication flow

```
    +--------------------+     /webhook     +--------------------+
    |                    |----------------->|                    |
    |    Teravoz API     |                  |       Judite       |
    |                    |<-----------------|                    |
    +--------------------+     /action      +--------------------+
```

## Running the application

### Docker

The simplest way to run this application is using [`docker-compose`](https://docs.docker.com/compose/):

```bash
# Creates the images with the transpiled Javascript files
docker-compose build 
# Starts the applications
docker-compose up
```

### Standalone

To run the application as standalone services, for each service, run:

```bash
cd ./applications/<service>
yarn install
yarn build
```

Both services rely on environment variables to communicate with each other:

```bash
# Teravoz fake API points to Judite /webhook
SERVER_PORT=3000 WEBHOOK_CONSUMER_URL='http://localhost:3001/webhook' yarn start
# Judite points to Teravoz fake API /action
SERVER_PORT=3001 CALL_DELEGATE_URL='http://localhost:3000/action' yarn start
```

## Services

### Teravoz fake API

This service is both a producer and a consumer/server at the same time (which means we could probably break it down into 2 different services).

It produces synthetic life cycle events of a call, with randomly distributed intervals between new calls and events from the same call. Depending on the intervals, there might be several ongoing calls at a given time.

To reduce the amount of boilerplate needed and make the code more declarative, I decided to use [`Observables`](https://rxjs-dev.firebaseapp.com/). 

A call event sequence is an `Observable` that starts emitting `call.new` and completes after emitting `call.finished`.

To simulate concurrent calls, theres a &ldquo;generator&rdquo; `Observable` (not to be confused with ES6 generator funcitons). It is basically a never-completing `Observable` that creates an event sequence after a random amount of time, while it forwards events generated by previously created observables. This is possible through the [`mergeAll`](https://rxjs-dev.firebaseapp.com/api/operators/mergeAll) operator from `rxjs`.

The `webhook-producer` component then subscribes the the &ldquo;generator&rdquo; `Observable` and sends the data to `/webhook` endpoints on the other service.

It also listens to `POST /action` through a [`restify`](http://restify.com/) HTTP server, which delegates calls. Currently, the &ldquo;delegation&rdquo; is simply logging the incomming data.

### Judite

This service listens to `POST /webhook` &mdash; through [`restify`](http://restify.com/) &mdash; to get incomming call events. Those events are then passed to a `reducer` (roughly inspired by the Flux architecture). The `reducer` checks the `type` property of the event and then calls the appopriate action.

Currently, the only implemented action is `delegate`, which will delegate calls to the appropriate extension, whether the incomming call is from a new user or a returning one.

The customer &ldquo;database&rdquo; is a simple JSON file, indexed by the calling number. The data is loaded into memory during startup and whenever a new customer makes a call, his/her number is updated in memory and immediately flushed to disk (write-through).

**ATTENTION:** the `./data/customers.json` file holds customer data and is commited to this repository as an initial fixture to show the different application behaviors for new and returning customers.

## FAQ

### Why there are so few tests?

Most of the code is declarative, so I restricted testing to the business logic of the application, since time was an issue to me while implementing this application.

### Why there are so few comments?

I try to write clean and concise code, in a way it documents itself.

I believe that, while well intentioned, comments usually will become oudated as the code base grows and someday you will end up with code that does something that is completely different from what the comments tell you it does.

So I restrict comments to places I find them to be absolutely necessary.

### Why did you use Observables?

1. To learn more about them, as I had never used Observables for anything serious before.
2. To make the code more declarative, reducing boilerplate and the amount of tests.

## Possible improvements/features

- [ ] Implement the React client for currently active calls (websockets + Redux?)
- [ ] Implement a circuit-breaker on Teravoz API when `/webhook` endpoint is not available (discard the events? buffer events locally until the endpoint is available again?)
- [ ] Change docker integration to not require building a new image for every change in the code (different Dockerfiles for production and development? code folder as mounted volume?)
- [ ] Current customer storage only works if `node` runs as a single proces (switch to a real database? implement resource locking?)
