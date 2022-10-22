var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser.json());

app.all('*', function (req, res, next) {

    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {



        let url = req.url
        while(url[0] == "/"){
            url = url.substring(2);
        }
        console.log(url)
        let headers = {}
        if(req.headers['x-naver-client-id'] != undefined){
            headers['x-naver-client-id'] = req.headers['x-naver-client-id']
        }
        if(req.headers['x-naver-client-secret'] != undefined){
            headers['x-naver-client-secret'] = req.headers['x-naver-client-secret']
        }
        request({ url , method: "GET", headers},
            function (error, response, body) {
                console.log(body)
                if (error) {
                    console.error('error: ' + response.statusCode)
                }
            }).pipe(res)
    }
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});