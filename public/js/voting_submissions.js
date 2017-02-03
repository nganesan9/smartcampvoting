/*eslint-env jquery, browser*/
$(document).ready(function(){

if(readCookie("voted"))
{
	console.log("Cookie is : " + document.cookie);
	alert("Teams get to pitch once. You get to vote once :) No duplicate votes.");
	document.getElementById("submit").disabled = true;
}
else
{
	$("#submit").click(function(e){
		e.preventDefault();
    var vote_received = document.querySelector('input[name="final_teams"]:checked').value;

	createCookie("voted","true",480);
    $.ajax({
			url: "/submit_vote",
			type: "GET",
			dataType: "json",
			data:{team_name: vote_received},
      contentType: "application/json",
				cache: true,
				timeout: 5000,
				complete: function() {
				  //called when complete
				  console.log('process complete');
				},
        success: function(data) {
          document.getElementById("submit").disabled = true;
          alert("Thank you for voting! ");
        },
				error: function() {
				  console.log('process error');
				},
		});

});
}
});

function createCookie(name,value,minutes) {
    if (minutes) {
        var date = new Date();
        date.setTime(date.getTime()+(minutes*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}