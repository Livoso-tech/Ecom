const userModel=require('../models/Usermodel')

const UploadProductPermision=async(userId)=>{
    const user=await userModel.findById(userId)
    console.log('found user is ',user)
    if(user.role === 'ADMIN' || user.role === 'SELLER'){
        return true
    }

    return false
}
module.exports=UploadProductPermision