const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch({ headless: true, width: 1920, height: 1080 });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36');

    page.on('console', (msg) => { console.log('Log >> ' + msg.text()) })

    const url = process.argv[2] || 'PNR06O9sSio';

    await page.goto('https://www.youtube.com/watch?v=' + url);

    console.log("Retrieving chats from " + url);

    /*  // One method to load jquery

    const jquery = await page.evaluate(() => window.fetch('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js').then((res) => res.text()));
    await page.evaluate(jquery);
    */


    await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' })

    const chatURL = await page.evaluate(() => {

        let searchParams = new URLSearchParams(window.location.search)
        let youtube_id = searchParams.get("v");
        let chat_iframe_url = $("#chatframe").attr("src");

        return Promise.resolve(

            chat_iframe_url + "&v=" + youtube_id

        );



    });

    console.log(chatURL);



    await page.goto('https://www.youtube.com' + chatURL);


    await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' })


    await page.evaluate(() => {

        let searchParams = new URLSearchParams(window.location.search)
        let youtube_id = searchParams.get("v");
        let liveChatArray = [];

        console.log("Youtube id is", youtube_id);


        function updateChats() {

            $("yt-live-chat-app").hide();
            $("body").css("background-color", "#04F404")

            //Insert custom chat div if already not existings
            if (!$('#customchat').length) {
                $("body").append('<div id="customchat"></div>');
            }


            let custom_content = "";

            let chatBox = $("yt-live-chat-text-message-renderer");
            let author = "";
            let message = "";
            let timeline = "";
            let author_photo = "";

            console.log(chatBox.length);



            let key = "";



            chatBox.each(function (index) {



                author = $(this).find("#author-name").text();
                message = $(this).find("#content > #message").html();
                timeline = $(this).find("#content > #timestamp").text();
                author_photo = $(this).find("#author-photo > #img").attr('src');

                let key_string = author + message + timeline;

                key = btoa(unescape(encodeURIComponent(key_string))).substr(0, 100);



                if (undefined == liveChatArray[key]) {
                    console.log("new chat", message);

                    liveChatArray[key] = key;

                    let liveChat =
                    {
                        "author": author,
                        "message": message,
                        "channel": youtube_id,
                        "platform": "YouTube",
                        "authorImg": author_photo,
                        "chatTime": timeline

                    }

                    console.log(liveChat);




                }



                if (message != "") {
                    custom_content += '<div class="chatline"><span class="author">' + author + ': </span><span class="message">' + message + '</span> </div>';
                }



            })


            if (custom_content != "") {
                $('#customchat').html(custom_content);
                $("html, body").animate({ scrollTop: $(document).height() - $(window).height() });
            }




        }


        setInterval(updateChats, 2000);



    });




})();



