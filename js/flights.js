$("#spinner").hide();

$("#findFlightsBtn").on("click", event => {
  let numberAdults = "1";
  let classOfService = "ECONOMY";
  let typeOfTrip = "ONEWAYTRIP";
  let departureDate = $("#datepickerDepart").val();
  let origin = $("#fromInput").val();
  let destination = "MIA";

  $("#spinner")
    .hide()
    .show();
  if ($("#table_body").html() != "") {
    $("#table_body").html("");
    setFlightDetails(
      numberAdults,
      classOfService,
      typeOfTrip,
      departureDate,
      destination,
      origin
    );
  } else {
    setFlightDetails(
      numberAdults,
      classOfService,
      typeOfTrip,
      departureDate,
      destination,
      origin
    );
  }
});

function setFlightDetails(
  numberAdults,
  classOfService,
  typeOfTrip,
  departureDate,
  destination,
  origin
) {
  let flightDetails = {
    ResponseVersion: "VERSION41",
    FlightSearchRequest: {
      Adults: numberAdults,
      Child: "0",
      ClassOfService: classOfService,
      InfantInLap: "0",
      InfantOnSeat: "0",
      Seniors: "0",
      TypeOfTrip: typeOfTrip,
      SegmentDetails: [
        {
          DepartureDate: departureDate,
          DepartureTime: "0000",
          Destination: destination,
          Origin: origin
        }
      ]
    }
  };
  apiCalls(flightDetails);
}

// apiCalls()

function apiCalls(details) {
  // let details = setFlightDetails()

  let apiCall = {
    async: true,
    crossDomain: true,
    url:
      "https://api-dev.fareportallabs.com/air/api/search/searchflightavailability",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic cHJhdGliYXNoYW4uZ0BnbWFpbC5jb206RjZCMjkzRjMg",
      //   Authorization: "Basic ZnJhbmR1bHVjQGdtYWlsLmNvbTpmbGlnaHRkZXBvdDEyMw==",
      "Cache-Control": "no-cache",
      "Postman-Token": "dc633901-993f-469a-b50d-ab22c7783bb5"
      // "Postman-Token": "38e78197-4179-4e24-8511-89c3934256d4"
    },
    processData: false,
    data: JSON.stringify(details)
  };
  console.log(details);
  console.log(apiCall);
  findFlights(apiCall);
}

// checkout function

function checkout(id) {
  console.log("HOLA!");

  var table_row = document.getElementById(id);
  var finalOutput = table_row.outerHTML;
  console.log(finalOutput);
  $("#flightModalBody").html(finalOutput);
  storeFlightSelected(finalOutput);
}

// AJAX API Call

function findFlights(callDetails) {
  console.log(callDetails);
  $.ajax(callDetails).done(function(response) {
    let outboundFlightsArray =
      response.FlightResponse.FpSearch_AirLowFaresRS.OriginDestinationOptions
        .OutBoundOptions.OutBoundOption;

    let segmentReferenceArray =
      response.FlightResponse.FpSearch_AirLowFaresRS.SegmentReference
        .RefDetails;

    if (outboundFlightsArray.length) {
      $("#spinner").hide();
    }

    // instead of injecting DOM for every item / row, build a long string and inject
    // into the DOM once

    // Add a single event on the <table> element using "event delegation"

    function clickPlusBtn(evt) {
      // evt.data.your_stuff
      // put some defensive code that makes sure everyting looks right
      //
    }

    // $('#theTable').on('click', '.plus-btn', clickPlusBtn)
    //
    // var htmlStr = ''
    // $.each(array, function (rowData) {
    //   htmlStr += buildTheRow(rowData)
    // })
    // $('#theTable').html(htmlStr)
    // $('#theTable').on('click', '.row-btn', clickedTheRow)

    $.each(outboundFlightsArray, (index, flight) => {
      // Flight Segment Object
      let flightSegment = outboundFlightsArray[index].FlightSegment[0];

      // Segment Reference Object
      let segmentReference = segmentReferenceArray[index];

      let departureAirport = flightSegment.DepartureAirport.LocationCode;
      let departureDateTime = flightSegment.DepartureDateTime;
      let arrivalAirport = flightSegment.ArrivalAirport.LocationCode;
      let arrivalDateTime = flightSegment.ArrivalDateTime;
      let flightDuration = flightSegment.FlightDuration;
      let marketingAirline = flightSegment.MarketingAirline.Code;
      let operatedByAirline = flightSegment.OperatedByAirline.CompanyText;
      let flightCabin = flightSegment.FlightCabin;
      let flightNumber = flightSegment.FlightNumber;
      let stopQty = flightSegment.StopQuantity;
      let totalAdultFare = parseFloat(
        Math.round(
          segmentReference.PTC_FareBreakdown.Adult.TotalAdultFare * 100
        ) / 100
      ).toFixed(2);
      console.log(operatedByAirline);
      var entry = `
        <tr id="row_${index}" class="table_row selectedFlight" data-id="{{id}}">
          <th id="airline"
          scope="col"> <img class="flight-img"
          src="http://www.gstatic.com/flights/airline_logos/70px/${marketingAirline}.png"></th>
          <th id="flightTime" scope="col">${(departureDateTime.slice(11) +
            " - " +
            arrivalDateTime.slice(11),
          operatedByAirline)}</th>
          <th id="stops" scope="col">${stopQty} stops</th>
          <th id="duration" scope="col">${flightDuration +
            "hrs"} <br> ${departureAirport} - ${arrivalAirport} </th>
          <th scope="col">Price <br></th>
          <th>
            <button type="button" onclick="checkout('row_${index}')" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">$${totalAdultFare}</button>
          </th>
        </tr>

        
     
     
        `;
      $("#table_body").append(entry);
    });
  });
}

// checkout page

function storeFlightSelected(finalOutput) {
  sessionStorage.setItem("flightCheckOut", finalOutput);
  window.location = "checkout.html";
  return false;
}

function getFlightSelected(finalOutput) {
  let flightSelected = sessionStorage.getItem("flightCheckOut");
  $("#injectHere").append(flightSelected);
}
