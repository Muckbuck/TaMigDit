/*Menu functionality*/


$(document).ready(function() {
    $('#simple-menu-button').sidr();
});

var faded = false;
$("#simple-menu-button").click(function() {
  
    if (!faded) {
        faded = true;
        $( "#destination-field" ).fadeOut( "fast", function() {
            // Animation complete.
        });
        $( "#go-button" ).fadeOut( "fast", function() {
            // Animation complete.
        });
        
    } else {
        faded = false;
        $( "#destination-field" ).fadeIn( "fast", function() {
            // Animation complete.
        });
        $( "#go-button" ).fadeIn( "fast", function() {
            // Animation complete.
        });
        
    }
});
        
/*DateTime picker*/
$(function () {
    $('#datetimepicker12').datetimepicker({
        inline: true
        , sideBySide: true
    });
});