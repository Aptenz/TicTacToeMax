const socket = io()
const textElement = document.getElementById('text')
const optionButtonsElement = document.getElementById('option-buttons')

const users = {}

const name = prompt('What is your name?')
socket.emit('new-user', name)

function createUser(name, totalPlayers) {
  users[totalPlayers] = name;
}

socket.on('user-connected', ({name, totalPlayers}) => {
  createUser(name, totalPlayers)
})

let state = {}
function startGame() {
  state = {}
  showTextNode(1)
}
function showTextNode(textNodeIndex) {
  const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)
  textElement.innerText = textNode.text
  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild)
  }

  textNode.options.forEach(option => {
    if (showOption(option)) {
      const button = document.createElement('button')
      button.innerText = option.text
      button.classList.add('btn')
      button.addEventListener('click', () => selectOption(option))
      optionButtonsElement.appendChild(button)
    }
  })
}

function showOption(option) {
  return option.requiredState == null || option.requiredState(state)
}

function selectOption(option) {
  const nextTextNodeId = option.nextText
  if (nextTextNodeId <= 0) {
    return startGame()
  }
  state = Object.assign(state, option.setState)
  showTextNode(nextTextNodeId)
}

const textNodes =[
  {
      id: 1,
      text: 'It is time to vote!',
      options: [
        {
          text: users[1],
          setState: { vote1: true },
          nextText: 2
        },
        {
          text: users[2],
          setState: { vote2: true},
          nextText: 2
        }
      ]
    },
    {
      id: 2,
      text: 'Your vote has been casted',
      options: [
        {
          text: 'Voted',
          requiredState: (currentState) => currentState.vote1,
          setState: { },
          nextText: 3
        },
        {
          text: user[2],
          requiredState: (currentState) => currentState.vote2,
          setState: { blueGoo: false, shield: true },
          nextText: 3
        }
      ]
    }

]

startGame()
