import mongoose,{Document,Schema} from "mongoose";


export interface IApplication extends Document{
    company:string,
    role:string,
    status:"Applied" | "Interview" | "Offer" | "Rejected",
    appliedDate:Date,
    notes?:string,
    user:mongoose.Types.ObjectId;
}

const applicationSchema=new Schema<IApplication>({
    company:{
        type:String,
        required:[true,"Company Name is required"]
    },
    role:{
        type:String,
        required:[true,"Role is required"]
    },
    status:{
        type:String,
        enum:["Applied" , "Interview" , "Offer" , "Rejected"],
        default:"Applied"
    },
    appliedDate:{
        type:Date,
        default:Date.now
    },
    notes:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},{timestamps:true})

export default mongoose.model<IApplication>("Application",applicationSchema)






















































