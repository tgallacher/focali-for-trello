/* global chrome */
/* eslint no-console: off */

// Trello css classnames
// const TRELLO_CLASSNAME__LIST_HEADER_WRAPPER = '.js-list-header';
const TRELLO_CLASSNAME__LIST_HEADER_NAME = '.js-list-name-assist';
const TRELLO_CLASSNAME__LIST_CONTENT_WRAPPER = '.js-list-content';
// const TRELLO_CLASSNAME__LIST_WRAPPER = '.js-list.list-wrapper';

chrome.storage.local.clear();

export const updateTrelloBoard2 = listTitlesToFocus => {
  console.log('listTitlesToFocus', listTitlesToFocus); // eslint-disable-line

  if (!Array.isArray(listTitlesToFocus) || listTitlesToFocus.length < 1) {
    return;
  }

  Array.prototype.filter
    .call(
      document.querySelectorAll('.js-list-header'),
      el =>
        !listTitlesToFocus.includes(
          el.querySelector('.js-list-name-assist').textContent,
        ),
    )
    .map(el => {
      const backplate = document.createElement('div');

      backplate.style.position = 'absolute';
      backplate.style.left = 0;
      backplate.style.top = 0;
      backplate.style.right = 0;
      backplate.style.bottom = 0;
      backplate.style.backgroundColor = '#dfe1e6';
      backplate.style.zIndex = -10;

      // Update styles
      el.parentElement.style.opacity = 0.2;
      el.parentElement.parentElement.style.position = 'relative';
      el.parentElement.parentElement.appendChild(backplate);
    });
};

// Triggered when storage has been updated, i.e. from ext. popup
chrome.storage.onChanged.addListener(function(changes) {
  // make sure uri doesn't start with `/`
  const curUri = window.location.pathname.replace(/^\//, '');

  if (!(curUri in changes)) {
    return;
  }

  updateTrelloBoard2(changes[curUri].newValue || changes[curUri].oldValue);
});

// expecting classname of `listNode` to be `.js-list`
const updateList = (listNode, whitelist) => {
  if (
    whitelist.includes(
      listNode.querySelector(TRELLO_CLASSNAME__LIST_HEADER_NAME).textContent,
    )
  ) {
    return; // do nothing
  }

  const backplate = document.createElement('div');

  backplate.id = 'backplate-' + Math.random();
  backplate.style.position = 'absolute';
  backplate.style.left = 0;
  backplate.style.top = 0;
  backplate.style.right = 0;
  backplate.style.bottom = 0;
  backplate.style.backgroundColor = '#dfe1e6';
  backplate.style.zIndex = -10;

  // Update styles
  listNode.querySelector(
    TRELLO_CLASSNAME__LIST_CONTENT_WRAPPER,
  ).style.opacity = 0.2;
  listNode.style.position = 'relative';
  listNode.appendChild(backplate);
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
  const listNodes = document.querySelectorAll('#board .js-list');

  for (const listNode of [].slice.call(listNodes)) {
    updateList(listNode, whitelist);
  }

  const observer = new MutationObserver(function(mutations) {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        console.log('#content mutation', mutation);
      }

      for (const entry of [].slice.call(mutation.addedNodes)) {
        console.log('board mutation entry, ', entry);

        if (!(entry instanceof Element)) {
          return;
        }

        // Lists are loading
        if (entry.classList.contains('js-list')) {
          updateList(entry, whitelist);
        }
      }
    }
  });

  observer.observe(document.querySelector('#board'), {
    childList: true,
  });
};

// /**
//  *
//  * @deprecated
//  */
// export const watchBoardContent = whitelist => {
//   const target = document.querySelector('#content');
//   const config = {
//     childList: true,
//   };

//   const observer = new MutationObserver(function(mutations) {
//     for (const mutation of mutations) {
//       console.log('content mutation', mutation);
//       for (const entry of [].slice.call(mutation.addedNodes)) {
//         if (entry instanceof Element && entry.classList.contains('js-list')) {
//           console.log('updating list', entry);
//           updateList(entry, whitelist);
//         }
//       }
//     }
//   });

//   observer.observe(target, config);
// };

// window.addEventListener('load', function() {
const whitelist = ['Blockers', 'In Progress', 'Sprint Backlog'];

watchContent(whitelist);

// chrome.storage.local.set({
//   'b/MMhfE9vK/transformers': whitelist,
// });
// });

// updateTrelloBoard2(chrome.storage.local.get('b/MMhfE9vK/transformers'));

// window.setTimeout(() => observer.disconnect(), 10000);
