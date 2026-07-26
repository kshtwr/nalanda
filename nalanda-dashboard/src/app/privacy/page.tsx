export default function PrivacyPolicy() {
  return (
    <main style={{ maxWidth: 680, margin: '60px auto', padding: '0 24px', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', color: '#171717', lineHeight: 1.7 }}>
      <h1 style={{ fontFamily: 'var(--font-garamond), serif', fontSize: '2.5rem', marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: '#6b7280', marginBottom: 40 }}>Last updated: July 2026</p>
      <h2><strong>What we collect</strong></h2>
      <p>When you sign in with Google, we receive your name and email address. When you highlight text on a webpage, we store the highlighted content and the URL of the page it came from.</p>
      <br/>
      <h2><strong>How it's stored</strong></h2>
      <p>Your data is stored in Supabase, a hosted database service. All data is protected by row-level security — only you can read or modify your own highlights.</p>
      <br/>
      <h2><strong>How we use your data</strong></h2>
      <p>Your data is used solely to display your highlights back to you in the Nalanda dashboard and Chrome extension. We do not analyze, sell, or share your data with any third parties.</p>
      <br/>
      <h2><strong>Third-party services</strong></h2>
      <ul>
        <li><strong>- Google OAuth</strong>: used for sign-in only. We do not access any Google data beyond your name and email.</li>
        <li><strong>- Supabase</strong>: used to store your highlights. Their privacy policy applies to data at rest.</li>
      </ul>
      <br/>
      <h2><strong>Deleting your data</strong></h2>
      <p>You can delete individual highlights from the dashboard at any time. To delete your account and all associated data, contact us at the email below.</p>
      <br/>
      <h2><strong>Contact</strong></h2>
      <p>For any privacy questions, email <a href="mailto:keshavt346@gmail.com" style={{ color: '#171717' }}>keshavt346@gmail.com</a>.</p>
    </main>
  )
}
