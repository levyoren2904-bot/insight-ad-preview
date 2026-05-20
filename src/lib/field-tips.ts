// Professional writing tips per field, sourced from official platform guidelines
// Displayed as tooltips in the client submission form

export type FieldTip = {
  en: string;
  he: string;
};

export const fieldTips: Record<string, Record<string, FieldTip>> = {
  google: {
    companyUrl: {
      en: "Use a dedicated landing page URL that matches the ad's offer - not your homepage.",
      he: "הפנו לדף נחיתה ייעודי שתואם את ההצעה במודעה - לא לדף הבית.",
    },
    displayPath: {
      en: "Signal what users will find after clicking - e.g. '/running-shoes'. Doesn't have to match the real URL.",
      he: "רמזו למשתמש מה ימצא בלחיצה - למשל '/נעלי-ריצה'. לא חייב לתאום את הכתובת האמיתית.",
    },
    headline1: {
      en: "Include your primary keyword - users engage more with ads that mirror their search terms.",
      he: "שלבו את מילת המפתח המרכזית - משתמשים נוטים ללחוץ על מודעות שמשקפות את מה שחיפשו.",
    },
    headline2: {
      en: "Highlight a clear benefit or unique value. Make sure it complements headline 1, not repeats it.",
      he: "הדגישו יתרון ברור או הצעת ערך ייחודית. וודאו שהיא משלימה את כותרת 1, לא חוזרת עליה.",
    },
    headline3: {
      en: "Use for your brand name or a strong CTA. Google may not always show it, so don't put critical info here.",
      he: "השתמשו לשם המותג או קריאה לפעולה חזקה. Google לא תמיד מציג אותה - אל תשימו כאן מידע קריטי.",
    },
    description1: {
      en: "Focus on user benefits, not features. Include a specific CTA like 'Get a free quote' - generic CTAs underperform.",
      he: "התמקדו בתועלת ללקוח, לא בתכונות. הוסיפו קריאה לפעולה ספציפית כמו 'קבלו הצעת מחיר'.",
    },
    description2: {
      en: "Add promotions, pricing, or social proof not in headlines. This may not always show - keep essentials in description 1.",
      he: "הוסיפו מבצעים, מחירים או הוכחה חברתית. לא תמיד מוצג - שמרו את העיקר בתיאור הראשון.",
    },
  },

  facebook: {
    pageName: {
      en: "Keep it short and recognizable - consistent with how customers know your business.",
      he: "שמרו על שם קצר ומזוהה - עקבי עם הדרך שבה הלקוחות מכירים את העסק.",
    },
    primaryText: {
      en: "Lead with your strongest hook - only ~125 characters show before 'See more'. Keep it to 2-3 lines.",
      he: "התחילו עם המסר הכי חזק - רק כ-125 תווים מוצגים לפני 'קרא עוד'. שמרו על 2-3 שורות.",
    },
    headline: {
      en: "Under 40 characters, action-oriented. Reinforce the visual message, don't repeat the primary text.",
      he: "עד 40 תווים, עם כיוון לפעולה. חזקו את המסר הוויזואלי, לא חזרה על הטקסט הראשי.",
    },
    description: {
      en: "Not always shown - treat as a bonus line. Add a supporting detail like a short offer or social proof.",
      he: "לא תמיד מוצג - התייחסו כשורת בונוס. הוסיפו פרט תומך כמו הצעה קצרה או הוכחה חברתית.",
    },
    ctaButton: {
      en: "Match the CTA to the actual next step - 'Learn More' for awareness, 'Shop Now' for purchase.",
      he: "התאימו את הכפתור לצעד הבא בפועל - 'למידע נוסף' למודעות, 'לרכישה' לקנייה.",
    },
  },

  linkedin: {
    companyName: {
      en: "Use your official name as on your LinkedIn Company Page. Consistency builds trust with a professional audience.",
      he: "השתמשו בשם הרשמי כפי שמופיע בדף החברה בלינקדאין. עקביות בונה אמון מול קהל מקצועי.",
    },
    introText: {
      en: "Only ~150 characters show before truncation - put your hook there. Speak to your audience's role or challenge.",
      he: "רק 150 תווים מוצגים לפני קיצוץ - שימו שם את ההוק. דברו ישירות לתפקיד או לאתגר של הקהל.",
    },
    headline: {
      en: "Under 60 characters to avoid truncation. Start with a question or use direct address for higher engagement.",
      he: "עד 60 תווים כדי למנוע קיצוץ. התחילו בשאלה או בפנייה ישירה למעורבות גבוהה יותר.",
    },
    description: {
      en: "Use for a clear, specific CTA - 'Download the free whitepaper'. Give people a reason to click.",
      he: "נצלו לקריאה לפעולה ברורה וספציפית - 'הורידו את המדריך החינמי'. תנו סיבה ללחוץ.",
    },
    ctaButton: {
      en: "Action-driven CTAs like 'Download' or 'Request a Demo' outperform generic options.",
      he: "קריאות אקטיביות כמו 'הורדה' או 'לתיאום דמו' עובדות טוב יותר מניסוחים גנריים.",
    },
  },

  pinterest: {
    pinTitle: {
      en: "Only ~40 characters show on most surfaces - front-load the most important keywords.",
      he: "רק 40 תווים נראים ברוב המקומות - הקדימו את מילות המפתח החשובות.",
    },
    pinDescription: {
      en: "Mix broad and specific keywords naturally. For sales ads, prioritize clarity - tell shoppers exactly what they're getting.",
      he: "שלבו מילות מפתח רחבות וספציפיות בטבעיות. במודעות למכירה - העדיפו בהירות, ספרו בדיוק מה מקבלים.",
    },
    destinationUrl: {
      en: "Link directly to the product or content shown - not a generic homepage. Users expect to land where the Pin promised.",
      he: "הפנו ישירות למוצר או לתוכן שמוצג - לא לדף בית כללי. הגולשים מצפים להגיע למה שהפין הבטיח.",
    },
    boardName: {
      en: "Use clear, keyword-rich board names - e.g. 'Easy Dinner Ideas' not 'My Stuff'. Boosts Pin discoverability.",
      he: "שמות בורד ברורים ועשירי מילות מפתח - למשל 'רעיונות לארוחות מהירות'. משפר גילוי בחיפוש.",
    },
  },
};
