'use strict'

module.exports = {
  upgrade: true,
  workspaces: true,
  root: true,
  reject: name => name === 'eslint' || name === 'typescript' || name.includes('emittery'),
}
