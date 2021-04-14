window.referenceClock = {};
document.getElementById("launching") && (
  document.getElementById("launching").innerHTML = `<span class="launch-txt"><mob>We're </mob>Launching in: </span><div class="arrange-clock" id="launchClock"><span class="days"></span>
  <x>:</x><span class="hours"></span>
  <x>:</x><span class="minutes"></span>
  <x>:</x><span class="seconds"></span></div>`,

setInterval(function () {
  //BOTH THESE TIMES SHOULD BE PROVIDED BY THE BACKEND SERVER TO PREVENT
  //TIME-ZONE MISMATCHES WHEN THE USER IS NOT IN THE SAME TIMEZONE AS UTC
  //THIS SCRIPT EXPECTS TIME TO BE PROVIDED IN MILLIsec. 

  var start = new Date()
  var end = new Date('2022/01/01 00:00:00 UTC')

  var sec = end - start;
  sec = sec / 1000;
  sec = Number(sec);

  var clock = {};

clock.d = Math.floor(sec / (3600*24));
clock.h = Math.floor(sec % (3600*24) / 3600);
clock.m = Math.floor(sec % 3600 / 60);
  clock.s = Math.floor(sec % 60);
  
  var parent = document.getElementById("launchClock")
  
  parent.querySelectorAll(".days")[0].style.animation = ""
  parent.querySelectorAll(".hours")[0].style.animation = ""
  parent.querySelectorAll(".minutes")[0].style.animation = ""
  parent.querySelectorAll(".seconds")[0].style.animation = ""
  
  window.referenceClock.d != clock.d && (parent.querySelectorAll(".days")[0].style.animation = "build-in-clock .2s linear forwards 1")
  window.referenceClock.h != clock.h && (parent.querySelectorAll(".hours")[0].style.animation = "build-in-clock .2s linear forwards 1")
  window.referenceClock.m != clock.m && (parent.querySelectorAll(".minutes")[0].style.animation = "build-in-clock .2s linear forwards 1")
  window.referenceClock.s != clock.s && (parent.querySelectorAll(".seconds")[0].style.animation = "build-in-clock .2s linear forwards 1")

  parent.querySelectorAll(".days")[0].innerHTML = clock.d
  parent.querySelectorAll(".hours")[0].innerHTML = clock.h < 10 ? `0${clock.h}` : clock.h
  parent.querySelectorAll(".minutes")[0].innerHTML = clock.m < 10 ? `0${clock.m}` : clock.m
  parent.querySelectorAll(".seconds")[0].innerHTML = clock.s < 10 ? `0${clock.s}` : clock.s
  
  window.referenceClock = clock;
  
}, 1000)

)