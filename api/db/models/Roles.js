const mongoose = require("mongoose");
const RolePrivileges = require("./RolePrivileges");

const schema = mongoose.Schema({
    role_name: {type: String, required: true, unique: true},
    is_active: {type: Boolean, default: true},
    created_by: {
        type: mongoose.SchemaTypes.ObjectId
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

schema.pre("deleteOne", {query: true}, async function (){

    const roleId = this.getQuery()._id;

    if(roleId){
        await RolePrivileges.deleteMany({role_id: roleId});
    }

});

class Roles extends mongoose.Model {

    static async deleteOne(query){

        if(query._id){
            await RolePrivileges.deleteMany({role_id: query._id});
        }

        await super.deleteOne(query);
    }
}

schema.loadClass(Roles);
module.exports = mongoose.model("roles", schema);