# Retrieve Live Chat from any YouTube Live Video
## For experimental purpose only

## important note
### YouTube webpage structure may change anytime in the future and that will make this code non-functional 

# Installation

```bash
npm install
```

## Usage

```bash

node index.js <YouTube Video ID>

#example
node index.js PNR06O9sSio


```

# Technology

```javascript

    //Load the browser

    const browser = await puppeteer.launch({ headless: true, width: 1920, height: 1080 });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36');

    page.on('console', (msg) => { console.log('Log >> ' + msg.text()) })

    const url = process.argv[2] || 'PNR06O9sSio';

    await page.goto('https://www.youtube.com/watch?v=' + url);

```

## Find the chat iframe URL and load that page

```javascript

    const chatURL = await page.evaluate(() => {

    let searchParams = new URLSearchParams(window.location.search)
    let youtube_id = searchParams.get("v");
    let chat_iframe_url = $("#chatframe").attr("src");

    return Promise.resolve(

        chat_iframe_url + "&v=" + youtube_id

    );



    });

```

## insert jQuery into the browser for easy query

```javascript
await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' })

```

## find each information using dom query

```javascript

    author = $(this).find("#author-name").text();
    message = $(this).find("#content > #message").html();
    timeline = $(this).find("#content > #timestamp").text();
    author_photo = $(this).find("#author-photo > #img").attr('src');    

```