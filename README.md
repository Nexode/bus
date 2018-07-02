Nexode Bus
==========

Simple implementation of message bus.

## How to use

Install it:

```
npm install --save @nexode/bus
```

Subscribing:

> Actually each unit of system can both publish and subscribe messages but it's better to consider it separately for simplicity.

```javascript
const unit = bus.unit('service-2');

unit.listen('service-1')
    .on('greeting', async message => {
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
const unit = bus.unit('service-1');

unit.on('ready', () => {
    unit.publish('greeting', {
        greeting: 'Hello!'  
    });
});

unit.on('error', error => {
    console.error(error.message);
});

unit.attach('amqp://guest:guest@amqp-server/vhost');
```