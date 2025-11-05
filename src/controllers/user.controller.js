
export const listUsers = async(req,res)=>{
    try {
        // const users = await getUser()
        res.send('hello user')
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}