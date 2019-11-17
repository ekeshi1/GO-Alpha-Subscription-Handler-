const pool = require("./dbConnector");

module.exports.updateSubscription = async function(projectId,subscriptionId,browser,subscriptionString,cb){
    let argArray = [subscriptionId,projectId];
    pool.query('SELECT * FROM `PN_SUBSCRIPTIONS` WHERE `subscription_id` = ? and `project_id`=?', argArray, function (error, results, fields) {
        // error will be an Error if one occurred during the query
        if(error){
            console.log(error);
            return
        }
        // results will contain the results of the query
        //console.log(results);
        let created = new Date();


        // In case the user was subscribed -- update
        if(results[0]){
        pool.query("CALL updateExistingSubscription(?,?)",[subscriptionId,created],(err,results)=>{
            if(err){
                console.log(err);
                cb(500)
            }

            cb(201)
        })

        } else {
            //the user is subscribing for the first time--insert

            pool.query("INSERT INTO `push_notif`.`PN_SUBSCRIPTIONS` "+
                "(`project_id`,"+
                "`subscription_id`,"+
                "`browser`,"+
                "`subscription_string`,"+
                "`last_updated`,"+
                "`is_active`)  "+
            "VALUES"+
            "(?,?,?,?,?,?)",[projectId,subscriptionId,browser,subscriptionString,created,"Y"],(error,results)=>{
                if(error)
                {
                    console.log(error);
                    cb(500);
                }
                console.log(results);

                pool.query("INSERT INTO `push_notif`.`PN_SUBSTRICPTION_LOG`\n" +
                    "(`subscription_id`," +
                    "`update_time`)" +
                    "VALUES (?,?)",[subscriptionId,created],(error2,results)=>{
                    if(error2){
                        console.log(error2);
                        cb(500)
                    }

                    console.log(results);
                    cb(201);

                })
            });

        }
        // fields will contain information about the returned results fields (if any)
    });
}


module.exports.deleteSubscription = async function (projectId,subscriptionId,cb) {

    pool.query("UPDATE `push_notif`.`PN_SUBSCRIPTIONS`\n" +
        "SET\n" +
        "`is_active` = ?\n" +
        "WHERE `subscription_id` = ? AND `project_id` = ?",['N',subscriptionId,projectId],(err,results)=>{
        if(err)
        {
            console.log(err);
            cb(500)
        }
        console.log(results.message);
        cb(204);


    })

}

module.exports.updateOpenedNumber = async function (campaignId,cb) {

    pool.query("UPDATE `push_notif`.`PN_CAMPAIGNS`\n" +
        "SET\n" +
        "`nr_opened` = `nr_opened`+1\n" +
        "WHERE `id_campaign` = ?",[campaignId],(err,results)=>{
        if(err){
            cb("Error");
        }

        cb("OK");
        console.log("Done update on notification Opened");
    })

}
