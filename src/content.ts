/* global chrome */
/* eslint no-console: off */

// Trello css classnames
const TRELLO_CLASSNAME__LIST_WRAPPER = '#board .js-list';
// const TRELLO_CLASSNAME__LIST_HEADER_WRAPPER = '.js-list-header';
const TRELLO_CLASSNAME__LIST_HEADER_NAME = '.js-list-name-assist';
const TRELLO_CLASSNAME__LIST_CONTENT_WRAPPER = '.js-list-content';

// Trello's list color hex: '#dfe1e6';
const LIST_BG_COLOR = '#333';

// chrome.storage.local.clear();

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
  backplate.style.backgroundColor = LIST_BG_COLOR;
  backplate.style.zIndex = -10;

  return backplate;
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
  const listContentArea = listNode.querySelector(
    TRELLO_CLASSNAME__LIST_CONTENT_WRAPPER,
  );

  listContentArea.style.position = 'relative';
  listContentArea.style.backgroundColor = LIST_BG_COLOR;

  Array.prototype.forEach.call(
    listContentArea.childNodes,
    el => (el.style.opacity = 0.25),
  );

  const addNewCardBtn = listContentArea.querySelector('.js-open-card-composer');

  addNewCardBtn.style.opacity = 1;

  // listContentArea.appendChild(createBackplateElement());
};

const updateTrelloBoard = listTitlesToFocus => {
  Array.prototype.forEach.call(
    document.querySelectorAll(TRELLO_CLASSNAME__LIST_WRAPPER),
    el => updateList(el, listTitlesToFocus),
  );
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

/**
 * Main entrypoint
 */
(function() {
  const [, curTrelloBoardId] = /b\/(.*)\//.exec(window.location.pathname);

  // Handle state changes
  chrome.storage.onChanged.addListener(function(changes) {
    if (!(curTrelloBoardId in changes)) return;

    updateTrelloBoard(
      changes[curTrelloBoardId].newValue.focus ||
        changes[curTrelloBoardId].oldValue.focus,
    );
  });

  // Fetch on initial load
  chrome.storage.local.get(
    [curTrelloBoardId],
    ({ [curTrelloBoardId]: { enabled, focus } = {} }) => {
      if (!enabled) return;

      // updateTrelloBoard(focalists);
      watchContent(focus);
    },
  );
})();
