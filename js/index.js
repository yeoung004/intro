const filter = "win16|win32|win64|mac|macintel";

// ------------- VARIABLES ------------- //
let ticking = false;
let isFirefox = (/Firefox/i.test(navigator.userAgent));
let scrollSensitivitySetting = 30; //Increase/decrease this number to change sensitivity to trackpad gestures (up = less sensitive; down = more sensitive) 
const slideDurationSetting = 700; //Amount of time for which slide is "locked"
let currentSlideNumber = 0;
const totalSlideNumber = $(".background").length;
let currentX = ''
let currentY = ''
let scrollIndex = 0
let animatedId = null
let intervalList = []
const target = document.querySelector('html')
const contentsRight = document.getElementsByClassName('contentRight')
const contentsLeft = document.getElementsByClassName('contentLeft')
const index_circles = document.getElementsByClassName('index')

// ------------- DETERMINE DELTA/SCROLL DIRECTION ------------- //
function parallaxScroll(evt) {

  if (isFirefox) {
    //Set delta for Firefox
    delta = evt.detail * (-120);
  } else {
    //Set delta for all other browsers
    delta = evt.wheelDelta;
  }

  if (ticking != true) {
    if (delta <= -scrollSensitivitySetting) {
      //Down scroll
      ticking = true;
      if (currentSlideNumber !== totalSlideNumber - 1) {
        currentSlideNumber++;
        nextItem();
      }
      slideDurationTimeout(slideDurationSetting);
    }
    if (delta >= scrollSensitivitySetting) {
      //Up scroll
      ticking = true;
      if (currentSlideNumber !== 0) {
        currentSlideNumber--;
      }
      previousItem();
      slideDurationTimeout(slideDurationSetting);
    }
  }
}

// ------------- SET TIMEOUT TO TEMPORARILY "LOCK" SLIDES ------------- //
function slideDurationTimeout(slideDuration) {
  setTimeout(function () {
    ticking = false;
  }, slideDuration);
}

// ------------- ADD EVENT LISTENER ------------- //

var mousewheelEvent = isFirefox ? "DOMMouseScroll" : "wheel";
window.addEventListener(mousewheelEvent, _.throttle(parallaxScroll, 60), false);

target.addEventListener('wheel', event => moveBack(event), false)

window.addEventListener("resize", (e) => {
  document.getElementsByClassName('back1')[0].style['left'] = '0vw'
  document.getElementsByClassName('back1')[0].style['top'] = '0vh'
  document.getElementsByClassName('back2')[0].style['right'] = '0vw'
  document.getElementsByClassName('back2')[0].style['bottom'] = '0vh'
})

document.addEventListener("mousemove", (e) => {
  if (currentX == '') currentX = e.pageX;
  let xdiff = e.pageX - currentX;
  currentX = e.pageX;
  if (currentY == '') currentY = e.pageY;
  let ydiff = e.pageY - currentY;
  currentY = e.pageY;
  changePosition(xdiff, ydiff, document.getElementsByClassName('back1')[0], 0)
  changePosition(xdiff, ydiff, document.getElementsByClassName('back2')[0], 1)
})

// ------------- SLIDE MOTION ------------- //
function nextItem() {
  if (currentSlideNumber == 0) {
    $(".fixed_menu2").css('z-index', 997);
  } else {
    $(".fixed_menu2").css('z-index', 999);
  }
  var $previousSlide = $(".background").eq(currentSlideNumber - 1);
  $previousSlide.removeClass("up-scroll").addClass("down-scroll");
}

function previousItem() {
  if (currentSlideNumber == 0) {
    $(".fixed_menu2").css('z-index', 997);
  } else {
    $(".fixed_menu2").css('z-index', 999);
  }
  var $currentSlide = $(".background").eq(currentSlideNumber);
  $currentSlide.removeClass("down-scroll").addClass("up-scroll");
}



function changeIndex(index) {
  Object.keys(index_circles).forEach(key => {
    index_circles[key].className = 'index'
  })
  index_circles[scrollIndex].className = 'index selected-index'
  target.scrollTo({ behavior: "smooth", top: window.innerHeight * scrollIndex })
}

const changeWidth = (width) => {
  const contentsRight = document.getElementsByClassName('contentRight')
  const contentsLeft = document.getElementsByClassName('contentLeft')
  clearInterval()
  Object.keys(contentsRight).forEach(key => {
    for (let min = 0; min <= width; min++) {
      contentsLeft[key].style.width = (width - limit) + '%'
      contentsRight[key].style.width = ((100 - width) - limit) + '%'
    }
  })
}

const changePosition = (xdiff, ydiff, back, index) => {
  let positionX = index ? 'right' : 'left'
  let positionY = index ? 'bottom' : 'top'
  let pastWidth = window.getComputedStyle(back).width.split('px')[0] * 0.000015
  let backX = window.getComputedStyle(back)[positionX].split('px')[0]
  let backY = window.getComputedStyle(back)[positionY].split('px')[0]
  let newX = Number(backX) + (xdiff * pastWidth)
  let newY = Number(backY) + (ydiff * pastWidth)
  back.style[positionX] = newX + 'px'
  back.style[positionY] = newY + 'px'
}

const clearIntervals = () => {
  intervalList.forEach(id => clearInterval(id))
}

const moveBack = (event = null, index = -1) => {
  let min = 20
  let isScollToBottom = event ? event.deltaY > 0 : index > scrollIndex

  if (scrollIndex == 0 && isScollToBottom) {
    clearIntervals()
    let id = setInterval(() => {
      Object.keys(contentsRight).forEach(key => {
        contentsLeft[key].style.width = (15 + min) + '%'
        contentsRight[key].style.width = (85 - min) + '%'
      })
      if (min > 0) min--
    }, 10)
    intervalList.push(id)
  } else if ((scrollIndex == 1 && !isScollToBottom) || (index == 0 && !isScollToBottom)) {
    clearIntervals()
    let id = setInterval(() => {
      Object.keys(contentsRight).forEach(key => {
        contentsLeft[key].style.width = (40 - min) + '%'
        contentsRight[key].style.width = (60 + min) + '%'
      })
      if (min > 0) min--
    }, 10)
    intervalList.push(id)
  }
  if (index > -1)
    scrollIndex = index
  else
    scrollIndex = scrollIndex + (isScollToBottom ? 1 : -1)

  if (scrollIndex < 0)
    scrollIndex = 0
  else if (scrollIndex > 6)
    scrollIndex = 6

  changeIndex(scrollIndex)
}
