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
    nav_home: "Accueil", nav_generator: "Générateur", nav_meaning: "Signification",
    nav_how: "Comment ça marche", nav_faq: "FAQ",
    sig_title: "Signification d'un prénom",
    sig_sub: "Tapez un prénom pour découvrir son origine, sa signification et des prénoms proches.",
    sig_placeholder: "Ex : Nathan, Léa, Yasmine…",
    sig_meaning: "Signification", sig_origin: "Origine", sig_gender: "Genre",
    sig_style: "Style", sig_length: "Longueur", sig_variants: "Variantes",
    sig_pron: "Prononciation", sig_similar: "Prénoms similaires",
    sig_open_generator: "Voir des prénoms similaires",
    sig_not_found: "Aucun prénom trouvé pour",
    sig_intro: "Plus de 4 000 prénoms avec leur signification, leur origine et leur style.",
    nav_favs: "Mes favoris",
    /* ---- hero ---- */
    hero_eyebrow: "Pour les futurs parents",
    hero_title: "Le prénom de votre bébé, choisi ensemble",
    hero_subtitle: "Générez des idées, votez chacun de votre côté, et découvrez les prénoms où vous êtes vraiment d'accord.",
    hero_cta: "Découvrir les prénoms", hero_cta2: "Comment ça marche",
    /* ---- pourquoi ---- */
    why_title: "Pas juste un générateur de prénoms",
    why_sub: "NameSpark Baby est conçu pour décider ensemble — pas seulement explorer chacun de son côté.",
    why_1_t: "Votez en couple",
    why_1_d: "Partagez un lien. Votre partenaire vote de son côté. On vous montre les prénoms où vous êtes vraiment d'accord.",
    why_2_t: "Faites voter la famille",
    why_2_d: "Envoyez le lien aux grands-parents, à vos proches. Suivez le classement en direct avec le détail de qui a voté quoi.",
    why_3_t: "Des idées sur-mesure",
    why_3_d: "Filtres précis par genre, origine, style, signification. Compatibilité avec votre nom de famille incluse.",
    /* ---- générateur ---- */
    gen_title: "Le générateur de prénoms", gen_sub: "Renseignez vos préférences, on s'occupe du reste.",
    f_gender: "Genre", g_boy: "Garçon", g_girl: "Fille", g_mixte: "Mixte",
    f_origin: "Origine", o_all: "Toutes", o_hebreu: "Hébreu", o_francais: "Français",
    o_anglais: "Anglais", o_arabe: "Arabe", o_italien: "Italien", o_espagnol: "Espagnol",
    o_grec: "Grec", o_latin: "Latin",
    o_nordique: "Nordique", o_irlandais: "Irlandais", o_japonais: "Japonais", o_slave: "Slave",
    o_sanskrit: "Sanskrit", o_persan: "Persan", o_africain: "Africain", o_portugais: "Portugais",
    o_coreen: "Coréen", o_chinois: "Chinois", o_gallois: "Gallois", o_basque: "Basque",
    o_armenien: "Arménien", o_georgien: "Géorgien",
    f_style: "Style", any: "Peu importe",
    s_classique: "Classique", s_moderne: "Moderne", s_rare: "Rare",
    s_elegant: "Élégant", s_court: "Court", s_poetique: "Poétique",
    f_meaning: "Signification recherchée",
    m_force: "Force", m_courage: "Courage", m_sagesse: "Sagesse",
    m_lumiere: "Lumière", m_nature: "Nature", m_liberte: "Liberté", m_foi: "Foi", m_amour: "Amour",
    m_paix: "Paix", m_victoire: "Victoire", m_joie: "Joie", m_beaute: "Beauté",
    m_espoir: "Espoir", m_noblesse: "Noblesse", m_grace: "Grâce", m_prosperite: "Prospérité",
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
    share_btn:             "📤 Partager",
    copy_link_btn:         "📋 Copier",
    copy_link_done:        "✓ Lien copié !",
    share_invite_text:     "Mon partenaire m'invite à voter sur des prénoms de bébé ✨",
    share_family_text:     "Votez pour le prénom de notre bébé ! Dites-nous votre préféré 👶",
    share_selection_text:  "Voici mes prénoms préférés pour notre bébé ❤️",
    hero_hint:             "Ajoutez vos coups de cœur, puis votez ensemble.",
    sel_hint_ready:        "Prêts à voter ensemble ?",
    filters_toggle:        "Affiner les critères",
    filters_active:        (n) => `${n} filtre${n > 1 ? "s" : ""} actif${n > 1 ? "s" : ""}`,
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
    sel_decide_btn: "💑 Décider à deux",
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
    email_sent_ok: "📩 Email envoyé ! Vérifiez votre boîte mail.",
    email_already_sent: "📩 Cet email a déjà été envoyé pour cette sélection.",
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
    how_title: "Comment ça fonctionne", how_sub: "De l'idée à la décision partagée, en trois étapes.",
    how_1_t: "Ajoutez vos coups de cœur", how_1_d: "Parcourez les prénoms, filtrez selon vos envies et ajoutez ceux qui vous touchent à votre sélection.",
    how_2_t: "Partagez en un clic", how_2_d: "Envoyez un lien à votre partenaire ou à toute la famille. Chacun vote de son côté, sans se concerter.",
    how_3_t: "Découvrez votre accord", how_3_d: "Voyez quels prénoms vous réunissent vraiment. Couple : les matchs ❤️. Famille : le classement complet.",
    pop_title: "Exemples de prénoms populaires", pop_sub: "Cliquez sur un prénom pour voir des idées similaires dans le générateur.",
    faq_title: "Questions fréquentes",
    /* ---- footer ---- */
    foot_tag: "Choisissez le prénom de votre bébé, ensemble.",
    foot_explore: "Explorer", foot_nav: "Navigation",
    foot_demo: "",
    /* ---- décider ensemble (boucle virale) ---- */
    decide_eyebrow: "Décidez ensemble",
    decide_title: "Invitez votre partenaire",
    partner_eyebrow: "Décidez ensemble",
    partner_title: "À vous de voter",
    family_voter_eyebrow: "Vote famille",
    family_voter_title: "À vous de voter",
    partner_reg_title: "Qui êtes-vous ?",
    partner_reg_sub: "Votre partenaire vous a invité·e à voter. Identifiez-vous pour que vos votes soient bien associés.",
    partner_reg_firstname: "Votre prénom",
    partner_reg_email: "Votre adresse email",
    partner_reg_submit: "Commencer à voter →",
    partner_reg_firstname_required: "Veuillez renseigner votre prénom.",
    partner_reg_email_required: "Veuillez renseigner une adresse email valide.",
    decide_invite_sub: "Partagez ce lien avec votre conjoint pour qu'il vote sur vos prénoms favoris.",
    decide_copy_link: "Copier le lien",
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
    /* ---- Vote famille ---- */
    sel_family_btn: "👨‍👩‍👧‍👦 Faire voter la famille",
    family_pill_btn: "👨‍👩‍👧‍👦 Vote famille",
    family_header_eyebrow: "Vote famille",
    family_header_title: "Faites voter vos proches",
    family_vote_sub: "Aidez-nous à choisir un prénom : votez sur chacun.",
    family_finish_vote: "J'ai terminé",
    family_name_sub: "Avant de voter, dites-nous qui vous êtes.",
    family_name_required: "Merci d'indiquer votre prénom.",
    family_no_votes: "Personne n'a encore voté. Partagez le lien à votre famille et vos amis !",
    family_start_vote: "Commencer à voter",
    family_thanks_title: "Merci pour votre participation !",
    family_thanks_sub: "Vos votes ont bien été enregistrés.",
    family_see_results: "Voir le classement",
    family_results_sub: "Partagez le lien, puis suivez le classement en direct.",
    family_copy_link: "Copier le lien",
    family_refresh: "🔄 Actualiser les votes",
    family_simulate: "Simuler des votes (démo)",
    /* ---- Gate email au lancement d'un vote ---- */
    /* ---- Détail votes couple (vue créateur) ---- */
    couple_detail_title: "Détail complet des votes",
    couple_detail_you: "Vous",
    couple_detail_partner: "Conjoint·e",
    couple_detail_match: "✅ Match",
    couple_detail_no_match: "❌ Pas d'accord",
    couple_detail_pending: "⏳ En attente",
    couple_detail_no_votes: "Aucun vote du conjoint pour l'instant.",
    /* ---- Gate email au lancement d'un vote ---- */
    vote_gate_title: "Être notifié quand votre partenaire vote",
    vote_gate_desc: "Laissez votre email et recevez automatiquement un message dès que votre partenaire a terminé son vote.",
    vote_gate_email: "Votre adresse email",
    vote_gate_continue: "Continuer",
    vote_gate_skip: "Passer →",
    vote_gate_email_invalid: "Cette adresse email semble invalide.",
    save_results_email: "📩 Recevoir par email",
    err_network:       "Erreur de connexion. Vérifiez votre réseau et réessayez.",
    err_vote_failed:   "Vote non enregistré. Réessayez.",
    err_session_load:  "Impossible de charger cette session. Vérifiez votre connexion.",
    err_session_create:"Impossible de créer la session. Réessayez.",
    err_generic:       "Une erreur est survenue. Réessayez.",
    loading_session:   "Chargement de votre session…",
    admin_wrong_pass: "Mot de passe admin incorrect.",
    decide_voted: (n) => `${n} prénom${n > 1 ? "s" : ""} voté${n > 1 ? "s" : ""}`,
    notif_partner_voted: (n) => `Votre partenaire a voté sur ${n} prénom${n > 1 ? "s" : ""} !`,
    notif_match_found: (n) => `🎉 ${n} nouveau${n > 1 ? "x" : ""} match${n > 1 ? "s" : ""} !`,
    notif_weeks_left: (n) => `⏳ Plus que ${n} semaine${n > 1 ? "s" : ""} avant la date prévue`,
    /* ---- listes ---- */
    origins: { hebreu: "Hébreu", francais: "Français", anglais: "Anglais", arabe: "Arabe", italien: "Italien", espagnol: "Espagnol", grec: "Grec", latin: "Latin", nordique: "Nordique", irlandais: "Irlandais", japonais: "Japonais", slave: "Slave", sanskrit: "Sanskrit", persan: "Persan", africain: "Africain", portugais: "Portugais", coreen: "Coréen", chinois: "Chinois", gallois: "Gallois", basque: "Basque", armenien: "Arménien", georgien: "Géorgien" },
    styles: { classique: "Classique", moderne: "Moderne", rare: "Rare", elegant: "Élégant", court: "Court", poetique: "Poétique" }
  },

  en: {
    nav_home: "Home", nav_generator: "Generator", nav_meaning: "Meaning",
    nav_how: "How it works", nav_faq: "FAQ",
    sig_title: "Name meaning",
    sig_sub: "Type a name to discover its origin, meaning and similar names.",
    sig_placeholder: "E.g. Nathan, Léa, Yasmine…",
    sig_meaning: "Meaning", sig_origin: "Origin", sig_gender: "Gender",
    sig_style: "Style", sig_length: "Length", sig_variants: "Variants",
    sig_pron: "Pronunciation", sig_similar: "Similar names",
    sig_open_generator: "See similar names",
    sig_not_found: "No name found for",
    sig_intro: "Over 4,000 names with their meaning, origin and style.",
    nav_favs: "Favourites",
    hero_eyebrow: "For parents-to-be",
    hero_title: "Your baby's name, chosen together",
    hero_subtitle: "Generate ideas, vote separately, and discover the names you truly agree on.",
    hero_cta: "Explore names", hero_cta2: "How it works",
    why_title: "Not just a name generator",
    why_sub: "NameSpark Baby is built to decide together — not just explore alone.",
    why_1_t: "Vote as a couple",
    why_1_d: "Share a link. Your partner votes on their side. We show you the names you both truly agreed on.",
    why_2_t: "Ask the whole family",
    why_2_d: "Send the link to grandparents and loved ones. Follow the live ranking with the full breakdown of who voted what.",
    why_3_t: "Tailored ideas",
    why_3_d: "Precise filters by gender, origin, style, meaning. Compatibility with your last name included.",
    gen_title: "The name generator", gen_sub: "Tell us your preferences, we'll handle the rest.",
    f_gender: "Gender", g_boy: "Boy", g_girl: "Girl", g_mixte: "Unisex",
    f_origin: "Origin", o_all: "All", o_hebreu: "Hebrew", o_francais: "French",
    o_anglais: "English", o_arabe: "Arabic", o_italien: "Italian", o_espagnol: "Spanish",
    o_grec: "Greek", o_latin: "Latin",
    o_nordique: "Nordic", o_irlandais: "Irish", o_japonais: "Japanese", o_slave: "Slavic",
    o_sanskrit: "Sanskrit", o_persan: "Persian", o_africain: "African", o_portugais: "Portuguese",
    o_coreen: "Korean", o_chinois: "Chinese", o_gallois: "Welsh", o_basque: "Basque",
    o_armenien: "Armenian", o_georgien: "Georgian",
    f_style: "Style", any: "Any",
    s_classique: "Classic", s_moderne: "Modern", s_rare: "Rare",
    s_elegant: "Elegant", s_court: "Short", s_poetique: "Poetic",
    f_meaning: "Desired meaning",
    m_force: "Strength", m_courage: "Courage", m_sagesse: "Wisdom",
    m_lumiere: "Light", m_nature: "Nature", m_liberte: "Freedom", m_foi: "Faith", m_amour: "Love",
    m_paix: "Peace", m_victoire: "Victory", m_joie: "Joy", m_beaute: "Beauty",
    m_espoir: "Hope", m_noblesse: "Nobility", m_grace: "Grace", m_prosperite: "Prosperity",
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
    share_btn:             "📤 Share",
    copy_link_btn:         "📋 Copy",
    copy_link_done:        "✓ Link copied!",
    share_invite_text:     "My partner invited me to vote on baby names ✨",
    share_family_text:     "Vote for our baby's name! Tell us your favourite 👶",
    share_selection_text:  "Here are my favourite baby names ❤️",
    hero_hint:             "Save your favourites, then vote together.",
    sel_hint_ready:        "Ready to vote together?",
    filters_toggle:        "Refine criteria",
    filters_active:        (n) => `${n} filter${n > 1 ? "s" : ""} active`,
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
    sel_decide_btn: "💑 Decide together",
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
    email_sent_ok: "📩 Email sent! Check your inbox.",
    email_already_sent: "📩 This email has already been sent for this selection.",
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
    how_title: "How it works", how_sub: "From idea to shared decision, in three steps.",
    how_1_t: "Save your favourites", how_1_d: "Browse names, filter by your preferences and add the ones that speak to you.",
    how_2_t: "Share in one tap", how_2_d: "Send a link to your partner or the whole family. Everyone votes on their own, no influence.",
    how_3_t: "Find your agreement", how_3_d: "See which names bring you together. Couple: the ❤️ matches. Family: the full ranking.",
    pop_title: "Popular name examples", pop_sub: "Click a name to see similar ideas in the generator.",
    faq_title: "Frequently asked questions",
    foot_tag: "Choose your baby's name, together.",
    foot_explore: "Explore", foot_nav: "Navigation",
    foot_demo: "",
    /* ---- decide together (viral loop) ---- */
    decide_eyebrow: "Decide together",
    decide_title: "Invite your partner",
    partner_eyebrow: "Decide together",
    partner_title: "Your turn to vote",
    family_voter_eyebrow: "Family vote",
    family_voter_title: "Your turn to vote",
    partner_reg_title: "Who are you?",
    partner_reg_sub: "Your partner invited you to vote. Identify yourself so your votes are properly linked.",
    partner_reg_firstname: "Your first name",
    partner_reg_email: "Your email address",
    partner_reg_submit: "Start voting →",
    partner_reg_firstname_required: "Please enter your first name.",
    partner_reg_email_required: "Please enter a valid email address.",
    decide_invite_sub: "Share this link with your spouse so they can vote on your favourite names.",
    decide_copy_link: "Copy link",
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
    /* ---- Family vote ---- */
    sel_family_btn: "👨‍👩‍👧‍👦 Ask the family to vote",
    family_pill_btn: "👨‍👩‍👧‍👦 Family vote",
    family_header_eyebrow: "Family vote",
    family_header_title: "Let your loved ones vote",
    family_vote_sub: "Help us choose a name: vote on each one.",
    family_finish_vote: "I'm done",
    family_name_sub: "Before voting, tell us who you are.",
    family_name_required: "Please enter your first name.",
    family_no_votes: "No one has voted yet. Share the link with your family and friends!",
    family_start_vote: "Start voting",
    family_thanks_title: "Thanks for taking part!",
    family_thanks_sub: "Your votes have been saved.",
    family_see_results: "See the ranking",
    family_results_sub: "Share the link, then follow the ranking live.",
    family_copy_link: "Copy link",
    family_refresh: "🔄 Refresh votes",
    family_simulate: "Simulate votes (demo)",
    /* ---- Email gate when starting a vote ---- */
    /* ---- Couple detail view ---- */
    couple_detail_title: "Full vote breakdown",
    couple_detail_you: "You",
    couple_detail_partner: "Partner",
    couple_detail_match: "✅ Match",
    couple_detail_no_match: "❌ No match",
    couple_detail_pending: "⏳ Pending",
    couple_detail_no_votes: "No votes from your partner yet.",
    /* ---- Gate email au lancement d'un vote ---- */
    vote_gate_title: "Get notified when your partner votes",
    vote_gate_desc: "Leave your email and receive an automatic message as soon as your partner finishes voting.",
    vote_gate_email: "Your email address",
    vote_gate_continue: "Continue",
    vote_gate_skip: "Skip →",
    vote_gate_email_invalid: "This email address looks invalid.",
    save_results_email: "📩 Receive by email",
    err_network:       "Connection error. Check your network and try again.",
    err_vote_failed:   "Vote not saved. Please try again.",
    err_session_load:  "Unable to load this session. Check your connection.",
    err_session_create:"Unable to create the session. Please try again.",
    err_generic:       "An error occurred. Please try again.",
    loading_session:   "Loading your session…",
    admin_wrong_pass: "Wrong admin password.",
    decide_voted: (n) => `${n} name${n > 1 ? "s" : ""} voted`,
    notif_partner_voted: (n) => `Your partner voted on ${n} name${n > 1 ? "s" : ""}!`,
    notif_match_found: (n) => `🎉 ${n} new match${n > 1 ? "es" : ""}!`,
    notif_weeks_left: (n) => `⏳ ${n} week${n > 1 ? "s" : ""} left until your due date`,
    origins: { hebreu: "Hebrew", francais: "French", anglais: "English", arabe: "Arabic", italien: "Italian", espagnol: "Spanish", grec: "Greek", latin: "Latin", nordique: "Nordic", irlandais: "Irish", japonais: "Japanese", slave: "Slavic", sanskrit: "Sanskrit", persan: "Persian", africain: "African", portugais: "Portuguese", coreen: "Korean", chinois: "Chinese", gallois: "Welsh", basque: "Basque", armenien: "Armenian", georgien: "Georgian" },
    styles: { classique: "Classic", moderne: "Modern", rare: "Rare", elegant: "Elegant", court: "Short", poetique: "Poetic" }
  }
};

