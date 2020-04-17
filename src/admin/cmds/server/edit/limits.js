const request = require(`${process.env.root}/src/admin/request`);
const config = require(`${process.env.root}/config`);
const errors = require(`${process.env.root}/src/admin/error`);
const util = require(`${process.env.root}/src/util.js`);
const _ = require('underscore');
const table = require('text-table');
module.exports = async function(args) {

    let obj = {
        title: {
            text: `User Editor | User #${args[3]}`,
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

        data = await request.get(`/servers/${args[3]}`);
        baseParams = data.attributes; // Assign current data to newParams object.

        // For some reason it doesn't take the limits as it's own object
        // The ptero docs state otherwise, I assume Trixter changed this.
        // Yet every other aspect of the servers endpoint returns limits
        // in its own object. This doesn't fit the style of all my other 
        // edit scripts, so I have to now write base parameters of all
        // limits types.
        baseParams.cpu = baseParams.limits.cpu;
        baseParams.memory = baseParams.limits.memory;
        baseParams.swap = baseParams.limits.swap;
        baseParams.disk = baseParams.limits.disk;
        baseParams.io = baseParams.limits.io;
    } catch(error) {
        return errors(error, 'admin/server/edit/details.js : line 26');

    }

    const params = await util.parseRawParams(
            _.compact(

            util.parseParamsWithQuotes(
                args.slice(4).join(" "))

        ), baseParams);

    try {
        // Send the new configuration to wisp, get a result that has changed properties.
        const data = await request.patch(`/servers/${args[3]}/build`, params);


        const array = util.cleanArray(

            [[`Property`, `Value`]].concat(
                Object.entries(data.data.attributes)
            )

        );

        obj.desc = `Sent data to panel.\n\`\`\`${table(array, { align: [ 'r', 'l'], hsep: [ '   ' ] })}\`\`\``;
        
        return obj;

    } catch(error) {
        return errors(error, 'admin/server/edit/details.js : line 44');

    }
}