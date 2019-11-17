const express =  require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
const dbHelper = require("./db/dbHelper");

const app = express();

app.use(express.static(path.join(__dirname,"client")));

app.use(bodyParser.json());

const publicVapidKey = "BF_boLUPcf7FyCwOKohFf2yI8he_tNVQLU0HjknY87SswjsMi8R1ybXqlOsBh3P6P\n" +
    "AjgEBaRI3XN16H_UhhNnqw";
const privateVapidKey = "TD877cAmEpfpNoj8aGXZGa5HHw3HxYv1FoGbEmc6xnc";

webpush.setVapidDetails(
    "mailto:test@test.com",
    publicVapidKey,
    privateVapidKey
);

//Subscribe route
app.post("/subscribe/:id", (req,res) => {
    console.log("came");
    console.log(req.params.id);

    const subscriptionId = req.params.id;
    //Get pushSubscription object
    const subscription = req.body.subscription;
    const browser = req.body.browser;
    const projectId = req.body.projectId;
    console.log(browser);
    console.log(subscription)

    const payload = JSON.stringify({"title": "Push test"});
    dbHelper.updateSubscription(projectId,subscriptionId,browser,JSON.stringify(subscription),(resStatus)=>{
        console.log("Finished update with status" + resStatus);

        res.status(resStatus).json(JSON.stringify({}));
    })



})

app.delete("/subscribe/:id",(req,res)=>{
    const subscriptionId = req.params.id;
    const projectId = req.body.projectId;
    dbHelper.deleteSubscription(projectId,subscriptionId,(resStatus)=>{
        res.status(resStatus).json({});
    })

})

app.get("/notificationOpened",(req,res)=>{
    console.log("sdsadsadsadsadbjsafjhksdf");
    const campaignId = req.query.campaignId;
    console.log(campaignId);
    dbHelper.updateOpenedNumber(campaignId,(response)=>{
        console.log(response);
        res.send("OK");
    })

})


const PORT = process.env.PORT || 8080;
app.listen(PORT,() => console.log(`Server started on port ${PORT}`));
