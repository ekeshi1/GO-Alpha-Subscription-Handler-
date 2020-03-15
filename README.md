# GO-Alpha-Subscription-Handler-
https://push-notif-259017.appspot.com/

## The purpose of this service is to handle all events related to user subscriptions.

It contains the below api calls :

1.app.post("/subscribe/:id) = > It inserts or updates the subscription (if the users was already subscribed for push notifications). Updating the subscription, and recording logs related to the number of times User has visited the page, can be useful for user segmentation.
2.app.delete("/subscribe/:id) => In case a subscribed user decides to unsubscribe, an api call is sent toward this endpoint , which makes the subscription inactive.

3.app.get("/notificationOpened") =>In case user opens a push notification sent by the application, the service worker calls this endpoint to update  nr of times the notification was opened.


## This service also contains the javascript client code.

client.js File registers the service worker, gets data about the user's browser (for statistics or targeting) and updates the subscription.

worker.js is the service worker which runs on the background listeting for a push event , in order to then display the notification.(Push event is sent by the Cloud Function).








