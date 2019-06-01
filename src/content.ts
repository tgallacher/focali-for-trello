/* global chrome */
/* eslint no-console: off */

// Trello css classnames
const TRELLO_CLASSNAME__LIST_WRAPPER = '#board .js-list';
const TRELLO_CLASSNAME__LIST_HEADER_WRAPPER = '.js-list-header';
const TRELLO_CLASSNAME__LIST_HEADER_NAME = '.js-list-name-assist';
const TRELLO_CLASSNAME__LIST_CONTENT_WRAPPER = '.js-list-content';

const TRELLO__LIST_BG_COLOR = '#dfe1e6';

chrome.storage.local.clear();

/**
 * Create an element to sit behind lists so we don't see
 * the bg wallpaper.
 */
const createBackplateElement = () => {
  const backplate = document.createElement('div');

  backplate.style.position = 'absolute';
  backplate.style.left = 0;
  backplate.style.top = 0;
  backplate.style.right = 0;
  backplate.style.bottom = 0;
  backplate.style.backgroundColor = TRELLO__LIST_BG_COLOR;
  backplate.style.zIndex = -10;

  return backplate;
};

export const updateTrelloBoard2 = listTitlesToFocus => {
  Array.prototype.filter
    .call(
      document.querySelectorAll(TRELLO_CLASSNAME__LIST_HEADER_WRAPPER),
      el =>
        !listTitlesToFocus.includes(
          el.querySelector(TRELLO_CLASSNAME__LIST_HEADER_NAME).textContent,
        ),
    )
    .map(el => {
      el.parentElement.style.opacity = 0.2;
      el.parentElement.parentElement.style.position = 'relative';
      el.parentElement.parentElement.appendChild(createBackplateElement());
    });
};

// expecting classname of `listNode` to be `TRELLO_CLASSNAME__LIST_WRAPPER`
const updateList = (listNode, whitelist) => {
  if (
    whitelist.includes(
      listNode.querySelector(TRELLO_CLASSNAME__LIST_HEADER_NAME).textContent,
    )
  ) {
    return; // do nothing
  }

  // Update styles
  listNode.querySelector(
    TRELLO_CLASSNAME__LIST_CONTENT_WRAPPER,
  ).style.opacity = 0.2;

  listNode.style.position = 'relative';
  listNode.appendChild(createBackplateElement());
};

const watchContent = whitelist => {
  const observer = new MutationObserver(function(mutations) {
    for (const mutation of mutations) {
      for (const entry of [].slice.call(mutation.addedNodes)) {
        if (
          entry instanceof Element &&
          entry.classList.contains('board-wrapper')
        ) {
          watchBoard(whitelist);
          return;
        }
      }
    }
  });

  observer.observe(document.querySelector('#content'), {
    childList: true,
  });
};

const watchBoard = whitelist => {
  const listNodes = document.querySelectorAll(TRELLO_CLASSNAME__LIST_WRAPPER);
  const observer = new MutationObserver(function(mutations) {
    for (const mutation of mutations) {
      for (const entry of [].slice.call(mutation.addedNodes)) {
        if (entry instanceof Element && entry.classList.contains('js-list')) {
          updateList(entry, whitelist);
        }
      }
    }
  });

  // Update lists we already have
  for (const listNode of Array.prototype.slice.call(listNodes)) {
    updateList(listNode, whitelist);
  }

  // watch for changes
  observer.observe(document.querySelector('#board'), {
    childList: true,
  });
};

(function() {
  // make sure uri doesn't start with `/`
  const curUri = window.location.pathname.replace(/^\//, '');
  const whitelist = ['Blockers', 'In Progress', 'Sprint Backlog'];

  chrome.storage.onChanged.addListener(function(changes) {
    if (!(curUri in changes)) {
      return;
    }

    updateTrelloBoard2(changes[curUri].newValue || changes[curUri].oldValue);
  });

  watchContent(whitelist);
})();

// chrome.storage.local.set({
//   'b/MMhfE9vK/transformers': whitelist,
// });
// });
