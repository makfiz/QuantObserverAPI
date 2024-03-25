const { WSClients } = require('./config');

function sendSnapshotAction (nodeName) {
    const keys = Object.keys(WSClients);

  // Проверяем, есть ли ключ с указанным nodeName
  if (keys.includes(nodeName)) {
    console.log(`Client with nodeName ${nodeName} found`);
    const wsObject = WSClients[nodeName];
    console.log(wsObject);
    wsObject.send('Action:Snapshot')
  }
}

const actions = {sendSnapshotAction}

module.exports = actions
