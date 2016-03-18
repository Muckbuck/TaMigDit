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
$('#datetimepicker3').datetimepicker({
  format:'d.m.Y H:i',
  inline:true,
  lang:'sv',
allowTimes:[
  '12:00', '13:00', '15:00', 
  '17:00', '17:05', '17:20', '19:00', '20:00'
 ]
});

$('#input').datetimepicker();
$('toggle-time-button').on('click', function () {
    $('#input').datetimepicker('toggle');
});

$.datetimepicker.setLocale('sv');