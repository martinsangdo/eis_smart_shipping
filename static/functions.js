/*
Author: Sang Do
*/
//check if what user inputs correctly or not
function validate_input(){

}
//send the request to server to get predicted info
function begin_prediction(){
    var txt_datetime = $('#txt_datetime').val();
    console.log(txt_datetime);

    $.ajax({
        url: SERVER_URI + POST_GET_PREDICTION,  // URL of your Flask route
        type: 'POST',         // HTTP method (POST is common for sending data)
        data: { txt_datetime: txt_datetime }, // Data to send to Flask (as a dictionary)
        dataType: 'json',     // Expected data type from Flask (JSON)
        success: function(response) {
            // Handle successful response from Flask
            console.log('Success:', response);
            //$('#responseArea').html("Flask Response: " + response.message); // Display the message
        },
        error: function(error) {
            // Handle errors
            console.error('Error:', error);
            //$('#responseArea').html("Error: " + error.responseJSON.error); // Display the error message
        }
    });
}