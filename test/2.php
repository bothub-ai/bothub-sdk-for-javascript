<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script src="https://beta.bothub.ai/static/js/raven.min.js"></script>
</head>
<body>
<script>
Raven.config('https://jserr.bothub.ai/bothub-sdk').install();

window.BOTHUB = window.BOTHUB || {
    bot_id: 249, // 143,
    custom_user_id: 5435, // 123
    facebook_page_id: 1512423468782593, // 1512423468782593,
    messenger_app_id: 985673201550272, // 985673201550272,
    api_server: 'https://api.bothub.ai/', // 985673201550272,
    platforms: ['facebook', 'bothub'], // 123
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://www.825407762.com/test/bothub/bothub.js?ver<?=time()?>";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'bothub-jssdk'));
</script>
<!-- <script async src="https://www.825407762.com/test/bothub/bothub.js"></script> -->
<div class="facebook_container">
    <div id="fb-messenger-checkbox" class="fb-messenger-checkbox"></div>

    <div>
        <button onclick="BOTHUB.Marketing.logEvent('logined',null,{sex:'nan'})">login nan</button>
        <button onclick="BOTHUB.Marketing.logEvent('logined',null,{sex:'nv'})">login nv</button>
        <button onclick="BOTHUB.Marketing.logAddedToCartEvent(6,'product','$','$30.50')">add2cart</button>
        <button onclick="BOTHUB.Marketing.logAddedToCartEvent(6,'test','$','$30.50')">add2cart no</button>
        <button onclick="BOTHUB.Marketing.logAddedToWishlistEvent(6,'product','$','$30.50')">add2like</button>
        <button onclick="BOTHUB.Marketing.logInitiatedCheckoutEvent('JXUZPOJJX', 'product', 1, true, '$', '35.98');">buyed</button>
    </div>
</div>
</body>
</html>