/* =============================================================
   FAQ
   ============================================================= */
const FAQ_DATA = {
  fr: [
    { q: "NameSpark Baby est-il gratuit ?", a: "Oui, entièrement gratuit. Créez votre sélection, votez en couple ou faites voter la famille — sans inscription obligatoire." },
    { q: "En quoi NameSpark Baby est-il différent de ChatGPT ?", a: "ChatGPT vous donne une liste de prénoms. NameSpark Baby vous permet de décider à deux : votre partenaire vote de son côté sur votre sélection, et on vous montre les prénoms où vous êtes vraiment d'accord. C'est un outil de décision partagée, pas juste une recherche." },
    { q: "Comment fonctionne le vote en couple ?", a: "Générez des prénoms, ajoutez vos coups de cœur, puis cliquez sur « Décider à deux ». Un lien est créé : envoyez-le à votre partenaire. Il vote de son côté, vous de votre côté. NameSpark vous montre ensuite les prénoms que vous avez tous les deux adorés." },
    { q: "Comment fonctionne le vote famille ?", a: "Même principe : vous créez une session et partagez un lien. Chaque membre de la famille vote (juste avec son prénom, sans compte). Vous voyez le classement complet en temps réel — qui a voté quoi, pour chaque prénom." },
    { q: "Comment fonctionne le score de compatibilité ?", a: "Si vous renseignez un nom de famille, chaque prénom reçoit un score de 1 à 10 estimant la fluidité de la combinaison (longueur totale, équilibre syllabique, enchaînement sonore). C'est une estimation locale, purement indicative." },
    { q: "Comment fonctionne le bouton « prénoms similaires » ?", a: "Il analyse l'origine, le style et l'ambiance du prénom choisi, puis vous propose des prénoms proches pour affiner votre sélection." },
    { q: "Mes données sont-elles enregistrées ?", a: "Vos favoris sont sauvegardés dans votre navigateur et persistent entre les sessions. Si vous laissez votre email, vos résultats de vote pourront être récupérés. Aucune donnée n'est vendue ni partagée." }
  ],
  en: [
    { q: "Is NameSpark Baby free?", a: "Yes, completely free. Build your selection, vote as a couple or with the whole family — no mandatory sign-up." },
    { q: "How is NameSpark Baby different from ChatGPT?", a: "ChatGPT gives you a list of names. NameSpark Baby helps you decide together: your partner votes on your selection separately, and we show you the names you both truly agreed on. It's a shared decision tool, not just a search." },
    { q: "How does the couple vote work?", a: "Generate names, add your favourites, then click 'Decide together'. A link is created — send it to your partner. They vote on their side, you vote on yours. NameSpark then shows you the names you both loved." },
    { q: "How does the family vote work?", a: "Same idea: you create a session and share a link. Each family member votes (just with their first name, no account needed). You see the full real-time ranking — who voted what, for each name." },
    { q: "How does the compatibility score work?", a: "If you enter a last name, each first name receives a score from 1 to 10 estimating the flow of the combination (total length, syllable balance, sound transition). It's a local, purely indicative estimate." },
    { q: "How does the 'similar names' button work?", a: "It analyses the origin, style and mood of the chosen name, then suggests close names to refine your selection." },
    { q: "Is my data stored?", a: "Your favourites are saved in your browser and persist between sessions. If you leave your email, your vote results can be retrieved. No data is sold or shared." }
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
  /* Tient à jour le compteur de favoris du lead (dashboard admin) */
  if (currentUser) registerLead(currentUser.email, currentUser.firstName, favorites.size);
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

  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const val = I18N[lang][el.getAttribute("data-i18n-ph")];
    if (typeof val === "string") el.setAttribute("placeholder", val);
  });

  document.querySelectorAll("#langSwitch button").forEach((b) =>
    b.classList.toggle("active", b.dataset.lang === lang)
  );

  if (typeof renderSigCurrent === "function") renderSigCurrent();

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
  /* Deduplicate NAMES by name (data.js may contain duplicates) */
  const _seen = new Set();
  const scored = NAMES.filter(n => {
    if (_seen.has(n.name)) return false;
    _seen.add(n.name);
    return true;
  }).map((n) => {
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
  const _seen2 = new Set([ref.name]);
  return NAMES
    .filter((n) => { if (_seen2.has(n.name)) return false; _seen2.add(n.name); return true; })
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
      if (nowFaved) window.plausible?.("Favori ajouté");

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
      /* Scroll vers le titre des résultats, pas le haut du générateur */
      document.querySelector(".results-head")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    window.plausible?.("Génération", { props: { genre: f.gender || "tous", origine: f.origin || "toutes" } });
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

  /* Texte des boutons de la pastille */
  const seeBtn = document.getElementById("selSeeBtn");
  if (seeBtn) seeBtn.textContent = t("sel_see_btn");
  const decideBtn = document.getElementById("selDecideBtn");
  if (decideBtn) decideBtn.textContent = t("sel_decide_btn");
  const familyBtn = document.getElementById("selFamilyBtn");
  if (familyBtn) familyBtn.textContent = t("family_pill_btn");

  /* Hint contextuel : invite à voter ensemble dès 3 favoris */
  const hint = document.getElementById("selHint");
  if (hint) {
    hint.textContent = count >= 3 ? t("sel_hint_ready") : "";
    hint.style.display = count >= 3 ? "" : "none";
  }

  if (count === 0) {
    panel.classList.remove("visible");
    return;
  }
  panel.classList.add("visible");
}

/* =============================================================
   17b) FILTRES PROGRESSIFS — toggle sur mobile
   ============================================================= */
function initFiltersToggle() {
  const btn    = document.getElementById("filtersToggle");
  const panel  = document.getElementById("advancedFilters");
  const label  = document.getElementById("filtersToggleLabel");
  const chevron = document.getElementById("filtersChevron");
  if (!btn || !panel) return;

  btn.addEventListener("click", () => {
    const expanded = panel.classList.toggle("expanded");
    chevron.textContent = expanded ? "▲" : "▼";

    /* Badge : compte les filtres actifs */
    _updateFiltersLabel();
  });

  /* Met à jour le libellé quand les selects changent */
  ["origin","style","meaning","letter","length","surname"].forEach(id => {
    document.getElementById(id)?.addEventListener("change", _updateFiltersLabel);
    document.getElementById(id)?.addEventListener("input",  _updateFiltersLabel);
  });

  /* Segments (longueur) */
  document.querySelectorAll('[data-segmented="length"] button').forEach(b =>
    b.addEventListener("click", () => setTimeout(_updateFiltersLabel, 50))
  );
}

function _updateFiltersLabel() {
  const label = document.getElementById("filtersToggleLabel");
  if (!label) return;
  const active = _countActiveFilters();
  const fn = t("filters_active");
  label.textContent = active > 0
    ? (typeof fn === "function" ? fn(active) : fn)
    : t("filters_toggle");
}

function _countActiveFilters() {
  let n = 0;
  if (document.getElementById("origin")?.value)  n++;
  if (document.getElementById("style")?.value)   n++;
  if (document.getElementById("meaning")?.value) n++;
  if (document.getElementById("letter")?.value.trim()) n++;
  if (document.getElementById("surname")?.value.trim()) n++;
  const lengthActive = document.querySelector('[data-segmented="length"] button.active')?.dataset.value;
  if (lengthActive) n++;
  return n;
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
  url.searchParams.delete("share");
  url.searchParams.delete("surname");
  url.searchParams.delete("lang");
  url.searchParams.set("share", [...favorites].join(","));
  if (lastSurname) url.searchParams.set("surname", lastSurname);
  url.searchParams.set("lang", lang);
  url.hash = "";

  shareLink(url.toString(), t("share_selection_text"));
}

/* Détecte si on est sur un vrai appareil mobile */
function _isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/* Ouvre WhatsApp avec le lien pré-rempli (mobile = app, desktop = web.whatsapp.com) */
function _shareWhatsApp(url, text) {
  const msg = encodeURIComponent(`${text}\n${url}`);
  window.open(`https://wa.me/?text=${msg}`, "_blank", "noopener");
}

/* Ouvre le client email avec sujet + corps pré-rempli */
function _shareEmail(url, subject, body) {
  const link = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${body}\n\n${url}`)}`;
  window.location.href = link;
}

/* Partage natif (navigator.share) avec fallback clipboard → fallback execCommand.
   Sur mobile ET desktop : ouvre la feuille de partage native du système. */
async function shareLink(url, text) {
  if (navigator.share) {
    try {
      await navigator.share({ title: "NameSpark Baby", text, url });
      window.plausible?.("Lien partagé", { props: { type: "natif" } });
    } catch (e) {
      /* AbortError = l'utilisateur a annulé le sélecteur — pas une erreur */
      if (e.name !== "AbortError") await _copyToClipboard(url);
    }
  } else {
    await _copyToClipboard(url);
  }
}

async function _copyToClipboard(url) {
  try {
    await navigator.clipboard.writeText(url);
    showToast(t("share_copied"));
    window.plausible?.("Lien partagé", { props: { type: "clipboard" } });
  } catch (_) {
    copyFallback(url);
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
   20b) HELPERS ROBUSTESSE
   ============================================================= */

/* Écran de chargement pleine page — utilisé pendant le chargement d'une invitation */
function showLoadingScreen(msg) {
  const el  = document.getElementById("loadingScreen");
  const txt = document.getElementById("loadingMsg");
  if (txt) txt.textContent = msg || t("loading_session");
  el?.classList.add("visible");
}
function hideLoadingScreen() {
  document.getElementById("loadingScreen")?.classList.remove("visible");
}

/* Désactive un bouton + affiche "…" pendant une opération async, restaure après.
   Usage : await _withBtnLoading(btn, async () => { ... }); */
async function _withBtnLoading(btn, asyncFn) {
  if (!btn) return asyncFn();
  const orig = btn.textContent;
  btn.disabled = true;
  btn.textContent = "…";
  try {
    return await asyncFn();
  } finally {
    btn.disabled = false;
    btn.textContent = orig;
  }
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

  // Liens de vote (couple/famille) : gérés par le module "Décider ensemble" (voir init)
  if (p.get("invite") || p.get("familyVote")) return;

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

async function handleSaveListeSubmit(e) {
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

  /* Appel backend réel */
  try {
    saveListeToStorage(firstName, email);
    await fetch("/api/save-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, firstName, names: [...favorites], lang }),
    });
  } catch (_) { /* silencieux — la liste est déjà sauvegardée localement */ }

  /* Abonnement newsletter si checkbox cochée */
  const newsletterChecked = document.getElementById("saveListeNewsletter")?.checked;
  if (newsletterChecked) {
    fetch("/api/subscribe-newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, firstName, lang }),
    }).catch(() => {});
  }

  document.getElementById("saveListeForm").style.display    = "none";
  document.getElementById("saveListeSuccess").style.display = "";
  btn.disabled = false;
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

/* ---- Clé anti-doublon email : signature de la sélection + email ---- */
let _lastEmailSig = null;
function _selectionSig() {
  return [...favorites].sort().join(",") + "|" + (currentUser?.email || "");
}

async function sendEmailFromEspace() {
  if (!currentUser) { openSaveListeModal(); return; }
  if (favorites.size === 0) { showToast(t("share_no_fav")); return; }

  /* Anti-doublon : même sélection + même email → bloqué */
  const sig = _selectionSig();
  if (sig === _lastEmailSig) {
    showToast(t("email_already_sent") || "Cet email a déjà été envoyé pour cette sélection.");
    return;
  }

  /* Sauvegarde locale (historique) */
  saveListeToStorage(currentUser.firstName, currentUser.email);

  /* Envoi réel via l'API Vercel (Resend) */
  try {
    const res = await fetch("/api/save-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: currentUser.email,
        firstName: currentUser.firstName || null,
        names: [...favorites],
        surname: lastSurname || null,
        lang
      })
    });
    if (res.ok) {
      _lastEmailSig = sig;
      showToast(t("email_sent_ok"));
    } else {
      const data = await res.json().catch(() => ({}));
      console.error("[NameSpark] save-list error:", data);
      showToast(t("err_network") || "Erreur lors de l'envoi de l'email.");
    }
  } catch (err) {
    console.error("[NameSpark] sendEmail fetch error:", err);
    showToast(t("err_network") || "Erreur réseau.");
  }
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
async function handleAuthSubmit(e) {
  e.preventDefault();
  const email     = document.getElementById("authEmail").value.trim();
  const firstName = document.getElementById("authFirstName").value.trim();

  if (tryAdminLogin(email, firstName)) return;

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!emailOk) {
    document.getElementById("authEmail").classList.add("field-error");
    document.getElementById("authEmailError").textContent = t("save_error_email");
    document.getElementById("authEmailError").classList.add("visible");
    document.getElementById("authEmail").focus();
    return;
  }

  const btn = document.getElementById("authSubmit");
  btn.disabled = true; btn.textContent = "…";

  let existing;
  try {
    existing = await findUserByEmail(email);
  } catch (err) {
    console.error("[NameSpark] handleAuthSubmit:", err);
    showToast(t("err_network"));
    btn.disabled = false; btn.textContent = t("create_space_btn");
    return;
  }

  if (existing) {
    currentUser = existing;
    const fn = t("space_welcome_back");
    showToast(typeof fn === "function" ? fn(existing.firstName) : fn);
  } else {
    currentUser = { email, firstName: firstName || null, createdAt: new Date().toISOString(), surname: lastSurname || null };
    showToast(t("space_created"));
  }

  saveUser();
  registerLead(currentUser.email, currentUser.firstName, favorites.size);
  btn.disabled = false;
  closeAuthModal();
  updateEspaceButton();
  if (!existing) window.plausible?.("Espace créé", { props: { source: "auth" } });

  /* Exécute l'action premium qui a déclenché l'inscription */
  const action = pendingAction;
  pendingAction = null;
  if (action) {
    setTimeout(() => executePremiumAction(action), 300);
  } else {
    openEspace();
  }
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

