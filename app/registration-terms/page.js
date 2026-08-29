'use client'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'

export default function RegistrationTermsPage() {
  const router = useRouter()

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingTop: '64px' }}>
      <AppHeader />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => router.back()} style={{ background: '#F1F1F1', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', marginBottom: '16px', cursor: 'pointer' }}>← Back</button>
        
        <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#000', marginBottom: '20px', textAlign: 'center' }}>Terms and Conditions</h1>
        <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#000', marginBottom: '16px' }}>Welcome to the Disruptive Advertising Agency Platform and Services</h2>

        <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#222' }}>
          <p style={{ marginBottom: '16px' }}>
            To ensure the security of both Disruptive Advertising Agency and the merchants' information (collectively referred to as the "Platform Use and Services"), we ask that you carefully review the following Platform and Services License Agreement (hereinafter referred to as the "Platform" or the "Agreement"). It is essential that you fully understand the terms and conditions outlined herein, particularly those related to service usage, limitations, and any separate agreements associated with specific terms.
          </p>
          <p style={{ marginBottom: '24px' }}>
            By becoming a user of Disruptive Advertising Agency, you acknowledge that you are at least 21 years of age and that you have read, understood, and agreed to be bound by this Agreement and all applicable terms and conditions. If you do not meet these requirements or do not agree to the terms, you are not permitted to download or install the software, nor are you authorized to access or use the services provided by the Platform.
          </p>

          <h3 style={{ fontWeight: '800', marginTop: '24px', color: '#000' }}>(A) Protection of Users' Personal Information</h3>
          <p>1.1 Disruptive Advertising Agency upholds the fundamental principle of safeguarding the personal information of both users and merchants. To ensure data security, Disruptive Advertising Agency employs professional-grade encryption for both storage and transmission of all user information. In the event of unauthorized disclosure of such information without the original party's consent, Disruptive Advertising Agency reserves the right to pursue legal action.</p>
          <p>1.2 During the use of Disruptive Advertising Agency's services, users are required to provide certain necessary personal details. For instance, account registration necessitates the submission of a valid mobile phone number and the acceptance of relevant terms and conditions. Failure to provide complete and accurate information may result in limitations or restrictions on the use of the services.</p>
          <p>1.3 Users may typically update their submitted information at any time. However, for security purposes such as account recovery—certain personal details may not be editable after registration.</p>
          <p>1.4 Disruptive Advertising Agency implements a variety of security technologies and procedures, supported by a robust management system, to protect personal data. Any unauthorized access, use, or misuse of such information will be subject to legal consequences. In particular, the registered mobile numbers associated with both new and existing Disruptive Advertising Agency accounts may not be altered arbitrarily.</p>
          <p>1.5 Disruptive Advertising Agency will not share or disclose user information to any third-party companies or organizations without the user's explicit consent, under any circumstances.</p>
          <p>1.6 Individuals under the age of 21 must provide written consent from a parent or legal guardian, or documentation from law enforcement, prior to accessing any services offered on this platform.</p>

          <h3 style={{ fontWeight: '800', marginTop: '24px', color: '#000' }}>(B) User Responsibilities</h3>
          <p>2.1 Users must complete two sets of required product submissions prior to initiating a withdrawal request.</p>
          <p>2.2 Withdrawals cannot be made while submission processes are still in progress.</p>
          <p>2.3 Users are not permitted to cancel or skip any product submission steps.</p>
          <p>2.4 If the withdrawal amount in a user's account exceeds 100,000 USD, a withdrawal fee of 20% will be applied. This fee must be paid before the withdrawal is processed. Upon receipt of the withdrawal fee, the full amount of the fee will be immediately refunded to the user.</p>

          <h3 style={{ fontWeight: '800', marginTop: '24px', color: '#000' }}>(C) Terms and Conditions</h3>
          <p>3.1 Agreement: The user agreement and terms of service are governed by the conditions outlined within the user account. Users are required to submit all necessary information and documentation to Disruptive Advertising Agency as part of the contractual relationship. These user-provided materials shall be considered an integral part of the contract. Disruptive Advertising Agency reserves the right to make the final interpretation of the terms of this agreement.</p>
          <p>3.2 Provision of Services: Disruptive Advertising Agency delivers its services to all users in accordance with these terms and conditions. For any questions, concerns, or important inquiries, users are encouraged to contact the appropriate department for further assistance or to provide feedback.</p>

          <p style={{ fontWeight: '800', marginTop: '30px', textAlign: 'center' }}>The final right of interpretation belongs to Disruptive Advertising Agency.</p>
          <p style={{ fontSize: '11px', color: '#888', marginTop: '12px', paddingBottom: '80px', textAlign: 'center' }}>Copyrights 2026 © Disruptive Advertising Agency</p>
        </div>
      </div>
    </div>
  )
}