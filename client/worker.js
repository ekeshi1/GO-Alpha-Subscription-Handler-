console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
    console.log(e);
    const data = e.data.json();
    console.log("Push Received...");

    console.log(data.icon);
    console.log(data.message);
    console.log(data.title);
    console.log(data.campaignId);

    self.registration.showNotification(data.title, {
        body: data.message,
        icon: data.icon,
       // image: "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
        data: {
            url:data.url,
            campaignId: data.campaignId
        }
    })


})

self.addEventListener('notificationclick',     function eventHandler(event)  {

    fetch(("/notificationOpened?campaignId="+event.notification.data.campaignId), {
        method: 'GET',
    })
        .then(function (data) {
            console.log("Successfully noified server");
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });

    let url = event.notification.data.url;
    //let url
    console.log(event.notification.data);
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        clients.matchAll({ includeUncontrolled: true, type: 'window' }).then( windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

self.addEventListener("pushsubscriptionchange", e => {
    console.log(e);
    console.log("Change Happened");
})
