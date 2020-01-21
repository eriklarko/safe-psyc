// @flow

import { getImages } from './image-sources/pixabay.js';
import { analyze } from './emotion-apis/azure-face.js';

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
