const { WSClients } = require('./config');

function sendSnapshotAction (nodeName) {
    const keys = Object.keys(WSClients);

  if (keys.includes(nodeName)) {
    console.log(`Client with nodeName ${nodeName} found`);
    const wsObject = WSClients[nodeName];
    wsObject.send('Action:Snapshot')
  }
}

function sendReloadAction (nodeName) {
  const keys = Object.keys(WSClients);

if (keys.includes(nodeName)) {
  console.log(`Client with nodeName ${nodeName} found`);
  const wsObject = WSClients[nodeName];
  wsObject.send('Action:Reload')
}
}

function sendUpdateAction () {
  const keys = Object.keys(WSClients);

if (keys.length > 0) {
  keys.forEach((key)=>{
    const wsObject = WSClients[key];
    wsObject.send('Action:Update')
  })

}
}

const actions = {sendSnapshotAction, sendReloadAction, sendUpdateAction}

module.exports = actions