async function handleUnlockSubmit(e) {
  e.preventDefault();
  const email     = document.getElementById("unlockEmail").value.trim();
  const firstName = document.getElementById("unlockFirstName").value.trim();

  if (tryAdminLogin(email, firstName)) return;

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

  let existing;
  try {
    existing = await findUserByEmail(email);
  } catch (err) {
    console.error("[NameSpark] handleUnlockSubmit:", err);
    showToast(t("err_network"));
    btn.disabled = false; btn.textContent = t("unlock_submit");
    return;
  }
  currentUser = existing || {
    email,
    firstName: firstName || null,
    createdAt: new Date().toISOString(),
    surname: lastSurname || null,
  };
  saveUser();
  registerLead(email, firstName || null, favorites.size);

  btn.disabled = false;
  closeUnlockModal();
  updateEspaceButton();
  showToast(t("save_space_confirm"));
  window.plausible?.("Espace créé", { props: { source: "unlock" } });

  renderSelectionPage();
  document.getElementById("selectionOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

/* ---- Ouverture / Fermeture de l'overlay Ma sélection ---- */
function openSelection() {
  /* Accès direct — pas de gate email. L'email est proposé plus tard,
     dans des moments où il apporte une vraie valeur (post-vote, sauvegarde). */
  window.plausible?.("Sélection ouverte");
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
      sendEmailFromEspace(); /* centralisé, avec anti-doublon + appel API */
      renderSelectionPage();
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
/* Timer d'auto-polling (s'active quand le créateur est sur l'écran d'attente) */
let _pollTimer = null;
const POLL_INTERVAL = 15000; /* 15 secondes */

/* Affiche une seule étape du module */
function showDecideStep(stepId) {
  document.querySelectorAll(".decide-step").forEach((s) => s.classList.remove("active"));
  document.getElementById(stepId)?.classList.add("active");
}

/* En-tête de l'overlay selon le mode (couple / famille) */
/* context : "couple_creator" | "couple_partner" | "family_creator" | "family_voter" */
function setDecideHeader(context) {
  const eyebrow = document.querySelector(".decide-head .eyebrow");
  const title   = document.querySelector(".decide-title");
  const MAP = {
    couple_creator: ["decide_eyebrow",       "decide_title"      ],
    couple_partner: ["partner_eyebrow",       "partner_title"     ],
    family_creator: ["family_header_eyebrow", "family_header_title"],
    family_voter:   ["family_voter_eyebrow",  "family_voter_title" ],
  };
  const [ek, tk] = MAP[context] || MAP.couple_creator;
  if (eyebrow) eyebrow.textContent = t(ek);
  if (title)   title.textContent   = t(tk);
}

/* =============================================================
   ACCÈS ADMIN SECRET + GATE EMAIL (facultatif) AU LANCEMENT D'UN VOTE
   ============================================================= */

/* Backdoor admin : dans un formulaire email, email="admin" + prénom=mot de passe.
   → ouvre le dashboard admin. Renvoie true si la saisie était une tentative admin
   (à consommer : ne pas la traiter comme un email normal). */
function tryAdminLogin(email, password) {
  if ((email || "").trim().toLowerCase() !== "admin") return false;
  if (adminLogin((password || "").trim())) {
    window.location.href = "admin.html";
  } else {
    showToast(t("admin_wrong_pass"));
  }
  return true;
}

let pendingVoteMode  = null;   // "couple" | "family"
let _voteInProgress = false;  // garde contre le double-clic pendant Supabase

/* Point d'entrée unique des votes : propose l'email (facultatif) si non connecté */
async function startVote(mode) {
  console.log("[NS:startVote] mode:", mode, "favs:", favorites.size, "user:", !!currentUser, "inProgress:", _voteInProgress);
  if (_voteInProgress) return;          // double-clic ou appel concurrent
  if (!favorites.size) {
    showToast(lang === "fr" ? "Ajoutez des favoris d'abord" : "Add favourites first");
    return;
  }
  _voteInProgress = true;
  try {
    window.plausible?.("Vote lancé", { props: { mode } });
    pendingVoteMode = mode;
    if (currentUser) {
      console.log("[NS:startVote] user déjà connecté → launchVote direct");
      await launchVote(mode);
      return;
    }
    console.log("[NS:startVote] ouverture modal email");
    openVoteStartModal();
  } finally {
    _voteInProgress = false;
  }
}

async function launchVote(mode) {
  if (mode === "family") await openFamilyVote();
  else await openDecide();
}

function openVoteStartModal() {
  document.getElementById("voteStartEmail").value = "";
  document.getElementById("voteStartFirstName").value = "";
  document.getElementById("voteStartEmail").classList.remove("field-error");
  document.getElementById("voteStartEmailError").classList.remove("visible");
  document.getElementById("voteStartModal").classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("voteStartEmail").focus(), 200);
}
function closeVoteStartModal() {
  document.getElementById("voteStartModal").classList.remove("open");
  document.body.style.overflow = "";
}

async function handleVoteStartSubmit(e) {
  e.preventDefault();
  const email     = document.getElementById("voteStartEmail").value.trim();
  const firstName = document.getElementById("voteStartFirstName").value.trim();
  console.log("[NS:voteSubmit] email:", !!email, "firstName:", !!firstName, "pendingMode:", pendingVoteMode);

  if (tryAdminLogin(email, firstName)) return;

  if (email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById("voteStartEmail").classList.add("field-error");
      document.getElementById("voteStartEmailError").textContent = t("vote_gate_email_invalid");
      document.getElementById("voteStartEmailError").classList.add("visible");
      return;
    }
    const btn = document.getElementById("voteStartSubmit");
    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "…";
    try {
      const existing = await findUserByEmail(email);
      currentUser = existing || {
        email, firstName: firstName || null, createdAt: new Date().toISOString(), surname: lastSurname || null,
      };
    } catch (_) {
      /* Réseau indisponible — on crée quand même un user local */
      currentUser = {
        email, firstName: firstName || null, createdAt: new Date().toISOString(), surname: lastSurname || null,
      };
    } finally {
      btn.disabled = false;
      btn.textContent = origText;
    }
    saveUser();
    registerLead(email, firstName || currentUser.firstName, favorites.size);
    updateEspaceButton();
  }

  console.log("[NS:voteSubmit] → closeModal + launchVote:", pendingVoteMode);
  closeVoteStartModal();
  await launchVote(pendingVoteMode);
}

/* ---- Créateur : ouvrir le module et créer la décision ---- */
async function openDecide() {
  console.log("[NS:openDecide] démarrage — favs:", favorites.size, "user:", !!currentUser);
  if (!favorites.size) {
    showToast(lang === "fr" ? "Ajoutez des favoris d'abord" : "Add favourites first");
    return;
  }
  try {
    console.log("[NS:openDecide] createDecision...");
    const { decision, participantId } = await createDecision({
      creatorName:  currentUser?.firstName || null,
      creatorEmail: currentUser?.email || null,
      surname:      lastSurname || null,
      mode:         "couple",
      items:        [...favorites],
    });
    console.log("[NS:openDecide] décision créée:", decision.id);
    decideState = { decisionId: decision.id, role: "creator", participantId, mode: "couple" };
    if (currentUser) registerLead(currentUser.email, currentUser.firstName, favorites.size, true);

    setDecideHeader("couple_creator");
    showDecideStep("decideInvite");
    const overlay = document.getElementById("decideOverlay");
    console.log("[NS:openDecide] overlay trouvé:", !!overlay);
    if (overlay) { overlay.classList.add("open"); document.body.style.overflow = "hidden"; }
    generateInviteLink();
    _showEmailNudgeIfNeeded();
    console.log("[NS:openDecide] ✅ overlay ouvert");
  } catch (err) {
    console.error("[NS:openDecide] ❌ ERREUR:", err?.message || err, err);
    /* Affiche le détail de l'erreur pour le debug */
    showToast(`${t("err_session_create")} [${err?.message || "unknown"}]`);
  }
}

function closeDecide() {
  stopPolling();
  document.getElementById("decideOverlay")?.classList.remove("open");
  document.body.style.overflow = "";
}

/* ---- Auto-polling : vérifie les votes toutes les POLL_INTERVAL ms ---- */
function startPolling() {
  stopPolling(); /* évite les doublons */
  _pollTimer = setInterval(async () => {
    /* N'actualise que si l'écran d'attente est visible */
    const waitingStep = document.getElementById("decideWaiting");
    if (!waitingStep?.classList.contains("active")) { stopPolling(); return; }
    /* Mise à jour silencieuse des stats — le bouton "Voir les résultats"
       apparaît automatiquement si des votes arrivent */
    await refreshWaiting();
  }, POLL_INTERVAL);
}
function stopPolling() {
  if (_pollTimer) { clearInterval(_pollTimer); _pollTimer = null; }
}

/* ---- Lien d'invitation : ?invite=<decisionId> ---- */
function generateInviteLink() {
  if (!decideState.decisionId) return;
  const baseUrl = window.location.href.split("?")[0].split("#")[0];
  const inviteUrl = `${baseUrl}?invite=${decideState.decisionId}&lang=${lang}`;
  const input = document.getElementById("inviteLinkInput");
  if (!input) return; /* null-safe — ne jette plus d'exception */
  input.value = inviteUrl;
  try { input.select(); } catch (_) {} /* input.select() peut échouer sur iOS */
}

/* ---- Partager le lien d'invitation (feuille native / clipboard) ---- */
async function copyInviteLink() {
  const url = _getOrBuildInviteUrl();
  if (!url) { showToast(t("err_generic")); return; }
  await shareLink(url, t("share_invite_text"));
}

/* ---- Copier le lien d'invitation directement ---- */
async function copyInviteLinkOnly() {
  const url = _getOrBuildInviteUrl();
  if (!url) { showToast(t("err_generic")); return; }
  await _copyToClipboard(url);
}

/* ---- Helper : récupère ou reconstruit l'URL d'invitation couple ---- */
function _getOrBuildInviteUrl() {
  const input = document.getElementById("inviteLinkInput");
  let url = input?.value || "";
  if (!url && decideState.decisionId) {
    const baseUrl = window.location.href.split("?")[0].split("#")[0];
    url = `${baseUrl}?invite=${decideState.decisionId}&lang=${lang}`;
    if (input) input.value = url;
  }
  return url;
}

/* Stocke la décision en attente pendant l'identification du partenaire */
let _pendingPartnerDecision = null;

/* ---- Partenaire : ouvrir via ?invite=<decisionId> ---- */
async function openDecideAsPartner(decisionId) {
  try {
    const decision = await getDecision(decisionId);
    if (!decision) {
      showToast(t("decide_invite_invalid"));
      return false;
    }
    if (decision.surname) lastSurname = decision.surname;
    setDecideHeader("couple_partner");

    /* Si le partenaire est déjà identifié, passer directement au vote */
    if (currentUser) {
      await _joinAndShowPartnerVote(decision, decisionId);
    } else {
      /* Sinon, montrer l'écran d'identification (prénom + email obligatoires) */
      _pendingPartnerDecision = decision;
      document.getElementById("decideOverlay").classList.add("open");
      document.body.style.overflow = "hidden";
      showDecideStep("couplePartnerReg");
      setTimeout(() => document.getElementById("partnerFirstName")?.focus(), 200);
    }
    return true;
  } catch (err) {
    console.error("[NameSpark] openDecideAsPartner:", err);
    showToast(t("err_session_load"));
    return false;
  }
}

/* ---- Rejoint la décision et affiche le vote (après identification) ---- */
async function _joinAndShowPartnerVote(decision, decisionId) {
  const participantId = await joinDecision(decisionId, {
    role:  "partner",
    name:  currentUser?.firstName || null,
    email: currentUser?.email || null,
  });
  decideState = { decisionId, role: "partner", participantId, mode: "couple" };
  renderDecideVote(decision);
  showDecideStep("decideVote");
  document.getElementById("decideOverlay")?.classList.add("open");
  document.body.style.overflow = "hidden";
}

/* ---- Soumission du formulaire d'identification partenaire ---- */
async function handlePartnerRegSubmit(e) {
  e.preventDefault();
  const firstName = document.getElementById("partnerFirstName").value.trim();
  const email     = document.getElementById("partnerEmail").value.trim();

  /* Validation prénom */
  if (!firstName) {
    document.getElementById("partnerFirstName").classList.add("field-error");
    document.getElementById("partnerFirstNameError").textContent = t("partner_reg_firstname_required");
    document.getElementById("partnerFirstNameError").classList.add("visible");
    document.getElementById("partnerFirstName").focus();
    return;
  }

  /* Validation email */
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById("partnerEmail").classList.add("field-error");
    document.getElementById("partnerEmailError").textContent = t("partner_reg_email_required");
    document.getElementById("partnerEmailError").classList.add("visible");
    document.getElementById("partnerEmail").focus();
    return;
  }

  const btn = document.getElementById("partnerRegSubmit");
  const origText = btn.textContent;
  btn.disabled = true;
  btn.textContent = "…";

  try {
    const existing = await findUserByEmail(email);
    currentUser = existing || {
      email, firstName, createdAt: new Date().toISOString(), surname: lastSurname || null,
    };
  } catch (_) {
    currentUser = { email, firstName, createdAt: new Date().toISOString(), surname: lastSurname || null };
  } finally {
    btn.disabled = false;
    btn.textContent = origText;
  }

  saveUser();
  registerLead(email, firstName, 0);
  updateEspaceButton();

  /* Reprendre le flow avec la décision en attente */
  const decision = _pendingPartnerDecision;
  _pendingPartnerDecision = null;
  if (!decision) { showToast(t("err_generic")); return; }

  await _joinAndShowPartnerVote(decision, decision.id);
}

