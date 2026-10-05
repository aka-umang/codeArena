const mockClient = {
    connect: async () => console.log('Mock Redis connected (disabled for local dev)'),
    exists: async (key) => false,
    get: async (key) => null,
    set: async (key, val, opts) => 'OK',
    incr: async (key) => 1,
    expireAt: async (key, timestamp) => 1
};

module.exports = mockClient;