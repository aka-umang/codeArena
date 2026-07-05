

const {getLanguageById,submitBatch,submitToken}=require("../utils/Problemutility")

const Problem= require("../models/problem")
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo");
const createProblem = async(req,res)=>{
   console.log("CREATE PROBLEM HIT");
    const {title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator}=req.body;



    try{
       for(const {language,completeCode} of referenceSolution){

console.log("language =", language);
    console.log("completeCode =", completeCode);


        const languageId= getLanguageById(language)
         
console.log("visibleTestCases =", visibleTestCases);
console.log("referenceSolution =", referenceSolution);
console.log("req.body =", req.body);

        //creation of batch
        const submissions=visibleTestCases.map((testcases)=>({
           source_code:completeCode,
           language_id:languageId,
           stdin:testcases.input,
           expected_output:testcases.output
        }))
           



//         const submitResult=await submitBatch(submissions);
//         console.log("submitResult =", submitResult);

// if (!submitResult) {
//     throw new Error("submitResult is undefined");
// }

// console.log("Is Array?", Array.isArray(submitResult));

// const resultToken = submitResult.map((value) => value.token);
//    const testResult=await submitToken(resultToken)
//      for(const test of testResult){
//       if(test.status_id!=3){
//         return res.status(400).send("Error Occured")
//       }
      }
   
       await Problem.create({
         ...req.body,
         problemCreator:req.result._id //admin wale middleware se hmne attach kradia tha req k sath hi jo res tha use attach kradia tha jo b user ki info hai wo sb result sath store hai.  "req.result=result;"
       })
       res.status(201).send("Problem saved successfully")
    }
    catch(err){
   console.error(err);
   res.status(400).send(err.stack);
}


}
const updateProblem = async(req,res)=>{
   const {id} = req.params
    const {title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator}=req.body;
   try{
      if(!id){
         res.status(400).send("inavalid id")
      }

      const dsaproblem=await Problem.findById(id)
      if(!dsaproblem){
        return res.status(404).send("id not present ")
      }




   for(const {language,completeCode} of referenceSolution){

console.log("language =", language);
    console.log("completeCode =", completeCode);


        const languageId= getLanguageById(language)
         
console.log("visibleTestCases =", visibleTestCases);
console.log("referenceSolution =", referenceSolution);
console.log("req.body =", req.body);

        //creation of batch
        const submissions=visibleTestCases.map((testcases)=>({
           source_code:completeCode,
           language_id:languageId,
           stdin:testcases.input,
           expected_output:testcases.output
        }))
           



//         const submitResult=await submitBatch(submissions);
//         console.log("submitResult =", submitResult);

// if (!submitResult) {
//     throw new Error("submitResult is undefined");
// }

// console.log("Is Array?", Array.isArray(submitResult));

// const resultToken = submitResult.map((value) => value.token);
//    const testResult=await submitToken(resultToken)
//      for(const test of testResult){
//       if(test.status_id!=3){
//         return res.status(400).send("Error Occured")
//       }
      }
     const newProblem=await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true})


     res.status(200).send(newProblem)
   }
   catch{
       res.status(404).send("Error:  "+err)
   }
}

const deleteProblem= async(req,res)=>{
   const {id}=req.params
   try{
      if(!id) return res.status(400).send("id is missing")
      const deletedProblem = await Problem.findByIdAndDelete(id)

      if(!deletedProblem) return res.status(404).send("missing problem")

      res.status(200).send("successfully deleted")   
   }
   catch(err){
     res.status(500).send("error: "+err)
   }
}
const getProblemById = async(req,res)=>{
  const {id} = req.params
  try{
   if(!id) return res.status(400).send("id is missing")

   const getProblem = await Problem.findById(id) .select('_id title description difficulty tags visibleTestCases startCode referenceSolution ')  
   if(!getProblem) return res.status(404).send("problem is missing")

      const videos = await SolutionVideo.findOne({problemId:id});

   if(videos){    
   getProblem.secureUrl = videos.secureUrl;
   getProblem.cloudinaryPublicId = videos.cloudinaryPublicId;
   getProblem.thumbnailUrl = videos.thumbnailUrl;
   getProblem.duration = videos.duration;

   return res.status(200).send(getProblem);
   }
    res.status(200).send(getProblem)   
  }
  catch (err) {
    console.log("ERROR:", err);
    console.log(err.stack);

    res.status(500).json({
        error: err.message
    });
}
}
const getAllProblem = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const totalProblems = await Problem.countDocuments();

    const problems = await Problem.find({})
      .select("_id title difficulty tags")
      .skip(skip)
      .limit(limit);

    if (problems.length === 0) {
      return res.status(404).send("Problem is missing");
    }

    res.status(200).json({
      problems,
      currentPage: page,
      totalPages: Math.ceil(totalProblems / limit),
      totalProblems,
      limit
    });

  } catch (err) {
    res.status(500).send("error: " + err.message);
  }
};
const solvedAllProblembyUser=async(req,res)=>{
   try{
   //   const count=req.user.problemsSolved.length
   const userId=req.user._id
const user=await User.findById(userId).populate({
   path:"problemsSolved",
   select:"_id title difficulty tags"
})

   res.status(200).send(user.problemsSolved)
   }
   catch(err){
   console.log(err);
   res.status(500).send("error: " + err.message);
}
}
const submittedProblem = async(req,res)=>{
  try{
   const userId = req.user._id
   const problemId = req.params.pid

   const ans=await Submission.find({userId,problemId})
   if(ans.length==0){
      res.status(200).send("no submission")
   }
   res.status(200).send(ans)
  }
  catch(err){
     res.status(500).send("internal server error")
  }
}
module.exports={createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem}