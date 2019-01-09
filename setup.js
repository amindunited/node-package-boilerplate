const path = require('path');
const { exec } = require('child_process');
const npmLogin = require('npm-cli-login');
const writeFile = require('@amindunited/utils').fileSystem.writeFile;
const ensure = require('@amindunited/utils').fileSystem.ensure;

const loginDetails = { }

const actions = {
  'username': {
    'options': [],
    'fn': async (name) => {
      console.log('uname ', name);
      loginDetails.username = name;
    }
  },
  'password': {
    'options': [],
    'fn': async (password) => {
      console.log('password ', password);
      loginDetails.password = password;
    }
  },
  'email': {
    'options': [],
    'fn': async (email) => {
      console.log('email ', email);
      loginDetails.email = email;
    }
  },
  'npm-scope': {
    'options': [],
    'fn': async (scope) => {

      console.log('ecope ', scope);
      loginDetails.scope = scope;
    }
  },
  'login': {
    'options': [],
    'fn': async () => {
      loginDetails.registry = 'https://registry.npmjs.org';
      npmLogin(
        loginDetails.username,
        loginDetails.password,
        loginDetails.email,
        loginDetails.registry,
        loginDetails.scope
      );
    }
  },
  'npm-init': {
    'options': [],
    'fn': async () => {
      const initArgs = ['init', '-y'];
      //--scope
      if (loginDetails.scope) {
        initArgs.push('--scope');
        initArgs.push(loginDetails.scope);
      }
      exec('npm', );
    }
  },
  'editorconfig': {
    'options': [],
    'fn': async () => {
      const fileName = '.editorconfig';
      const content = `
# http://editorconfig.org

root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
insert_final_newline = false
`;
      const filePath = path.resolve(__dirname, fileName);
      return await writeFile(filePath, content);
    }
  },
  'gitignore': {
    'options': [],
    'fn': async () => {
      const fileName = '.gitignore';
      const content = `
/node_modules
.nyc_output
coverage
.DS_STORE
yarn-error.log
yarn.lock
`;
      const filePath = path.resolve(__dirname, fileName);
      return await writeFile(filePath, content);
    }
  },
  'nvmrc': {
    'options': [],
    'fn': async () => {
      const fileName = '.nvmrc';
      const content = `v10.13.0`;
      const filePath = path.resolve(__dirname, fileName);
      return await writeFile(filePath, content);

    }
  },
  'dockerfile': {
    'options': [],
    'fn': async () => {
      const fileName = 'dockerfile';
      const content = `
      # Cheat Sheet - https://github.com/wsargent/docker-cheat-sheet

      FROM debian:stable-slim

      ARG DEBIAN_FRONTEND=noninteractive

      RUN apt-get update -qqy   && apt-get -qqy install        dumb-init curl git-all gnupg wget zip ca-certificates        python-pip apt-transport-https ttf-wqy-zenhei xvfb   && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

      RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -   && echo "deb https://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list   && apt-get update -qqy   && apt-get -qqy install google-chrome-unstable   && rm /etc/apt/sources.list.d/google-chrome.list   && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

      RUN groupadd -g 10101 bamboo   && useradd bamboo --shell /bin/bash --create-home -u 10101 -g 10101   && usermod -a -G sudo bamboo   && echo 'ALL ALL = (ALL) NOPASSWD: ALL' >> /etc/sudoers   && echo 'bamboo:nopassword' | chpasswd

      RUN mkdir /data && chown -R bamboo:bamboo /data

      RUN pip install awscli --upgrade

      USER bamboo

      ENTRYPOINT ["/usr/bin/dumb-init", "--",             "/usr/bin/google-chrome-unstable",             "--disable-gpu",             "--headless",             "--disable-dev-shm-usage",             "--remote-debugging-address=0.0.0.0",             "--remote-debugging-port=9222",             "--user-data-dir=/data"]
`;
      const filePath = path.resolve(__dirname, fileName);
      return await writeFile(filePath, content);
    }
  },
  'circleci': {
    'options': [],
    'fn': async () => {
      const dirPath = path.resolve(__dirname, '.circleci');
      await ensure(dirPath);
      const fileName = 'config.yml';
      const content = `
# Javascript Node CircleCI 2.0 configuration file
#
# Check https://circleci.com/docs/2.0/language-javascript/ for more details
#
version: 2

defaults: &defaults
  working_directory: ~/repo
  docker:
    - image: circleci/node:8.11.1

jobs:
  test:
    <<: *defaults
    steps:
      - checkout

      - restore_cache:
          keys:
          - v1-dependencies-
    # fallback to using the latest cache if no exact match is found
          - v1-dependencies-

      - run: npm install
      - run:
          name: Run tests
          command: npm test

      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-

      - persist_to_workspace:
          root: ~/repo
          paths: .
  deploy:
    <<: *defaults
    steps:
      - attach_workspace:
          at: ~/repo
      - run:
          name: Authenticate with registry
          command: echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/repo/.npmrc
      - run:
          name: Publish package
          command: npm publish

workflows:
  version: 2
  test-deploy:
    jobs:
      - test:
          filters:
            tags:
              only: /^v.*/
      - deploy:
          requires:
            - test
          filters:
            tags:
              only: /^v.*/
            branches:
              ignore: /.*/
`;
      const filePath = path.resolve(dirPath, fileName);
      return await writeFile(filePath, content);
    }
  },
  'chai-mocha': {
    'options': [],
    'fn': async () => {
      // npm install --save-dev chai mocha sinon nyc
      exec('npm', ['install', '--save-dev', 'chai', 'mocha', 'sinon', 'nyc']);
    }
  },
}

const setup = async (form) => {
  for ( let option in form ) {
    console.log('options ', option, ' = ', form[option]);
    if ( form[option] ) {
      await actions[option]['fn'](form[option]);
    }
  }
}

module.exports = setup;
