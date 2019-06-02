/* global chrome */
/* eslint no-console: off */
import focaliCss from './focali.scss';

// Trello css classnames
const TRELLO_CLASSNAME__LIST_WRAPPER = '#board .js-list';
const TRELLO_CLASSNAME__LIST_HEADER_NAME = '.js-list-name-assist';
// Focali css classnames
const FOCALI_CLASSNAME__FOCUSED = 'focali__list-focused';
const FOCALI_CLASSNAME__UNFOCUSED = 'focali__list-unfocused';

/**
 *
 * @param listNode DOMNode with classname of TRELLO_CLASSNAME__LIST_WRAPPER
 * @param whitelist list of columns titles to focus
 */
const updateList = (listNode, whitelist) => {
  const listTitle = listNode.querySelector(TRELLO_CLASSNAME__LIST_HEADER_NAME)
    .textContent;

  if (!listNode.classList.contains('js-list')) {
    console.warn(
      `Focali for Trello: "updateList()" was invoked with a DOMNode at the wrong hierarchy level (given "${
        listNode.classList
      }"). Unexpected results may follow`,
    );
  }

  // Toggle classnames
  if (whitelist.includes(listTitle)) {
    // focused
    listNode.classList.remove(FOCALI_CLASSNAME__UNFOCUSED);
    listNode.classList.add(FOCALI_CLASSNAME__FOCUSED);
  } else {
    // un-focused
    listNode.classList.remove(FOCALI_CLASSNAME__FOCUSED);
    listNode.classList.add(FOCALI_CLASSNAME__UNFOCUSED);
  }
};

/**
 *
 * @param listTitlesToFocus list of columns titles to focus
 */
const updateTrelloBoard = listTitlesToFocus => {
  console.log('updateTrelloBoard() with whitelist', listTitlesToFocus);
  Array.prototype.forEach.call(
    document.querySelectorAll(TRELLO_CLASSNAME__LIST_WRAPPER),
    el => updateList(el, listTitlesToFocus),
  );
};

/**
 *
 */
const resetTrelloBoard = () => {
  Array.prototype.forEach.call(
    document.querySelectorAll(TRELLO_CLASSNAME__LIST_WRAPPER),
    el => {
      el.classList.remove(FOCALI_CLASSNAME__FOCUSED);
      el.classList.remove(FOCALI_CLASSNAME__UNFOCUSED);
    },
  );
};

/**
 *
 * @param whitelist list of columns titles to focus
 */
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

/**
 *
 * @param whitelist list of columns titles to focus
 */
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
  // TODO Add reseting board. if disabled
  chrome.storage.onChanged.addListener(function(changes) {
    console.log('storage change', changes);

    if (!(curTrelloBoardId in changes)) {
      resetTrelloBoard();

      return;
    }

    let focalists, enabled;
    if ('newValue' in changes[curTrelloBoardId]) {
      focalists = changes[curTrelloBoardId].newValue.focus;
      enabled = changes[curTrelloBoardId].newValue.enabled;
    } else if ('oldValue' in changes[curTrelloBoardId]) {
      focalists = changes[curTrelloBoardId].oldValue.focus;
      enabled = changes[curTrelloBoardId].oldValue.enabled;
    }

    if (enabled === false) {
      resetTrelloBoard();

      return;
    }

    Array.isArray(focalists) &&
      focalists.length > 0 &&
      updateTrelloBoard(focalists);
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

  const link = document.createElement('link');
  link.href = focaliCss;
  document.head.appendChild(link);
})();
