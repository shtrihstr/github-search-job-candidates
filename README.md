A simple tool for searching prospective employees on GitHub.

## Installation
```
$ git clone https://github.com/shtrihstr/github-search-job-candidates.git
$ cd github-search-job-candidates
$ npm i
```

## Usage
```
$ node search.js <location> <language> <technology>
```

## Example
```
$ node search.js london php wordpress
Searching users by location...
2179 users were found
Reading users data...
Filtering users...

foo - https://github.com/foo
bar - https://github.com/bar
baz - https://github.com/baz
...
```