/* ---- Rendu de la liste de vote (partenaire OU votant famille) ---- */
function renderDecideVote(decision) {
  const isFamily = decideState.mode === "family";
  document.getElementById("decideVoteSub").textContent =
    isFamily ? t("family_vote_sub") : t("decide_vote_sub");
  const seeBtn = document.getElementById("seeMatchsBtn");
  if (seeBtn) seeBtn.textContent = isFamily ? t("family_finish_vote") : t("decide_see_matchs");

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
      btn.addEventListener("click", async () => {
        /* Mise à jour optimiste immédiate */
        item.querySelectorAll("[data-react]").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        try {
          await handleVote(name, btn.dataset.react);
        } catch (_) {
          /* Annule la mise à jour optimiste si l'enregistrement Supabase échoue */
          btn.classList.remove("selected");
          showToast(t("err_vote_failed"));
        }
      });
    });
  });
}

/* ---- Enregistrer un vote (créateur OU partenaire) ---- */
async function handleVote(prenameName, reaction) {
  await saveVote(decideState.decisionId, decideState.participantId, prenameName, reaction);
  window.plausible?.("Vote effectué", { props: { mode: decideState.mode, reaction } });
}

/* ---- Afficher les résultats (matchs DÉRIVÉS via storage.computeMatches) ---- */
/* Async pour pouvoir re-fetcher la décision et passer les données à renderCoupleVoteDetail */
async function showDecideResults() {
  showDecideStep("decideResults");
  const matchs = computeMatches(decideState.decisionId);

  /* ---- Grille des matchs ---- */
  const grid = document.getElementById("decideMatchsGrid");
  if (!matchs.length) {
    grid.innerHTML = `<div class="results-empty" style="text-align:center;padding:40px;color:var(--ink-soft)">
      <div style="font-size:2rem;margin-bottom:10px">💭</div>
      <p>${lang === "fr" ? "Aucun prénom en commun pour l'instant" : "No names in common yet"}</p>
    </div>`;
  } else {
    const fn  = t("notif_match_found");
    const msg = typeof fn === "function" ? fn(matchs.length) : fn;
    addNotification("match_found", msg);
    const names = matchs.map((n) => NAMES.find((x) => x.name === n)).filter(Boolean);
    grid.innerHTML = names.map((n, i) => nameCardHTML(n, i, lastSurname)).join("");
    wireCards(grid, "generateur");
  }

  /* ---- Détail complet (créateur couple uniquement) ---- */
  const detailWrap = document.getElementById("coupleVoteDetail");
  if (!detailWrap) return;

  if (decideState.mode !== "couple" || decideState.role !== "creator") {
    detailWrap.style.display = "none";
    return;
  }

  /* Récupère la décision depuis le cache (déjà mis à jour par refreshWaiting/getDecision)
     ou re-fetch si nécessaire. Pas d'appel async sans await. */
  const d = await getDecision(decideState.decisionId);
  renderCoupleVoteDetail(d);
  detailWrap.style.display = "";
}

