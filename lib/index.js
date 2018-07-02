const EventEmitter = require('events');
const amqp = require('amqp');

class Unit extends EventEmitter {

    constructor(name) {
        super();
        this.name = name;
        this.connection = null;
        this.exchange = null;
    }

    publish(event, data) {
        this.exchange.publish(event, data, { deliveryMode: 2 });
    }

    listen(unit) {
        const unitEventEmitter = new EventEmitter();

        const attach = () => {
            this.connection.exchange(
                unit,
                { type: 'fanout', durable: true },
                exchange => {
                    this.queue.bind(exchange, 'created', () => {
                        this.queue.subscribe(
                            { ack: true },
                            (data, headers, meta, message) => unitEventEmitter.emit(meta.routingKey, {
                                headers,
                                data,
                                ack: () => message.acknowledge(false)
                            })
                        );
                    });
                }
            );
        };

        this.on('ready', () => {
            if (this.queue) {
                attach();
            } else {
                this.connection.queue(
                    this.name,
                    { durable: true, autoDelete: false },
                    queue => {
                        this.queue = queue;
                        attach();
                    }
                );
            }
        });

        return unitEventEmitter;
    }

    attach(url) {
        this.connection = amqp.createConnection({ url });
        this.connection.on('ready', () => {
            this.connection.exchange(
                this.name,
                { type: 'fanout', durable: true },
                exchange => {
                    this.exchange = exchange;
                    this.emit('ready');
                }
            );
        });

        this.connection.on('error', error => this.emit('error', error));

        return this;
    };
}

const unit = name => new Unit(name);

const middleware = unit => (req, res, next) => {
    req.unit = unit;
    next();
};

module.exports = { Unit, unit, middleware };
