
const request = require(`${process.env.root}/src/admin/request`);
const errors = require(`${process.env.root}/src/admin/error`);
const util = require(`${process.env.root}/src/util.js`);

module.exports = async function(args) {

    const ids = args[2].split(`,`);
    let obj = util.baseEmbedObj(args);

    for(const id of ids) {

        try {
            await request.post(`/servers/${id}/reinstall`);
            obj.desc = `${obj.desc}\nReinstalling server #${id}`;

        } catch(error) {
            return errors(error, 'admin/server/reinstall.js : line 17');

        }
    }
    
    return obj;
}