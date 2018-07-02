Nexode Bus
==========

Simple implementation of message bus.

> Note: This package contains built-in TypeScript typings.

## How to use

Install it:

```
npm install --save @nexode/bus
```

Subscribing:

> Actually each unit of system can both publish and subscribe messages but it's better to consider it separately for simplicity.

```javascript
const bus = require('@nexode/bus');
const unit = bus.unit('service-1');

unit.listen('service-2')
    .on('greeting', message => {
        console.log(message.data.greeting);
        message.ack();
    });

unit.on('error', error => {
    console.error(error.message);
});

unit.attach('amqp://guest:guest@amqp-server/vhost');
```

Publishing:

```javascript
const bus = require('@nexode/bus');
const unit = bus.unit('service-2');

unit.on('ready', () => {
    unit.publish('greeting', { greeting: 'Hello!' });
});

unit.on('error', error => {
    console.error(error.message);
});

unit.attach('amqp://guest:guest@amqp-server/vhost');
```

## Express integration

In order to push messages from you routes you can use built-in middleware.

```javascript
const bus = require('@nexode/bus');
const express = require('express');

const app = express();
const unit = bus.unit('service-1');

unit.on('ready', () => {
    app.use(bus.middleware(unit));

    app.get('/', (req, res) => {
        req.unit.publish('hit', { page: 'home' });
        res.render('home');
    });

    app.listen(3000);
});

unit.attach(process.env.AMQP_URL);
```
