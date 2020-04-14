const request = require('../../request');
const config = require('../../../../config');
const errors = require('../../error');
const util = require('../../../util.js');
const _ = require('underscore');
const table = require('text-table');
module.exports = async function(args) {
    let obj = {
        title: {
            text: "Location Lookup",
            icon: config.embeds.servers.icon
        },
        color: config.embeds.servers.color,
        footer: {
            text: config.embeds.footer.text,
            icon: config.embeds.footer.icon
        }
    };
    try {
        const data = await request.get(`/locations/${args[2]}`);
        const created = new Date(data.attributes.created_at).toDateString();
        const array = [
            [`ID`, data.attributes.id],
            [`Short Name`, data.attributes.short],
            [`Long Name`, data.attributes.long],
            [`Created`, created]
            
        ]
        obj.desc = `\`\`\`${table(array, { align: [ 'r', 'l'], hsep: [ '   ' ] })}\`\`\``;
        return obj;
    } catch(error) {
        return errors(error, 'admin/location/get.js : line 20');
    }
}