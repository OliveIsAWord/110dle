import './style.css'

const rule = 110
const rowLen = 5
const colLen = 3

type Square = {
  trueValue: boolean,
  userValue: boolean,
  div: HTMLDivElement,
};

function click_square(x: number, y: number) {
  // console.log(x, ".", y, "=>", pyramid[y][x])
  const square = pyramid[y][x];
  square.userValue = !square.userValue
  if (square.userValue) {
    square.div.classList.add("lit")
  } else {
    square.div.classList.remove("lit")
  }
  checkSolved()
}

function checkSolved() {
  for (let y = 0; y < colLen - 1; y++) {
    for (let x = 0; x < rowLen; x++) {
      const square = pyramid[y][x]
      if (square.trueValue !== square.userValue) {
        return
      }
    }
  }
  const p = document.createElement("p")
  p.innerText = "YOU WIN!!!"
  app_div.appendChild(p)
  
  for (let y = 0; y < colLen; y++) {
    for (let x = 0; x < rowLen; x++) {
      const square = pyramid[y][x]
      square.div.classList.remove("clickable")
      square.div.onclick = (_ev: PointerEvent) => {}
    }
  }
}

const app_div = document.querySelector<HTMLDivElement>('#app')!

// add header
{
  const title = document.createElement("h1")
  app_div.appendChild(title)
  title.textContent = "110dle"
}

// create pyramid
const pyramid: Square[][] = []
const pyramid_div = document.createElement("div")
app_div.appendChild(pyramid_div)
pyramid_div.classList.add("pyramid")
for (let y = 0; y < colLen; y++) {
  const row = document.createElement("div")
  pyramid_div.appendChild(row)
  row.classList.add("pyramid-row")
  const pyramid_row = []
  for (let x = 0; x < rowLen; x++) {
    const square = document.createElement("div")
    row.appendChild(square)
    square.classList.add("square")
    if (y < colLen - 1) {
      square.classList.add("clickable")
      square.onclick = (_ev: PointerEvent) => click_square(x, y)
    }
    pyramid_row.push({trueValue: false, userValue: false, div: square})
  }
  pyramid.push(pyramid_row)
}

// generate solution
for (const start_square of pyramid[0]) {
  start_square.trueValue = Math.random() < .5
}
for (let y = 1; y < colLen; y++) {
  for (let x = 0; x < rowLen; x++) {
    let bits = 0;
    for (let i = -1; i <= 1; i++) {
      const px = x + i;
      if (0 <= px && px < rowLen && pyramid[y - 1][px].trueValue) {
        bits |= 1 << (1 - i);
      }
    }
    console.log(x, y, bits)
    pyramid[y][x].trueValue = ((rule >> bits) & 1) !== 0
  }
}

// display clues
for (let x = 0; x < rowLen; x++) {
  const square = pyramid[colLen - 1][x]
  if (square.trueValue) {
    square.div.classList.add("lit")
  }
}
