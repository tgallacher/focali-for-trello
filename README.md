[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg?style=flat-square&logo=Github)](http://makeapullrequest.com)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-green.svg?style=flat-square)](#contributors)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=flat-square)](https://github.com/tgallacher/focali-for-trello/graphs/commit-activity)
[![Build Status](https://travis-ci.com/tgallacher/focali-for-trello.svg?branch=master)](https://travis-ci.com/tgallacher/focali-for-trello)
[![Coverage Status](https://coveralls.io/repos/github/tgallacher/focali-for-trello/badge.svg?branch=master)](https://coveralls.io/github/tgallacher/focali-for-trello?branch=master)

<p align="center">
  <img class="center" src="./images/focali-splash.png" alt="Focali splash" />
</p>

# Focali for Trello

Google Chrome extension for sharpening focus on (busy) [Trello](https://trello.com) boards.

![Focali demo](./focali-demo.gif)

## Install

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

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://commented.tech"><img src="https://avatars1.githubusercontent.com/u/6460370?v=4" width="100px;" alt="Tom Gallacher"/><br /><sub><b>Tom Gallacher</b></sub></a><br /><a href="#ideas-tgallacher" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-tgallacher" title="Maintenance">🚧</a> <a href="https://github.com/tgallacher/focali-for-trello/commits?author=tgallacher" title="Code">💻</a> <a href="https://github.com/tgallacher/focali-for-trello/issues?q=author%3Atgallacher" title="Bug reports">🐛</a> <a href="https://github.com/tgallacher/focali-for-trello/commits?author=tgallacher" title="Documentation">📖</a></td><td align="center"><a href="http://andrewsims.co"><img src="https://avatars3.githubusercontent.com/u/12777283?v=4" width="100px;" alt="Andrew "/><br /><sub><b>Andrew Sims</b></sub></a><br /><a href="#design-andrew-sims" title="Design">🎨</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
