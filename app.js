/* =============================================================
   NameSpark Baby — Logique frontend v2
   -------------------------------------------------------------
   Contient :
   1)  Traductions FR / EN (i18n)
   2)  Navigation + burger mobile
   3)  Animations (titre, reveal au scroll)
   4)  Segments (genre / longueur)
   5)  Lecture des filtres
   6)  Génération MODE DÉMO (local, sans API)
   7)  Stub backend sécurisé (futur)
   8)  Score de compatibilité prénom / nom de famille
   9)  Rendu des cartes (nameCardHTML)
   10) Rendu des résultats (renderResults)
   11) Formulaire
   12) Prénoms populaires
   13) FAQ
   14) ★ FAVORIS (localStorage)
   15) ★ RENDU FAVORIS
   16) ★ COMPARATEUR (modal)
   17) ★ EXPORT PDF (window.print)
   18) ★ PARTAGE (URL params)
   19) ★ PANNEAU FLOTTANT « Votre sélection »
   20) ★ TOAST
   21) Pré-remplissage via query string (SEO + share)
   22) Init

   ⚠️  Aucune clé API dans ce fichier.
       Aucun appel réseau en mode démo.
   ============================================================= */

/* =============================================================
   1) TRADUCTIONS (i18n)
   ============================================================= */
