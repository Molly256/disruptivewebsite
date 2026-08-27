'use client'
import { useState, useEffect } from 'react'

const en = {
  home:"Home",
  withdraw:"WITHDRAW",totalBalance:"Total Balance",freeze:"Freeze",submit:"SUBMIT",save:"SAVE",all:"ALL",
  selected:"Selected",certificate:"CERTIFICATE",contactUs:"Contact Us",contactDesc:"Looking to get in touch? You can reach us with the info below",
  onlineSupport:"Online Customer Support",deposit:"Deposit",event:"Event",vipLevels:"VIP LEVELS",faqs:"FAQs",terms:"T&C's",aboutUs:"About Us",
  adminPanel:"Admin Panel",weWantYouTo:"WE WANT YOU TO",dreamBig:"DREAM BIG",scaleFast:"SCALE FAST",buildBoldly:"BUILD BOLDLY",
  quickClicks:"QUICK CLICKS",noticeText:"Thank you for your support on the disruptive advertising platform. kindly read rules and regulations. Thank you.",
  weSpecialize1:"WE SPECIALIZE IN HELPING B2B",weSpecialize2:"AND ECOMMERCE BUSINESSES",weSpecialize3:"DOMINATE THE DIGITAL SPACE.",
  ourServices:"OUR\nSERVICES",tagWebDesign:"Web Design",tagSEO:"SEO",tagSMM:"Social Media Marketing",tagShopify:"Shopify Brand Development",
  service1:"eCommerce Website Design",service2:"Search Engine Optimization",service3:"Social Media Marketing",service4:"Pay-Per-Click (PPC)",
  service5:"Digital Marketing Strategy",service6:"Influencer Marketing",
  disruptiveDesc1:"At Disruptive, we don't just offer services—we deliver",disruptiveDescBold:"strategic solutions",
  disruptiveDesc2:"designed to drive your business forward. Whether you're looking to build a brand from scratch or scale an established one, our expert team is ready to help you spark real growth.",
  copyright:"Copyrights 2026 © Distruptive Advertising Agency",contactCS:"Contact Customer Service",
  depositHelp:"To make a deposit, please contact our customer service team and they will assist you.",ok:"OK",depositTitle:"DEPOSIT",
  depositViaCS:"Deposit Through Customer Service",depositCSDesc:"For security reasons, all deposits must be processed through our customer service team.",
  contactCustomerService:"Contact Customer Service",currentDepositRewards:"Current Deposit Rewards",
  depositTier1:"1,500 - 9,999 USD: 4% Bonus",depositTier2:"10,000 - 19,999 USD: 8% Bonus",depositTier3:"20,000 - 49,999 USD: 12% Bonus",depositTier4:"50,000+ USD: 20% Bonus",
  depositDisclaimer:"*The final interpretation right belongs to Disruptive platform",eventTitle:"EVENT",
  anniversary:"3rd Anniversary\nThanksgiving Feedback",advanceActivities:"Advances Activities.",resetAdvanceRewards:"Reset Advance Rewards",
  amount:"Amount",getExtra:"Get Extra",accumulatedDepositRewards:"Accumulated Deposit Rewards For The Day",advancesOnDay:"Advances On Day (USD)",
  willGet:"Will Get (USD)",advanceReward:"Advance Reward",vipLevelChart:"VIP Level Chart",moreYouRecharge:"The More You Recharge • The Higher You Rise",
  vipLevel:"VIP Level",profitRate:"Profit Rate/\nDeal",dailyWorkOpportunities:"Daily Work\nOpportunities",unlockCondition:"Unlock Condition/\nFirst Deposit Amount",
  noticeToUsers:"Notice to all users:",vipNotice:"All advance for the above mentioned unlocked VIP levels will be credited to the account and all deposits can be withdrawn by the user after completing the daily works.",
  benefitsTitle:"Benefits of Upgrading Your VIP Level:",benefit1:"Higher Daily Profits",benefit2:"More Work Opportunities",benefit3:"Priority Access to Special Events",benefit4:"Bonus Rewards for Top-tier Members",
  upgradeToday:"Upgrade today and maximize your earning power!",workdayRewards:"Workday Rewards Scheme",signInShowUp:"Sign In • Show Up • Get Paid",
  daysWorked:"Days Worked",salaryEarned:"Salary Earned",signIn:"Sign in",workingDays:"working days",howItWorks:"How It Works:",
  howItWorksDesc:"For everyday you sign in and complete your work, you earn guaranteed income!\nThe more you show up, the more you earn. Simple as that!",
  perfectAttendance:"Perfect attendance will earn up to USD 6,120 per month.",welcomeTitle:"DISRUPTIVE WELCOMES YOU",
  welcomeDesc:"We specialize in helping B2B and e-commerce businesses dominate the digital space.",loginUsername:"Username",loginPhone:"Phone",
  enterPhone:"Enter a phone number",searchCountry:"Search country...",loginPassword:"Login Password",forgotPassword:"Forgot your password?",
  noAccount:"Don't have an account yet?",signUp:"SIGN UP",cantSignIn:"Can't sign in?",contactSupport:"Contact our user support",
  loginSuccess:"Login Successful",redirecting:"Redirecting to dashboard...",passwordRequired:"Password is required",notificationsTitle:"Notifications",
  loading:"Loading...",noNotificationsYet:"No notifications yet",myProfile:"My Profile",hello:"Hello,",myReferralCode:"My Referral Code",
  todaysProfit:"Today's Profit (USD)",totalBalanceLabel:"Total Balance (USD)",creditScoreLabel:"Credit Score:",editProfileImage:"Edit Profile Image",
  uploadProfileImage:"Upload Profile Image",referralCopied:"Referral Code Copied!",myProfileSection:"My Profile",myFinancial:"My Financial",
  other:"Other",changeLanguage:"Change Language",logout:"LOG OUT",logoutConfirm:"Are you sure you want to logout?",
  records:"Records",pending:"Pending",completed:"Completed",noRecords:"No records",completedBadge:"Completed",totalAmount:"TOTAL AMOUNT",
  profit:"PROFIT",code:"Code:",registrationSuccess:"Registration Successful",redirectingToLogin:"Redirecting to login...",
  confirmLoginPassword:"Confirm Login Password",transactionPassword:"Transaction Password",male:"Male",female:"Female",acceptTerms:"Accept ours",
  termsAndConditions:"Terms and Conditions",alreadyHaveAccount:"Already have an account?",bySigningUp:"By signing up, you agree to our",
  usernameRequired:"Username is required",validPhoneRequired:"Enter valid phone number",inviteCodeRequired:"Invite code is required",
  transactionPasswordRequired:"Transaction password is required",selectGender:"Please select gender",acceptTermsRequired:"You must accept Terms and Conditions",
  starting:"Starting",startingDetail:"Starting Detail",createdAt:"Created At",taskCode:"Task Code",totalPrice:"TOTAL PRICE",
  totalProfit:"TOTAL PROFIT",toPayHold:"TO PAY/HOLD",insufficientBalance:"Insufficient Balance",
  balanceNegative:"Balance is negative. Deposit {amount} USD to enable submit.",setCompleted:"Set completed. Contact Customer Service to reset.",
  startingMsg:"Starting...",taskCompleted:"Task Completed! Payout Received",balanceBelow50:"Balance below 50 unable to continue trading",
  todaysCommission:"TODAY'S COMMISSION",todayCommissionDesc:"The displayed amount reflects today's earned commissions.",balance:"BALANCE",
  balanceDesc:"The total balance reflects deposited + hold + special bonus.",holdAmount:"HOLD AMOUNT",
  holdAmountDesc:"Money for tasks not yet submitted.",specialBonus:"Special Bonus",importantNotice:"Important Notice",
  supportHours:"Online Support Hours 09:45 - 23:10",contactSupport:"Please contact online support for your assistance",
  suitableFor:"Suitable for most data capture scenarios involving light to medium usage",profitPerProduct:"Profit of {percent}% per product data",
  productDataPerSet:"{count} product data per set",submissionsPerDay:"Up to {count} data submissions per day",
  setsPerDay:"Can complete {count} sets of data submissions per day",noPremiumAccess:"No access to other Premium features",
  premiumLimited:"Premium user have limited access to all features of the platform",depositByEvent:"Deposit according to our events",
  betterProfitPermission:"Better profit and permission",fullPremiumAccess:"Full access to all other premium features",
  supremeUnlimited:"Supreme user gets unlimited access to all features of the platform",depositsByEvent:"Deposits according to our events",
  betterProfitsPermissions:"Better profits and permissions",withdrawAccount:"Withdraw Account",noWalletBound:"No wallet bound. Go to Bind Wallet first",
  withdrawAmount:"Withdraw Amount",enterTxPassword:"Enter tx password",pleaseEnterAmount:"Please enter amount",
  pleaseBindWallet:"Please bind wallet first",enterTxPass:"Enter transaction password",withdrawRequestSent:"Withdraw Request Sent. Status: Pending",
  withdrawFailed:"Withdraw Failed",withdrawNote:"After submit: Amount moves to \"Freeze\". Admin approves in admin panel, then amount is released.",
  accountInfo:"Account Info",accountInformation:"Account Information",username:"Username",phone:"Phone",gender:"Gender",
  updatePassword:"Update Password",updateTxPassword:"Update Transaction Password",insertOldPassword:"Insert Old Password",
  insertNewPassword:"Insert New Password",repeatNewPassword:"Repeat New Password",insertNew:"Insert New",repeatNew:"Repeat New",
  enterCurrentPassword:"Enter current password",enterNewPassword:"Enter new password",enterCurrentTxPassword:"Enter current tx password",
  enterNewTxPassword:"Enter new tx password",repeatNewTxPassword:"Repeat new tx password",fillAllFields:"Fill all fields",
  passwordsDontMatch:"New passwords do not match",newPassDifferent:"New password must be different from old",
  passwordUpdated:"Password Updated Successfully",txPasswordUpdated:"Transaction Password Updated Successfully",
  bindWallet:"Bind Wallet",paymentMethods:"Payment Methods",noMoreData:"No more data",create:"CREATE",edit:"EDIT",
  withdrawType:"Withdraw Type",walletName:"Wallet Name",walletAddress:"Wallet Address",walletBound:"Wallet Bound Successfully",
  notifications:"Notifications",noNotifications:"No notifications yet",
  history:"History",reviewing:"Reviewing",success:"Success",reject:"Reject",cancel:"Cancel"
}

