const config = require('../../../config');
const request = require('../request');
const errors = require('../error');

const table = require('text-table');

module.exports = async function(args) {
    let data, response;
    let obj = {
        title: {
            text: config.embeds.status.title,
            icon: config.embeds.status.icon
        },
        color: config.embeds.error.color,
        footer: {
            text: config.embeds.footer.text,
            icon: config.embeds.footer.icon
        }
    };
    try {
        response = await request.get(`/servers/${config.servers[args[0]]}/utilization`);
        data = response.attributes;

    } catch(error) {

        return errors(error, 'status.js : line 20');

    }
    let array = [];
    if(data.state == "on") {
        obj.color = config.embeds.status.color.running;
        obj.head = data.query.name;
        
        let curplayers = data.players.current;
        let maxplayers = data.query.maxplayers || "??";
        if (data.query.raw) {curplayers = data.query.raw.numplayers}
        // The server is running, lets put resource usage in a table.
        array = [   
            ["Status", data.state.toUpperCase()],
            ["Memory", data.memory.current+'/'+data.memory.limit],
            ["CPU", Math.floor(data.cpu.current)+'/'+data.cpu.limit],
            ["Disk", data.disk.current+'/'+data.disk.limit],
            ["Players", curplayers+'/'+maxplayers]
        ];
        if(maxplayers == "" || !data.query) {
            if(config.debug) { console.log(data); }
        }
        obj.desc = '```'+table(array, { align: [ 'r', 'l' ], hsep: [ '   ' ] })+'```';

    } else if(data.state == "starting") {
        obj.color = config.embeds.status.color.starting;
        obj.name = "Server starting";

    } else {
        obj.color = config.embeds.status.color.stopped;
        obj.name = "Server offline";
    }
    return obj;
}