const GitHubApi = require("github");
const Promise = require("bluebird");

const github = new GitHubApi({
    debug: false,
    protocol: "https",
    host: "api.github.com",
    headers: {
        "user-agent": "FindCandidates"
    },
    Promise: Promise
});


const wait = 60 / 10 /* requests per minute */ * 1000;
const perPage = 100;
const maxPages = 10;

const promiseWhile = (condition, action) => {
    const resolver = Promise.defer();

    const loop = () => {
        if (!condition()) {
            return resolver.resolve();
        }
        return Promise.cast(action())
            .then(loop)
            .catch(resolver.reject);
    };

    process.nextTick(loop);

    return resolver.promise;
};

const printSuitedUsers = (location, language, technology) => {
    let page = 1;
    let stop = false;
    let users = [];
    let usersFoundMsg = false;

    console.log("Searching users by location...");

    promiseWhile(() => (!stop && page < maxPages), () => {

        return new Promise((resolve, reject) => {

            setTimeout(() => {

                github.search.users({
                    per_page: perPage,
                    page: page,
                    q: 'repos:>1 location:' + location + ' language:' + language
                }, (err, res) => {

                    page++;

                    if (err) {
                        return reject(err);
                    }

                    if (!usersFoundMsg) {
                        console.log(res.data.total_count + " users were found" );
                        console.log("Reading users data...");
                        usersFoundMsg = true;
                    }

                    if (res.data.items.length < perPage) {
                        stop = true;
                    }

                    users.push.apply(users, res.data.items);

                    resolve();
                });

            }, wait);
        });

    }).then(() => {

        console.log("Filtering users...\n");

        let index = 0;

        promiseWhile(() => (index < users.length), () => {

            return new Promise((resolve, reject) => {

                let user = users[index];

                setTimeout(() => {

                    github.search.repos({
                        q: technology + ' user:' + user.login
                    }, (err, res) => {

                        index++;

                        if (err) {
                            return reject(err);
                        }

                        if (res.data.total_count > 0) {
                            console.log(user.login + ' - https://github.com/' + user.login);
                        }
                        resolve();
                    });

                }, wait);
            });

        }).then(() => {
            console.log('Done.');
        })

    });
};

exports = module.exports = printSuitedUsers;