# Buzzmint Client  

For validating tokens from third party websites. When you mint tokens you will receive a mintId at the top of the page in the URL.
Use this in the client code below to request a users' tokens within a particular set.

You can then use the onSuccess callback to set what action you want to trigger on your site in response to a user having a valid token from the mintId you specified.

## Use

Place this in the header of an html document.
```html
<script src="https://unpkg.com/buzzmint-client"></script>
```


Place this in the body of an html document.
```html
<div id="buzzmint"></div>
<script>
    const bm = window.document.getElementById('buzzmint')
    new BuzzmintClient(bm, {
        mintId: 'replace-with-your-mint-id',
        onSuccess: function (response) {
            // handle tokens which belong to the user who is browsing your website
            console.log(response)
        },
        onError: function (error) {
            // handle errors
            console.log(error)
        }
    })
</script>
```

You could check multiple mintIds simply by making multiple Clients with different mintIds.

```javascript
new BuzzmintClient(bm, {
    mintId: 'your-mint-id-2',
    onSuccess: function (response) {
        // handle tokens which belong to the user who is browsing your website
        console.log(response)
    },
    onError: function (error) {
        // handle errors
        console.log(error)
    }
})
```

