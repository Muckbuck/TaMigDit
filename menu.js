/*Menu functionality*/


$(document).ready(function() {
    $('#simple-menu-button').sidr();
});

var faded = false;
$( "#simple-menu-button" ).click(function() {
  
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

/*
/*DateTime picker
$.datetimepicker.setLocale('en');

jQuery('#datetimepicker3').datetimepicker({
  format:'d.m.Y H:i',
  inline:true,
  lang:'en'
});

jQuery('#datetimepicker').datetimepicker();
*/