// NOW FIXED: each language overrides the visible keys
const fr = {...en,
  hello:"Bonjour,", myProfile:"Mon Profil", myProfileSection:"Mon Profil", myReferralCode:"Mon Code de Parrainage",
  todaysProfit:"Bénéfice du Jour (USD)", totalBalanceLabel:"Solde Total (USD)", creditScoreLabel:"Score de Crédit:",
  editProfileImage:"Modifier l'image", uploadProfileImage:"Télécharger l'image", myFinancial:"Mes Finances", other:"Autre",
  accountInfo:"Infos Compte", bindWallet:"Lier Portefeuille", deposit:"Dépôt", withdraw:"Retrait", notifications:"Notifications",
  changeLanguage:"Changer de Langue", logout:"DÉCONNEXION", records:"Enregistrements", pending:"En attente", completed:"Terminé",
  history:"Historique",reviewing:"En cours",success:"Réussi",reject:"Rejeté",cancel:"Annuler"
}
const ja = {...en,
  hello:"こんにちは,", myProfile:"マイプロフィール", myProfileSection:"マイプロフィール", myReferralCode:"マイ紹介コード",
  todaysProfit:"本日の利益 (USD)", totalBalanceLabel:"合計残高 (USD)", creditScoreLabel:"信用スコア:",
  editProfileImage:"プロフィール画像を編集", uploadProfileImage:"プロフィール画像をアップロード", myFinancial:"私の財務", other:"その他",
  accountInfo:"アカウント情報", bindWallet:"ウォレットをバインド", deposit:"入金", withdraw:"出金", notifications:"通知",
  changeLanguage:"言語を変更", logout:"ログアウト", records:"記録", pending:"保留中", completed:"完了",
  history:"履歴",reviewing:"審査中",success:"成功",reject:"拒否",cancel:"キャンセル"
}
const sv = {...en,
  hello:"Hej,", myProfile:"Min Profil", myProfileSection:"Min Profil", myReferralCode:"Min Referral Kod",
  todaysProfit:"Dagens Vinst (USD)", totalBalanceLabel:"Totalt Saldo (USD)", creditScoreLabel:"Kreditpoäng:",
  editProfileImage:"Redigera Profilbild", uploadProfileImage:"Ladda upp Profilbild", myFinancial:"Min Ekonomi", other:"Övrigt",
  accountInfo:"Kontoinfo", bindWallet:"Bind Plånbok", deposit:"Insättning", withdraw:"Uttag", notifications:"Notiser",
  changeLanguage:"Byt Språk", logout:"LOGGA UT", records:"Register", pending:"Väntar", completed:"Slutförd",
  history:"Historik",reviewing:"Granskas",success:"Lyckades",reject:"Avvisad",cancel:"Avbryt"
}
const it = {...en,
  hello:"Ciao,", myProfile:"Mio Profilo", myProfileSection:"Mio Profilo", myReferralCode:"Mio Codice Referral",
  todaysProfit:"Profitto di Oggi (USD)", totalBalanceLabel:"Saldo Totale (USD)", creditScoreLabel:"Punteggio di Credito:",
  editProfileImage:"Modifica Immagine", uploadProfileImage:"Carica Immagine", myFinancial:"Le Mie Finanze", other:"Altro",
  accountInfo:"Info Account", bindWallet:"Collega Portafoglio", deposit:"Deposito", withdraw:"Preleva", notifications:"Notifiche",
  changeLanguage:"Cambia Lingua", logout:"LOG OUT", records:"Registri", pending:"In attesa", completed:"Completato",
  history:"Cronologia",reviewing:"In Revisione",success:"Successo",reject:"Rifiutato",cancel:"Annulla"
}
const de = {...en,
  hello:"Hallo,", myProfile:"Mein Profil", myProfileSection:"Mein Profil", myReferralCode:"Mein Empfehlungscode",
  todaysProfit:"Heutiger Gewinn (USD)", totalBalanceLabel:"Gesamtsaldo (USD)", creditScoreLabel:"Kreditwürdigkeit:",
  editProfileImage:"Profilbild Bearbeiten", uploadProfileImage:"Profilbild Hochladen", myFinancial:"Meine Finanzen", other:"Andere",
  accountInfo:"Kontoinfo", bindWallet:"Wallet Binden", deposit:"Einzahlung", withdraw:"Auszahlung", notifications:"Benachrichtigungen",
  changeLanguage:"Sprache Ändern", logout:"ABMELDEN", records:"Aufzeichnungen", pending:"Ausstehend", completed:"Abgeschlossen",
  history:"Verlauf",reviewing:"In Prüfung",success:"Erfolg",reject:"Abgelehnt",cancel:"Abbrechen"
}
const no = {...en,
  hello:"Hei,", myProfile:"Min Profil", myProfileSection:"Min Profil", myReferralCode:"Min Vervingskode",
  todaysProfit:"Dagens Fortjeneste (USD)", totalBalanceLabel:"Total Saldo (USD)", creditScoreLabel:"Kredittscore:",
  editProfileImage:"Rediger Profilbilde", uploadProfileImage:"Last opp Profilbilde", myFinancial:"Min Økonomi", other:"Annet",
  accountInfo:"Kontoinfo", bindWallet:"Bind Lommebok", deposit:"Innskudd", withdraw:"Uttak", notifications:"Varsler",
  changeLanguage:"Endre Språk", logout:"LOGG UT", records:"Registreringer", pending:"Venter", completed:"Fullført",
  history:"Historikk",reviewing:"Gjennomgås",success:"Suksess",reject:"Avvist",cancel:"Avbryt"
}
const ru = {...en,
  hello:"Привет,", myProfile:"Мой Профиль", myProfileSection:"Мой Профиль", myReferralCode:"Мой Реферальный Код",
  todaysProfit:"Прибыль Сегодня (USD)", totalBalanceLabel:"Общий Баланс (USD)", creditScoreLabel:"Кредитный Рейтинг:",
  editProfileImage:"Редактировать Фото", uploadProfileImage:"Загрузить Фото", myFinancial:"Мои Финансы", other:"Другое",
  accountInfo:"Инфо Аккаунта", bindWallet:"Привязать Кошелек", deposit:"Депозит", withdraw:"Вывод", notifications:"Уведомления",
  changeLanguage:"Сменить Язык", logout:"ВЫЙТИ", records:"Записи", pending:"Ожидает", completed:"Завершено",
  history:"История",reviewing:"На рассмотрении",success:"Успешно",reject:"Отклонено",cancel:"Отмена"
}
const hu = {...en,
  hello:"Szia,", myProfile:"Profilom", myProfileSection:"Profilom", myReferralCode:"Saját Hivatkozási Kód",
  todaysProfit:"Mai Profit (USD)", totalBalanceLabel:"Összes Egyenleg (USD)", creditScoreLabel:"Hitelpontszám:",
  editProfileImage:"Profilkép Szerkesztése", uploadProfileImage:"Profilkép Feltöltése", myFinancial:"Pénzügyeim", other:"Egyéb",
  accountInfo:"Fiókinfó", bindWallet:"Tárca Összekapcsolás", deposit:"Befizetés", withdraw:"Kifizetés", notifications:"Értesítések",
  changeLanguage:"Nyelv Váltás", logout:"KIJELENTKEZÉS", records:"Rekordok", pending:"Függőben", completed:"Befejezett",
  history:"Előzmények",reviewing:"Ellenőrzés alatt",success:"Siker",reject:"Elutasítva",cancel:"Mégse"
}
const pl = {...en,
  hello:"Cześć,", myProfile:"Mój Profil", myProfileSection:"Mój Profil", myReferralCode:"Mój Kod Polecający",
  todaysProfit:"Dzisiejszy Zysk (USD)", totalBalanceLabel:"Całkowite Saldo (USD)", creditScoreLabel:"Wynik Kredytowy:",
  editProfileImage:"Edytuj Zdjęcie", uploadProfileImage:"Prześlij Zdjęcie", myFinancial:"Moje Finanse", other:"Inne",
  accountInfo:"Info o Koncie", bindWallet:"Powiąż Portfel", deposit:"Wpłata", withdraw:"Wypłata", notifications:"Powiadomienia",
  changeLanguage:"Zmień Język", logout:"WYLOGUJ", records:"Rekordy", pending:"Oczekujące", completed:"Zakończone",
  history:"Historia",reviewing:"W trakcie",success:"Sukces",reject:"Odrzucono",cancel:"Anuluj"
}
const sk = {...en,
  hello:"Ahoj,", myProfile:"Môj Profil", myProfileSection:"Môj Profil", myReferralCode:"Môj Odporúčací Kód",
  todaysProfit:"Dnešný Zisk (USD)", totalBalanceLabel:"Celkový Zostatok (USD)", creditScoreLabel:"Kreditné Skóre:",
  editProfileImage:"Upraviť Profilovú Fotku", uploadProfileImage:"Nahrať Profilovú Fotku", myFinancial:"Moje Financie", other:"Ostatné",
  accountInfo:"Info o Účte", bindWallet:"Prepojiť Peňaženku", deposit:"Vklad", withdraw:"Výber", notifications:"Upozornenia",
  changeLanguage:"Zmeniť Jazyk", logout:"ODHLÁSIŤ", records:"Záznamy", pending:"Čaká sa", completed:"Dokončené",
  history:"História",reviewing:"Kontroluje sa",success:"Úspech",reject:"Zamietnuté",cancel:"Zrušiť"
}