const I18N = {
  fr: {
    /* ---- navigation ---- */
    nav_home: "Accueil", nav_generator: "Générateur",
    nav_how: "Comment ça marche", nav_faq: "FAQ",
    nav_favs: "Mes favoris",
    /* ---- hero ---- */
    hero_eyebrow: "Générateur de prénoms bébé",
    hero_title: "Trouvez le prénom parfait pour votre bébé",
    hero_subtitle: "Découvrez des milliers d'idées de prénoms selon leur origine, leur signification et leur style.",
    hero_cta: "Lancer le générateur", hero_cta2: "Comment ça marche",
    /* ---- pourquoi ---- */
    why_title: "Pourquoi utiliser NameSpark Baby",
    why_sub: "Un outil pensé pour les futurs parents, simple, élégant et précis.",
    why_1_t: "Des résultats sur-mesure",
    why_1_d: "Filtrez par genre, origine, style, signification, première lettre et longueur pour des idées vraiment adaptées.",
    why_2_t: "Le sens derrière chaque prénom",
    why_2_d: "Signification, origine et explication : vous comprenez pourquoi chaque prénom vous correspond.",
    why_3_t: "Des idées qui s'enchaînent",
    why_3_d: "Un prénom vous plaît ? Découvrez en un clic des prénoms similaires en style et en origine.",
    /* ---- générateur ---- */
    gen_title: "Le générateur de prénoms", gen_sub: "Renseignez vos préférences, on s'occupe du reste.",
    f_gender: "Genre", g_boy: "Garçon", g_girl: "Fille", g_mixte: "Mixte",
    f_origin: "Origine", o_all: "Toutes", o_hebreu: "Hébreu", o_francais: "Français",
    o_anglais: "Anglais", o_arabe: "Arabe", o_italien: "Italien", o_espagnol: "Espagnol",
    o_grec: "Grec", o_latin: "Latin",
    f_style: "Style", any: "Peu importe",
    s_classique: "Classique", s_moderne: "Moderne", s_rare: "Rare",
    s_elegant: "Élégant", s_court: "Court", s_poetique: "Poétique",
    f_meaning: "Signification recherchée",
    m_force: "Force", m_courage: "Courage", m_sagesse: "Sagesse",
    m_lumiere: "Lumière", m_nature: "Nature", m_liberte: "Liberté", m_foi: "Foi", m_amour: "Amour",
    f_letter: "Première lettre (optionnel)", f_length: "Longueur",
    l_court: "Court", l_moyen: "Moyen", l_long: "Long",
    f_surname: "Nom de famille (optionnel)", f_submit: "Générer des prénoms",
    /* ---- résultats ---- */
    res_title: "Vos prénoms",
    res_empty: "Choisissez vos critères puis cliquez sur « Générer » pour découvrir des idées de prénoms.",
    res_none: "Aucun prénom ne correspond exactement. Essayez d'élargir vos critères.",
    res_count: (n) => `${n} prénom${n > 1 ? "s" : ""} proposé${n > 1 ? "s" : ""}`,
    /* ---- cards ---- */
    card_meaning: "Signification", card_origin: "Origine",
    card_style: "Style", card_why: "Pourquoi ce prénom fonctionne",
    similar_btn: "Voir des prénoms similaires",
    similar_title: (n) => `Prénoms similaires à ${n}`,
    /* ---- favoris ---- */
    fav_add_tip: "Ajouter aux favoris",
    fav_remove_tip: "Retirer des favoris",
    fav_title: "Ma liste",
    fav_sub: "Vos coups de cœur sauvegardés. Sauvegardez, comparez ou partagez votre sélection.",
    /* ---- sauvegarder ---- */
    save_btn: "📩 Sauvegarder ma liste",
    save_modal_title: "Sauvegarder ma liste",
    save_modal_desc: "Recevez votre sélection par email et retrouvez-la plus tard.",
    save_field_fname: "Votre prénom (optionnel)",
    save_field_email: "Votre adresse email",
    save_submit: "Recevoir ma liste",
    save_success_title: "Votre sélection a été sauvegardée.",
    save_success_sub: "Vous recevrez bientôt un email avec votre liste.",
    save_success_close: "Fermer",
    save_error_email: "Veuillez renseigner une adresse email valide.",
    fav_empty: "Cliquez sur ❤️ pour sauvegarder un prénom.",
    fav_remove: "Retirer",
    fav_compare_all: "⚖️ Comparer ma sélection",
    fav_download: "📄 Télécharger PDF",
    fav_share: "🔗 Partager",
    fav_loaded: "Sélection partagée chargée !",
    /* ---- mon espace ---- */
    mon_espace: "Mon espace",
    bonjour: (n) => n ? `Bonjour ${n} 👋` : "Mon espace",
    create_space_title: "Créez votre espace",
    create_space_desc: "Sauvegardez vos prénoms favoris, retrouvez-les plus tard et exportez-les en PDF.",
    create_space_btn: "Créer mon espace",
    auth_hint: "Déjà un espace ? Entrez simplement votre email.",
    space_created: "✓ Votre espace est prêt !",
    space_welcome_back: (n) => n ? `Bon retour ${n} 👋` : "Bon retour !",
    /* ---- page sélection ---- */
    sel_see_btn: "Voir ma sélection",
    sel_page_eyebrow: "Votre sélection",
    sel_page_title: "Votre sélection de prénoms",
    sel_page_sub: "Retrouvez tous les prénoms que vous avez enregistrés.",
    sel_page_empty: "Cliquez sur ❤️ pour ajouter des prénoms à votre sélection.",
    sel_page_count: (n) => `${n} prénom${n > 1 ? "s" : ""} enregistré${n > 1 ? "s" : ""}`,
    sel_premium_title: "Faites plus avec votre sélection",
    prem_pdf_title: "Télécharger en PDF",
    prem_pdf_desc: "Exportez votre liste de prénoms imprimable.",
    prem_email_title: "Recevoir par email",
    prem_email_desc: "Recevez votre sélection directement dans votre boîte mail.",
    prem_save_title: "Retrouver plus tard",
    prem_save_desc: "Accédez à vos favoris depuis n'importe quel appareil.",
    prem_sync_title: "Synchroniser",
    prem_sync_desc: "Gardez vos favoris à jour sur tous vos appareils.",
    save_space_title: "Sauvegardez votre sélection",
    save_space_desc: "Créez votre espace gratuit pour retrouver vos prénoms favoris à tout moment et recevoir votre sélection.",
    save_space_btn: "Créer mon espace",
    save_space_confirm: "✓ Votre sélection a été sauvegardée.",
    /* ---- modal unlock (gate "Voir ma sélection") ---- */
    unlock_title: "Votre sélection est prête !",
    unlock_desc: "Créez votre espace gratuit pour y accéder, recevoir votre liste par email et la retrouver à tout moment.",
    unlock_benefits: [
      "Retrouvez vos prénoms favoris depuis n'importe quel appareil",
      "Recevez votre sélection complète par email",
      "Partagez facilement avec votre partenaire",
      "Téléchargez votre liste en PDF quand vous voulez"
    ],
    unlock_submit: "Accéder à ma sélection →",
    unlock_trust: "🔒 Gratuit • Sans engagement • Données protégées",
    drawer_favs_title: "Mes favoris",
    drawer_no_favs: "Cliquez sur ❤️ pour ajouter des favoris.",
    drawer_surname_title: "Nom de famille",
    drawer_surname_ph: "Ajouter un nom de famille…",
    drawer_surname_save: "Enregistrer",
    drawer_surname_saved: "✓ Nom de famille enregistré.",
    drawer_history_title: "Historique",
    drawer_history_empty: "Lancez une génération pour voir l'historique.",
    drawer_history_from: "Depuis l'historique",
    drawer_compare_title: "Mes comparaisons",
    drawer_compare_empty: "Comparez des favoris pour les voir ici.",
    drawer_pdf_btn: "📄 Télécharger en PDF",
    drawer_email_btn: "📩 M'envoyer par email",
    drawer_compare_btn: "⚖️ Comparer mes favoris",
    drawer_logout: "Se déconnecter",
    email_sent_ok: "📩 Email simulé — activez le backend pour l'envoi réel.",
    logout_bye: "À bientôt !",
    /* ---- compatibilité ---- */
    compat_label: "Harmonie avec",
    compat_na: "Renseignez un nom de famille pour voir le score.",
    /* ---- panneau flottant ---- */
    sel_title: "Votre sélection",
    sel_favs_lbl: (n) => `favori${n > 1 ? "s" : ""}`,
    sel_best_score: "Meilleur score",
    sel_compare: "⚖️ Comparer",
    sel_download: "📄 PDF",
    sel_share: "🔗 Partager",
    /* ---- comparateur ---- */
    compare_title: "Comparateur de prénoms",
    compare_close: "Fermer",
    compare_th_name: "Prénom", compare_th_meaning: "Signification",
    compare_th_origin: "Origine", compare_th_style: "Style",
    compare_th_why: "Pourquoi ça fonctionne", compare_th_score: "Compatibilité",
    compare_empty: "Ajoutez des prénoms aux favoris pour les comparer.",
    /* ---- partage / toast ---- */
    share_copied: "✓ Lien copié dans le presse-papier !",
    share_no_fav: "Ajoutez d'abord des prénoms aux favoris.",
    /* ---- PDF ---- */
    pdf_header: "Ma sélection de prénoms",
    /* ---- comment / populaires / FAQ ---- */
    how_title: "Comment ça fonctionne", how_sub: "Trois étapes simples pour trouver le prénom de votre bébé.",
    how_1_t: "Définissez vos envies", how_1_d: "Genre, origine, style, signification… affinez selon ce qui compte pour vous.",
    how_2_t: "Générez des idées", how_2_d: "Recevez une sélection de prénoms avec leur sens, leur origine et pourquoi ils fonctionnent.",
    how_3_t: "Explorez les similaires", how_3_d: "Un coup de cœur ? Découvrez des prénoms proches pour affiner votre choix.",
    pop_title: "Exemples de prénoms populaires", pop_sub: "Cliquez sur un prénom pour voir des idées similaires dans le générateur.",
    faq_title: "Questions fréquentes",
    /* ---- footer ---- */
    foot_tag: "Le générateur de prénoms bébé pensé pour les futurs parents.",
    foot_explore: "Explorer", foot_nav: "Navigation",
    foot_demo: "Mode démo — génération locale, sans API.",
    /* ---- décider ensemble (boucle virale) ---- */
    decide_eyebrow: "Décidez ensemble",
    decide_title: "Invitez votre partenaire",
    decide_invite_sub: "Partagez ce lien avec votre conjoint pour qu'il vote sur vos prénoms favoris.",
    decide_copy_link: "Copier le lien",
    decide_family_mode: "📢 Activer le mode famille (inviter aussi les parents)",
    decide_continue: "Continuer",
    decide_waiting_sub: "Votre partenaire vote sur votre sélection...",
    decide_refresh: "🔄 Actualiser",
    decide_results_sub: "Voici les prénoms où vous êtes d'accord !",
    decide_share_matchs: "🔗 Partager ces matchs",
    decide_vote_sub: "Votre partenaire vous a invité·e à voter sur ces prénoms.",
    decide_see_matchs: "Voir les prénoms en commun",
    decide_simulate: "Simuler le vote du partenaire (démo)",
    decide_invite_invalid: "Cette invitation est introuvable ou a expiré.",
    decide_thanks: "Merci, votre vote est enregistré !",
    decide_no_votes_yet: "Aucun vote pour l'instant. Partagez le lien à votre partenaire.",
    vote_yes: "💚 J'aime",
    vote_maybe: "🤷 Peut-être",
    vote_no: "❌ Non",
    decide_voted: (n) => `${n} prénom${n > 1 ? "s" : ""} voté${n > 1 ? "s" : ""}`,
    notif_partner_voted: (n) => `Votre partenaire a voté sur ${n} prénom${n > 1 ? "s" : ""} !`,
    notif_match_found: (n) => `🎉 ${n} nouveau${n > 1 ? "x" : ""} match${n > 1 ? "s" : ""} !`,
    notif_weeks_left: (n) => `⏳ Plus que ${n} semaine${n > 1 ? "s" : ""} avant la date prévue`,
    /* ---- listes ---- */
    origins: { hebreu: "Hébreu", francais: "Français", anglais: "Anglais", arabe: "Arabe", italien: "Italien", espagnol: "Espagnol", grec: "Grec", latin: "Latin" },
    styles: { classique: "Classique", moderne: "Moderne", rare: "Rare", elegant: "Élégant", court: "Court", poetique: "Poétique" }
  },

  en: {
    nav_home: "Home", nav_generator: "Generator",
    nav_how: "How it works", nav_faq: "FAQ",
    nav_favs: "Favourites",
    hero_eyebrow: "Baby name generator",
    hero_title: "Find the perfect name for your baby",
    hero_subtitle: "Discover thousands of name ideas based on their origin, meaning and style.",
    hero_cta: "Open the generator", hero_cta2: "How it works",
    why_title: "Why use NameSpark Baby",
    why_sub: "A tool made for parents-to-be: simple, elegant and precise.",
    why_1_t: "Tailored results",
    why_1_d: "Filter by gender, origin, style, meaning, first letter and length for ideas that truly fit.",
    why_2_t: "The meaning behind each name",
    why_2_d: "Meaning, origin and explanation: understand why each name suits you.",
    why_3_t: "Ideas that flow",
    why_3_d: "Love a name? Discover similar names in style and origin with one click.",
    gen_title: "The name generator", gen_sub: "Tell us your preferences, we'll handle the rest.",
    f_gender: "Gender", g_boy: "Boy", g_girl: "Girl", g_mixte: "Unisex",
    f_origin: "Origin", o_all: "All", o_hebreu: "Hebrew", o_francais: "French",
    o_anglais: "English", o_arabe: "Arabic", o_italien: "Italian", o_espagnol: "Spanish",
    o_grec: "Greek", o_latin: "Latin",
    f_style: "Style", any: "Any",
    s_classique: "Classic", s_moderne: "Modern", s_rare: "Rare",
    s_elegant: "Elegant", s_court: "Short", s_poetique: "Poetic",
    f_meaning: "Desired meaning",
    m_force: "Strength", m_courage: "Courage", m_sagesse: "Wisdom",
    m_lumiere: "Light", m_nature: "Nature", m_liberte: "Freedom", m_foi: "Faith", m_amour: "Love",
    f_letter: "First letter (optional)", f_length: "Length",
    l_court: "Short", l_moyen: "Medium", l_long: "Long",
    f_surname: "Last name (optional)", f_submit: "Generate names",
    res_title: "Your names",
    res_empty: 'Pick your criteria then click "Generate" to discover name ideas.',
    res_none: "No name matches exactly. Try widening your criteria.",
    res_count: (n) => `${n} name${n > 1 ? "s" : ""} suggested`,
    card_meaning: "Meaning", card_origin: "Origin",
    card_style: "Style", card_why: "Why this name works",
    similar_btn: "See similar names",
    similar_title: (n) => `Names similar to ${n}`,
    fav_add_tip: "Add to favourites",
    fav_remove_tip: "Remove from favourites",
    fav_title: "My list",
    fav_sub: "Your saved picks. Save, compare or share your selection.",
    /* ---- save modal ---- */
    save_btn: "📩 Save my list",
    save_modal_title: "Save my list",
    save_modal_desc: "Receive your selection by email and find it again later.",
    save_field_fname: "Your first name (optional)",
    save_field_email: "Your email address",
    save_submit: "Receive my list",
    save_success_title: "Your selection has been saved.",
    save_success_sub: "You will soon receive an email with your list.",
    save_success_close: "Close",
    save_error_email: "Please enter a valid email address.",
    fav_empty: "Click ❤️ on a name to save it.",
    fav_remove: "Remove",
    fav_compare_all: "⚖️ Compare my selection",
    fav_download: "📄 Download PDF",
    fav_share: "🔗 Share",
    fav_loaded: "Shared selection loaded!",
    /* ---- mon espace ---- */
    mon_espace: "My space",
    bonjour: (n) => n ? `Hello ${n} 👋` : "My space",
    create_space_title: "Create your space",
    create_space_desc: "Save your favourite names, find them later and export them as PDF.",
    create_space_btn: "Create my space",
    auth_hint: "Already have a space? Just enter your email.",
    space_created: "✓ Your space is ready!",
    space_welcome_back: (n) => n ? `Welcome back ${n} 👋` : "Welcome back!",
    /* ---- selection page ---- */
    sel_see_btn: "View my selection",
    sel_page_eyebrow: "Your selection",
    sel_page_title: "Your name selection",
    sel_page_sub: "Find all the names you have saved.",
    sel_page_empty: "Click ❤️ to add names to your selection.",
    sel_page_count: (n) => `${n} name${n > 1 ? "s" : ""} saved`,
    sel_premium_title: "Do more with your selection",
    prem_pdf_title: "Download as PDF",
    prem_pdf_desc: "Export your printable name list.",
    prem_email_title: "Receive by email",
    prem_email_desc: "Get your selection delivered to your inbox.",
    prem_save_title: "Find it later",
    prem_save_desc: "Access your favourites from any device.",
    prem_sync_title: "Synchronise",
    prem_sync_desc: "Keep your favourites up to date everywhere.",
    save_space_title: "Save your selection",
    save_space_desc: "Create your free space to access your favourite names at any time and receive your selection.",
    save_space_btn: "Create my space",
    save_space_confirm: "✓ Your selection has been saved.",
    /* ---- unlock modal ---- */
    unlock_title: "Your selection is ready!",
    unlock_desc: "Create your free space to access it, receive your list by email and find it again at any time.",
    unlock_benefits: [
      "Access your favourite names from any device",
      "Receive your full selection by email",
      "Share easily with your partner",
      "Download your list as PDF whenever you like"
    ],
    unlock_submit: "Access my selection →",
    unlock_trust: "🔒 Free • No commitment • Data protected",
    drawer_favs_title: "My favourites",
    drawer_no_favs: "Click ❤️ to add favourites.",
    drawer_surname_title: "Last name",
    drawer_surname_ph: "Add a last name…",
    drawer_surname_save: "Save",
    drawer_surname_saved: "✓ Last name saved.",
    drawer_history_title: "History",
    drawer_history_empty: "Run a generation to see history.",
    drawer_history_from: "From history",
    drawer_compare_title: "My comparisons",
    drawer_compare_empty: "Compare favourites to see them here.",
    drawer_pdf_btn: "📄 Download as PDF",
    drawer_email_btn: "📩 Send by email",
    drawer_compare_btn: "⚖️ Compare favourites",
    drawer_logout: "Sign out",
    email_sent_ok: "📩 Simulated email — activate backend for real sending.",
    logout_bye: "See you soon!",
    compat_label: "Harmony with",
    compat_na: "Enter a last name to see the score.",
    sel_title: "Your selection",
    sel_favs_lbl: (n) => `favourite${n > 1 ? "s" : ""}`,
    sel_best_score: "Best score",
    sel_compare: "⚖️ Compare",
    sel_download: "📄 PDF",
    sel_share: "🔗 Share",
    compare_title: "Name comparator",
    compare_close: "Close",
    compare_th_name: "Name", compare_th_meaning: "Meaning",
    compare_th_origin: "Origin", compare_th_style: "Style",
    compare_th_why: "Why it works", compare_th_score: "Compatibility",
    compare_empty: "Add names to favourites to compare them.",
    share_copied: "✓ Link copied to clipboard!",
    share_no_fav: "Add names to favourites first.",
    pdf_header: "My name selection",
    how_title: "How it works", how_sub: "Three simple steps to find your baby's name.",
    how_1_t: "Set your preferences", how_1_d: "Gender, origin, style, meaning… refine what matters to you.",
    how_2_t: "Generate ideas", how_2_d: "Get a selection of names with their meaning, origin and why they work.",
    how_3_t: "Explore similar ones", how_3_d: "A favourite? Discover close names to refine your choice.",
    pop_title: "Popular name examples", pop_sub: "Click a name to see similar ideas in the generator.",
    faq_title: "Frequently asked questions",
    foot_tag: "The baby name generator made for parents-to-be.",
    foot_explore: "Explore", foot_nav: "Navigation",
    foot_demo: "Demo mode — local generation, no API.",
    /* ---- decide together (viral loop) ---- */
    decide_eyebrow: "Decide together",
    decide_title: "Invite your partner",
    decide_invite_sub: "Share this link with your spouse so they can vote on your favourite names.",
    decide_copy_link: "Copy link",
    decide_family_mode: "📢 Enable family mode (invite parents too)",
    decide_continue: "Continue",
    decide_waiting_sub: "Your partner is voting on your selection...",
    decide_refresh: "🔄 Refresh",
    decide_results_sub: "Here are the names you both agreed on!",
    decide_share_matchs: "🔗 Share these matches",
    decide_vote_sub: "Your partner invited you to vote on these names.",
    decide_see_matchs: "See the names you agree on",
    decide_simulate: "Simulate partner's vote (demo)",
    decide_invite_invalid: "This invitation could not be found or has expired.",
    decide_thanks: "Thanks, your vote has been saved!",
    decide_no_votes_yet: "No votes yet. Share the link with your partner.",
    vote_yes: "💚 Like",
    vote_maybe: "🤷 Maybe",
    vote_no: "❌ No",
    decide_voted: (n) => `${n} name${n > 1 ? "s" : ""} voted`,
    notif_partner_voted: (n) => `Your partner voted on ${n} name${n > 1 ? "s" : ""}!`,
    notif_match_found: (n) => `🎉 ${n} new match${n > 1 ? "es" : ""}!`,
    notif_weeks_left: (n) => `⏳ ${n} week${n > 1 ? "s" : ""} left until your due date`,
    origins: { hebreu: "Hebrew", francais: "French", anglais: "English", arabe: "Arabic", italien: "Italian", espagnol: "Spanish", grec: "Greek", latin: "Latin" },
    styles: { classique: "Classic", moderne: "Modern", rare: "Rare", elegant: "Elegant", court: "Short", poetique: "Poetic" }
  }
};

