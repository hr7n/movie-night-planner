//DEPENDENCIES ====================
var apiKeyTmbd = "76c745d0d38df70f6fb5ec449119b744";
var apiKeyOmbd = "3c12800d";

var genreDropdown = $("#genre-dropdown");
var durationValue = $("#duration-dropdown").val();
var typeValue = $("#type-dropdown").val();

//DATA=============================
// adds range slider
var slider = document.getElementById("test-slider");

var format = {
  to: function (value) {
    return Math.round(value);
  },
  from: function (value) {
    return Math.round(value);
  },
};

noUiSlider.create(slider, {
  start: [1900, 2023],
  connect: true,
  tooltips: true,
  step: 1,
  orientation: "horizontal",
  range: {
    min: 1900,
    max: 2023,
  },
  format,
  //   format: wNumb({ //styling, 3rd party library
  //     decimals: 0,
  //   }),
});

var yearRangeValue = slider.noUiSlider.get();

//FUNCTIONS =======================
let userGenre;
let startDate;
let endDate;

function getSliderValues() {
  yearRangeValue = slider.noUiSlider.get();
  // console.log(yearRangeValue);
  var startYear = yearRangeValue[0];
  var endYear = yearRangeValue[1];
  startDate = `${startYear}-01-01`;
  endDate = `${endYear}-12-31`;
  // console.log(startDate);
  // console.log(endDate);
  return [startDate, endDate];
}

function getGenreValue() {
  userGenre = genreDropdown.val();
  // console.log(userGenre);
  return userGenre;
}

//fetch request TMBD
// function getTmbdData() {
//   slider.noUiSlider.on("change", function () {
//     yearRangeValue = slider.noUiSlider.get();
//     console.log(yearRangeValue);
//     var startYear = yearRangeValue[0];
//     var endYear = yearRangeValue[1];
//     const startDate = `${startYear}-01-01`;
//     const endDate = `${endYear}-12-31`;
//     console.log(startDate);
//     console.log(endDate);
//     updateApiRequest(userGenre, startDate, endDate);
//   });
// genreDropdown.on("change", function () {
//   userGenre = genreDropdown.val();
//   updateApiRequest(userGenre, startDate, endDate);
// });

// someInput.on("change", updateApiRequest)
slider.noUiSlider.on("change", updateApiRequest);
genreDropdown.on("change", updateApiRequest);

function updateApiRequest() {
  // get all the values from the inputs

  // get slider values
  var sliderValues = getSliderValues(); // returns an array
  console.log(sliderValues);

  // get genre value
  var userGenre = getGenreValue(); // returns a string
  console.log(userGenre);

  // build the query url
  var queryURL = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKeyTmbd}&language=en-US`;
  if (userGenre) queryURL += `&with_genres=${userGenre}`;
  if (sliderValues[0] && sliderValues[1])
    queryURL += `&release_date.gte=${sliderValues[0]}&release_date.lte=${sliderValues[1]}`;
  // queryUrl = `&sort_by=vote_average.desc&vote_count.gte=2500`;

  // make the request
  fetch(queryURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        console.error("Error: " + response.statusText);
        return null;
      }
    })
    .then(function (data) {
      if (data) {
        console.log(data.results);
      } else {
        console.log("No data received");
      }
    });
}

// // getTmbdData();
// // fetch request OMDB
// function getOmbdData() {
//   var queryURL = `http://www.omdbapi.com/?apikey=${apiKeyOmbd}&`;
//   fetch(queryURL).then(function (response) {
//     if (response.ok) {
//       response.json().then(function (data) {
//         console.log(data);
//       });
//     }
//   });
// }
// getOmbdData();

//USER INTERACTIONS================
// Handle form submission
console.log($("#search-form"));
$("#search-form").submit(function (event) {
  event.preventDefault(); // Prevent the form from submitting normally
  console.log("form clicked");
  // Get user input from the search input field
  var searchQuery = $("#search").val();

  // Create an object to store the user's preferences
  var userPreferences = {
    searchQuery: searchQuery,
    genre: userGenre,
    yearRange: yearRangeValue,
    duration: durationValue,
    type: typeValue,
  };

  // Store the user's preferences in localStorage
  localStorage.setItem("userPreferences", JSON.stringify(userPreferences));

  // You can also retrieve data from localStorage later if needed
  // var storedPreferences = localStorage.getItem('userPreferences');
  // var parsedPreferences = JSON.parse(storedPreferences);
  // console.log(parsedPreferences);

  // For demonstration, we'll just display a confirmation message
  // alert("Your preferences have been saved locally.");

  updateApiRequest();

  // Redirect to the results page
  // window.location.href = "result-page.html";

  // You can further process the data or update the page content.
});
