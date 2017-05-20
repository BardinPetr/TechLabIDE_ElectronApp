var boards = [{
        name: 'uno',
        baud: 115200,
        signature: new Buffer([0x1e, 0x95, 0x0f]),
        pageSize: 128,
        numPages: 256,
        timeout: 400,
        productId: ['0x0043', '0x7523', '0x0001', '0xea60'],
        protocol: 'stk500v1',
        aname: 'arduino:avr:uno'
    },
    {
        name: 'nano',
        baud: 57600,
        signature: new Buffer([0x1e, 0x95, 0x0f]),
        pageSize: 128,
        numPages: 256,
        timeout: 400,
        productId: ['0x6001', '0x7523'],
        protocol: 'stk500v1',
        aname: 'arduino:avr:nano:cpu=atmega328'
    },

    //TODO: set avrdude names of boards
    {
        name: 'mega',
        baud: 115200,
        signature: new Buffer([0x1e, 0x98, 0x01]), // ATmega2560
        pageSize: 256,
        delay1: 10,
        delay2: 1,
        timeout: 0xc8,
        stabDelay: 0x64,
        cmdexeDelay: 0x19,
        synchLoops: 0x20,
        byteDelay: 0x00,
        pollValue: 0x53,
        pollIndex: 0x03,
        productId: ['0x0042', '0x6001', '0x0010', '0x7523'],
        protocol: 'stk500v2',
        aname: 'arduino:avr:uno'
    },

    {
        name: 'micro',
        baud: 57600,
        signature: new Buffer([0x43, 0x41, 0x54, 0x45, 0x52, 0x49, 0x4e]),
        productId: ['0x0037', '0x8037', '0x0036', '0x0237'],
        protocol: 'avr109',
        aname: 'arduino:avr:uno'
    },
    {
        name: 'imuduino',
        baud: 57600,
        signature: new Buffer([0x43, 0x41, 0x54, 0x45, 0x52, 0x49, 0x4e]),
        productId: ['0x0036', '0x8037', '0x8036'],
        protocol: 'avr109',
        aname: 'arduino:avr:uno'
    },
    {
        name: 'leonardo',
        baud: 57600,
        signature: new Buffer([0x43, 0x41, 0x54, 0x45, 0x52, 0x49, 0x4e]),
        productId: ['0x0036', '0x8036', '0x800c'],
        protocol: 'avr109',
        aname: 'arduino:avr:uno'
    },
    {
        name: 'arduboy',
        baud: 57600,
        signature: new Buffer([0x43, 0x41, 0x54, 0x45, 0x52, 0x49, 0x4e]),
        productId: ['0x0036', '0x8036', '0x800c'],
        protocol: 'avr109',
        aname: 'arduino:avr:uno'
    },
    {
        name: 'feather',
        baud: 57600,
        signature: new Buffer([0x43, 0x41, 0x54, 0x45, 0x52, 0x49, 0x4e]),
        productId: ['0x800c', '0x000c'],
        protocol: 'avr109',
        aname: 'arduino:avr:uno'
    },
    {
        name: 'little-bits',
        baud: 57600,
        signature: new Buffer([0x43, 0x41, 0x54, 0x45, 0x52, 0x49, 0x4e]),
        productId: ['0x0036', '0x8036'],
        protocol: 'avr109',
        aname: 'arduino:avr:uno'
    },
    {
        name: 'blend-micro',
        baud: 57600,
        signature: new Buffer([0x43, 0x41, 0x54, 0x45, 0x52, 0x49, 0x4e]),
        productId: ['0x2404'],
        protocol: 'avr109',
        aname: 'arduino:avr:uno'
    },
    {
        name: 'duemilanove168',
        baud: 19200,
        signature: new Buffer([0x1e, 0x94, 0x06]),
        pageSize: 128,
        numPages: 128,
        timeout: 400,
        productId: ['0x6001'],
        protocol: 'stk500v1',
        aname: 'arduino:avr:uno'
    },
    {
        name: 'tinduino',
        baud: 57600,
        signature: new Buffer([0x1e, 0x95, 0x0f]),
        pageSize: 128,
        numPages: 256,
        timeout: 400,
        productId: ['0x6015'],
        protocol: 'stk500v1',
        aname: 'arduino:avr:uno'
    },
    {
        name: 'bqZum',
        baud: 19200,
        signature: new Buffer([0x1e, 0x95, 0x0f]),
        pageSize: 128,
        numPages: 256,
        timeout: 400,
        productId: ['0x6001', '0x7523'],
        protocol: 'stk500v1',
        aname: 'arduino:avr:uno'
    },
    {
        name: 'adk',
        baud: 115200,
        signature: new Buffer([0x1e, 0x98, 0x01]), // ATmega2560
        pageSize: 256,
        delay1: 10,
        delay2: 1,
        timeout: 0xc8,
        stabDelay: 0x64,
        cmdexeDelay: 0x19,
        synchLoops: 0x20,
        byteDelay: 0x00,
        pollValue: 0x53,
        pollIndex: 0x03,
        productId: ['0x0044', '0x6001', '0x003F'],
        protocol: 'stk500v2',
        aname: 'arduino:avr:uno'
    },
    {
        name: 'sf-pro-micro',
        baud: 57600,
        signature: new Buffer([0x43, 0x41, 0x54, 0x45, 0x52, 0x49, 0x4e]),
        productId: ['0x9206'],
        protocol: 'avr109',
        aname: 'arduino:avr:uno'
    },
    {
        name: 'pro-mini',
        baud: 57600,
        signature: new Buffer([0x1e, 0x95, 0x0f]),
        pageSize: 128,
        numPages: 256,
        timeout: 400,
        protocol: 'stk500v1',
        aname: 'arduino:avr:uno'
    },
    {
        name: 'qduino',
        baud: 57600,
        signature: new Buffer([0x43, 0x41, 0x54, 0x45, 0x52, 0x49, 0x4e]),
        productId: ['0x516d'],
        protocol: 'avr109',
        aname: 'arduino:avr:uno'
    },
    {
        name: 'pinoccio',
        baud: 115200,
        signature: new Buffer([0x1e, 0xa8, 0x02]), // ATmega256RFR2
        pageSize: 256,
        delay1: 10,
        delay2: 1,
        timeout: 0xc8,
        stabDelay: 0x64,
        cmdexeDelay: 0x19,
        synchLoops: 0x20,
        byteDelay: 0x00,
        pollValue: 0x53,
        pollIndex: 0x03,
        productId: ['0x6051'],
        protocol: 'stk500v2',
        aname: 'arduino:avr:uno'
    },
    {
        name: 'lilypad-usb',
        baud: 57600,
        signature: new Buffer([0x43, 0x41, 0x54, 0x45, 0x52, 0x49, 0x4e]),
        productId: ['0x9207', '0x9208', '0x1B4F'],
        protocol: 'avr109',
        aname: 'arduino:avr:uno'
    },
    {
        name: 'yun',
        baud: 57600,
        signature: new Buffer([0x43, 0x41, 0x54, 0x45, 0x52, 0x49, 0x4e]),
        productId: ['0x0041', '0x8041'],
        protocol: 'avr109',
        aname: 'arduino:avr:uno'
    },
];

module.exports = boards;