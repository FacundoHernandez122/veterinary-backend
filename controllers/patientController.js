import Patient from "../models/Patient.js"

const addPatient = async (req, res) => {
    const patient = new Patient(req.body)
    patient.vet = req.vet._id
   try {
    const savedPatient = await patient.save()
    res.json(savedPatient)
   } catch (error) {
    console.log(error)
   }
};
const getPatients = async (req, res) => {
    const patients = await Patient.find().where("vet").equals(req.vet);

    res.json(patients)
};

const getPatient = async (req, res) => {
    const {id} = req.params;
    const patient = await Patient.findById(id);

    if(!patient) {
        return   res.status(404).json({msg:"User not found"})
       }

    if(patient.vet._id.toString() !== req.vet._id.toString()) {
      return  res.json({msg:"Invalid Action"})
    }

      res.json(patient)
    
};

const updatePatient = async (req, res) => {
    const {id} = req.params;
    const patient = await Patient.findById(id);

    if(!patient) {
     return   res.status(404).json({msg:"User not found"})
    }

    if(patient.vet._id.toString() !== req.vet._id.toString()) {
      return  res.json({msg:"Invalid Action"})
    }

    patient.name = req.body.name || patient.name;
    patient.owner = req.body.owner || patient.owner;
    patient.email = req.body.email || patient.email;
    patient.date = req.body.date || patient.date;
    patient.symptoms = req.body.symptoms || patient.symptoms;
    
    try {
        const updatePatient = await patient.save();
        return res.json(updatePatient);
    } catch (error) {
        
    }
};

const deletePatient = async (req, res) => {
    const {id} = req.params;
    const patient = await Patient.findById(id);

    if(!patient) {
     return   res.status(404).json({msg:"User not found"})
    }

    if(patient.vet._id.toString() !== req.vet._id.toString()) {
      return  res.json({msg:"Invalid Action"})
    }
    try {
        await patient.deleteOne();
        res.json({msg:"Patient Deleted"})
    } catch (error) {
        console.log(error)
    }
};

const searchPatientsByName = async (req, res) => {
    try {
      const { name } = req.query;
      const results = await Patient.find({ name: { $regex: new RegExp(name, "i") } });

    
      res.json({ results });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


export {addPatient, getPatients, getPatient, updatePatient, deletePatient, searchPatientsByName}
