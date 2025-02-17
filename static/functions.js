/*
Author: Sang Do
*/
//check if what user inputs correctly or not
$(document).ready(function() {
    // Get current date and time
    var now = new Date();

    // Initialize datepicker
    $("#datepicker").datepicker({
        dateFormat: 'dd-mm-yy', // Customize date format
        defaultDate: now,       // Set default to now
        onSelect: function(selectedDate) {
            // Update the timepicker's minDate if a date is selected
            $("#timepicker").timepicker("option", "minDate", selectedDate);
        }
    });

    // Initialize timepicker
    $("#timepicker").timepicker({
        timeFormat: 'HH:mm', // 24-hour format (or 'hh:mm A' for 12-hour)
        ampm: false,           // Set to true for 12-hour format
        interval: 15,         // Time interval (e.g., 15 minutes)
        defaultTime: now,        // Set default time to now
        dynamic: true,
        // Set minDate and maxDate to the selected date from datepicker
        minDate: now,
        maxDate: $("#datepicker").val(),
        change: function(time) {
            // Update the datepicker's maxDate if a time is selected
            var selectedTime = $(this).val();
            var selectedDate = $("#datepicker").val();

            if(selectedDate){
                var combinedDateTime = new Date(selectedDate + " " + selectedTime);
                $("#datepicker").datepicker("option", "maxDate", combinedDateTime);
            }
        }
    });

    // Set the initial values of the date and time pickers
    $("#datepicker").datepicker("setDate", now);
    $("#timepicker").timepicker("setTime", now);

});
//
function convert_datetime_2_sec(){
    var txt_datetime = $('#datepicker').val();
    var timepicker = $('#timepicker').val();

    const datetimeString = txt_datetime + ' ' + timepicker;

    // 1. Split the date and time parts
    const [datePart, timePart] = datetimeString.split(' ');

    // 2. Split the date into day, month, and year
    const [day, month, year] = datePart.split('-');

    // 3. Split the time into hours and minutes
    const [hours, minutes] = timePart.split(':');

    // 4. Create a Date object (month is 0-indexed in JavaScript Date)
    const date = new Date(year, month - 1, day, hours, minutes);

    // 5. Get the timestamp in milliseconds and convert to seconds
    const timestampSeconds = date.getTime() / 1000;

    return timestampSeconds;
}
/////
function validate_input(){
    //todo
}
//send the request to server to get predicted info
function begin_prediction(){
    var cur_timestamp = convert_datetime_2_sec();
    //console.log(cur_timestamp);
    const body_data = {
        'from_wave_h': $.trim($('#from_wave_h').val()),
        'from_e_wind': $.trim($('#from_e_wind').val()), 
        'from_n_wind': $.trim($('#from_n_wind').val()), 
        'from_e_current': $.trim($('#from_e_current').val()), 
        'from_n_current': $.trim($('#from_n_current').val()), 
        'from_time': cur_timestamp
    }

    $.ajax({
        url: POST_GET_PREDICTION,  // URL of your Flask route
        type: 'POST',         // HTTP method (POST is common for sending data)
        data: body_data, // Data to send to Flask (as a dictionary)
        dataType: 'json',     // Expected data type from Flask (JSON)
        success: function(response) {
            // Handle successful response from Flask
            console.log('Success:', response['predicted_fuel']);
            //$('#responseArea').html("Flask Response: " + response.message); // Display the message
        },
        error: function(error) {
            // Handle errors
            console.error('Error:', error);
            //$('#responseArea').html("Error: " + error.responseJSON.error); // Display the error message
        }
    });
}