/* Tableau de détail : pour chaque prénom, vote du créateur vs vote du conjoint.
   Reçoit la décision en paramètre — plus d'appel async sans await. */
function renderCoupleVoteDetail(d) {
  if (!d) return;

  const votes = d.votes;
  const myPid = decideState.participantId;

  /* Participants autres que le créateur (= conjoint(s)) */
  const partners = Object.entries(d.participants)
    .filter(([pid]) => pid !== myPid)
    .map(([pid, p]) => ({ pid, name: p.name || t("couple_detail_partner") }));

  document.getElementById("coupleDetailTitle").textContent = t("couple_detail_title");

  if (!partners.length || !Object.keys(votes).some((pid) => pid !== myPid)) {
    document.getElementById("coupleDetailList").innerHTML =
      `<p class="couple-detail-empty">${t("couple_detail_no_votes")}</p>`;
    return;
  }

  const reactionIcon = (r) => r === "yes" ? "❤️" : r === "maybe" ? "🤔" : r === "no" ? "❌" : "—";

  const html = d.items.map((name) => {
    /* Le créateur ne vote pas explicitement : ses favoris = "yes" implicite.
       ?? "yes" : si aucun vote explicite, on considère "yes" (il a choisi ces prénoms). */
    const myVote      = ((votes[myPid]  || {})[name]) ?? "yes";
    const partnerVote = (votes[partners[0].pid] || {})[name]; // 1 conjoint en couple

    const isMatch   = myVote === "yes" && partnerVote === "yes";
    const isPending = !partnerVote;
    const statusLabel = isPending ? t("couple_detail_pending")
                      : isMatch   ? t("couple_detail_match")
                      : t("couple_detail_no_match");
    const statusCls = isPending ? "cd-pending" : isMatch ? "cd-match" : "cd-nomatch";

    return `
      <div class="cd-row ${statusCls}">
        <span class="cd-name">${name}</span>
        <span class="cd-vote">
          <span class="cd-voter-lbl">${t("couple_detail_you")}</span>
          <span class="cd-icon">${reactionIcon(myVote)}</span>
        </span>
        <span class="cd-vote">
          <span class="cd-voter-lbl">${partners[0].name}</span>
          <span class="cd-icon">${reactionIcon(partnerVote)}</span>
        </span>
        <span class="cd-status">${statusLabel}</span>
      </div>`;
  }).join("");

  document.getElementById("coupleDetailList").innerHTML = html;
}

