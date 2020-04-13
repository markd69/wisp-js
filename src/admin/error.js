const config = require('../../config');
const errors = {
    400: ['**400** | `Bad Request`', 'Probably a bad config.'],
    401: ['**401** | `Unauthorized`', 'The Dino API key is probably invalid.'],
    403: ['**403** | `Forbidden`', 'Invalid `WISPAPIKey` in config.js'],
    404: ['**404** | `Not Found`', 'The url used for the request was invalid.\n\nThis can happen because :\n • The id/name provided for the node/server/allocation/egg/nest/location/user is invalid.\n • Someone tampered with request.js\n • Someone tampered with the command calling request.js'],
    405: ['**405** | `Method Not Allowed`', 'This shouldn\'t happen, contact Maineiac#0001.'],
    412: ['**412** | `Precondition Failed`', 'The server is probably not running.'],
    429: ['**429** | `Too Many Requests`', 'Your bot has tried to use the api too many times recently, it has been temporarily rate limited'],
    500: ['**500** | `Internal Server Error`', 'WISP has had a problem. Contact support.'],
    503: ['**503** | `Service Unavailable`', 'WISP is temporarily offline for maintenance, try again later.'],
    504: ['**504** | `DaemonConnectionException`', 'The daemon isn\'t responding. '],
    'ENOTFOUND': ['**ENOTFOUND**', 'Invalid PanelURL in config.js, no instance to make requests from.']
}
module.exports = function(error, location) {
    console.log(error);
    const handled = errors[
        (error.response) ? error.response.status : error.code
    ];
    const obj = {
        title: {
            text: config.embeds.error.title,
            icon: config.embeds.error.icon
        },  
        color: config.embeds.error.color, 
        desc: `${handled[0]}\n\n${handled[1]}${(config.debug) ? `\n\n\`\`\`${location}\`\`\`` : ''}`,
        footer: {
            icon: config.embeds.footer.icon,
            text: config.embeds.footer.text
        }
    }
    if(config.debug) {
        console.log(`Parsed error : ${(error.response) ? error.response.status : error.code} | in : ${location}`);
    }
    return obj;
}