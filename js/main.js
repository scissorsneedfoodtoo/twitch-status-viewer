$(document).ready(function() {

  var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "Jakejw93", "scissorsneedfoodtoo", "brunofin", "comster404"]; // global var of channel names to build HTML

  function applySearchTerms() {
    $(".twitch-channels-list a").each(function() { // iterates through the twitch-channel-list li

      $(this).attr("channel-search-term", // creates attr in li
        $(this).text().toLowerCase() // applies the lowercase text of each li as the attr
      ); // end attr
    }); // end each
  }; // end applySearchTerms
  

  $(".live-search-box").on('keyup', function() {

    var searchTerm = $(this).val().toLowerCase(); // changes search box text to lower case to prevent case errors when searching the attr of the lis

    $(".twitch-channels-list a").each(function() { // looks at each li
      if ($(this).filter('[channel-search-term *= ' + searchTerm + ']').length > 0 || searchTerm.length < 1) { // filters for the attr channel-search-term
        $(this).show();
      } else {
        $(this).hide();
      }; // end if else
    }); // end each 
  }); // end on keyup
  

 function twitchStreamStatus() {

    var outputHTML = "";
    var sortArr = [];

    $(channels).each(function(index) {

      var streamURL = $.getJSON("https://wind-bow.gomix.me/twitch-api/streams/" + channels[index] + "?callback=?"); // this url to check if users are currently streaming

      var channelURL = $.getJSON("https://wind-bow.gomix.me/twitch-api/channels/" + channels[index] + "?callback=?"); // this url to get and set profile pictures

      var defaultPic = "https://res.cloudinary.com/scissorsneedfoodtoo/image/upload/c_scale,h_300,q_100/v1483945240/Glitch_Purple_RGB_z5yxog.png"; // url for default twitch logo
      
      var errorPic = "https://res.cloudinary.com/scissorsneedfoodtoo/image/upload/v1484731453/blinky_imftn9.png"; // url for 404 error

      $.when(streamURL, channelURL).done(function(streamData, profilePicData) {

        var outputHTML = "<a href='https://www.twitch.tv/";
        outputHTML += channels[index].toLowerCase() + "'";
        
        if (profilePicData[0].status === 404) {
          outputHTML += "<div class ='row " + channels[index].toLowerCase() + " dne offline";
        } else if (streamData[0].stream === null) {
          outputHTML += "<div class='row " + channels[index].toLowerCase() + " offline";
        } else {
          outputHTML += "<div class='row " + channels[index].toLowerCase() + " online";
        }; // end if else

        outputHTML += " all'><div class='col-sm-12'>";
        outputHTML += "<div class='row vertical-align'>";
        outputHTML += "<div class='col-xs-8 col-sm-8 username'>";
        outputHTML += "<h4>" + channels[index] + "</h4>";
        
        if (profilePicData[0].status === 404) {
          outputHTML += "<p>This channel does not exist.</p></div>";
        } else if (streamData[0].stream === null) {
          outputHTML += "<p>Offline</p></div>";
        } else {
          outputHTML += "<strong><p>Currently Streaming:</strong> ";
          outputHTML += streamData[0].stream.channel.status + "</p></div>";
        };
        
        outputHTML += "<div class='col-xs-4 col-sm-4'>";
        outputHTML += "<img class='profile-pic' src='";

        if (profilePicData[0].logo === null) {
          outputHTML += defaultPic + "'>" // url for default twitch logo
        } else if (profilePicData[0].status === 404) {
          outputHTML += errorPic + "'>";
        } else {
          outputHTML += profilePicData[0].logo + "'>";
        }; // end if else

        outputHTML += "</div></div></div></div></a>";

        sortArr.push(outputHTML);
        sortArr.sort();
        
        $('.twitch-channels-list').delay(500).hide().html(sortArr).fadeIn();
        
      }).done(function() {
        applySearchTerms();
      }); // end when done
    }); // end each
  }; // end twitchStreamStatus
  

  function filterList() { // shows and hides li elements based on their classes

    $("#all").click(function() {
      $("a .all").show();
    });

    $("#online").click(function() {
      $("a .offline").hide();
      $("a .online").show();
    });

    $("#offline").click(function() {
      $("a .online").hide();
      $("a .offline").show();
    });
  }; // end filterList

  filterList();
  twitchStreamStatus();

}); // end document ready