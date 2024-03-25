const { WSClients } = require('./config');

function sendSnapshotAction (nodeName) {
    const keys = Object.keys(WSClients);

  if (keys.includes(nodeName)) {
    console.log(`Client with nodeName ${nodeName} found`);
    const wsObject = WSClients[nodeName];
    wsObject.send('Action:Snapshot')
  }
}

const actions = {sendSnapshotAction}

module.exports = actions