/* ---- Créateur : rafraîchir l'état des votes reçus depuis Supabase ---- */
async function refreshWaiting() {
  try {
    console.log("[NS:refresh] decisionId:", decideState.decisionId, "myPid:", decideState.participantId);

    /* Re-fetch depuis Supabase → met à jour le cache local */
    const decision = await getDecision(decideState.decisionId);
    const votes = decision ? decision.votes : getVotes(decideState.decisionId);

    console.log("[NS:refresh] participants avec votes:", Object.keys(votes).length);

    let yes = 0, no = 0, maybe = 0, voteCount = 0;
    Object.entries(votes).forEach(([pid, byName]) => {
      if (pid === decideState.participantId) return; /* ignorer mes propres votes */
      Object.values(byName).forEach((r) => {
        voteCount++;
        if (r === "yes") yes++; else if (r === "no") no++; else maybe++;
      });
    });

    console.log("[NS:refresh] votes partenaire:", voteCount, "(yes:", yes, "no:", no, "maybe:", maybe, ")");

    /* Mise à jour des stats — toujours visible */
    document.getElementById("votingStats").innerHTML = `
      <div class="voting-stat-item"><div class="voting-stat-num">${yes || 0}</div><div class="voting-stat-label">💚 J'aime</div></div>
      <div class="voting-stat-item"><div class="voting-stat-num">${maybe || 0}</div><div class="voting-stat-label">🤔 Peut-être</div></div>
      <div class="voting-stat-item"><div class="voting-stat-num">${no || 0}</div><div class="voting-stat-label">❌ Non</div></div>`;

    /* Bouton "Voir les résultats" visible dès qu'il y a des votes */
    const seeResultsBtn = document.getElementById("seeResultsBtn");
    if (seeResultsBtn) seeResultsBtn.style.display = voteCount > 0 ? "" : "none";

    return voteCount;
  } catch (err) {
    console.error("[NS:refresh] erreur:", err?.message || err);
    showToast(t("err_network"));
    return 0;
  }
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
  /* Point d'entrée créateur : depuis l'overlay "Ma sélection" */
  document.getElementById("openDecideBtn")?.addEventListener("click", () => {
    closeSelection();
    startVote("couple");
  });

  document.getElementById("closeDecide")?.addEventListener("click", closeDecide);
  /* Grille de partage — invite couple */
  document.getElementById("copyInviteLinkBtn")?.addEventListener("click", copyInviteLink);     /* "Plus" = natif/clipboard */
  document.getElementById("copyInviteLinkOnlyBtn")?.addEventListener("click", copyInviteLinkOnly); /* Copier */
  document.getElementById("shareInviteWhatsApp")?.addEventListener("click", () => {
    const url = _getOrBuildInviteUrl();
    if (url) _shareWhatsApp(url, t("share_invite_text"));
  });
  document.getElementById("shareInviteEmail")?.addEventListener("click", () => {
    const url = _getOrBuildInviteUrl();
    if (url) _shareEmail(url,
      lang === "fr" ? "Vote pour notre bébé ✨" : "Vote for our baby ✨",
      t("share_invite_text"));
  });

  /* Créateur : passe à l'écran d'attente + démarre l'auto-polling */
  document.getElementById("continueAfterInviteBtn")?.addEventListener("click", () => {
    showDecideStep("decideWaiting");
    refreshWaiting(); /* premier fetch immédiat */
    startPolling();   /* puis auto-poll toutes les 15s */
  });

  /* Créateur : actualise manuellement */
  document.getElementById("refreshVotesBtn")?.addEventListener("click", async (e) => {
    const count = await _withBtnLoading(e.currentTarget, refreshWaiting);
    if (count === 0) showToast(t("decide_no_votes_yet"));
    /* Pas d'auto-navigation — l'utilisateur choisit quand voir les résultats */
  });

  /* Créateur : voir les résultats explicitement */
  document.getElementById("seeResultsBtn")?.addEventListener("click", () => {
    stopPolling();
    showDecideResults();
  });

  /* Démo : simuler le vote d'un partenaire (passe par storage) */
  document.getElementById("simulatePartnerBtn")?.addEventListener("click", simulatePartnerVoting);

  /* Après vote : couple → matchs ; famille → écran de remerciement */
  document.getElementById("seeMatchsBtn")?.addEventListener("click", () => {
    /* Notifier le créateur seulement si c'est un votant (pas le créateur lui-même) */
    if (decideState.role !== "creator") {
      _notifyCreatorOfVote();
    }
    if (decideState.mode === "family") {
      finishFamilyVote();
    } else {
      showToast(t("decide_thanks"));
      showDecideResults();
    }
  });

  /* Partager les matchs */
  document.getElementById("shareMatchsBtn")?.addEventListener("click", () => {
    if (computeMatches(decideState.decisionId).length) shareSelection();
    closeDecide();
  });

  /* Recevoir résultats couple par email (post-vote, non bloquant) */
  document.getElementById("saveMatchsBtn")?.addEventListener("click", () => {
    window.plausible?.("Email capturé", { props: { contexte: "matchs-couple" } });
    openSaveListeModal();
  });

  /* ===== IDENTIFICATION PARTENAIRE COUPLE ===== */
  document.getElementById("partnerRegForm")?.addEventListener("submit", handlePartnerRegSubmit);
  document.getElementById("partnerFirstName")?.addEventListener("input", () => {
    document.getElementById("partnerFirstName").classList.remove("field-error");
    document.getElementById("partnerFirstNameError").classList.remove("visible");
  });
  document.getElementById("partnerEmail")?.addEventListener("input", () => {
    document.getElementById("partnerEmail").classList.remove("field-error");
    document.getElementById("partnerEmailError").classList.remove("visible");
  });

  /* ===== VOTE FAMILLE ===== */
  document.getElementById("openFamilyBtn")?.addEventListener("click", () => {
    closeSelection();
    startVote("family");
  });
  /* Modal gate email (facultatif) au lancement d'un vote */
  document.getElementById("voteStartForm")?.addEventListener("submit", handleVoteStartSubmit);
  document.getElementById("voteStartSkip")?.addEventListener("click", () => {
    closeVoteStartModal();
    launchVote(pendingVoteMode);
  });
  document.getElementById("closeVoteStart")?.addEventListener("click", closeVoteStartModal);
  document.getElementById("voteStartModal")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeVoteStartModal();
  });
  document.getElementById("voteStartEmail")?.addEventListener("input", () => {
    document.getElementById("voteStartEmail").classList.remove("field-error");
    document.getElementById("voteStartEmailError").classList.remove("visible");
  });
  document.getElementById("familyNameForm")?.addEventListener("submit", handleFamilyNameSubmit);
  document.getElementById("familyVoterName")?.addEventListener("input", () => {
    document.getElementById("familyVoterName").classList.remove("field-error");
    document.getElementById("familyNameError").classList.remove("visible");
  });
  document.getElementById("familySeeResultsBtn")?.addEventListener("click", async () => {
    await getDecision(decideState.decisionId); /* re-fetch pour avoir les derniers votes */
    renderFamilyResults();
    showDecideStep("familyResults");
  });
  /* Grille de partage — vote famille */
  document.getElementById("copyFamilyLinkBtn")?.addEventListener("click", copyFamilyLink);       /* "Plus" = natif/clipboard */
  document.getElementById("copyFamilyLinkOnlyBtn")?.addEventListener("click", copyFamilyLinkOnly); /* Copier */
  document.getElementById("shareFamilyWhatsApp")?.addEventListener("click", () => {
    const url = _getOrBuildFamilyUrl();
    if (url) _shareWhatsApp(url, t("share_family_text"));
  });
  document.getElementById("shareFamilyEmail")?.addEventListener("click", () => {
    const url = _getOrBuildFamilyUrl();
    if (url) _shareEmail(url,
      lang === "fr" ? "Votez pour le prénom de notre bébé 👶" : "Vote for our baby's name 👶",
      t("share_family_text"));
  });
  document.getElementById("refreshFamilyBtn")?.addEventListener("click", async (e) => {
    await _withBtnLoading(e.currentTarget, async () => {
      await getDecision(decideState.decisionId);
      renderFamilyResults();
    });
  });

  /* Recevoir classement famille par email (post-vote, non bloquant) */
  document.getElementById("saveResultsFamilyBtn")?.addEventListener("click", () => {
    window.plausible?.("Email capturé", { props: { contexte: "classement-famille" } });
    openSaveListeModal();
  });

  document.getElementById("simulateFamilyBtn")?.addEventListener("click", simulateFamilyVotes);
}

