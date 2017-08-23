const q = (target) => { return document.querySelector(target) }

let map, heatmap

// Take query and return fetch promise in json format
function getData(query){
  return fetch(query)
          .then(res => res.json())
}

// Take JSON array and return lat-lng points
function getCoords(array=[]){
  return array.map((row) => {
    let coords = row.geometry.coordinates
    return new google.maps.LatLng(coords[1],coords[0])
  })
}

// Take query and return lat-lng points
function loadQuery(query){
  return getData(query)
          .then((array) => {return getCoords(array)})
}

// Take query and set data on map
function setCoords(query) {
  // let points = loadQuery(query)
  // console.log(points)
  // heatmap.setData(points)
  loadQuery(query).then(points => heatmap.setData(points))
}

function initMap() {
  map = new google.maps.Map(q('#map'), {
    center: {lat: 49, lng: -20},
    zoom: 2
  });

  heatmap = new google.maps.visualization.HeatmapLayer({
    map: map,
    data: getCoords()
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const slider = q('#slider')
  const sliderValue = q('#slider-value')

  const minValue = q('#min')
  const maxValue = q('#max')
  const stepValue = q('#step')
  const intervalValue = q('#interval')

  const sliderPlayBtn = q('#slider-play-btn')
  const sliderStopBtn = q('#slider-stop-btn')

  let query
  let tid

  // Set default values
  initMap()
  sliderValue.innerHTML = slider.value

  function updateSliderValue() {
    sliderValue.innerHTML = slider.value
    query = `http://localhost:3001/api/hurricanes?year=${slider.value}`
    setCoords(query)
  }

  function stopTimer(){
    clearInterval(tid)
    tid = undefined
  }

  slider.addEventListener('input', () => {
    updateSliderValue()
    stopTimer()
  })

  minValue.addEventListener('input', () => {
    slider['min'] = minValue.value
  })

  maxValue.addEventListener('input', () => {
    slider['max'] = maxValue.value
  })

  stepValue.addEventListener('input', () => {
    slider['step'] = stepValue.value
  })


  // Slider play button
  sliderPlayBtn.addEventListener('click', (event) => {
    event.preventDefault()


    if(slider.value === slider['max']){
      slider.value = slider['min']
      updateSliderValue()
    }

    if(!tid) {
      tid = setInterval(function () {
        if(parseInt(slider.value) === parseInt(slider['max'])){
          stopTimer()
        } else {
          slider.stepUp()
          updateSliderValue()
        }
      }, intervalValue.value * 1000)
    }

  })

  // Slider stop button
  sliderStopBtn.addEventListener('click', (event) => {
    stopTimer()
  })
})












/**/
