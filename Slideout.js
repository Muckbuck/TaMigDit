/*Menu functionality*/
var slideout = new Slideout({
    'panel': document.getElementById('panel'),
    'menu': document.getElementById('menu'),
    'padding': 256,
    'tolerance': 70,
    'side': 'left'
  });

// Toggle button
    document.querySelector('.toggle-button').addEventListener('click', function() {
    slideout.toggle();
});