/* =============================================================
   FAQ
   ============================================================= */
const FAQ_DATA = {
  fr: [
    { q: "NameSpark Baby est-il gratuit ?", a: "Oui. Le générateur est entièrement gratuit et pensé pour accompagner les futurs parents dans leur recherche du prénom idéal." },
    { q: "D'où viennent les prénoms proposés ?", a: "En mode démo, les prénoms proviennent d'une liste locale soigneusement constituée. Prochainement, ils seront générés par une IA via une fonction backend sécurisée pour des résultats encore plus riches." },
    { q: "Comment fonctionne le bouton « prénoms similaires » ?", a: "Il analyse l'origine, le style et l'ambiance du prénom choisi, puis vous propose des prénoms proches pour affiner votre sélection." },
    { q: "Comment fonctionnent les favoris ?", a: "Cliquez sur ❤️ pour sauvegarder un prénom. Vos favoris sont enregistrés dans votre navigateur (localStorage) : ils restent disponibles même si vous fermez et rouvrez la page." },
    { q: "Comment fonctionne le score de compatibilité ?", a: "Si vous renseignez un nom de famille, chaque prénom reçoit un score de 1 à 10 estimant la fluidité de la combinaison (longueur totale, équilibre syllabique, enchaînement sonore). C'est une estimation locale, purement indicative." },
    { q: "Comment partager ma sélection ?", a: "Cliquez sur « Partager » dans la section Favoris ou dans le panneau de sélection. Un lien est copié dans votre presse-papier. Envoyez-le à votre partenaire — en l'ouvrant, il verra exactement votre sélection." },
    { q: "Mes données sont-elles enregistrées ?", a: "Non. Vos favoris restent dans votre navigateur. Aucune donnée personnelle n'est collectée ni envoyée à un serveur." }
  ],
  en: [
    { q: "Is NameSpark Baby free?", a: "Yes. The generator is completely free and designed to help parents-to-be find their ideal name." },
    { q: "Where do the names come from?", a: "In demo mode, names come from a carefully curated local list. Soon, they will be generated by an AI through a secure backend function for even richer results." },
    { q: "How does the 'similar names' button work?", a: "It analyses the origin, style and mood of the chosen name, then suggests close names to refine your selection." },
    { q: "How do favourites work?", a: "Click ❤️ to save a name. Your favourites are stored in your browser (localStorage) and remain available even after you close and reopen the page." },
    { q: "How does the compatibility score work?", a: "If you enter a last name, each first name receives a score from 1 to 10 estimating the flow of the combination (total length, syllable balance, sound transition). It's a local, purely indicative estimate." },
    { q: "How do I share my selection?", a: "Click 'Share' in the favourites section or the selection panel. A link is copied to your clipboard. Send it to your partner — opening it will show your exact selection." },
    { q: "Is my data stored?", a: "No. Your favourites stay in your browser. No personal data is collected or sent to a server." }
  ]
};

const POPULAR = ["Gabriel", "Emma", "Raphaël", "Léa", "Noah", "Chloé", "Lucas", "Inès", "Adam", "Sofia"];

/* =============================================================
   2) ÉTAT
   ============================================================= */
let lang = "fr";
const filters = { gender: "", length: "" };
let lastResults = null;
let lastTitle = null;
let lastSurname = "";

/* Source de vérité : storage.js. `favorites` est un CACHE en mémoire,
   hydraté depuis getSelection() et toujours réécrit via saveSelection(). */
const favorites = new Set();
let currentUser   = null; /* { email, firstName, createdAt, surname } */
let pendingAction = null; /* action en attente avant authentification */

function saveFavorites() {
  saveSelection([...favorites]);
  /* Met à jour le compte admin si l'utilisateur est connecté */
  if (currentUser && typeof updateAdminFavoriteCount === "function") {
    updateAdminFavoriteCount(currentUser.email, favorites.size);
  }
}
function loadFavorites() {
  favorites.clear();
  getSelection().forEach((n) => favorites.add(n));
}

/* =============================================================
   3) i18n
   ============================================================= */
function t(key) {
  const v = I18N[lang][key];
  return v !== undefined ? v : I18N.fr[key] ?? key;
}

function applyLang(next) {
  lang = next;
  document.documentElement.lang = lang;
  /* Persiste la langue (réutilisée sur les pages SEO et au prochain chargement) */
  saveLang(lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const val = I18N[lang][el.getAttribute("data-i18n")];
    if (typeof val === "string") el.textContent = val;
  });

  document.querySelectorAll("#langSwitch button").forEach((b) =>
    b.classList.toggle("active", b.dataset.lang === lang)
  );

  renderFaq();
  if (lastResults) renderResults(lastResults, lastTitle);
  renderFavorites();
  updateSelPanel();
  updateEspaceButton();
  /* Re-rend le drawer si ouvert (changement de langue) */
  if (document.getElementById("espaceDrawer")?.classList.contains("open")) {
    renderEspaceDrawer();
  }
}

/* =============================================================
   4) NAVIGATION
   ============================================================= */
