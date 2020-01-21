// @flow
import axios from 'axios';
import cheerio from 'cheerio';

export type Image = {
    emotion: string,
    contentUrl: string,
    detailsUrl: string,
};

export function getImages(emotion: string, batchSize: number): Promise<Array<Image>> {
    const protocolAndHost = 'https://pixabay.com';
    return axios.get(`${protocolAndHost}/en/photos/${emotion}/?order=latest`)
        .then( response => {

            const domSelector = cheerio.load(response.data);
            return domSelector('.credits > .item > a')
                .map((_, itemElement) => {
                    const images = domSelector(itemElement).children('img')
                    if (images.length === 1) {
                        const contentUrl = images[0].attribs.src;
                        if (contentUrl !== '/static/img/blank.gif') {
                            const detailsUrl = protocolAndHost + itemElement.attribs.href;

                            return {
                                contentUrl,
                                detailsUrl,
                            };
                        }
                    }
                }).get();
        });
}

