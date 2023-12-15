// Update dropdown list with saved art from local storage
;(() => {
  sessionStorage.setItem('paintBrush', '')
  for (let i = 0; i < localStorage.length; i++) {
    let newOpt = document.createElement('option')
    newOpt.textContent = localStorage.key(i)
    newOpt.value = localStorage.key(i)
    document.querySelector('#savedLibrary').appendChild(newOpt)
  }
})()
// Update the color of the paint brush when the user uses the color picker
const brushColorPreview = document.querySelector('.brushColor')
const hexcodes = document.querySelectorAll('.canvas__paint-hexcodes input')
const paintColors = document.querySelectorAll('.canvas__paint')
paintColors.forEach((paintColor, index) => {
  paintColor.addEventListener('input', (event) => {
    sessionStorage.setItem('paintBrush', event.target.value)
    brushColorPreview.style.backgroundColor = event.target.value
    hexcodes[index].value = event.target.value
  })
})
// Update the color of the paint brush when the user clicks on the paint color
paintColors.forEach((paintColor, index) => {
  paintColor.addEventListener('click', (event) => {
    sessionStorage.setItem('paintBrush', event.target.value)
    brushColorPreview.style.backgroundColor = event.target.value
    hexcodes[index].value = event.target.value
  })
})
// Update the color of the paint color when the user types in the hexcode
const paint = document.querySelector('.canvas__paint-group')
hexcodes.forEach((hexcode, index) => {
  hexcode.addEventListener('input', (event) => {
    Array.from(paint.children)[index].value = event.target.value
    hexcode.value = event.target.value
  })
})
// Update the color of the pixel when the user clicks on it
const pixels = document.querySelector('.canvas__grid')
pixels.addEventListener('click', (event) => {
  if (Array.from(pixels.children).indexOf(event.target) === -1) {
  } else if (sessionStorage.getItem('paintBrush') === '') {
  } else if (eraserMode) {
    event.target.style.backgroundColor = ''
    event.target.style.border = '0.1px dashed #0004'
  } else {
    const paintColor = sessionStorage.getItem('paintBrush')
    event.target.style.backgroundColor = paintColor
    event.target.style.border = 'none'
  }
})
// Generate a random palette when the user clicks the button
document
  .querySelector('#generatePalette')
  .addEventListener('click', async () => {
    const response = await fetch('http://colormind.io/api/', {
      method: 'POST',
      body: JSON.stringify({
        model: 'default',
        input: [[44, 43, 44], [90, 83, 82], 'N', 'N', 'N']
      })
    })
    const data = await response.json()
    for (let i = 0; i < data.result.length; i++) {
      let hexPalette = rgbToHex(
        data.result[i][0],
        data.result[i][1],
        data.result[i][2]
      )
      Array.from(paint.children)[i].value = hexPalette
      hexcodes[i].value = hexPalette
    }
  })
// Clear the palette when the user clicks the button
document.querySelector('#clearPalette').addEventListener('click', () => {
  for (let i = 0; i < 5; i++) {
    Array.from(paint.children)[i].value = '#ffffff'
    hexcodes[i].value = ''
  }
})
// Enable and disable erase mode when the user clicks the button
let eraser = document.querySelector('#enableEraser')
eraser.style.color = 'red'
let eraserMode
eraser.addEventListener('click', () => {
  if (eraserMode) {
    eraserMode = false
    eraser.style.color = 'red'
  } else {
    eraserMode = true
    eraser.style.color = 'green'
  }
})
// Clear the canvas when the user clicks the button
document.querySelector('#clearCanvas').addEventListener('click', () => {
  for (let i = 0; i < pixels.children.length; i++) {
    pixels.children[i].style.backgroundColor = ''
    pixels.children[i].style.border = '0.1px dashed #0004'
  }
})
// Save the canvas when the user clicks the button
const saveArtName = document.querySelector('.saveArt__text')
document.querySelector('.saveArt__submit').addEventListener('click', () => {
  if (saveArtName.value !== '') {
    let artName = saveArtName.value
    const artCoords = {}

    for (let i = 0; i < pixels.children.length; i++) {
      artCoords[i] = pixels.children[i].style.backgroundColor
    }
    localStorage.setItem(artName, JSON.stringify(artCoords))
    let newOpt = document.createElement('option')
    newOpt.textContent = artName
    newOpt.value = artName
    document.querySelector('#savedLibrary').appendChild(newOpt)
  } else {
    saveArtName.setAttribute('placeholder', 'Please enter a name')
  }
})
// Load the canvas when the user clicks the button
document
  .querySelector('.savedLibrary__submit')
  .addEventListener('click', () => {
    const artName = document.querySelector('#savedLibrary').value
    const artCoords = JSON.parse(localStorage.getItem(artName))

    for (let i = 0; i < pixels.children.length; i++) {
      pixels.children[i].style.backgroundColor = artCoords[i]
    }
  })
// Delete the saved art from storage and list
document
  .querySelector('.savedLibrary__delete')
  .addEventListener('click', () => {
    localStorage.removeItem(document.querySelector('#savedLibrary').value)
    document
      .querySelector('#savedLibrary')
      .removeChild(document.querySelector('#savedLibrary option:checked'))
  })
// Convert RGB to Hex
function rgbToHex(r, g, b) {
  let componentToHex = (c) => {
    const hex = c.toString(16)
    return hex.length == 1 ? '0' + hex : hex
  }
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}
