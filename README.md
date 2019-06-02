[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg?style=flat-square&logo=Github)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=flat-square)](https://github.com/tgallacher/focali-for-trello/graphs/commit-activity)
[![Build Status](https://travis-ci.com/tgallacher/focali-for-trello.svg?branch=master)](https://travis-ci.com/tgallacher/focali-for-trello)
[![Coverage Status](https://coveralls.io/repos/github/tgallacher/focali-for-trello/badge.svg?branch=master)](https://coveralls.io/github/tgallacher/focali-for-trello?branch=master)

# FocaLi for Trello

Google Chrome extension for sharpening focus on (busy) [Trello](https://trello.com) boards.

![Focali demo](./focali-demo-resized.gif)

## Install / Get

Install from the [Chrome Web Store](#). (TODO)

## Develop

```sh
yarn install

# Available in http://localhost:6006
# Test the popup.html UI
yarn storybook

# Auto rebuild on changes
yarn build:dev --watch
```

Then use the Chrome extensions in "developer mode" and load the unpacked extension. Simply refresh the extension when any files are changed, to see how the work in the browser.

> Note: Some parts of the extension rely on the `chrome` API and so can't be fully tested inside StorybookJS. Hence the workflow above.
