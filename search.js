const program = require('commander');
const printSuitedUsers = require('./inc/printSuitedUsers.js');

program
    .version('0.0.1');

program
    .arguments('<location> <language> <technology>')
    .action((location, language, technology) => {
        printSuitedUsers(location, language, technology);
    });

program.parse(process.argv);
