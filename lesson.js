let seed = 0
let currentRule = 73

let wrap = document.querySelector('#wrapper')
let metaContainer = document.querySelector('#meta')

let currentRow = initialiseRow()
wrap.appendChild(currentRow)
pageUpdate()

setInterval(function() {
  currentRow = processNextRow(currentRow)
  wrap.appendChild(currentRow)
  if (wrap.children.length > 100) {
    wrap.removeChild(wrap.childNodes[0])
  }
  pageUpdate()
}, 100)

setInterval(function() {
  if (currentRule++ === 256) {
    currentRule = 0
  }

  currentRow = initialiseRow()
  wrap.appendChild(currentRow)

  pageUpdate()
}, 6000)

function pageUpdate () {
  window.scrollTo(0, document.body.scrollHeight)

  metaContainer.innerHTML = `Current Rule: ${currentRule}`
}

function processNextRow(prevRow) {
  let currRow = prevRow.cloneNode(true)

  let prevCurr = prevRow.firstChild
  let currChild = currRow.firstChild

  while (currChild !== null) {
    let prevLeft = prevCurr.previousSibling || currentRow.lastChild
    let prevRight = prevCurr.nextSibling || currentRow.firstChild

    let nextState = getNextState([getState(prevLeft), getState(prevCurr), getState(prevRight)], currentRule)
    currChild.classList.remove('active', 'inactive')
    currChild.classList.add(nextState ? 'active': 'inactive')

    prevCurr = prevCurr.nextSibling
    currChild = currChild.nextSibling
  }

  return currRow
}

function getState (elem) {
  return elem.classList.contains('active') ? 1 : 0
}

function getNextState(input, currentRule) {
  // The next state of a node is function of the rule number and the input state
  // So, first we translate the current rule num into a byte representation
  // and store it in a string.
  // Then we translate the input state into an integer by taking the prev 3 vals
  // as binary, which gives us 8 possible values (0 - 7).
  // We will then use that as the index of the character to pick from the
  // current rules binary representation.
  // because this is already binary, we use it as the next state

  let binStr = padBin(currentRule.toString(2))
  let pick = parseInt(input.join(''), 2)
  return Number(binStr.charAt(pick))

  // one lined
  // return padBin(currentRule.toString(2)).charAt(parseInt(input.join(''), 2))
}

function padBin(input) {
  while (input.length !== 8) {
    input = '0' + input
  }
  return input
}

function initialiseRow(wrap) {
  let initialRow = document.createElement('div')
  initialRow.classList.add('row')

  for (let i = 0; i < 100; i++) {
    let node = document.createElement('div')
    node.classList.add('node', randomState())

    initialRow.appendChild(node)
  }

  return initialRow
}

function randomState() {
  return Math.round(Math.random()) ? 'active' : 'inactive'
}

function random() {
    let x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
}
