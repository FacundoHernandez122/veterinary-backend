import mongoose from "mongoose";
import bcrypt from "bcrypt"
import createId from "../helpers/createId.js";

const vetSchema =  mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    phone:{
        type: String,
        default: null,
        trim: true,
    },
    web: {
        type: String,
        default: null,
    },
    token: {
        type: String,
        default: createId(),
    },
    confirmed: {
        type: Boolean,
        default: false,
    }

});

vetSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

vetSchema.methods.confirmPassword = async function (passwordForm) {
    return await bcrypt.compare(passwordForm, this.password);
};

const Vet = mongoose.model("Vet", vetSchema);
export default Vet;