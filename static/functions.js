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
    //load turbines mapping into list
    var $turbines_list = $('#turbines_list');
    var index = 0;  //to select random turbines
    for (var turbine_key in turbines_mapping){
        var $li = $('<li></li>').clone();
        if (index++ < 6){
            $li.append($('<input type="checkbox" value="'+turbines_mapping[turbine_key]+'" name="cbo_turbines" checked/>'));
        } else {
            $li.append($('<input type="checkbox" value="'+turbines_mapping[turbine_key]+'" name="cbo_turbines"/>'));
        }
        
        $li.append($('<span>'+turbine_key+'</span>'));

        $turbines_list.append($li);
    }
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
    //get list of turbines
    var list_turbine_ids = [];
    
    $("input[name='cbo_turbines']").each(function() {
        if (this.checked){
            list_turbine_ids.push(parseInt(this.value));
        }
    });
    if (list_turbine_ids.length < 3){
        $('#txt_error').text('Please select more than 3 turbines');
        return;
    }
    //console.log(list_turbine_ids);
    //
    const body_data = {
        'list_turbine_ids': list_turbine_ids.join(','),
        'from_wave_h': $.trim($('#from_wave_h').val()),
        'from_e_wind': $.trim($('#from_e_wind').val()), 
        'from_n_wind': $.trim($('#from_n_wind').val()), 
        'from_e_current': $.trim($('#from_e_current').val()), 
        'from_n_current': $.trim($('#from_n_current').val()), 
        'from_time': cur_timestamp
    }
    //clear data
    $('#txt_error').text('Predicting ...');
    $('#txt_result_fuel').text('');
    $('#txt_result_turbines').text('');
    $.ajax({
        url: POST_GET_PREDICTION,  // URL of your Flask route
        type: 'POST',         // HTTP method (POST is common for sending data)
        data: body_data, // Data to send to Flask (as a dictionary)
        dataType: 'json',     // Expected data type from Flask (JSON)
        success: function(response) {
            // Handle successful response from Flask
            console.log('Success:', response);
            $('#txt_result_fuel').text(response['predicted_fuel'].toFixed(3));
            //show list of turbines
            var shortest_path_result = response['shortest_path_result'];
            var result_turbines = [];
            for (var i in shortest_path_result){
                //console.log(shortest_path_result[i]);
                for (var turbine_name in turbines_mapping){
                    if (parseInt(shortest_path_result[i]) == turbines_mapping[turbine_name]){
                        result_turbines.push(turbine_name);
                        break;
                    }
                }
            }
            $('#txt_result_turbines').html(result_turbines.join(' -> '));
            //
            $('#txt_error').text('');
        },
        error: function(error) {
            // Handle errors
            console.error('Error:', error);
            $('#txt_error').text(error);
        }
    });
}