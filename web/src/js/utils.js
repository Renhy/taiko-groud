

function httpGet(url) {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.onreadystatechange = () => {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    return resolve(request.responseText);
                } else {
                    console.error('error in http get. status=' + request.status + '. url=' + url)
                    return reject();
                }
            }
        };
        request.send();
    });
}


export {
    httpGet,
};