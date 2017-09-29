'use strict';

const YAML = require('yamljs'),
  params = YAML.load('./parameters.yml').parameters;

const config = {
  host: params.SSH_HOST,
  user: params.SSH_USER,
  pass: params.SSH_PASS
};

if (process.env.SSH_AUTH_SOCK) {
  config.agent = process.env.SSH_AUTH_SOCK;
  config.agentForward = true;
}

const SSH = require('simple-ssh'),
  ssh = new SSH(config);

ssh.exec('cd ' + params.MODULE_PATH + '&& git pull && make doc', {
  out: function(stdout) {
    console.log('Fait :', stdout);
  }
}).start({
  success: function() {
    console.log('Mise à jour en cours sur', params.MODULE_PATH, '...');
  },
  fail: function(err) {
    console.log('Une erreur est apparue : ', err);
  }
});