/* ---- Démo : simule un partenaire DISTINCT qui vote (via storage) ---- */
async function simulatePartnerVoting() {
  const decision = await getDecision(decideState.decisionId);
  if (!decision || !decision.items.length) return;

  const partnerPid = await addParticipant(decideState.decisionId, {
    role: "partner",
    name: lang === "fr" ? "Partenaire (démo)" : "Partner (demo)",
  });
  for (const name of decision.items) {
    const r = ["yes", "no", "maybe"][Math.floor(Math.random() * 3)];
    await saveVote(decideState.decisionId, partnerPid, name, r);
  }

  showDecideStep("decideWaiting");
  await refreshWaiting();
  setTimeout(() => showDecideResults(), 900);
}

/* =============================================================
   26b) VOTE FAMILLE — N votants identifiés par prénom (pas d'email)
   Même modèle Decision (mode:"family"), même couche storage.
   ============================================================= */

/* ---- Créateur : ouvre une session de vote famille ---- */
async function openFamilyVote() {
  if (!favorites.size) {
    showToast(lang === "fr" ? "Ajoutez des favoris d'abord" : "Add favourites first");
    return;
  }
  try {
    const { decision, participantId } = await createDecision({
      creatorName:  currentUser?.firstName || null,
      creatorEmail: currentUser?.email || null,
      surname:      lastSurname || null,
      mode:         "family",
      items:        [...favorites],
    });
    decideState = { decisionId: decision.id, role: "creator", participantId, mode: "family" };
    if (currentUser) registerLead(currentUser.email, currentUser.firstName, favorites.size, true);

    setDecideHeader("family_creator");
    generateFamilyLink();
    renderFamilyResults();
    showDecideStep("familyResults");
    const fOverlay = document.getElementById("decideOverlay");
    if (fOverlay) { fOverlay.classList.add("open"); document.body.style.overflow = "hidden"; }
    _showEmailNudgeIfNeeded();
  } catch (err) {
    console.error("[NameSpark] openFamilyVote:", err);
    showToast(t("err_session_create"));
  }
}

/* ---- Lien partageable : ?familyVote=<decisionId> ---- */
function generateFamilyLink() {
  const baseUrl = window.location.href.split("?")[0].split("#")[0];
  const url = `${baseUrl}?familyVote=${decideState.decisionId}&lang=${lang}`;
  const input = document.getElementById("familyLinkInput");
  if (input) input.value = url;
}
/* ---- Partager le lien famille (feuille native / clipboard) ---- */
async function copyFamilyLink() {
  const url = _getOrBuildFamilyUrl();
  if (!url) { showToast(t("err_generic")); return; }
  await shareLink(url, t("share_family_text"));
}

/* ---- Copier le lien famille directement ---- */
async function copyFamilyLinkOnly() {
  const url = _getOrBuildFamilyUrl();
  if (!url) { showToast(t("err_generic")); return; }
  await _copyToClipboard(url);
}

/* ---- Helper : récupère ou reconstruit l'URL famille ---- */
function _getOrBuildFamilyUrl() {
  const input = document.getElementById("familyLinkInput");
  let url = input?.value || "";
  if (!url && decideState.decisionId) {
    const baseUrl = window.location.href.split("?")[0].split("#")[0];
    url = `${baseUrl}?familyVote=${decideState.decisionId}&lang=${lang}`;
    if (input) input.value = url;
  }
  return url;
}

/* ---- Votant : ouvre via ?familyVote=<decisionId> ---- */
async function openFamilyVoteAsVoter(decisionId) {
  try {
    const decision = await getDecision(decisionId);
    if (!decision) { showToast(t("decide_invite_invalid")); return false; }

    decideState = { decisionId, role: "family", participantId: null, mode: "family" };
    if (decision.surname) lastSurname = decision.surname;

    setDecideHeader("family_voter");
    document.getElementById("familyNameSub").textContent = t("family_name_sub");
    showDecideStep("familyName");
    document.getElementById("decideOverlay").classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => document.getElementById("familyVoterName").focus(), 220);
    return true;
  } catch (err) {
    console.error("[NameSpark] openFamilyVoteAsVoter:", err);
    showToast(t("err_session_load"));
    return false;
  }
}

/* ---- Votant : valide son prénom puis passe au vote ---- */
async function handleFamilyNameSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("familyVoterName");
  const name = input.value.trim();
  if (!name) {
    input.classList.add("field-error");
    const err = document.getElementById("familyNameError");
    err.textContent = t("family_name_required");
    err.classList.add("visible");
    input.focus();
    return;
  }
  const btn = document.getElementById("familyNameSubmit");
  try {
    btn.disabled = true; btn.textContent = "…";
    const pid = await addParticipant(decideState.decisionId, { role: "family", name });
    decideState.participantId = pid;
    /* La décision est déjà en cache depuis openFamilyVoteAsVoter */
    const decision = await getDecision(decideState.decisionId);
    renderDecideVote(decision);
    showDecideStep("decideVote");
  } catch (err) {
    console.error("[NameSpark] handleFamilyNameSubmit:", err);
    showToast(t("err_network"));
    btn.disabled = false;
    btn.textContent = t("family_start_vote");
  }
}

/* ---- Votant : termine → remerciement.
   Le bouton "Voir le classement" n'est visible que pour le créateur. ---- */
/* Affiche le nudge email si le créateur n'a pas d'email enregistré. */
function _showEmailNudgeIfNeeded() {
  const nudge = document.getElementById("inviteEmailNudge");
  if (!nudge) return;
  if (currentUser?.email) { nudge.style.display = "none"; return; }

  nudge.style.display = "";
  const input = document.getElementById("inviteNudgeEmail");
  const saveBtn = document.getElementById("inviteNudgeSave");
  if (!input || !saveBtn) return;

  saveBtn.onclick = () => {
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.style.borderColor = "var(--error, #e74c3c)";
      return;
    }
    input.style.borderColor = "";
    if (!currentUser) {
      currentUser = { email, firstName: null, createdAt: new Date().toISOString() };
    } else {
      currentUser.email = email;
    }
    saveUser();
    registerLead(email, currentUser.firstName, favorites.size);
    /* Mettre à jour l'email du créateur dans Supabase (UPDATE, pas INSERT) */
    if (decideState?.participantId) {
      updateParticipantEmail(decideState.participantId, email);
    }
    nudge.innerHTML = `<p class="email-nudge-text" style="color:#27ae60;">✓ Email enregistré — vous recevrez les votes !</p>`;
    setTimeout(() => { nudge.style.display = "none"; }, 3000);
  };
}

/* Envoie un email au créateur quand un votant termine.
   Fire-and-forget : on ne bloque pas l'UX en cas d'erreur. */
async function _notifyCreatorOfVote() {
  try {
    const { decisionId, participantId } = decideState;
    /* Récupère le nom du votant depuis currentUser ou les participants */
    const decision = await getDecision(decisionId);
    const voterName = currentUser?.firstName
      || decision?.participants?.[participantId]?.name
      || (lang === "fr" ? "Quelqu'un" : "Someone");
    if (!decisionId) return;

    const myVotes = getVotes(decisionId)[participantId] || {};
    const yes   = Object.entries(myVotes).filter(([, r]) => r === "yes").map(([n]) => n);
    const maybe = Object.entries(myVotes).filter(([, r]) => r === "maybe").map(([n]) => n);
    const no    = Object.entries(myVotes).filter(([, r]) => r === "no").map(([n]) => n);

    await fetch("/api/notify-vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decisionId, voterName, votes: { yes, maybe, no } }),
    });
  } catch (_) {
    /* Silencieux — ne jamais bloquer l'UX pour un email */
  }
}

function finishFamilyVote() {
  const seeBtn = document.getElementById("familySeeResultsBtn");
  if (seeBtn) seeBtn.style.display = decideState.role === "creator" ? "" : "none";
  showDecideStep("familyThanks");
}

/* ---- Résultats famille : classement + détail (qui a voté quoi) ---- */
function renderFamilyResults() {
  if (decideState.role === "creator") generateFamilyLink();

  const rows = computeRanking(decideState.decisionId);
  const wrap = document.getElementById("familyRanking");
  const hasVotes = rows.some((r) => r.yes + r.maybe + r.no > 0);

  if (!hasVotes) {
    wrap.innerHTML = `<div class="results-empty" style="text-align:center;padding:36px;color:var(--ink-soft)">
      <div style="font-size:2rem;margin-bottom:10px">🗳️</div>
      <p>${t("family_no_votes")}</p>
    </div>`;
    return;
  }

  const medals = ["🥇", "🥈", "🥉"];
  const chipRow = (emoji, names) => names.length
    ? `<div class="fam-chip-row"><span class="fam-emoji">${emoji}</span>${names.map((n) => `<span class="fam-voter">${n}</span>`).join("")}</div>`
    : "";

  wrap.innerHTML = rows.map((r, i) => `
    <div class="fam-row${i === 0 ? " fam-row-top" : ""}">
      <div class="fam-row-head">
        <span class="fam-rank">${medals[i] || "#" + (i + 1)}</span>
        <span class="fam-name">${r.name}</span>
        <span class="fam-tally">${r.yes} ❤️ · ${r.maybe} 🤔 · ${r.no} ❌</span>
      </div>
      <div class="fam-voters">
        ${chipRow("❤️", r.voters.yes)}
        ${chipRow("🤔", r.voters.maybe)}
        ${chipRow("❌", r.voters.no)}
      </div>
    </div>`).join("");
}

