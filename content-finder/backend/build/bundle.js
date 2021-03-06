'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('cheerio');
var axios = _interopDefault(require('axios'));

//

//      

// https://portal.azure.com/#@eriklarko.onmicrosoft.com/resource/subscriptions/925759d7-3c96-4dda-a6c2-506f5d7c9af7/resourcegroups/whuuut/providers/Microsoft.CognitiveServices/accounts/whaaat/keys
const subscriptionKey = '58a618615aa3479eaa5acd637e41064a';

                                            
function analyze(imageUrl        )                    {

    const options = {
        url: 'https://eastus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=false&returnFaceLandmarks=false&returnFaceAttributes=emotion',
        method: 'post',
        //baseURL: uriBase,
        //params: params,
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key' : subscriptionKey
        },
        data: {
            url: imageUrl,
        },
    };

    return axios.request(options)
        .then( resp => {
            if (!resp) {
                throw new Error("No response");
            }

            if (!resp.data) {
                throw new Error("No data in response");
            }

            if (!Array.isArray(resp.data) || resp.data.length != 1) {
                throw new Error("Data isn't an array of length 1");
            }

            if (!resp.data[0].faceAttributes) {
                throw new Error("No faceAttributes property found");
            }

            if (!resp.data[0].faceAttributes.emotion) {
                throw new Error("No emotion property found");
            }

            return resp.data[0].faceAttributes.emotion;
        })
}

//      

/*getImages('worried', 10)
    .then( images => {
        console.log(images);
    })
    .catch( error => {
        console.log(error);
    });
    */
analyze('https://cdn.pixabay.com/photo/2018/07/17/06/44/sad-3543631__340.jpg')
    .then( emotions => {
        console.log(emotions);
    })
    .catch( e => {
        console.log(e);
    });