function initNav() {
  const burger = document.getElementById("burger");
  const links = document.getElementById("navLinks");

  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll("[data-nav]").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

/* =============================================================
   5) ANIMATIONS
   ============================================================= */
function animateTitle() {
  const h1 = document.querySelector("[data-animate-title]");
  if (!h1) return;
  const text = h1.textContent;
  h1.textContent = "";
  [...text].forEach((char, i) => {
    const span = document.createElement("span");
    span.className = "ch" + (char === " " ? " space" : "");
    span.textContent = char === " " ? " " : char;
    span.style.animationDelay = `${i * 0.028}s`;
    h1.appendChild(span);
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${entry.target.dataset.delay || 0}ms`;
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".grid").forEach((grid) => {
    grid.querySelectorAll(".reveal").forEach((el, i) => (el.dataset.delay = i * 90));
  });
  items.forEach((el) => obs.observe(el));
}

/* =============================================================
   6) SEGMENTS (genre / longueur)
   ============================================================= */
function initSegments() {
  document.querySelectorAll("[data-segmented]").forEach((group) => {
    const key = group.dataset.segmented;
    group.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const isActive = btn.classList.contains("active");
        group.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
        if (key === "gender" && isActive) {
          filters.gender = "";
        } else {
          btn.classList.add("active");
          filters[key] = btn.dataset.value;
        }
      });
    });
  });
}

/* =============================================================
   7) LECTURE DES FILTRES
   ============================================================= */
function readFilters() {
  return {
    gender: filters.gender,
    origin: document.getElementById("origin").value,
    style: document.getElementById("style").value,
    meaning: document.getElementById("meaning").value,
    letter: document.getElementById("letter").value.trim().toLowerCase(),
    length: filters.length,
    surname: document.getElementById("surname").value.trim()
  };
}

/* =============================================================
   8) GÉNÉRATION — MODE DÉMO (LOCAL, SANS API)
   -------------------------------------------------------------
   👉 À REMPLACER PLUS TARD :
   Remplacer generateDemo(...) par generateViaBackend(...)
   quand le backend Vercel sera actif (cf. api/generate.js).
   ============================================================= */
function generateDemo(f, limit = 8) {
  const scored = NAMES.map((n) => {
    let score = 0;
    let hardFail = false;

    if (f.gender) {
      if (f.gender === "mixte") {
        if (n.gender === "mixte") score += 4; else hardFail = true;
      } else if (n.gender === f.gender) {
        score += 4;
      } else if (n.gender === "mixte") {
        score += 1;
      } else {
        hardFail = true;
      }
    }

    if (f.origin) { if (n.origin === f.origin) score += 4; else hardFail = true; }
    if (f.letter) { if (n.name[0].toLowerCase() === f.letter) score += 3; else hardFail = true; }
    if (f.style && n.style.includes(f.style)) score += 2;
    if (f.meaning && n.meaningTags.includes(f.meaning)) score += 2;
    if (f.length && n.length === f.length) score += 1;

    return { n, score, hardFail };
  });

  let pool = scored.filter((s) => !s.hardFail).sort((a, b) => b.score - a.score);
  pool = shuffleByScore(pool);
  return pool.slice(0, limit).map((s) => s.n);
}

function shuffleByScore(arr) {
  const groups = {};
  arr.forEach((item) => { (groups[item.score] = groups[item.score] || []).push(item); });
  const result = [];
  Object.keys(groups).map(Number).sort((a, b) => b - a).forEach((score) => {
    const g = groups[score];
    for (let i = g.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [g[i], g[j]] = [g[j], g[i]];
    }
    result.push(...g);
  });
  return result;
}

function getSimilarDemo(name, limit = 6) {
  const ref = NAMES.find((n) => n.name === name);
  if (!ref) return [];
  return NAMES
    .filter((n) => n.name !== ref.name)
    .map((n) => {
      let score = 0;
      if (n.origin === ref.origin) score += 3;
      score += n.style.filter((s) => ref.style.includes(s)).length * 2;
      if (n.gender === ref.gender) score += 1;
      score += n.meaningTags.filter((m) => ref.meaningTags.includes(m)).length;
      if (n.length === ref.length) score += 1;
      return { n, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.n);
}

/* Stub backend (non utilisé en mode démo) */
// eslint-disable-next-line no-unused-vars
async function generateViaBackend(f, limit = 8) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filters: f, limit, lang })
  });
  if (!res.ok) throw new Error("Backend generation failed");
  const data = await res.json();
  return data.names;
}

/* =============================================================
   9) SCORE DE COMPATIBILITÉ
   =============================================================
   Estime la fluidité sonore du duo prénom + nom de famille.
   Critères : longueur totale, premières lettres, syllabes,
   enchaînement, terminaisons. Score local 5–10.
   ============================================================= */
function compatibilityScore(firstName, surname) {
  if (!surname || !firstName) return null;

  const norm = (s) =>
    s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const countSyl = (s) =>
    Math.max(1, (norm(s).match(/[aeiouy]+/g) || []).length);

  const fn = norm(firstName);
  const sn = norm(surname);
  const fnSyl = countSyl(firstName);
  const snSyl = countSyl(surname);

  let score = 4;

  // Longueur totale idéale : 8–18 caractères
  const total = firstName.length + surname.length;
  if (total >= 8 && total <= 18) score += 1;

  // Premières lettres différentes = meilleur son
  if (fn[0] !== sn[0]) score += 1;

  // Syllabes totales idéales : 4–6
  const totalSyl = fnSyl + snSyl;
  if (totalSyl >= 4 && totalSyl <= 6) score += 1;

  // Équilibre syllabique
  if (Math.abs(fnSyl - snSyl) <= 1) score += 0.5;

  // Bonne accroche : dernière lettre du prénom ≠ première lettre du nom
  if (fn[fn.length - 1] !== sn[0]) score += 1;

  // Terminaisons différentes
  if (fn[fn.length - 1] !== sn[sn.length - 1]) score += 0.5;

  return Math.round(Math.min(10, Math.max(5, score)));
}

/* =============================================================
   10) RENDU DES CARTES
   ============================================================= */
function nameCardHTML(n, index, surname, opts = {}) {
  const { inFavorites = false } = opts;
  const isFaved = favorites.has(n.name);

  const meaning = n.meaning[lang] || n.meaning.fr;
  const why = n.why[lang] || n.why.fr;
  const originLabel = t("origins")[n.origin] || n.origin;
  const styleLabels = n.style.map((s) => t("styles")[s] || s).join(" · ");
  const genderLabel =
    n.gender === "boy" ? t("g_boy") :
    n.gender === "girl" ? t("g_girl") : t("g_mixte");

  const score = surname ? compatibilityScore(n.name, surname) : null;

  // Pas d'animation dans la section favoris (re-render fréquent)
  const animStyle = inFavorites
    ? "opacity:1;transform:none;animation:none;"
    : `animation-delay:${index * 70}ms`;

  const heartIcon = isFaved ? "❤️" : "🤍";
  const heartTip = isFaved ? t("fav_remove_tip") : t("fav_add_tip");

  const scoreHTML = score !== null ? `
    <div class="compat-wrap">
      <span class="compat-label">${t("compat_label")} ${surname}</span>
      <div class="compat-bar-outer">
        <div class="compat-bar-inner" style="width:${score * 10}%"></div>
      </div>
      <span class="compat-num">${score}<small>/10</small></span>
    </div>` : "";

  const removeBtn = inFavorites
    ? `<button class="btn-remove-fav" data-remove="${n.name}">${t("fav_remove")}</button>`
    : "";

  return `
    <article class="name-card" style="${animStyle}">
      <div class="top">
        <h4>${n.name}</h4>
        <div class="top-actions">
          <span class="badge ${n.gender}">${genderLabel}</span>
          <button class="btn-heart${isFaved ? " faved" : ""}" data-heart="${n.name}" title="${heartTip}" aria-label="${heartTip}">${heartIcon}</button>
        </div>
      </div>
      ${surname ? `<div class="fullname">${n.name} ${surname}</div>` : ""}
      ${scoreHTML}
      <div class="meta-row">
        <span class="meta-tag">${originLabel}</span>
        <span class="meta-tag">${styleLabels}</span>
      </div>
      <dl>
        <dt>${t("card_meaning")}</dt><dd>${meaning}</dd>
        <dt>${t("card_why")}</dt><dd class="why">${why}</dd>
      </dl>
      <div class="card-foot">
        <button class="btn-link" data-similar="${n.name}">${t("similar_btn")}</button>
        ${removeBtn}
      </div>
    </article>`;
}

/* =============================================================
   11) WIRE — branchement des boutons sur un conteneur
   ============================================================= */
function wireCards(container, scrollTarget = "generateur") {
  // Cœurs
  container.querySelectorAll("[data-heart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.heart;
      const nowFaved = !favorites.has(name);
      if (nowFaved) favorites.add(name); else favorites.delete(name);
      saveFavorites();

      // Mise à jour immédiate de tous les boutons cœur pour ce prénom
      document.querySelectorAll(`[data-heart="${name}"]`).forEach((b) => {
        b.classList.toggle("faved", nowFaved);
        b.innerHTML = nowFaved ? "❤️" : "🤍";
        b.title = nowFaved ? t("fav_remove_tip") : t("fav_add_tip");
        if (nowFaved) {
          b.classList.add("pop");
          setTimeout(() => b.classList.remove("pop"), 420);
        }
      });

      renderFavorites();
      updateSelPanel();
    });
  });

  // Similaires
  container.querySelectorAll("[data-similar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.similar;
      const similar = getSimilarDemo(name);
      renderResults(similar, t("similar_title")(name));
      document.getElementById(scrollTarget).scrollIntoView({ behavior: "smooth" });
    });
  });

  // Retirer des favoris
  container.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.remove;
      favorites.delete(name);
      saveFavorites();

      // Mise à jour des cœurs dans les résultats si ouverts
      document.querySelectorAll(`[data-heart="${name}"]`).forEach((b) => {
        b.classList.remove("faved");
        b.innerHTML = "🤍";
        b.title = t("fav_add_tip");
      });

      renderFavorites();
      updateSelPanel();
    });
  });
}

/* =============================================================
   12) RENDU DES RÉSULTATS (générateur)
   ============================================================= */
function renderResults(list, title) {
  lastResults = list;
  lastTitle = title;
  const wrap = document.getElementById("results");
  const head = document.querySelector(".results-head h3");
  const count = document.getElementById("resultCount");

  head.textContent = title || t("res_title");

  if (!list.length) {
    wrap.innerHTML = `<div class="empty"><div class="big">🔍</div><p>${t("res_none")}</p></div>`;
    count.textContent = "";
    return;
  }

  count.textContent = t("res_count")(list.length);
  wrap.innerHTML = list.map((n, i) => nameCardHTML(n, i, lastSurname)).join("");
  wireCards(wrap);
}

/* =============================================================
   13) FORMULAIRE
   ============================================================= */
function initForm() {
  const form = document.getElementById("genForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = readFilters();
    lastSurname = f.surname;
    const results = generateDemo(f, 8); // ← mode démo (remplacer par generateViaBackend)
    renderResults(results, t("res_title"));
    addToHistory(f, results);            // ← sauvegarde dans l'historique
    if (favorites.size > 0) renderFavorites();
    updateSelPanel();
  });

  // Mise à jour des scores en temps réel quand le nom de famille change
  document.getElementById("surname").addEventListener("input", () => {
    const sn = document.getElementById("surname").value.trim();
    lastSurname = sn;
    if (lastResults) renderResults(lastResults, lastTitle);
    if (favorites.size > 0) renderFavorites();
    updateSelPanel();
  });
}

/* =============================================================
   14) PRÉNOMS POPULAIRES (chips)
   ============================================================= */
function initPopular() {
  const wrap = document.getElementById("popularChips");
  wrap.innerHTML = POPULAR.map(
    (name) => `<button class="chip" data-pop="${name}">${name}</button>`
  ).join("");
  wrap.querySelectorAll("[data-pop]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const name = chip.dataset.pop;
      renderResults(getSimilarDemo(name), t("similar_title")(name));
      document.getElementById("generateur").scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* =============================================================
   15) FAQ
   ============================================================= */
function renderFaq() {
  const list = document.getElementById("faqList");
  list.innerHTML = FAQ_DATA[lang]
    .map((item) => `
      <div class="faq-item">
        <button class="faq-q">${item.q}</button>
        <div class="faq-a"><p style="padding-right:30px">${item.a}</p></div>
      </div>`)
    .join("");
  list.querySelectorAll(".faq-item").forEach((item) => {
    item.querySelector(".faq-q").addEventListener("click", () => item.classList.toggle("open"));
  });
}

/* =============================================================
   16) ★ FAVORIS — MISE À JOUR (sans section dédiée)
   La section "Mes favoris" a été retirée de la page.
   Les favoris sont désormais gérés exclusivement via Mon espace.
   Cette fonction : 1) peuple le container PDF invisible
                   2) met à jour le panneau flottant
                   3) rafraîchit le drawer si ouvert
   ============================================================= */
function renderFavorites() {
  /* Peuple le container d'impression (export PDF) */
  const printEl = document.getElementById("printResults");
  if (printEl) {
    const list = [...favorites]
      .map((n) => NAMES.find((x) => x.name === n))
      .filter(Boolean);
    printEl.innerHTML = list.length
      ? list.map((n, i) => nameCardHTML(n, i, lastSurname, { inFavorites: false })).join("")
      : "";
  }

  updateSelPanel();

  /* Rafraîchit le drawer Mon espace si ouvert */
  if (document.getElementById("espaceDrawer")?.classList.contains("open")) {
    renderEspaceDrawer();
  }
}

/* =============================================================
   17) ★ PANNEAU FLOTTANT « Votre sélection »
   ============================================================= */
function updateSelPanel() {
  const panel = document.getElementById("selPanel");
  const count = favorites.size;

  document.getElementById("selCount").textContent = count;
  const lblFn = t("sel_favs_lbl");
  document.getElementById("selCountLbl").textContent =
    typeof lblFn === "function" ? lblFn(count) : lblFn;

  /* Bouton "Ma liste" — ouvre Mon espace, visible dès qu'il y a des favoris */
  const listeWrap  = document.getElementById("navListeWrap");
  const listeBadge = document.getElementById("navListeBadge");
  if (listeWrap)  listeWrap.style.display  = count > 0 ? "" : "none";
  if (listeBadge) listeBadge.textContent   = count;

  /* Persiste le nom de famille */
  saveSurname(lastSurname);

  /* Texte du bouton "Voir ma sélection" */
  const seeBtn = document.getElementById("selSeeBtn");
  if (seeBtn) seeBtn.textContent = t("sel_see_btn");

  if (count === 0) {
    panel.classList.remove("visible");
    return;
  }
  panel.classList.add("visible");
}

/* =============================================================
   18) ★ COMPARATEUR (modal)
   ============================================================= */
function openCompare() {
  if (favorites.size === 0) { showToast(t("compare_empty")); return; }

  addToComparisons([...favorites]); // ← sauvegarde dans l'historique des comparaisons

  const list = [...favorites]
    .map((name) => NAMES.find((n) => n.name === name))
    .filter(Boolean);

  const hasSurname = !!lastSurname;
  const thead = document.getElementById("compareThead");
  const tbody = document.getElementById("compareTbody");

  // Tête du tableau
  thead.innerHTML = `<tr>
    <th>${t("compare_th_name")}</th>
    <th>${t("compare_th_meaning")}</th>
    <th>${t("compare_th_origin")}</th>
    <th>${t("compare_th_style")}</th>
    <th>${t("compare_th_why")}</th>
    ${hasSurname ? `<th>${t("compare_th_score")}</th>` : ""}
  </tr>`;

  // Corps — trié par score décroissant si nom de famille
  const rows = list.map((n) => {
    const score = hasSurname ? compatibilityScore(n.name, lastSurname) : null;
    return { n, score };
  });
  if (hasSurname) rows.sort((a, b) => (b.score || 0) - (a.score || 0));

  tbody.innerHTML = rows.map(({ n, score }) => {
    const meaning = n.meaning[lang] || n.meaning.fr;
    const why = n.why[lang] || n.why.fr;
    const originLabel = t("origins")[n.origin] || n.origin;
    const styleLabels = n.style.map((s) => t("styles")[s] || s).join(", ");

    return `<tr>
      <td>
        <div class="cmp-name">${n.name}</div>
        ${lastSurname ? `<div class="cmp-fullname">${n.name} ${lastSurname}</div>` : ""}
      </td>
      <td>${meaning}</td>
      <td>${originLabel}</td>
      <td>${styleLabels}</td>
      <td><em class="cmp-why">${why}</em></td>
      ${score !== null ? `
      <td class="cmp-score-cell">
        <strong class="cmp-score-num">${score}/10</strong>
        <div class="compat-bar-outer" style="margin-top:5px;min-width:60px">
          <div class="compat-bar-inner" style="width:${score * 10}%"></div>
        </div>
      </td>` : ""}
    </tr>`;
  }).join("");

  document.getElementById("compareModal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCompareModal() {
  document.getElementById("compareModal").classList.remove("open");
  document.body.style.overflow = "";
}

function initCompare() {
  document.getElementById("closeCompare").addEventListener("click", closeCompareModal);
  document.getElementById("compareModal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeCompareModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCompareModal();
  });
}

/* =============================================================
   19) ★ EXPORT PDF (window.print)
   ============================================================= */
function exportPDF() {
  if (favorites.size === 0) { showToast(t("share_no_fav")); return; }

  /* S'assure que le container d'impression est peuplé */
  renderFavorites();

  /* Met à jour le sous-titre */
  const sub = document.getElementById("printSub");
  if (sub) sub.textContent = lastSurname
    ? `${t("pdf_header")} — ${lastSurname}`
    : t("pdf_header");

  const prevTitle = document.title;
  document.title = `NameSpark Baby — ${lastSurname ? lastSurname + " — " : ""}${t("pdf_header")}`;
  window.print();
  document.title = prevTitle;
}

/* =============================================================
   20) ★ PARTAGE (URL params)
   ============================================================= */
function shareSelection() {
  if (favorites.size === 0) { showToast(t("share_no_fav")); return; }

  const url = new URL(window.location.href);
  // Nettoyer les anciens params de partage
  url.searchParams.delete("share");
  url.searchParams.delete("surname");
  url.searchParams.delete("lang");

  url.searchParams.set("share", [...favorites].join(","));
  if (lastSurname) url.searchParams.set("surname", lastSurname);
  url.searchParams.set("lang", lang);

  // Retirer le fragment (#section) pour un lien propre
  url.hash = "";
  const shareUrl = url.toString();

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(shareUrl)
      .then(() => showToast(t("share_copied")))
      .catch(() => copyFallback(shareUrl));
  } else {
    copyFallback(shareUrl);
  }
}

function copyFallback(text) {
  const inp = document.createElement("input");
  inp.value = text;
  inp.style.position = "fixed";
  inp.style.opacity = "0";
  document.body.appendChild(inp);
  inp.select();
  try {
    document.execCommand("copy");
    showToast(t("share_copied"));
  } catch (_) {
    showToast("URL : " + text.slice(0, 60) + "…");
  }
  document.body.removeChild(inp);
}

/* =============================================================
   21) ★ TOAST
   ============================================================= */
let _toastTimer;
function showToast(msg, duration = 3200) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove("show"), duration);
}

/* =============================================================
   22) PRÉ-REMPLISSAGE QUERY STRING
   ============================================================= */
function applyQueryPrefill() {
  const p = new URLSearchParams(location.search);

  // Lien d'invitation partenaire : géré par le module "Décider ensemble" (voir init)
  if (p.get("invite")) return;

  // Chargement d'une sélection partagée
  if (p.get("share")) {
    const names = p.get("share").split(",");
    names.forEach((name) => {
      const trimmed = name.trim();
      if (trimmed && NAMES.some((n) => n.name === trimmed)) favorites.add(trimmed);
    });
    saveFavorites();

    if (p.get("surname")) {
      const sn = p.get("surname");
      document.getElementById("surname").value = sn;
      lastSurname = sn;
    }

    if (p.get("lang") && ["fr", "en"].includes(p.get("lang"))) {
      applyLang(p.get("lang"));
    }

    renderFavorites();
    /* Ouvre Mon espace pour montrer les favoris chargés */
    setTimeout(() => showToast(t("fav_loaded")), 400);
    setTimeout(() => openEspace(), 700);
    return; // Ne pas déclencher le générateur
  }

  // Pré-remplissage générateur (pages SEO)
  if (![...p.keys()].length) return;

  if (p.get("gender")) {
    const g = p.get("gender");
    filters.gender = g;
    const btn = document.querySelector(`[data-segmented="gender"] [data-value="${g}"]`);
    if (btn) {
      document.querySelectorAll('[data-segmented="gender"] button').forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    }
  }
  if (p.get("origin")) document.getElementById("origin").value = p.get("origin");
  if (p.get("style")) document.getElementById("style").value = p.get("style");
  if (p.get("meaning")) document.getElementById("meaning").value = p.get("meaning");
  if (p.get("length")) {
    const l = p.get("length");
    filters.length = l;
    const btn = document.querySelector(`[data-segmented="length"] [data-value="${l}"]`);
    if (btn) {
      document.querySelectorAll('[data-segmented="length"] button').forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    }
  }

  const results = generateDemo(readFilters(), 8);
  renderResults(results, t("res_title"));
  setTimeout(() => document.getElementById("generateur").scrollIntoView({ behavior: "smooth" }), 300);
}

/* =============================================================
   23) MODAL SAUVEGARDER MA LISTE
   =============================================================
   Sauvegarde localement en attendant le backend sécurisé.
   Pour brancher l'envoi email, remplacer le bloc localStorage
   dans saveListeToStorage() par :
     await fetch("/api/save-list", { method:"POST", body: JSON.stringify(entry) })
   La clé API (Resend, Brevo, etc.) restera UNIQUEMENT côté serveur.
   ============================================================= */
function openSaveListeModal() {
  if (favorites.size === 0) { showToast(t("share_no_fav")); return; }
  // Réinitialise le formulaire
  const form = document.getElementById("saveListeForm");
  const ok   = document.getElementById("saveListeSuccess");
  form.style.display = "";
  ok.style.display   = "none";
  /* Auto-fill si l'utilisateur est connecté via Mon espace */
  document.getElementById("saveListeFirstName").value = currentUser?.firstName || "";
  document.getElementById("saveListeEmail").value     = currentUser?.email     || "";
  document.getElementById("saveListeEmail").classList.remove("field-error");
  document.getElementById("saveListeEmailError").classList.remove("visible");
  // Ouvre la modale
  document.getElementById("saveListeModal").classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("saveListeEmail").focus(), 240);
}

function closeSaveListeModal() {
  document.getElementById("saveListeModal").classList.remove("open");
  document.body.style.overflow = "";
}

function handleSaveListeSubmit(e) {
  e.preventDefault();
  const email     = document.getElementById("saveListeEmail").value.trim();
  const firstName = document.getElementById("saveListeFirstName").value.trim();
  const emailOk   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!emailOk) {
    document.getElementById("saveListeEmail").classList.add("field-error");
    document.getElementById("saveListeEmailError").textContent = t("save_error_email");
    document.getElementById("saveListeEmailError").classList.add("visible");
    document.getElementById("saveListeEmail").focus();
    return;
  }

  const btn = document.getElementById("saveListeSubmit");
  btn.disabled    = true;
  btn.textContent = "…";

  /* Simuler latence (futur : appel API) */
  setTimeout(() => {
    saveListeToStorage(firstName, email);
    document.getElementById("saveListeForm").style.display    = "none";
    document.getElementById("saveListeSuccess").style.display = "";
    btn.disabled = false;
  }, 700);
}

function saveListeToStorage(firstName, email) {
  addSavedList({
    id:        Date.now(),
    createdAt: new Date().toISOString(),
    firstName: firstName || null,
    email,
    names:     [...favorites],
    surname:   lastSurname || null,
    lang
  });
}

function initSaveListeModal() {
  document.getElementById("closeSaveListeModal").addEventListener("click", closeSaveListeModal);
  document.getElementById("saveListeModal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeSaveListeModal();
  });
  document.getElementById("saveListeForm").addEventListener("submit", handleSaveListeSubmit);
  document.getElementById("saveListeSuccessClose").addEventListener("click", closeSaveListeModal);
  document.getElementById("saveListeEmail").addEventListener("input", () => {
    document.getElementById("saveListeEmail").classList.remove("field-error");
    document.getElementById("saveListeEmailError").classList.remove("visible");
  });
  // Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.getElementById("saveListeModal").classList.contains("open")) {
      closeSaveListeModal();
    }
  });
}

/* =============================================================
   24) MON ESPACE — Auth, Drawer, Historique, Comparaisons
   =============================================================
   Toutes les données sont en localStorage.
   Pour brancher un backend, remplacer les fonctions
   loadUser / saveUser / loadHistory / loadComparisons par
   des appels à des routes API sécurisées.
   ============================================================= */

/* ---- Gestion utilisateur (via storage.js) ---- */
function loadUser() {
  const u = getUser();
  if (u?.email) currentUser = u;
}
function saveUser() {
  setUser(currentUser);
}
function logoutUser() {
  currentUser = null;
  clearUser();
  updateEspaceButton();
  closeEspace();
  showToast(t("logout_bye"));
}

/* ---- Historique des générations (via storage.js) ---- */
function loadHistory() {
  return getHistory();
}
function addToHistory(filters, results) {
  if (!results.length) return;
  addHistory({
    id:      Date.now(),
    date:    new Date().toISOString(),
    filters: { gender: filters.gender, origin: filters.origin,
               style: filters.style, meaning: filters.meaning },
    results: results.map((n) => n.name),
    count:   results.length
  });
}

/* ---- Historique des comparaisons (via storage.js) ---- */
function loadComparisons() {
  return getComparisons();
}
function addToComparisons(names) {
  if (!names.length) return;
  addComparison({ id: Date.now(), date: new Date().toISOString(), names, surname: lastSurname || null });
}

/* ---- Helpers affichage ---- */
function formatDate(isoStr) {
  try {
    return new Date(isoStr).toLocaleDateString(
      lang === "fr" ? "fr-FR" : "en-GB",
      { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }
    );
  } catch (_) { return isoStr.slice(0, 10); }
}
function formatFilters(f) {
  const parts = [];
  if (f.gender)  parts.push(I18N[lang]["g_"  + f.gender]  || f.gender);
  if (f.origin)  parts.push(I18N[lang]["o_"  + f.origin]  || f.origin);
  if (f.style)   parts.push(I18N[lang]["s_"  + f.style]   || f.style);
  if (f.meaning) parts.push(I18N[lang]["m_"  + f.meaning] || f.meaning);
  return parts.length ? parts.join(" · ") : (lang === "fr" ? "Tous critères" : "All criteria");
}

/* ---- Mise à jour du bouton header ---- */
function updateEspaceButton() {
  const btn    = document.getElementById("espaceBtn");
  const avatar = document.getElementById("espaceAvatarMini");
  const label  = document.getElementById("espaceBtnLabel");
  if (!btn) return;

  if (currentUser) {
    const initial = (currentUser.firstName || currentUser.email)[0].toUpperCase();
    if (avatar) { avatar.textContent = initial; avatar.style.display = "inline-grid"; }
    const fn = t("bonjour");
    if (label) label.textContent = typeof fn === "function" ? fn(currentUser.firstName) : "Mon espace";
    btn.classList.add("logged-in");
  } else {
    if (avatar) avatar.style.display = "none";
    if (label) label.textContent = t("mon_espace");
    btn.classList.remove("logged-in");
  }
}

/* ---- Rendu du corps du drawer ---- */
function renderEspaceDrawer() {
  if (!currentUser) return;

  /* Profil */
  const initial = (currentUser.firstName || currentUser.email)[0].toUpperCase();
  document.getElementById("drawerAvatar").textContent = initial;
  const greetFn = t("bonjour");
  document.getElementById("drawerGreeting").textContent =
    typeof greetFn === "function" ? greetFn(currentUser.firstName) : "Mon espace";
  document.getElementById("drawerUserEmail").textContent = currentUser.email;

  const favList    = [...favorites].map((n) => NAMES.find((x) => x.name === n)).filter(Boolean);
  const history    = loadHistory();
  const comparisons = loadComparisons();
  let html = "";

  /* ── Section Mes favoris ── */
  html += `<div class="drawer-section">
    <div class="drawer-section-label">
      ${t("drawer_favs_title")}
      ${favList.length ? `<span class="drawer-badge">${favList.length}</span>` : ""}
    </div>`;
  if (!favList.length) {
    html += `<p class="drawer-empty">${t("drawer_no_favs")}</p>`;
  } else {
    html += `<div class="drawer-chips">
      ${favList.map((n) => `<span class="drawer-chip">${n.name}</span>`).join("")}
    </div>
    <div class="drawer-actions">
      <button class="d-btn d-primary" id="dPdfBtn">${t("drawer_pdf_btn")}</button>
      <button class="d-btn" id="dEmailBtn">${t("drawer_email_btn")}</button>
      <button class="d-btn" id="dCmpBtn">${t("drawer_compare_btn")}</button>
    </div>`;
  }
  html += `</div>`;

  /* ── Section Nom de famille ── */
  const snVal = lastSurname || currentUser.surname || "";
  html += `<div class="drawer-section">
    <div class="drawer-section-label">${t("drawer_surname_title")}</div>
    <div class="drawer-surname-row">
      <input type="text" id="drawerSurnameInput" value="${snVal}"
             placeholder="${t("drawer_surname_ph")}" />
      <button id="drawerSurnameBtn">${t("drawer_surname_save")}</button>
    </div>
  </div>`;

  /* ── Section Historique ── */
  html += `<div class="drawer-section">
    <div class="drawer-section-label">${t("drawer_history_title")}</div>`;
  if (!history.length) {
    html += `<p class="drawer-empty">${t("drawer_history_empty")}</p>`;
  } else {
    html += history.slice(0, 6).map((entry, i) => `
      <div class="drawer-hist-item" data-hist="${i}">
        <div class="drawer-hist-date">${formatDate(entry.date)}</div>
        <div class="drawer-hist-filters">${formatFilters(entry.filters)}</div>
        <div class="drawer-hist-names">${entry.results.slice(0, 4).join(", ")}${entry.results.length > 4 ? "…" : ""}</div>
      </div>`).join("");
  }
  html += `</div>`;

  /* ── Section Comparaisons ── */
  html += `<div class="drawer-section">
    <div class="drawer-section-label">${t("drawer_compare_title")}</div>`;
  if (!comparisons.length) {
    html += `<p class="drawer-empty">${t("drawer_compare_empty")}</p>`;
  } else {
    html += comparisons.slice(0, 4).map((entry) => `
      <div class="drawer-hist-item">
        <div class="drawer-hist-date">${formatDate(entry.date)}</div>
        <div class="drawer-hist-names">${entry.names.slice(0, 5).join(", ")}${entry.names.length > 5 ? "…" : ""}</div>
      </div>`).join("");
  }
  html += `</div>`;

  document.getElementById("drawerBody").innerHTML = html;

  /* Branchement événements */
  if (favList.length) {
    document.getElementById("dPdfBtn").addEventListener("click", () => { exportPDF(); closeEspace(); });
    document.getElementById("dEmailBtn").addEventListener("click", sendEmailFromEspace);
    document.getElementById("dCmpBtn").addEventListener("click", () => { closeEspace(); openCompare(); });
  }
  document.getElementById("drawerSurnameBtn").addEventListener("click", saveDrawerSurname);
  document.querySelectorAll("[data-hist]").forEach((el) => {
    el.addEventListener("click", () => loadHistoryEntry(history[+el.dataset.hist]));
  });
}

/* ---- Actions du drawer ---- */
function saveDrawerSurname() {
  const val = document.getElementById("drawerSurnameInput").value.trim();
  lastSurname = val;
  document.getElementById("surname").value = val;
  if (currentUser) { currentUser.surname = val; saveUser(); }
  saveSurname(val);
  if (favorites.size > 0) renderFavorites();
  updateSelPanel();
  showToast(t("drawer_surname_saved"));
}

function sendEmailFromEspace() {
  if (!currentUser) { openSaveListeModal(); return; }
  saveListeToStorage(currentUser.firstName, currentUser.email);
  showToast(t("email_sent_ok"));
}

function loadHistoryEntry(entry) {
  const names = entry.results.map((n) => NAMES.find((x) => x.name === n)).filter(Boolean);
  renderResults(names, t("drawer_history_from"));
  closeEspace();
  document.getElementById("generateur").scrollIntoView({ behavior: "smooth" });
}

/* ---- Ouverture / Fermeture drawer ---- */
function openEspace() {
  /* Non connecté : montre la sélection (email demandé UNIQUEMENT sur action premium) */
  if (!currentUser) { openSelection(); return; }
  renderEspaceDrawer();
  document.getElementById("espaceDrawer").classList.add("open");
  document.getElementById("espaceOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeEspace() {
  document.getElementById("espaceDrawer").classList.remove("open");
  document.getElementById("espaceOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

/* ---- Auth Modal ---- */
function openAuthModal() {
  document.getElementById("authEmail").value = "";
  document.getElementById("authFirstName").value = "";
  document.getElementById("authEmail").classList.remove("field-error");
  document.getElementById("authEmailError").classList.remove("visible");
  document.getElementById("authModal").classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("authEmail").focus(), 200);
}
function closeAuthModal() {
  document.getElementById("authModal").classList.remove("open");
  document.body.style.overflow = "";
}
function handleAuthSubmit(e) {
  e.preventDefault();
  const email     = document.getElementById("authEmail").value.trim();
  const firstName = document.getElementById("authFirstName").value.trim();
  const emailOk   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!emailOk) {
    document.getElementById("authEmail").classList.add("field-error");
    document.getElementById("authEmailError").textContent = t("save_error_email");
    document.getElementById("authEmailError").classList.add("visible");
    document.getElementById("authEmail").focus();
    return;
  }

  const btn = document.getElementById("authSubmit");
  btn.disabled = true; btn.textContent = "…";

  setTimeout(() => {
    /* Vérifie si un espace existait déjà pour cet email */
    const existing = findUserByEmail(email);

    if (existing) {
      currentUser = existing;
      const fn = t("space_welcome_back");
      showToast(typeof fn === "function" ? fn(existing.firstName) : fn);
    } else {
      currentUser = { email, firstName: firstName || null, createdAt: new Date().toISOString(), surname: lastSurname || null };
      showToast(t("space_created"));
    }

    saveUser();
    btn.disabled = false;
    closeAuthModal();
    updateEspaceButton();

    /* Exécute l'action premium qui a déclenché l'inscription */
    const action = pendingAction;
    pendingAction = null;
    if (action) {
      setTimeout(() => executePremiumAction(action), 300);
    } else {
      /* Accès direct à Mon espace : ouvre le drawer profil */
      openEspace();
    }
  }, 420);
}

function initMonEspace() {
  document.getElementById("espaceBtn").addEventListener("click", openEspace);
  document.getElementById("closeEspace").addEventListener("click", closeEspace);
  document.getElementById("espaceOverlay").addEventListener("click", closeEspace);
  document.getElementById("drawerLogout").addEventListener("click", logoutUser);
  document.getElementById("authForm").addEventListener("submit", handleAuthSubmit);
  document.getElementById("closeAuthModal").addEventListener("click", closeAuthModal);
  document.getElementById("authModal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeAuthModal();
  });
  document.getElementById("authEmail").addEventListener("input", () => {
    document.getElementById("authEmail").classList.remove("field-error");
    document.getElementById("authEmailError").classList.remove("visible");
  });
  document.getElementById("closeSelection").addEventListener("click", closeSelection);

  /* Modal unlock "Votre sélection est prête !" */
  document.getElementById("closeUnlockModal").addEventListener("click", closeUnlockModal);
  document.getElementById("unlockModal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeUnlockModal();
  });
  document.getElementById("unlockForm").addEventListener("submit", handleUnlockSubmit);
  document.getElementById("unlockEmail").addEventListener("input", () => {
    document.getElementById("unlockEmail").classList.remove("field-error");
    document.getElementById("unlockEmailError").classList.remove("visible");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (document.getElementById("unlockModal").classList.contains("open"))    closeUnlockModal();
      if (document.getElementById("selectionOverlay").classList.contains("open")) closeSelection();
      if (document.getElementById("espaceDrawer").classList.contains("open"))  closeEspace();
      if (document.getElementById("authModal").classList.contains("open"))     closeAuthModal();
    }
  });
}

/* =============================================================
   25) PAGE MA SÉLECTION — Unlock gate + Actions premium
   =============================================================
   Flux :
   1. Clic "Voir ma sélection" (widget ou nav)
      → si non connecté : modal "Votre sélection est prête !" (unlock gate)
      → si connecté     : overlay Ma sélection directement
   2. L'email est demandé NATURELLEMENT dans l'unlock gate,
      avec une vraie valeur proposée (pas une collecte forcée).
   3. Actions premium : toujours accessibles depuis l'overlay.
   ============================================================= */

/* ---- Unlock gate — modal "Votre sélection est prête !" ---- */
function openUnlockModal() {
  const favList = [...favorites]
    .map((n) => NAMES.find((x) => x.name === n))
    .filter(Boolean);

  /* Aperçu des prénoms choisis */
  const previewEl = document.getElementById("unlockPreview");
  if (previewEl) {
    const chips = favList.slice(0, 5).map((n) =>
      `<span class="unlock-chip">${n.name}</span>`
    );
    if (favList.length > 5) {
      chips.push(`<span class="unlock-chip-more">+${favList.length - 5}</span>`);
    }
    previewEl.innerHTML = chips.join("");
  }

  /* Textes i18n */
  const titleEl  = document.getElementById("unlockTitle");
  const descEl   = document.getElementById("unlockDesc");
  const benfEl   = document.getElementById("unlockBenefits");
  const submitEl = document.getElementById("unlockSubmit");
  const trustEl  = document.getElementById("unlockTrust");

  if (titleEl)  titleEl.textContent  = t("unlock_title");
  if (descEl)   descEl.textContent   = t("unlock_desc");
  if (submitEl) submitEl.textContent = t("unlock_submit");
  if (trustEl)  trustEl.textContent  = t("unlock_trust");
  if (benfEl) {
    const bens = t("unlock_benefits");
    benfEl.innerHTML = Array.isArray(bens)
      ? bens.map((b) => `<li>${b}</li>`).join("")
      : "";
  }

  /* Reset formulaire */
  document.getElementById("unlockEmail").value = "";
  document.getElementById("unlockFirstName").value = "";
  document.getElementById("unlockEmail").classList.remove("field-error");
  document.getElementById("unlockEmailError").classList.remove("visible");

  document.getElementById("unlockModal").classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("unlockEmail").focus(), 240);
}

function closeUnlockModal() {
  document.getElementById("unlockModal").classList.remove("open");
  document.body.style.overflow = "";
}

function handleUnlockSubmit(e) {
  e.preventDefault();
  const email     = document.getElementById("unlockEmail").value.trim();
  const firstName = document.getElementById("unlockFirstName").value.trim();
  const emailOk   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!emailOk) {
    document.getElementById("unlockEmail").classList.add("field-error");
    document.getElementById("unlockEmailError").textContent = t("save_error_email");
    document.getElementById("unlockEmailError").classList.add("visible");
    document.getElementById("unlockEmail").focus();
    return;
  }

  const btn = document.getElementById("unlockSubmit");
  btn.disabled = true;
  btn.textContent = "…";

  setTimeout(() => {
    /* Espace existant ou création */
    const existing = findUserByEmail(email);

    currentUser = existing || {
      email,
      firstName: firstName || null,
      createdAt: new Date().toISOString(),
      surname: lastSurname || null
    };
    saveUser();

    /* Enregistre dans l'admin (si fonction disponible, i.e. admin.js chargé) */
    if (typeof registerAdminUser === "function") {
      registerAdminUser(email, firstName || null, favorites.size);
    }

    btn.disabled = false;

    closeUnlockModal();
    updateEspaceButton();
    showToast(t("save_space_confirm"));

    /* Ouvre maintenant la sélection complète */
    renderSelectionPage();
    document.getElementById("selectionOverlay").classList.add("open");
    document.body.style.overflow = "hidden";
  }, 480);
}

/* ---- Ouverture / Fermeture de l'overlay Ma sélection ---- */
function openSelection() {
  /* Non connecté : montre d'abord la modal "Votre sélection est prête !" */
  if (!currentUser) { openUnlockModal(); return; }
  renderSelectionPage();
  document.getElementById("selectionOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeSelection() {
  document.getElementById("selectionOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

/* ---- Rendu de la page Ma sélection ---- */
function renderSelectionPage() {
  const favList = [...favorites]
    .map((n) => NAMES.find((x) => x.name === n))
    .filter(Boolean);

  /* Compteur */
  const countEl = document.getElementById("selPageCount");
  if (countEl) {
    const fn = t("sel_page_count");
    countEl.textContent = favList.length
      ? (typeof fn === "function" ? fn(favList.length) : fn)
      : "";
  }

  /* Cartes actions premium */
  const actionsEl = document.getElementById("premiumActions");
  if (actionsEl) {
    const acts = [
      { id: "pdf",   icon: "📄", tk: "prem_pdf_title",   dk: "prem_pdf_desc"   },
      { id: "email", icon: "📩", tk: "prem_email_title", dk: "prem_email_desc" },
      { id: "save",  icon: "🔒", tk: "prem_save_title",  dk: "prem_save_desc"  },
      { id: "sync",  icon: "📱", tk: "prem_sync_title",  dk: "prem_sync_desc"  },
    ];
    actionsEl.innerHTML = acts.map((a) => `
      <button class="prem-card${currentUser ? " unlocked" : ""}" data-action="${a.id}">
        <span class="prem-icon">${a.icon}</span>
        <span class="prem-title">${t(a.tk)}</span>
        <span class="prem-desc">${t(a.dk)}</span>
      </button>`).join("");
    actionsEl.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => handlePremiumAction(btn.dataset.action));
    });
  }

  /* Grille des favoris */
  const grid = document.getElementById("selPageResults");
  if (!grid) return;
  if (!favList.length) {
    grid.innerHTML = `
      <div class="sel-ov-empty">
        <div class="big">❤️</div>
        <p>${t("sel_page_empty")}</p>
      </div>`;
  } else {
    grid.innerHTML = favList.map((n, i) => nameCardHTML(n, i, lastSurname)).join("");
    wireCards(grid, "generateur");
  }
}

/* ---- Gestion des actions premium ---- */
function handlePremiumAction(action) {
  if (currentUser) {
    executePremiumAction(action);
  } else {
    pendingAction = action;
    openSaveSpaceModal(); /* demande l'email UNIQUEMENT ici */
  }
}

function executePremiumAction(action) {
  switch (action) {
    case "pdf":
      closeSelection();
      setTimeout(() => exportPDF(), 260);
      break;
    case "email":
      if (currentUser) saveListeToStorage(currentUser.firstName, currentUser.email);
      showToast(t("email_sent_ok"));
      renderSelectionPage(); /* mise à jour état débloqué */
      break;
    case "save":
      showToast(t("save_space_confirm"));
      renderSelectionPage();
      break;
    case "sync":
      showToast(lang === "fr" ? "📱 Synchronisation activée !" : "📱 Sync enabled!");
      renderSelectionPage();
      break;
  }
}

/* ---- Modal "Sauvegardez votre sélection" (contextuelle aux actions) ---- */
function openSaveSpaceModal() {
  /* Personnalise le texte de la modal auth selon le contexte */
  document.getElementById("authModalTitle").textContent = t("save_space_title");
  const descEl = document.querySelector("#authModal .auth-modal-desc");
  if (descEl) descEl.textContent = t("save_space_desc");
  document.getElementById("authSubmit").textContent = t("save_space_btn");

  document.getElementById("authEmail").value = "";
  document.getElementById("authFirstName").value = "";
  document.getElementById("authEmail").classList.remove("field-error");
  document.getElementById("authEmailError").classList.remove("visible");

  document.getElementById("authModal").classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("authEmail").focus(), 220);
}

/* =============================================================
   26) DÉCIDER ENSEMBLE — Module social & boucle virale
   =============================================================
   TODO: BACKEND — Remplacer tous les appels storage.* par des
   fetch() vers Supabase / votre backend.
   ============================================================= */

/* État du module — simple POINTEUR. La vérité vit dans storage.js (Decision). */
let decideState = {
  decisionId:    null,
  role:          null, // "creator" | "partner"
  participantId: null,
};

/* Affiche une seule étape du module */
function showDecideStep(stepId) {
  document.querySelectorAll(".decide-step").forEach((s) => s.classList.remove("active"));
  document.getElementById(stepId)?.classList.add("active");
}

/* ---- Créateur : ouvrir le module et créer la décision ---- */
function openDecide() {
  if (!favorites.size) {
    showToast(lang === "fr" ? "Ajoutez des favoris d'abord" : "Add favourites first");
    return;
  }

  const familyMode = document.getElementById("familyModeCheckbox")?.checked || false;
  const { decision, participantId } = createDecision({
    creatorName:  currentUser?.firstName || null,
    creatorEmail: currentUser?.email || null,
    surname:      lastSurname || null,
    familyMode,
    items:        [...favorites],
  });
  decideState = { decisionId: decision.id, role: "creator", participantId };

  showDecideStep("decideInvite");
  document.getElementById("decideOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
  generateInviteLink();
}

function closeDecide() {
  document.getElementById("decideOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

/* ---- Lien d'invitation : ?invite=<decisionId> ---- */
function generateInviteLink() {
  const baseUrl = window.location.href.split("?")[0].split("#")[0];
  const inviteUrl = `${baseUrl}?invite=${decideState.decisionId}&lang=${lang}`;
  const input = document.getElementById("inviteLinkInput");
  input.value = inviteUrl;
  input.select();
}

/* ---- Copier le lien ---- */
function copyInviteLink() {
  const input = document.getElementById("inviteLinkInput");
  input.select();
  try {
    document.execCommand("copy");
    showToast(t("share_copied"));
  } catch (_) {
    showToast(lang === "fr" ? "Copie échouée" : "Copy failed");
  }
}

/* ---- Partenaire : ouvrir via ?invite=<decisionId> ---- */
function openDecideAsPartner(decisionId) {
  const decision = getDecision(decisionId);
  if (!decision) {
    showToast(t("decide_invite_invalid"));
    return false;
  }
  const participantId = joinDecision(decisionId, {
    role:  "partner",
    name:  currentUser?.firstName || null,
    email: currentUser?.email || null,
  });
  decideState = { decisionId, role: "partner", participantId };

  if (decision.surname) lastSurname = decision.surname;

  renderDecideVote(decision);
  showDecideStep("decideVote");
  document.getElementById("decideOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
  return true;
}

/* ---- Partenaire : rendu de la liste de vote ---- */
function renderDecideVote(decision) {
  document.getElementById("decideVoteSub").textContent = t("decide_vote_sub");
  const myVotes = getVotes(decideState.decisionId)[decideState.participantId] || {};
  const reactions = [
    { r: "yes",   txt: t("vote_yes")   },
    { r: "maybe", txt: t("vote_maybe") },
    { r: "no",    txt: t("vote_no")    },
  ];

  const wrap = document.getElementById("voteList");
  wrap.innerHTML = decision.items.map((name) => {
    const n = NAMES.find((x) => x.name === name);
    return `
      <div class="vote-item" data-vote-name="${name}">
        <span class="vote-name">${n ? n.name : name}</span>
        <div class="vote-actions">
          ${reactions.map((x) =>
            `<button class="vote-btn vote-${x.r}${myVotes[name] === x.r ? " selected" : ""}" data-react="${x.r}">${x.txt}</button>`
          ).join("")}
        </div>
      </div>`;
  }).join("");

  wrap.querySelectorAll(".vote-item").forEach((item) => {
    const name = item.dataset.voteName;
    item.querySelectorAll("[data-react]").forEach((btn) => {
      btn.addEventListener("click", () => {
        handleVote(name, btn.dataset.react);
        item.querySelectorAll("[data-react]").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
      });
    });
  });
}

/* ---- Enregistrer un vote (créateur OU partenaire) ---- */
function handleVote(prenameName, reaction) {
  saveVote(decideState.decisionId, decideState.participantId, prenameName, reaction);
}

/* ---- Afficher les résultats (matchs DÉRIVÉS via storage.computeMatches) ---- */
function showDecideResults() {
  showDecideStep("decideResults");
  const matchs = computeMatches(decideState.decisionId);

  const grid = document.getElementById("decideMatchsGrid");
  if (!matchs.length) {
    grid.innerHTML = `<div class="results-empty" style="text-align:center;padding:40px;color:var(--ink-soft)">
      <div style="font-size:2rem;margin-bottom:10px">💭</div>
      <p>${lang === "fr" ? "Aucun prénom en commun pour l'instant" : "No names in common yet"}</p>
    </div>`;
    return;
  }

  const fn  = t("notif_match_found");
  const msg = typeof fn === "function" ? fn(matchs.length) : fn;
  if (typeof addNotification === "function") addNotification("match_found", msg);

  const names = matchs.map((n) => NAMES.find((x) => x.name === n)).filter(Boolean);
  grid.innerHTML = names.map((n, i) => nameCardHTML(n, i, lastSurname)).join("");
  wireCards(grid, "generateur");
}

/* ---- Créateur : rafraîchir l'état des votes reçus ---- */
function refreshWaiting() {
  const votes = getVotes(decideState.decisionId);
  let yes = 0, no = 0, maybe = 0, voteCount = 0;
  Object.entries(votes).forEach(([pid, byName]) => {
    if (pid === decideState.participantId) return; // ignore les votes du créateur
    Object.values(byName).forEach((r) => {
      voteCount++;
      if (r === "yes") yes++; else if (r === "no") no++; else maybe++;
    });
  });

  document.getElementById("votingStats").innerHTML = `
    <div class="voting-stat-item"><div class="voting-stat-num">${yes}</div><div class="voting-stat-label">${t("vote_yes")}</div></div>
    <div class="voting-stat-item"><div class="voting-stat-num">${maybe}</div><div class="voting-stat-label">${t("vote_maybe")}</div></div>
    <div class="voting-stat-item"><div class="voting-stat-num">${no}</div><div class="voting-stat-label">${t("vote_no")}</div></div>`;

  return voteCount;
}

/* ---- Ajouter une notification dans l'UI ---- */
function addNotificationUI(text) {
  const notifEl = document.getElementById("decideNotifications");
  if (!notifEl) return;
  const div = document.createElement("div");
  div.className = "decide-notif";
  div.textContent = text;
  notifEl.insertBefore(div, notifEl.firstChild);
  setTimeout(() => div.remove(), 5000);
}

/* ---- Wire boutons "Décider ensemble" ---- */
function wireDecideButtons() {
  document.getElementById("closeDecide")?.addEventListener("click", closeDecide);
  document.getElementById("copyInviteLinkBtn")?.addEventListener("click", copyInviteLink);

  /* Créateur : passe à l'écran d'attente */
  document.getElementById("continueAfterInviteBtn")?.addEventListener("click", () => {
    showDecideStep("decideWaiting");
    refreshWaiting();
  });

  /* Créateur : actualise les votes reçus → résultats si votes présents */
  document.getElementById("refreshVotesBtn")?.addEventListener("click", () => {
    const count = refreshWaiting();
    if (count > 0) showDecideResults();
    else showToast(t("decide_no_votes_yet"));
  });

  /* Démo : simuler le vote d'un partenaire (passe par storage) */
  document.getElementById("simulatePartnerBtn")?.addEventListener("click", simulatePartnerVoting);

  /* Partenaire : voir les prénoms en commun après avoir voté */
  document.getElementById("seeMatchsBtn")?.addEventListener("click", () => {
    showToast(t("decide_thanks"));
    showDecideResults();
  });

  /* Partager les matchs */
  document.getElementById("shareMatchsBtn")?.addEventListener("click", () => {
    if (computeMatches(decideState.decisionId).length) shareSelection();
    closeDecide();
  });
}

/* ---- Démo : simule un partenaire DISTINCT qui vote (via storage) ---- */
function simulatePartnerVoting() {
  const decision = getDecision(decideState.decisionId);
  if (!decision || !decision.items.length) return;

  const partnerPid = addParticipant(decideState.decisionId, {
    role: "partner",
    name: lang === "fr" ? "Partenaire (démo)" : "Partner (demo)",
  });
  decision.items.forEach((name) => {
    const r = ["yes", "no", "maybe"][Math.floor(Math.random() * 3)];
    saveVote(decideState.decisionId, partnerPid, name, r);
  });

  showDecideStep("decideWaiting");
  refreshWaiting();
  setTimeout(() => showDecideResults(), 900);
}

/* =============================================================
   27) INIT
   ============================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // Switch FR / EN
  document.getElementById("langSwitch").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn) applyLang(btn.dataset.lang);
  });

  // Widget compact → ouvre Ma sélection
  document.getElementById("selSeeBtn").addEventListener("click", openSelection);

  // Comparateur + Sauvegarder + Mon espace
  initCompare();
  initSaveListeModal();
  initMonEspace();

  loadFavorites();
  loadUser();                       // ← charge le profil utilisateur
  lastSurname = getSurname() || currentUser?.surname || "";
  const surnameInput = document.getElementById("surname");
  if (surnameInput && lastSurname) surnameInput.value = lastSurname;
  initNav();
  initSegments();
  initForm();
  initPopular();
  renderFaq();
  animateTitle();
  initReveal();
  applyLang(getLang());             // langue persistée ; appelle updateEspaceButton()
  renderFavorites();

  /* Module "Décider ensemble" */
  wireDecideButtons();

  /* Parcours partenaire : ?invite=<decisionId> a priorité sur le prefill */
  const inviteId = new URLSearchParams(location.search).get("invite");
  if (inviteId) {
    const il = new URLSearchParams(location.search).get("lang");
    if (il === "fr" || il === "en") applyLang(il);
    openDecideAsPartner(inviteId);
  } else {
    applyQueryPrefill();
  }
});
