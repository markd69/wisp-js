const request = require('../../request');
const config = require('../../../../config');
const errors = require('../../error');
const util = require('../../../util.js');
const _ = require('underscore');
const table = require('text-table');
module.exports = async function(args) {

    let obj = {
        title: {
            text: `Node Editor | Node #${args[2]}`,
            icon: config.embeds.servers.icon
        },
        color: config.embeds.servers.color,
        desc: "",
        footer: {
            text: config.embeds.footer.text,
            icon: config.embeds.footer.icon
        }
    };

    let baseParams;
    
    try {

        data = await request.get(`/nodes/${args[2]}`);
        baseParams = data.attributes; // Assign current data to newParams object.

    } catch(error) {
        return errors(error, 'admin/node/edit.js : line 29');

    }

    const params = await util.parseRawParams(
         _.compact(

            util.parseParamsWithQuotes(
                args.slice(3).join(" "))

        ), baseParams);

    try {
        // Send the new configuration to wisp, get a result that has changed properties.
        const data = await request.patch(`/nodes/${args[2]}`, params);
        
        // Omit sensitive data
        data.data.attributes.license_key = false;
        data.data.attributes.fqdn = false;


        const array = [[`Property`, `Value`]];
        const finalParams = array.concat(
            Object.entries(_.pick(data.data.attributes, Boolean))
        );

        obj.desc = `Sent data to panel.\n\`\`\`${table(finalParams, { align: [ 'r', 'l'], hsep: [ '   ' ] })}\`\`\``;
        
        return obj;

    } catch(error) {
        return errors(error, 'admin/node/edit.js : line 54');

    }
}