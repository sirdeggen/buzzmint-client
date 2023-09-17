class BuzzmintClient {
    constructor(div, { mintId, onSuccess, onError, host = 'https://app.buzzmint.io' }) {
        if (!mintId || typeof mintId !== 'string') throw new Error('mintId is required, and must be a string')
        if (!onSuccess || typeof onSuccess !== 'function') throw new Error('onSuccess callback function is required')
        if (!onError || typeof onError !== 'function') throw new Error('onError callback function is required')
        this.div = div
        this.host = host
        this.mintId = mintId
        this.onSuccess = onSuccess
        this.onError = onError
        this.loggedIn = false
        this.kickoff().then(() => console.log('Buzzmint Client Ready'))
    }

    async kickoff() {
        try {
            await this.setupIframe()
            this.setListeners()
            this.getTokens()
        } catch (error) {
            console.log({ error })
        }
    }

    async setupIframe () {
        return new Promise((resolve) => {
            this.iframe = window.document.createElement('iframe')
            this.iframe.id = 'buzzmintIframe'
            this.iframe.src = `${this.host}/valid/v1/${this.mintId}`
            this.iframe.style.width = '1px'
            this.iframe.style.height = '1px'
            this.iframe.style.border = 'none'
            this.div.appendChild(this.iframe)
            this.iframe.contentWindow.postMessage('login', '*')
            this.iframe.onload = () => {
                resolve()
            }
        })
    }

    loginWindow() {
        if (this?.loggedIn) return
        if (!this?.iframe) return
        window.location = `${this.host}/login?redirect=${window.location.href}`
    }

    attachEvent(event, bc) {
        if (!!event?.data && event?.data?.source === 'buzzmint') {
            console.log({ data: event?.data })
            const data = event?.data || {}
            if (event.data === '') {
                bc.onError(new Error('No data from Buzzmint'))
            }
            if (data?.loggedIn === 'yes') {
                bc.loggedIn = true
            }
            if (data?.loggedIn === 'no' && bc?.loggedIn === false) {
                return bc.loginWindow()
            }
            if (!!data?.tokens) {
                this.onSuccess(data)
                return
            }
        }
    }

    setListeners() {
        window.addEventListener('message', event => this.attachEvent(event, this))
    }

    getTokens() {
        if (!!this?.iframe) {
            this.iframe.contentWindow.postMessage('getTokens', '*')
        }
    }
}

window.BuzzmintClient = BuzzmintClient
