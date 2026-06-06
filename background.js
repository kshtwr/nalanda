importScripts('supabase.js')
const { createClient } = supabase
const SUPABASE_URL = 'https://mvuafuijosnsgtglomfx.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_YOoDS5GlFfbfJgmRGUIEqQ_bFXpi0o_'
const hDB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


const AUTH_URL = 
  'https://accounts.google.com/o/oauth2/auth' +
  '?client_id=890060841181-h1afu7bsstenpmjlcgoe9pogb1edotl9.apps.googleusercontent.com' +
  '&response_type=id_token' +
  '&access_type=offline' +
  '&redirect_uri=https://bekpiokeecdinophabjeianginppegdf.chromiumapp.org/' +
  '&scope=openid email profile' +
  '&nonce=random123'

function signIn(){  
    chrome.identity.launchWebAuthFlow(
        { url: AUTH_URL, interactive: true },
        async (redirectUrl) => {
        // redirectUrl contains the token in the URL hash
        // parse it out and exchange with Supabase
        const hash = new URL(redirectUrl).hash.substring(1) // remove the #
        const params = new URLSearchParams(hash)
        const idToken = params.get('id_token')

        const { data, error } = await hDB.auth.signInWithIdToken({
            provider: 'google',
            token: idToken
        })
        if (data.session) {
            chrome.storage.local.set({ session: data.session })
        }
        
        }
    )
}

chrome.runtime.onMessage.addListener((message) => {
    console.log('message received:', message)
    if (message === 'signIn') signIn()
})

