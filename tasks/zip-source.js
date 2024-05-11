const { execSync } = require('child_process');

const version = process.env.npm_package_version;
const command = `git archive --format zip --output ./build/source-v${version}.zip HEAD`;

execSync(command, { stdio: 'inherit' });
