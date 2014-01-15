<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:og="http://ogp.me/ns#">
<head>
  <meta charset="utf-8" />
  <title>View Source App</title>
  <link href='https://fonts.googleapis.com/css?family=Exo:700,700italic|Average' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" type="text/css" href="_/css/mystyle.css">
  <script type="text/javascript" src="_/js/jquery-1.7.2.min.js"></script>

  <script>
    var appToken='<?php
      $APPLICATION_ID = '401236519908500';
      $APPLICATION_SECRET = '156aff33a1bcc7488efe944ad367d9b3';

      $token_url ="https://graph.facebook.com/oauth/access_token?" .
      "client_id=" . $APPLICATION_ID .
      "&client_secret=" . $APPLICATION_SECRET .
      "&grant_type=client_credentials";
      $result=file_get_contents($token_url);
      $pieces=explode("=", $result);
      echo $pieces[1];
      ?>';
  </script>

  <script type="text/javascript" src="_/js/myscript.js"></script>
</head>
<body>
	<div id="fb-root"></div>
	<div id="content">
		<div id="main">
		  	<div id="fb-root"></div>
		  	<div id="mymessage"></div>
			<div id="welcome"></div>

			<h2 class="label">Coding Challenge</h2>
			<p>Join us for a weekly coding challenge to see who's got source foo chops.</p>
	        <div class="fb-live-stream" data-width="510" data-height="400" data-always-post-to-friends="false"></div>

	     	<div id="blog"></div>
          	<div class="fb-comments" data-width="510" data-href="https://apps.facebook.com/sourcefooo" data-num-posts="2"></div>
		</div>
		<div id="sidebar">
			  <div id="socialplugins">
					<h2 class="label">Social Stuff</h2>
					<p>Help us share View Source by liking this app. Click on the like button below.</p>
					<div class="fb-like" data-width="200"></div>

					<h2 class="label">Who loves us</h2>
					<p>Here's a list of some your friends who also like this app.</p>
					<div class="fb-facepile" data-width="240"></div>          

					<div id="achievements">
						<div id="appachievements" class="group"></div>
						<div id="userachievements" class="group"></div>
					</div>


			  </div><!--social plugins -->

			  <div id="join" onclick="requestToFriends();"><img src="images/invite.png" alt="Invite Button" /></div>

		     <div id="videogroup"></div><!--videogroup -->
		</div><!--sidebar -->
	</div><!--content -->
	<script type="text/javascript" src="https://gdata.youtube.com/feeds/users/lynda/uploads?alt=json-in-script&callback=populateVideos&max-results=7&category=Villalobos"></script>
</body>
</html>
