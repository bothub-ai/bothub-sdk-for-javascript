<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>fb checkbok test</title>
    <script src="https://beta.bothub.ai/static/js/raven.min.js"></script>
    <script>
        console.log(123);
    </script>
</head>
<body>

<div class="adsfas">

    <div class="fb-messenger-checkbox"
         origin="https://www.825407762.com"
         page_id="1512423468782593"
         messenger_app_id="985673201550272"
         user_ref="www_825407762_com_j487ghey_<?=time()?>"
         prechecked="true"
         allow_login="true"
         size="xlarge"></div>

    <div>asdfasdfasdfasdf</div>

</div>
<script>
    Raven.config('https://jserr.bothub.ai/bothub-sdk').install();

    window.fbAsyncInit = function() {
        FB.init({
            appId: '985673201550272',
            xfbml: true,
            version: 'v2.6'
        });
    };

    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
</script>

</body>
</html>
