# GO-Alpha-Subscription-Handler-
https://push-notif-259017.appspot.com/


Qellimi i ketij service eshte qe te handle eventet ne lidhje me subscription.

Ai ka disa api calls  :

1.app.post("/subscribe/:id", (req,res) => Sherben per te updatetuar subscriptionin ne rast se klienti ka qene subscribur me pare, ose per ta insertur
ate per here te pare nese jo. Table PN_Subscription_log eshte ideuar qe te permbaje te gjitha updatet qe i behen subscriptionit te klientit,
ne menyre qe te merren te dhena ne lidhje me (numrin e hereve qe perdoruesi e ka perhapur aplikacionin ) => Kjo do te sherbente per segmentin te
klienteve ne Active , Inactive dhe Engaged ne menyre qe te mund te targetohen dhe segmente te caktuara.(Kete pjese nuk arritem ta implementonim
ne kohen qe kishim).

2.app.delete("/subscribe/:id",(req,res)=> Ne rast se perdoruesi i ka lejuar njoftimet nga website me pare dhe vendos ti bllokoje ato , ne scriptin qe vendoset ne klient
kapet eventi dhe dergohet kjo thirrje. Ky subcription update-t ne inactive sapo ndodh kjo ne menyre qe funksioni te mos tentoje te dergoje
push notification te cilat dihet qe do te failin.

3.app.get("/notificationOpened",(req,res)=>{ sapo klienti klikon notification serviceWorker dergon nje event per te njoftuar qe njoftimi u hap dhe
nrOpened inkrementohet me 1.



Per arsye kohe ne kete service eshte implementuar dhe klienti. (Nje website i thjeshte i cili ka te inkorporuar javascriptet qe bejne te mundur
push notificaiton.) Keto file ndodhen nee folder client,  por keto javascripte mund te vendosen manualisht ne cdo project .

File client.js ben regjistrimin e service workerit , merr te dhena per browser te klientit per arsye statistikore (ose targetimi) dhe update 
subscriptionin sa here qe klienti hap faqen index.html. Subscriptioni Hashohet ne menyre qe te identifikohet ne menyre unike( arsye performance kur kemi update) 
dhe dergohet hashi bashk me subscription string ne backend per tu ruajtur.

Worker .js eshte service worker i cili runet ne background i cili degjon gjithe kohes per nje push event per te shfaquer me pas njoftimin. (Push event dergohet nga cloud function)
