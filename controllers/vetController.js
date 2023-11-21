import Vet from "../models/Vet.js"
import createJWT from "../helpers/createJWT.js";
import createId from "../helpers/createId.js";
import registerEmail from "../helpers/registeremail.js";
import forgotPasswordEmail from "../helpers/forgotpasswordemail.js";

const register = async (req, res) => {
const { email, name } = req.body;

const userExist = await Vet.findOne({email})

if(userExist) {
    const error = new Error("the email has already been used")
    return res.status(400).json({msg: error.message});
}

    try {

    const vet = new Vet(req.body)
    const vetSaved = await vet.save();

    registerEmail({email, name, token: vetSaved.token})

    res.json(vetSaved)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error" });
    }
};

const profile = (req, res) => {
    const {vet} = req;

    res.json(vet)
}

const confirm = async (req, res) => {
    const { token } = req.params;

    const confirmUser = await Vet.findOne({ token });

    if (!confirmUser) {
        const error = new Error("Invalid Token");
        return res.status(404).json({ msg: error.message });
    }

    try {
        confirmUser.token = null;
        confirmUser.confirmed = true;
        await confirmUser.save();

        res.json({ msg: "User confirmed successfully" });
    } catch (error) {
        console.log(error);
    }
}

const authenticate = async (req, res) => {
    const { email, password } = req.body
    const user = await Vet.findOne({email})
    if(!user) {
        const error = new Error ("User doesnt exist")
        return res.status(401).json({msg: error.message});
    }
    if(!user.confirmed) {
        const error = new Error ("Your account is not confirmed yet")
        return res.status(403).json({msg: error.message});
    }
    if( await user.confirmPassword(password)) {
        user.token = createJWT(user.id);
     res.json({
    _id:user._id,
    name:user.name,
    email:user.email,
    token:createJWT(user.id)
});

    } else {
        const error = new Error ("Invalid password")
        return res.status(403).json({msg: error.message});
    }

}

const forgotPassword = async (req, res) => {
    const {email} = req.body;
    const existVet = await Vet.findOne({email})
    if(!existVet) {
        const error = new Error("User doesnt exist")
        return res.status(404).json({msg: error.message})
    }
    try {
        existVet.token = createId()
        await existVet.save()

forgotPasswordEmail({
    email,
    name: existVet.name,
    token: existVet.token
})

        res.json({msg: "We sent you a mail with following instructions"})
    } catch (error) {
        console.log(error)
    }
}

const confirmToken = async (req, res) => {
    const {token} = req.params
    const validToken = await Vet.findOne({token})

    if(validToken) {
        res.json({msg: "Valid Token"})
    } else {
        const error = new Error("Invalid Token")
        return res.status(400).json({msg: error.message})
    }

}

const newPassword = async (req, res) => {
const {token} = req.params;
const {password} = req.body;

const vet = await Vet.findOne({token})
if(!vet) {
    const error = new Error("Error")
    return res.status(400).json({msg: error.message})
}
try {
   vet.token = null
   vet.password = password
   await vet.save()
   res.json({msg: "Password changed successfully"})
} catch (error) {
    const e = new Error("Error")
    return res.status(400).json({msg: e.message})
}
}

const updateProfile = async (req, res) => {
    const vet = await Vet.findById(req.params.id)
    if(!vet) {
        const error = new Error("Error")
        return res.status(400).json({msg: error.msg})
    }
const {email} = req.body
    if(vet.email !== req.body.email) {
        const emailExists = await Vet.findOne({email})
        if(emailExists) {
            const error = new Error("Email already used")
            return res.status(400).json({msg: error.message})
        }
    }
    try {
        vet.name = req.body.name ;
        vet.email = req.body.email ;
        vet.web = req.body.web ;
        vet.phone = req.body.phone ;

        const updateVet = await vet.save()
        res.json(updateVet)
    } catch (error) {
        
    }

}

const updatePassword = async (req, res) => {
const { id} = req.vet
const {current_password, new_password} = req.body

const vet = await Vet.findById(id)
if(!vet) {
    const error = new Error("Error")
    return res.status(400).json({msg: error.msg})
}

if(await vet.confirmPassword(current_password)) {


vet.password = new_password
await vet.save()
res.json({msg:"Password changed successfully"})

} else {
  
    const error = new Error("Password does not match")
    return res.status(400).json({msg: error.message})
}
}

export { register, profile, confirm, authenticate, forgotPassword, confirmToken, newPassword, updateProfile, updatePassword };