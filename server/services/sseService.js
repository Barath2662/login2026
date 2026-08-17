const clients = new Set();

function addClient(res) {
  clients.add(res);
}

function removeClient(res) {
  clients.delete(res);
}

function broadcastEventChange(eventId, htmlFragment) {
  const data = JSON.stringify({
    type: 'timeline:updated',
    eventId,
    html: htmlFragment,
    timestamp: new Date().toISOString(),
  });

  clients.forEach((client) => {
    client.write(`event: timeline:updated\ndata: ${data}\n\n`);
  });
}

module.exports = {
  addClient,
  removeClient,
  broadcastEventChange,
};
