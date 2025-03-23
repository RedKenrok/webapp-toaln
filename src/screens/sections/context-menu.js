import {
  conditional as c,
  node as n,
} from '@doars/staark'
import {
  translate as t,
} from '../../data/translations'
import { createMessage } from '../../apis/apis'

const removeContextMenu = (
  state,
) => {
  state.contextMenu = null
  state.selection = null
}

const handleBack = (
  event,
  state,
) => {
  window.history.back()
  removeContextMenu(state)
}

const handleCopy = (
  event,
  state,
) => {
  navigator.clipboard.writeText(
    state.selection.text,
  )
  removeContextMenu(state)
}

const handleExplain = (
  event,
  state,
) => {
  state.popupModal = {
    messages: [{
      role: 'user',
      content: (
        t(state, 'popup-explain')
        + "\r\n\r\n"
        + state.selection.text
      ),
    }],
    pending: true,
  }

  createMessage(
    state,
    [{
      role: 'user',
      content: t(state, 'prompt-explain-user'),
    }, ...(
      state.selection.text === state.selection.context
        ? []
        : [{
          role: 'context',
          content: t(state, 'prompt-explain-context'),
        }]
    )],
    t(state, 'prompt-context'),
    t(state, 'prompt-explain'),
  ).then(([error, _response, result]) => {
    state.popupModal.pending = false
    if (error) {
      state.popupModal.error = error.toString()
      return
    }
    state.popupModal.messages.push(result)
  })

  removeContextMenu(state)
}

const handleReload = (
  event,
  state,
) => {
  window.location.reload()
  removeContextMenu(state)
}

const handleTranslate = (
  event,
  state,
) => {
  state.popupModal = {
    messages: [{
      role: 'user',
      content: (
        t(state, 'popup-translate')
        + "\r\n\r\n"
        + state.selection.text
      ),
    }],
    pending: true,
  }

  createMessage(
    state,
    [{
      role: 'user',
      content: t(state, 'prompt-translate-user'),
    }, ...(
      state.selection.text === state.selection.context
        ? []
        : [{
          role: 'context',
          content: t(state, 'prompt-translate-context'),
        }]
    )],
    t(state, 'prompt-context'),
    t(state, 'prompt-translate'),
  ).then(([error, _response, result]) => {
    state.popupModal.pending = false
    if (error) {
      state.popupModal.error = error.toString()
      return
    }
    state.popupModal.messages.push(result)
  })

  removeContextMenu(state)
}

export const contextMenu = (
  state,
) => c(
  state.contextMenu && state.selection,
  () => n('div', {
    class: 'context-menu',
    style: {
      // Change on which side the dropdown appears based on the pointer's position.
      ...(
        state.contextMenu.pointerX > (window.innerWidth / 2)
          ? {
            left: null,
            right: (window.innerWidth - state.contextMenu.pointerX + 'px'),
            borderTopLeftRadius: 'var(--border-radius)',
            borderTopRightRadius: '0',
          }
          : {
            left: state.contextMenu.pointerX + 'px',
            right: null,
            borderTopLeftRadius: '0',
            borderTopRightRadius: 'var(--border-radius)',
          }
      ),
      top: state.contextMenu.pointerY + 'px',
    }
  }, [
    ...c(
      state.selection.text.length > 0,
      [
        n('button', {
          click: handleCopy,
        }, t(state, 'context-copy')),

        n('button', {
          click: handleTranslate,
        }, t(state, 'context-translate')),

        n('button', {
          click: handleExplain,
        }, t(state, 'context-explain')),

        n('div', {
          class: 'margin',
        }),
      ],
    ),

    n('button', {
      disabled: !window.history.length,
      click: handleBack,
    }, t(state, 'button-go_back')),

    n('button', {
      click: handleReload,
    }, t(state, 'button-reload')),
  ])
)
