'use client'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'

export default function TermsPage() {
  const router = useRouter()

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingTop: '64px' }}>
      <AppHeader />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => router.back()} style={{ background: '#F1F1F1', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', marginBottom: '16px', cursor: 'pointer' }}>← Back</button>
        
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Terms & Conditions</h1>
        <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>
          These Terms and Conditions are governed by the following terminology and principles of interpretation. All users are required to adhere to the terms outlined by the platform. Any violations will result in corrective actions and penalties imposed by the platform. The User Agreement, which is part of these Terms and Conditions, is subject to the platform's final interpretation.
        </p>

        <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#222' }}>
          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>1. Start to Submit Product Data</h3>
          <p>1.1 A minimum account balance of 50 USD is required to initiate the first set of 40 product submissions.</p>
          <p>1.2 A minimum deposit of 100 USD is required to reset and begin the new daily product submission process.</p>
          <p>1.3 Users must complete the current dataset before requesting a reset for the next set of submissions.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>2. Withdrawal</h3>
          <p>2.1 Withdrawal amount is based on the VIP level of the account, if withdrawals exceeding the amount require an upgrade to the appropriate membership level, as each level is subject to different withdrawal limits.</p>
          <p>2.2 Users are required to complete two sets of product submissions per day in order to submit a withdrawal request. Additionally, users must request the withdrawal of their full account balance.</p>
          <p>2.3 Users who abandon or quit during the product submission process are ineligible to apply for a withdrawal or refund.</p>
          <p>2.4 If a withdrawal request has not been formally submitted by the user, the platform cannot process any withdrawal on the user's behalf.</p>
          <p>2.5 All members apply for withdrawal of more than 20,000 USD for the first time need to contact online customer service to process it to ensure the safety of all members' transfer funds</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>3. Funds</h3>
          <p>3.1 All user funds will be securely stored in their account and may be withdrawn in full once all product submissions are completed.</p>
          <p>3.2 To avoid any loss of funds, all data processing will be handled by the system, not manually.</p>
          <p>3.3 In case of accidental loss of funds, the platform will assume full responsibility.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>4. Account Security</h3>
          <p>4.1 Users must not share their login passwords or security PIN with others. If this results in a loss, the platform will not be responsible.</p>
          <p>4.2 It is not recommended to set easily identifiable information, such as birthdates, ID card numbers, or phone numbers, as security codes or login passwords.</p>
          <p>4.3 If users forget their login or withdrawal passwords, they should contact customer service to reset them.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>5. Normal Product</h3>
          <p>5.1 VIP 1 users can complete 2 sets of product submissions per day with a 0.5% commission for each normal product data.</p>
          <p>5.2 VIP 2 users can complete 2 sets of product submissions per day with a 1.0% commission.</p>
          <p>5.3 VIP 3 users can complete 2 sets of product submissions per day with a 1.5% commission.</p>
          <p>5.4 VIP 4 users can complete 2 sets of product submissions per day with a 2.0% commission.</p>
          <p>5.5 VIP 5 users can complete 2 sets of product submissions per day with a 2.5% commission.</p>
          <p>5.6 Upon successful submission of product data, the commission will be automatically credited to the user's account balance.</p>
          <p>5.7 The system will randomly assign product data to the user's account based on their account balance.</p>
          <p>5.8 Once the data is assigned to the user's account, it cannot be canceled, skipped, or exchanged.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>6. Merged Product</h3>
          <p>6.1 Merged product consists of 2 to 3 product data sets. Users may not necessarily receive 3 product data sets; the system will randomly assign product data within the merged product, with a higher likelihood of receiving 1 product data set.</p>
          <p>6.2 Users will earn ten times the commission for each product in the merged product compared to normal product data.</p>
          <p>6.3 Upon receiving merged product, all funds will be placed on hold until the submission of each pending merged product is completed. These funds will be returned to the user's account after the submissions are finalized.</p>
          <p>6.4 The system will randomly assign merged product to the user's account based on the total balance in the user's account.</p>
          <p>6.5 Once merged product is assigned to the user's account, it cannot be canceled, skipped, or exchanged.</p>
          <p>6.6 A user can receive a maximum of 3 merged product sets per set of product submission.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>7. Advance Payments</h3>
          <p>7.1 The amount for advance payment is determined by the user. The platform does not set specific amounts for the user, but recommends users make advance payments based on their financial capacity or after becoming familiar with the platform.</p>
          <p>7.2 If a user needs to make an advance payment upon receiving merged product, it is advised that the user pays according to the negative balance indicated in their account.</p>
          <p>7.3 Before making an advance payment, users must contact customer service to request advance payment details and confirm the merchant's wallet address.</p>
          <p>7.4 The platform will not assume responsibility for any loss resulting from payments made to incorrect wallet addresses.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>8. Merchant Cooperation</h3>
          <p>8.1 Data availability on the platform fluctuates. If product is not processed in a timely manner, merchants may be unable to offload it, affecting their progress. Users are encouraged to complete their submissions and apply for withdrawals promptly to avoid hindering merchant progress. Users must complete all submissions within 24 hours to avoid complaints from merchants and order freezes.</p>
          <p>8.2 Merchants will provide users with wallet addresses to facilitate advance payments.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>9. Invitation</h3>
          <p>9.1 Users may invite other users to the platform using the invitation code linked to their account.</p>
          <p>9.2 Referral invitations are limited to once per user per month.</p>
          <p>9.3 To be eligible to use an invitation code to invite referrals, a user must first complete 15 days of work after registration.</p>
          <p>9.4 Referrers will receive 20% of the referee's daily earnings as a commission.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>10. Credit Score</h3>
          <p>10.1 Users must complete all sets of product data submissions to maintain a 100% credit score.</p>
          <p>10.2 Failure to complete the submissions will result in a decrease in the user's credit score.</p>
          <p>10.3 The credit score is determined by the number of incomplete orders and the timeliness of their completion.</p>
          <p>10.4 A decrease in credit score may affect a user's ability to request withdrawals.</p>

          <h3 style={{ fontWeight: '800', marginTop: '20px' }}>11. Operating Hours</h3>
          <p>11.1 The platform operates from 10:00 -23:00 (EST).</p>
          <p>11.2 Customer service is available from 10:00 -23:00 (EST).</p>
          <p>11.3 Platform withdrawal hours are from 10:00 -23:00 (EST).</p>

          <p style={{ fontWeight: '800', marginTop: '30px' }}>The final right of interpretation belongs to Disruptive.</p>
          <p style={{ fontSize: '11px', color: '#888', marginTop: '12px', paddingBottom: '80px', textAlign: 'center' }}>Copyrights 2026 © Disruptive Advertising Agency</p>
        </div>
      </div>
    </div>
  )
}