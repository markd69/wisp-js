const request = require(`${process.env.root}/src/admin/request`);
const config = require(`${process.env.root}/config`);
const errors = require(`${process.env.root}/src/admin/error`);
const util = require(`${process.env.root}/src/util.js`);
const _ = require('underscore');
const table = require('text-table');

module.exports = async function() {

    let obj = {
        title: {
            text: "Node List",
            icon: config.embeds.servers.icon
        },
        color: config.embeds.servers.color,
        footer: {
            text: config.embeds.footer.text,
            icon: config.embeds.footer.icon
        }
    };

    let data;
    let array = [["ID", "Name", "Location"]];

    try {
        data = await request.get('/nodes');

    } catch(error) {
        return errors(error, 'admin/node/list.js : line 25');

    }

    for(i = 0; i < data.data.length; i++) {
        array[i+1] = [

            data.data[i].attributes.id,
            data.data[i].attributes.name,
            data.data[i].attributes.location_id
        ]
    }

    obj.desc = '```'+table(array, { align: [ 'c', 'c', 'c' ], hsep: [ '   ' ] })+'```';

    return obj;

}