/* ---- Démo : simule plusieurs votants famille (via storage) ---- */
async function simulateFamilyVotes() {
  const decision = await getDecision(decideState.decisionId);
  if (!decision || !decision.items.length) return;
  const demo = lang === "fr"
    ? ["Mamie", "Papa", "Léa", "Tonton"]
    : ["Grandma", "Dad", "Lea", "Uncle"];
  for (const nm of demo) {
    const pid = await addParticipant(decideState.decisionId, { role: "family", name: nm });
    for (const name of decision.items) {
      const r = ["yes", "yes", "maybe", "no"][Math.floor(Math.random() * 4)];
      await saveVote(decideState.decisionId, pid, name, r);
    }
  }
  renderFamilyResults();
}

/* =============================================================
   27) INIT
   ============================================================= */
document.addEventListener("DOMContentLoaded", () => {
  /* Risque 6 — masque les boutons "Simuler (démo)" en production.
     Activables via ?demo=1 dans l'URL (usage interne uniquement). */
  if (new URLSearchParams(location.search).get("demo") !== "1") {
    document.getElementById("simulatePartnerBtn")?.remove();
    document.getElementById("simulateFamilyBtn")?.remove();
  }

  // Switch FR / EN
  document.getElementById("langSwitch").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn) applyLang(btn.dataset.lang);
  });

  // Widget compact → ouvre Ma sélection
  document.getElementById("selSeeBtn").addEventListener("click", openSelection);
  // Widget compact → lance "Décider à deux" (avec gate email facultatif)
  document.getElementById("selDecideBtn").addEventListener("click", () => startVote("couple"));
  // Widget compact → lance "Vote famille"
  document.getElementById("selFamilyBtn").addEventListener("click", () => startVote("family"));

  // Comparateur + Sauvegarder + Mon espace
  initCompare();
  initSaveListeModal();
  initMonEspace();
  initFiltersToggle();

  loadFavorites();
  loadUser();                       // ← charge le profil utilisateur
  lastSurname = getSurname() || currentUser?.surname || "";
  const surnameInput = document.getElementById("surname");
  if (surnameInput && lastSurname) surnameInput.value = lastSurname;
  initNav();
  initSegments();
  initForm();
  initPopular();
  initSignification();
  renderFaq();
  animateTitle();
  initReveal();
  applyLang(getLang());             // langue persistée ; appelle updateEspaceButton()
  renderFavorites();

  /* Module "Décider ensemble" */
  wireDecideButtons();

  /* Liens de vote : ?invite= (couple) et ?familyVote= (famille) ont la priorité */
  const params       = new URLSearchParams(location.search);
  const inviteId     = params.get("invite");
  const familyVoteId = params.get("familyVote");
  const urlLang      = params.get("lang");
  if (inviteId || familyVoteId) {
    if (urlLang === "fr" || urlLang === "en") applyLang(urlLang);
    /* Risque 3 fix — loading screen + catch explicite */
    showLoadingScreen(t("loading_session"));
    const bootPromise = familyVoteId
      ? openFamilyVoteAsVoter(familyVoteId)
      : openDecideAsPartner(inviteId);
    bootPromise
      .catch(() => showToast(t("err_session_load")))
      .finally(() => hideLoadingScreen());
  } else {
    applyQueryPrefill();
  }
});

/* =============================================================
   25) PAGE « SIGNIFICATION D'UN PRÉNOM »
   - Recherche instantanée dans toute la base
   - Fiche détaillée (réutilise les données NAMES)
   - Deep-link SEO : #/prenom/<slug>  (slug = nom normalisé)
   ============================================================= */
function sigSlug(name) {
  return name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
             .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
let _sigIndex = null;      // [{ name, norm, slug, ref }]
let _sigBySlug = null;     // Map slug -> name
let currentSigName = null; // prénom actuellement affiché (pour re-render i18n)

function buildSigIndex() {
  if (_sigIndex) return;
  _sigIndex = [];
  _sigBySlug = new Map();
  const seen = new Set();
  for (const n of NAMES) {
    const key = n.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const norm = n.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const slug = sigSlug(n.name);
    _sigIndex.push({ name: n.name, norm, slug, ref: n });
    if (!_sigBySlug.has(slug)) _sigBySlug.set(slug, n.name);
  }
}

function sigSearch(q, limit = 8) {
  buildSigIndex();
  const nq = q.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  if (!nq) return [];
  const starts = [], contains = [];
  for (const e of _sigIndex) {
    if (e.norm.startsWith(nq)) starts.push(e);
    else if (e.norm.includes(nq)) contains.push(e);
    if (starts.length >= limit) break;
  }
  return starts.concat(contains).slice(0, limit);
}

function renderSigDetail(name) {
  const detail = document.getElementById("sigDetail");
  if (!detail) return;
  const n = NAMES.find((x) => x.name === name);
  if (!n) {
    detail.innerHTML = `<div class="sig-empty">${t("sig_not_found")} « ${name} ».</div>`;
    currentSigName = null;
    return;
  }
  currentSigName = name;
  const meaning = (n.meaning && (n.meaning[lang] || n.meaning.fr)) || "";
  const originLabel = (t("origins") || {})[n.origin] || n.origin;
  const styleLabels = (n.style || []).map((s) => (t("styles") || {})[s] || s).join(" · ");
  const genderLabel = n.gender === "boy" ? t("g_boy") : n.gender === "girl" ? t("g_girl") : t("g_mixte");
  const lengthLabel = t("l_" + n.length) || n.length;
  const tags = (n.meaningTags || []).map((tg) => `<span class="sig-tag">${t("m_" + tg) || tg}</span>`).join("");
  const variants = (n.variants && n.variants.length)
    ? `<div class="sig-row"><span class="k">${t("sig_variants")}</span><span class="v">${n.variants.join(", ")}</span></div>` : "";
  const pron = n.pronunciation
    ? `<div class="sig-row"><span class="k">${t("sig_pron")}</span><span class="v sig-pron">${n.pronunciation}</span></div>` : "";

  const similar = getSimilarDemo(name, 6);
  const similarHTML = similar.length ? `
    <div class="sig-similar">
      <h4>${t("sig_similar")}</h4>
      <div class="chips">
        ${similar.map((s) => `<button class="chip" data-sig-name="${s.name}">${s.name}</button>`).join("")}
      </div>
    </div>` : "";

  detail.innerHTML = `
    <article class="sig-card">
      <div class="sig-head">
        <h3>${n.name}</h3>
        <span class="sig-gender-badge ${n.gender}">${genderLabel}</span>
      </div>
      <p class="sig-meaning">« ${meaning} »</p>
      <div class="sig-rows">
        <div class="sig-row"><span class="k">${t("sig_origin")}</span><span class="v">${originLabel}</span></div>
        <div class="sig-row"><span class="k">${t("sig_style")}</span><span class="v">${styleLabels}</span></div>
        <div class="sig-row"><span class="k">${t("sig_length")}</span><span class="v">${lengthLabel}</span></div>
        <div class="sig-row"><span class="k">${t("sig_meaning")}</span><span class="v"><div class="sig-tags">${tags}</div></span></div>
        ${variants}
        ${pron}
      </div>
      <div class="sig-actions">
        <a class="btn btn-ghost" href="?origin=${n.origin}&gender=${n.gender}#generateur">${t("sig_open_generator")}</a>
        <button class="btn btn-ghost" data-sig-fav="${n.name}">${favorites.has(n.name) ? t("fav_remove") : t("fav_add_tip")}</button>
      </div>
      ${similarHTML}
    </article>`;

  detail.querySelectorAll("[data-sig-name]").forEach((b) =>
    b.addEventListener("click", () => selectSigName(b.getAttribute("data-sig-name"))));
  const favBtn = detail.querySelector("[data-sig-fav]");
  if (favBtn) favBtn.addEventListener("click", () => {
    const nm = favBtn.getAttribute("data-sig-fav");
    if (favorites.has(nm)) favorites.delete(nm); else favorites.add(nm);
    saveFavorites(); renderFavorites(); updateSelPanel();
    renderSigDetail(nm);
  });
}

function renderSigCurrent() { if (currentSigName) renderSigDetail(currentSigName); }

function selectSigName(name, opts = {}) {
  const input = document.getElementById("sigInput");
  const sug = document.getElementById("sigSuggest");
  if (input) input.value = name;
  if (sug) { sug.hidden = true; sug.innerHTML = ""; }
  renderSigDetail(name);
  const slug = sigSlug(name);
  if (location.hash !== "#/prenom/" + slug) {
    history.replaceState(null, "", "#/prenom/" + slug);
  }
  if (!opts.noScroll) {
    document.getElementById("signification")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function initSignification() {
  const input = document.getElementById("sigInput");
  const sug = document.getElementById("sigSuggest");
  if (!input || !sug) return;
  buildSigIndex();

  const showSuggest = () => {
    const q = input.value.trim();
    const res = sigSearch(q, 8);
    if (!res.length) { sug.hidden = true; sug.innerHTML = ""; return; }
    sug.innerHTML = res.map((e) => {
      const o = (t("origins") || {})[e.ref.origin] || e.ref.origin;
      const m = (e.ref.meaning && (e.ref.meaning[lang] || e.ref.meaning.fr)) || "";
      return `<li role="option" data-name="${e.name}"><span class="s-name">${e.name}</span><span class="s-meta">${o} — ${m}</span></li>`;
    }).join("");
    sug.hidden = false;
    sug.querySelectorAll("li").forEach((li) =>
      li.addEventListener("mousedown", (ev) => { ev.preventDefault(); selectSigName(li.getAttribute("data-name")); }));
  };

  input.addEventListener("input", showSuggest);
  input.addEventListener("focus", () => { if (input.value.trim()) showSuggest(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const res = sigSearch(input.value.trim(), 1);
      if (res.length) selectSigName(res[0].name);
    } else if (e.key === "Escape") { sug.hidden = true; }
  });
  document.addEventListener("click", (e) => {
    if (!sug.contains(e.target) && e.target !== input) sug.hidden = true;
  });

  // Deep-link : #/prenom/<slug>
  const routeFromHash = () => {
    const m = location.hash.match(/^#\/prenom\/(.+)$/);
    if (!m) return false;
    const name = _sigBySlug.get(decodeURIComponent(m[1]));
    if (name) { selectSigName(name, { noScroll: false }); return true; }
    return false;
  };
  window.addEventListener("hashchange", routeFromHash);
  routeFromHash();
}