const translations = {en,fr,ja,sv,it,de,no,ru,hu,pl,sk}

function getLang(){
  if(typeof window === 'undefined') return 'en'
  return localStorage.getItem('app_lang') || localStorage.getItem('lang') || localStorage.getItem('language') || 'en'
}

export const t = (key, vars) => {
  const lang = getLang()
  let str = translations[lang]?.[key] || translations['en'][key] || key
  if(vars){
    Object.keys(vars).forEach(k => { str = str.replace(`{${k}}`, vars[k]) })
  }
  return str
}

export const setLang = (code) => {
  if(typeof window === 'undefined') return
  localStorage.setItem('app_lang', code)
  localStorage.setItem('lang', code)
  localStorage.setItem('language', code)
  document.documentElement.lang = code
  window.dispatchEvent(new Event('languageChanged'))
}

export const getCurrentLang = getLang

// NEW HOOK - use this instead of t() to make whole app reactive
export function useT(){
  const [lang, setLangState] = useState(getLang())
  useEffect(()=>{
    setLangState(getLang())
    const handler = () => setLangState(getLang())
    window.addEventListener('languageChanged', handler)
    window.addEventListener('storage', handler)
    return ()=>{
      window.removeEventListener('languageChanged', handler)
      window.removeEventListener('storage', handler)
    }
  },[])
  return (key, vars) => {
    let str = translations[lang]?.[key] || translations['en'][key] || key
    if(vars){
      Object.keys(vars).forEach(k => { str = str.replace(`{${k}}`, vars[k]) })
    }
    return str
  }
}