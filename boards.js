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
        aname: 'arduino:avr:mega:cpu=atmega2560'
    },

    {
        name: 'micro',
        baud: 57600,
        signature: new Buffer([0x43, 0x41, 0x54, 0x45, 0x52, 0x49, 0x4e]),
        productId: ['0x0037', '0x8037', '0x0036', '0x0237'],
        protocol: 'avr109',
        aname: 'arduino:avr:micro'
    },
    {
        name: 'leonardo',
        baud: 57600,
        signature: new Buffer([0x43, 0x41, 0x54, 0x45, 0x52, 0x49, 0x4e]),
        productId: ['0x0036', '0x8036', '0x800c'],
        protocol: 'avr109',
        aname: 'arduino:avr:leonardo'
    },
    {
        name: 'little-bits',
        baud: 57600,
        signature: new Buffer([0x43, 0x41, 0x54, 0x45, 0x52, 0x49, 0x4e]),
        productId: ['0x0036', '0x8036'],
        protocol: 'avr109',
        aname: 'arduino:avr:nano:cpu=atmega328'
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
        aname: 'arduino:avr:diecimila:cpu=atmega168'
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
        aname: 'arduino:avr:megaADK'
    }
];

module.exports = boards;