'use client'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'

export default function FaqsPage() {
  const router = useRouter()

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingTop: '64px' }}>
      <AppHeader />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => router.back()} style={{ background: '#F1F1F1', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', marginBottom: '16px', cursor: 'pointer' }}>← Back</button>
        
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>FAQs</h1>

        <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#222' }}>
          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>I. Start Submission</h3>
          <p>1.1 A minimum account balance of 50 USD is required to initiate the first set of 40 products submission.</p>
          <p>1.2 A minimum deposit of 100 USD is required to reset and begin the new daily products submission process.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>II. Withdrawal</h3>
          <p>2.1) Users must complete all tasks before they are eligible to request a withdrawal.</p>
          <p>2.2) Withdrawals or refunds are not permitted if a user chooses to abandon or withdraw during task optimization.</p>
          <p>2.3) Withdrawals will not be processed unless a formal withdrawal request has been submitted.</p>
          <p>2.4) VIP1: Maximum withdrawal limit is 5,000 USD<br/>VIP2: Maximum withdrawal limit is 30,000 USD<br/>VIP3: Maximum withdrawal limit is 50,000 USD<br/>VIP4 and above: No withdrawal limit</p>
          <p>2.5) If a user's credit score is insufficient, they may be restricted from using certain platform features.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>III. Funds</h3>
          <p>3.1 All funds are securely held within the user's account and may be withdrawn in full upon successful completion of all required products submission.</p>
          <p>3.2 To ensure the security and integrity of user funds, all data processing is conducted automatically by the system; manual processing is not permitted.</p>
          <p>3.3 The platform assumes full responsibility for any accidental loss of funds resulting from system errors or platform-related issues.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>IV. Account Security</h3>
          <p>4.1 Users are strictly advised not to disclose their login passwords or security codes to any third party. The platform shall not be held liable for any loss or damage resulting from unauthorized access due to such disclosure.</p>
          <p>4.2 For security purposes, it is strongly recommended that users do not use easily identifiable information such as birthdates, identification numbers, or mobile phone numbers as their login passwords or security codes.</p>
          <p>4.3 In the event that a user forgets their login password or security PIN, they must contact the platform's online customer service for assistance in resetting the credentials.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>V. Normal Products</h3>
          <p>5.1 Platform earnings are categorized into normal earnings and "ten-times revenue" earnings. Under normal circumstances, users will typically receive 0 to 3 merged product sets per submission set, with the possibility of obtaining a maximum of 3 merged data sets from a single set.</p>
          <p>5.2 VIP 1 members will earn 0.5% of the profit for each normal product submission.</p>
          <p>5.3 VIP 1 members will earn 5.0% of the profit for each merged product submission.</p>
          <p>5.4 Funds and earnings from completed product submissions will be credited back to the user's account upon successful completion of each product set.</p>
          <p>5.5 The system will randomly distribute product to the user's account based on the total balance in the user's account.</p>
          <p>5.6 Once product has been distributed to the user's account, it cannot be canceled, skipped, or modified.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>VI. Merged Product</h3>
          <p>6.1 Merged Product consist of 2 to 3 product data sets. Users may not necessarily receive 3 merged data sets; the system will randomly assign normal product data, with users having a higher likelihood of receiving either 2 or 3 product data sets within the merged product.</p>
          <p>6.2 Users will receive ten times the commission for each product set in the merged product compared to the commission for normal product data.</p>
          <p>6.3 Once the user is matched with merged product, all associated funds will be on-hold until the completion of each products submission. The funds will be refunded to the user's account upon successful completion of the required submissions.</p>
          <p>6.4 The system will randomly assign merged product to the user's account based on the total balance within the user's account.</p>
          <p>6.5 Once merged products have been distributed to the user's account, they cannot be canceled, skipped, or modified.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>VII. Deposit</h3>
          <p>7.1 The deposit amount is determined by the user, and the platform does not impose any specific deposit requirements. It is recommended that users make advance payments based on their financial capacity.</p>
          <p>7.2 If a deposit is required when receiving a merged product, users are advised to make an advance payment to cover the insufficient amount indicated in their account.</p>
          <p>7.3 Before proceeding with an advance payment, users must contact user support to request the payment details and confirm the specific deposit information.</p>
          <p>7.4 The platform will not be held liable for any errors in depositing funds to an incorrect account.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>VIII. Merchants' Cooperation</h3>
          <p>8.1 The availability of product on the platform fluctuates, and if product submissions are delayed for an extended period, merchants may be unable to offload the data, which could negatively impact their progress. It is strongly recommended that users complete all required submissions and apply for withdrawals promptly to avoid hindering the merchants' progress.</p>
          <p>8.2 Merchants will provide users with deposit details to facilitate the deposit process.</p>
          <p>8.3 Delays in completing product submissions will have a detrimental effect on merchants and the overall process.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>IX. Invitation</h3>
          <p>9.1 Users may invite other users to the platform using the invitation code linked to their account.</p>
          <p>9.2 Users must complete all product submissions in their account before they can invite other users.</p>
          <p>9.3 To be eligible to use an invitation code to invite referrals, a user must first complete 15 days of work after registration.</p>
          <p>9.4 Referrers will receive 20% of the referee's daily earnings as a commission.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>X. User Authentication</h3>
          <p>10. All users must undergo authentication before being eligible to apply for any withdrawal of funds from the platform. This measure is implemented to ensure the security of all users' funds and to prevent any potential loss of assets for active users on our platform.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>XI. Operating Hours</h3>
          <p>11.1 The platform operates from 10:00 -23:00 (EST).</p>
          <p>11.2 Online customer service is available from 10:00 -23:00 (EST).</p>
          <p>11.3 Withdrawal operations are processed between 10:00 -23:00 (EST).</p>

          <p style={{ fontWeight: '800', marginTop: '30px' }}>The final right of interpretation belongs to Disruptive.</p>
          <p style={{ fontSize: '11px', color: '#888', marginTop: '12px', paddingBottom: '80px', textAlign: 'center' }}>Copyrights 2026 © Disruptive Advertising Agency</p>
        </div>
      </div>
    </div>
  )
}