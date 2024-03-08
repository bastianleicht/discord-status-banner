module.exports = client => {
    //  Pool Events
    client.pool.on('acquire', function (connection) {
        console.log('Connection %d acquired', connection.threadId);
    });
    client.pool.on('connection', function (connection) {
        connection.query('SET SESSION auto_increment_increment=1');
    });
    client.pool.on('enqueue', function () {
        console.log('Waiting for available connection slot');
    });
    client.pool.on('release', function (connection) {
        console.log('Connection %d released', connection.threadId);
    });
}