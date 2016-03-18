/*Menu functionality*/


$(document).ready(function() {
    $('#simple-menu-button').sidr();
});


var faded = false;
$( "#simple-menu-button" ).click(function() {
  
    if (!faded) {
        $( "#fadebar" ).fadeOut( "slow", function() {
            // Animation complete.
        });
    } else {
         $( "#fadebar" ).fadeIn( "slow", function() {
            // Animation complete.
        });
        
    }
        
});