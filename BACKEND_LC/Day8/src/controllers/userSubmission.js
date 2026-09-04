 const Problem = require("../models/problem")
 const Submission=require("../models/submission")
 const getLanguageById=require("../utils/Problemutility")
 const { getStreakData } = require("../utils/streak")

 // Points a solve is worth, before any streak bonus. Harder problems are
 // worth more so rating growth roughly tracks real skill, not just volume.
 const BASE_POINTS = { easy: 10, medium: 25, hard: 50 }
 // +3 rating per active day in your current streak, capped so one huge
 // streak can't dwarf everything else. This is what rewards solving
 // *regularly* instead of just solving a lot in one sitting.
 const STREAK_BONUS_PER_DAY = 3
 const STREAK_BONUS_CAP = 30
 const submitCode = async(req,res)=>{
   try{
     const userId=req.user._id
     const problemId=req.params.id
     const {code,language} = req.body
     if(!userId || !code || !problemId || !language)
        return res.status(400).send("Some field Missing")
//fetch problem from db
 const problem=await Problem.findById(problemId)


 //jo cod aya phle db m dalege thenn judge0 ko denge kyuki in case judge0 crash hua ya kch b issue hua to hump user ka code to saved hoga
 const submittedResult = await Submission.create({
    userId,
    problemId,
    code,
    language,
    
    status:'pending',
    testCasesTotal:problem.hiddenTestCases.length
 })

 //judge0ko dena hai

//  const languageId = getLanguageById(language)

//  const submissions=Problem.hiddenTestCases.map((testcase)=>({
//     source_code: code,
//     language_id: languageId,
//     stdin: testcase.input,
//     expected_output: testecase.output

//  }))

//  const submitResult = await submitBatch(submissions)
//  const resultToken = submitResult.map((value)=>value.token)
//  const testResult = await submitToken(resultToken)

//  //update submitted res
//  let testCasesPassed=0
//  let runtime=0
//  let memory=0 //ye sb ab judge0 code chlak dera hai kitna kya laga wo sab db m dalre hai hum 
//  let status='accepted'
//  let errmsg=""
//  for(const test of testResult){
//     if(test.status_id==3){
//         testCasesPassed++;
//         runtime=runtime+parseFloat(test.time) //ye judge0 dera hai test.time 
//         memory=Math.max(memory,test.memory)
//     }
//     else{
//        if(test.status_id==4){
//         status = 'error'
//         errmsg=test.stderr // from judge0
//        }
//        else{
//         status='wrong'
//         errmsg=test.stderr
//        }
//     }
//  }
// //store in db
// Judge0 temporarily disabled

let testCasesPassed = problem.hiddenTestCases.length;
let runtime = 0;
let memory = 0;
let status = "accepted";
let errmsg = "";
 submittedResult.status=status
submittedResult.testCasesPassed=testCasesPassed
submittedResult.errorMessage=errmsg
submittedResult.runtime=runtime
submittedResult.memory=memory
await submittedResult.save();
//problem id ko insert krege userschema k problmsolved me if not present there

if(status === "accepted" && !req.user.problemsSolved.includes(problemId)){
   req.user.problemsSolved.push(problemId)

   // Award rating only the first time a problem is solved, so resubmitting
   // an already-solved problem doesn't farm points. The streak is computed
   // AFTER this submission is saved above, so today already counts toward it.
   const basePoints = BASE_POINTS[problem.difficulty] || 10
   const { currentStreak } = await getStreakData(userId)
   const streakBonus = Math.min(currentStreak * STREAK_BONUS_PER_DAY, STREAK_BONUS_CAP)

   req.user.rating = (req.user.rating || 0) + basePoints + streakBonus
   await req.user.save();
}

res.status(201).send("submitted")
   }
   catch(err){
res.status(500).send("error: "+err)
   }
 }
 const runCode=async(req,res)=>{
   try{
     const userId=req.user._id
     const problemId=req.params.id
     const {code,language} = req.body
     if(!userId || !code || !problemId || !language)
        return res.status(400).send("Some field Missing")
//fetch problem from db
 const problem=await Problem.findById(problemId)


 
 //judge0ko dena hai

//  const languageId = getLanguageById(language)

//  const submissions=Problem.visibleTestCases.map((testcase)=>({
//     source_code: code,
//     language_id: languageId,
//     stdin: testcase.input,
//     expected_output: testecase.output

//  }))

//  const submitResult = await submitBatch(submissions)
//  const resultToken = submitResult.map((value)=>value.token)
//  const testResult = await submitToken(resultToken)


// //store in db
// Judge0 temporarily disabled



res.status(201).send("run successfully")
   }
   catch(err){
res.status(500).send("error: "+err)
   }
 }
 module.exports={submitCode,runCode}