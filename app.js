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
    gen_searching_1: "Analyse de vos préférences…",
    gen_searching_2: "Recherche parmi nos prénoms…",
    gen_searching_2_deep: "On va un peu plus loin…",
    gen_error: "La génération n'a pas abouti. Vérifiez votre connexion.",
    gen_retry: "Réessayer",
    f_submit_loading: "Recherche…",
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
    fav_title: "Ma sélection",
    fav_sub: "Vos coups de cœur sauvegardés. Sauvegardez, comparez ou partagez votre sélection.",
    /* ---- sauvegarder ---- */
    save_btn: "📩 Sauvegarder ma liste",
    save_modal_title: "Sauvegarder ma liste",
    save_modal_desc: "Recevez votre sélection par email et retrouvez-la plus tard.",
    save_field_fname: "Votre prénom (optionnel)",
    save_newsletter_opt: "Recevoir aussi les tendances et idées chaque semaine",
    weeks_field_label: "Où en êtes-vous ? (optionnel)",
    weeks_field_hint:  "Facultatif. Utilisé uniquement pour afficher votre compte à rebours personnel — jamais partagé ni affiché publiquement.",
    weeks_opt_none:    "Je préfère ne pas dire",
    weeks_opt_week:    "Semaine {n}",
    weeks_opt_born:    "Bébé est déjà né",
    weeks_cd_left:     "Semaine {w} · plus que {n} semaines pour choisir",
    weeks_cd_last:     "Semaine {w} · plus qu'une semaine pour choisir",
    weeks_cd_soon:     "Semaine {w} · bébé peut arriver d'un jour à l'autre",
    weeks_cd_born:     "Félicitations ! Le plus beau des prénoms est choisi",
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
    /* ---- mon espace / ma sélection ---- */
    mon_espace: "Mon espace",
    bonjour: (n) => n ? `Bonjour ${n} 👋` : "Mon espace",
    create_space_title: "Sauvegardez votre sélection",
    create_space_desc: "Sauvegardez vos prénoms favoris, retrouvez-les plus tard et exportez-les en PDF.",
    create_space_btn: "Sauvegarder ma sélection",
    consent_text: `En continuant, vous acceptez nos <a href="/terms" target="_blank" rel="noopener">Conditions d'utilisation</a> et notre <a href="/privacy" target="_blank" rel="noopener">Politique de confidentialité</a>.`,
    auth_hint: "Déjà inscrit·e ? Entrez simplement votre email.",
    space_created: "✓ Votre espace est prêt !",
    space_welcome_back: (n) => n ? `Bon retour ${n} 👋` : "Bon retour !",
    /* ---- mode reconnexion (email déjà connu) ---- */
    login_title:   "Bon retour !",
    login_desc:    "Nous avons retrouvé votre espace. Entrez votre email pour y accéder.",
    login_btn:     "Accéder à mon espace",
    login_found:   "✓ Compte trouvé",
    /* ---- page sélection ---- */
    sel_see_btn: "Voir ma sélection",
    sel_page_eyebrow: "Ma sélection",
    sel_page_title: "Ma sélection de prénoms",
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
    save_space_desc: "Sauvegardez votre sélection pour retrouver vos prénoms favoris à tout moment et recevoir votre liste.",
    save_space_btn: "Sauvegarder ma sélection",
    save_space_confirm: "✓ Votre sélection a été sauvegardée.",
    /* ---- modal unlock (gate "Voir ma sélection") ---- */
    unlock_title: "Votre sélection est prête !",
    unlock_desc: "Sauvegardez votre sélection pour y accéder, la recevoir par email et la retrouver à tout moment.",
    unlock_benefits: [
      "Retrouvez vos prénoms favoris depuis n'importe quel appareil",
      "Recevez votre sélection complète par email",
      "Partagez facilement avec votre partenaire",
      "Téléchargez votre liste en PDF quand vous voulez"
    ],
    unlock_submit: "Accéder à ma sélection →",
    unlock_trust: "🔒 Gratuit • Sans engagement • Données protégées",
    drawer_selection_title: "Ma sélection",
    drawer_favs_title: "Mes favoris",
    drawer_no_favs: "Cliquez sur ❤️ pour ajouter des favoris.",
    drawer_surname_title: "Nom de famille",
    drawer_surname_ph: "Ajouter un nom de famille…",
    drawer_surname_save: "Enregistrer",
    drawer_surname_saved: "✓ Nom de famille enregistré.",
    drawer_votes_title: "Mes votes & invitations",
    drawer_votes_empty: "Aucun vote en cours.",
    drawer_vote_couple: "Vote couple",
    drawer_vote_family: "Vote famille",
    drawer_vote_resume: "Reprendre →",
    drawer_vote_names: (n) => `${n} prénom${n > 1 ? "s" : ""}`,
    drawer_history_title: "Historique",
    drawer_history_empty: "Lancez une génération pour voir l'historique.",
    drawer_history_from: "Depuis l'historique",
    drawer_compare_title: "Mes comparaisons",
    drawer_compare_empty: "Comparez des favoris pour les voir ici.",
    drawer_pdf_btn: "📄 Télécharger en PDF",
    drawer_email_btn: "📩 M'envoyer par email",
    drawer_compare_btn: "⚖️ Comparer mes favoris",
    drawer_connected: "Connecté·e",
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
    how_title: "Comment ça marche", how_sub: "Quatre étapes simples pour trouver le prénom parfait.",
    how_1_t: "Générez des prénoms",
    how_1_d: "Définissez vos envies — genre, origine, style, longueur. Cliquez sur Générer pour découvrir une sélection personnalisée avec la signification de chaque prénom.",
    how_2_t: "Likez vos coups de cœur ❤️",
    how_2_d: "Un prénom vous touche ? Cliquez sur ❤️ — il s'ajoute instantanément à votre sélection. Régénérez autant de fois que vous voulez : de nouveaux prénoms apparaissent à chaque fois.",
    how_3_t: "Consultez Ma sélection",
    how_3_d: "Retrouvez tous vos coups de cœur dans « Ma sélection ». Comparez-les, exportez-les en PDF ou ajoutez votre nom de famille pour visualiser le résultat final.",
    how_4_t: "Décidez ensemble",
    how_4_d: "Partagez votre sélection avec votre partenaire ou votre famille. Chacun vote en secret. NameSpark révèle les prénoms sur lesquels vous êtes vraiment d'accord.",
    pop_title: "Exemples de prénoms populaires", pop_sub: "Cliquez sur un prénom pour voir des idées similaires dans le générateur.",
    faq_title: "Questions fréquentes",
    /* ---- footer ---- */
    foot_tag: "Choisissez le prénom de votre bébé, ensemble.",
    foot_explore: "Explorer", foot_nav: "Navigation",
    foot_legal: "Légal", foot_legal_notice: "Mentions légales", foot_privacy: "Confidentialité", foot_terms: "Conditions d'utilisation",
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
    family_close_vote:    "🔒 Clôturer le vote",
    family_close_confirm: "Clôturer le vote ? Les votants ne pourront plus modifier leurs votes.",
    vote_closed_banner:   "🔒 Ce vote est terminé.",
    err_vote_closed:      "Ce vote est clôturé — vote non enregistré.",
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
    email_disposable:   "Cette adresse est temporaire. Utilisez votre vrai email.",
    email_no_mx:        "Ce domaine email n'existe pas. Vérifiez votre adresse.",
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
    heart_hint_title: (n) => `Tu as vu ${n} prénoms — lequel te plaît le plus ? 💛`,
    heart_hint_text: "Mets en favori tes préférés pour les retrouver et en discuter avec ton·ta partenaire ou ta famille",
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
    gen_searching_1: "Analysing your preferences…",
    gen_searching_2: "Searching our name collection…",
    gen_searching_2_deep: "Let's dig a little deeper…",
    gen_error: "The generation didn't go through. Check your connection.",
    gen_retry: "Try again",
    f_submit_loading: "Searching…",
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
    fav_title: "My selection",
    fav_sub: "Your saved picks. Save, compare or share your selection.",
    /* ---- save modal ---- */
    save_btn: "📩 Save my list",
    save_modal_title: "Save my list",
    save_modal_desc: "Receive your selection by email and find it again later.",
    save_field_fname: "Your first name (optional)",
    save_newsletter_opt: "Also send me weekly trends and ideas",
    weeks_field_label: "How far along are you? (optional)",
    weeks_field_hint:  "Optional. Used only to show your personal countdown — never shared or displayed publicly.",
    weeks_opt_none:    "I'd rather not say",
    weeks_opt_week:    "Week {n}",
    weeks_opt_born:    "Baby is already here",
    weeks_cd_left:     "Week {w} · {n} weeks left to choose",
    weeks_cd_last:     "Week {w} · one week left to choose",
    weeks_cd_soon:     "Week {w} · baby could arrive any day now",
    weeks_cd_born:     "Congratulations! The loveliest name has been chosen",
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
    /* ---- my space / my selection ---- */
    mon_espace: "My space",
    bonjour: (n) => n ? `Hello ${n} 👋` : "My space",
    create_space_title: "Save your selection",
    create_space_desc: "Save your favourite names, find them later and export them as PDF.",
    create_space_btn: "Save my selection",
    consent_text: `By continuing, you agree to our <a href="/terms" target="_blank" rel="noopener">Terms of Use</a> and our <a href="/privacy" target="_blank" rel="noopener">Privacy Policy</a>.`,
    auth_hint: "Already registered? Just enter your email.",
    space_created: "✓ Your space is ready!",
    space_welcome_back: (n) => n ? `Welcome back ${n} 👋` : "Welcome back!",
    /* ---- reconnect mode (existing email) ---- */
    login_title:   "Welcome back!",
    login_desc:    "We found your space. Enter your email to access it.",
    login_btn:     "Access my space",
    login_found:   "✓ Account found",
    /* ---- selection page ---- */
    sel_see_btn: "View my selection",
    sel_page_eyebrow: "My selection",
    sel_page_title: "My name selection",
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
    save_space_desc: "Save your selection to access your favourite names at any time and receive your list.",
    save_space_btn: "Save my selection",
    save_space_confirm: "✓ Your selection has been saved.",
    /* ---- unlock modal ---- */
    unlock_title: "Your selection is ready!",
    unlock_desc: "Save your selection to access it, receive your list by email and find it at any time.",
    unlock_benefits: [
      "Access your favourite names from any device",
      "Receive your full selection by email",
      "Share easily with your partner",
      "Download your list as PDF whenever you like"
    ],
    unlock_submit: "Access my selection →",
    unlock_trust: "🔒 Free • No commitment • Data protected",
    drawer_selection_title: "My selection",
    drawer_favs_title: "My favourites",
    drawer_no_favs: "Click ❤️ to add favourites.",
    drawer_surname_title: "Last name",
    drawer_surname_ph: "Add a last name…",
    drawer_surname_save: "Save",
    drawer_surname_saved: "✓ Last name saved.",
    drawer_votes_title: "My votes & invitations",
    drawer_votes_empty: "No active votes.",
    drawer_vote_couple: "Couple vote",
    drawer_vote_family: "Family vote",
    drawer_vote_resume: "Resume →",
    drawer_vote_names: (n) => `${n} name${n > 1 ? "s" : ""}`,
    drawer_history_title: "History",
    drawer_history_empty: "Run a generation to see history.",
    drawer_history_from: "From history",
    drawer_compare_title: "My comparisons",
    drawer_compare_empty: "Compare favourites to see them here.",
    drawer_pdf_btn: "📄 Download as PDF",
    drawer_email_btn: "📩 Send by email",
    drawer_compare_btn: "⚖️ Compare favourites",
    drawer_connected: "Connected",
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
    how_title: "How it works", how_sub: "Four simple steps to find the perfect name.",
    how_1_t: "Generate names",
    how_1_d: "Set your preferences — gender, origin, style, length. Click Generate to get a personalised selection with the meaning of each name.",
    how_2_t: "Like your favourites ❤️",
    how_2_d: "Love a name? Click ❤️ — it's added to your selection instantly. Generate again as many times as you like: new names appear every time.",
    how_3_t: "Browse My Selection",
    how_3_d: "Find all your favourites in 'My Selection'. Compare them side by side, export as PDF, or add your last name to see the full picture.",
    how_4_t: "Decide together",
    how_4_d: "Share your selection with your partner or family. Everyone votes in secret. NameSpark reveals the names you truly agree on.",
    pop_title: "Popular name examples", pop_sub: "Click a name to see similar ideas in the generator.",
    faq_title: "Frequently asked questions",
    foot_tag: "Choose your baby's name, together.",
    foot_explore: "Explore", foot_nav: "Navigation",
    foot_legal: "Legal", foot_legal_notice: "Legal notice", foot_privacy: "Privacy", foot_terms: "Terms of use",
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
    family_close_vote:    "🔒 Close vote",
    family_close_confirm: "Close the vote? Voters will no longer be able to change their votes.",
    vote_closed_banner:   "🔒 This vote is closed.",
    err_vote_closed:      "This vote is closed — vote not saved.",
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
    email_disposable:   "This is a temporary email. Please use your real email address.",
    email_no_mx:        "This email domain doesn't exist. Please check your address.",
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
    heart_hint_title: (n) => `You've seen ${n} names — which one do you like best? 💛`,
    heart_hint_text: "Add your favourites to find them again and discuss them with your partner or family",
    origins: { hebreu: "Hebrew", francais: "French", anglais: "English", arabe: "Arabic", italien: "Italian", espagnol: "Spanish", grec: "Greek", latin: "Latin", nordique: "Nordic", irlandais: "Irish", japonais: "Japanese", slave: "Slavic", sanskrit: "Sanskrit", persan: "Persian", africain: "African", portugais: "Portuguese", coreen: "Korean", chinois: "Chinese", gallois: "Welsh", basque: "Basque", armenien: "Armenian", georgien: "Georgian" },
    styles: { classique: "Classic", moderne: "Modern", rare: "Rare", elegant: "Elegant", court: "Short", poetique: "Poetic" }
  }
};

/* =============================================================
   FAQ
   ============================================================= */
const FAQ_DATA = {
  fr: [
    {
      q: "Par où commencer ?",
      a: "C'est immédiat : cliquez sur <strong>Générer des prénoms</strong>, parcourez les résultats et cliquez sur le ❤️ dès qu'un prénom vous plaît. Vos coups de cœur s'accumulent dans <strong>Ma sélection</strong>. Régénérez autant de fois que vous voulez — de nouveaux prénoms apparaissent à chaque fois. Quand votre liste est prête, partagez-la pour voter en couple ou en famille."
    },
    {
      q: "NameSpark Baby est-il gratuit ?",
      a: "Oui, entièrement gratuit. Le générateur, les favoris, la recherche par signification, le vote en couple, le vote famille et l'export PDF sont tous accessibles sans abonnement ni carte bancaire. Vous pouvez créer un espace personnel (email facultatif) pour retrouver vos favoris d'une session à l'autre, depuis n'importe quel appareil."
    },
    {
      q: "En quoi NameSpark Baby est-il différent de ChatGPT ?",
      a: "ChatGPT vous produit une liste statique de prénoms. NameSpark Baby vous accompagne dans <strong>la décision</strong> : vous générez, vous likez, vous comparez, et vous invitez votre partenaire ou votre famille à voter en secret sur votre sélection. L'outil révèle ensuite les prénoms sur lesquels vous êtes vraiment d'accord, sans vous être influencés mutuellement. C'est un outil de décision partagée, pas juste une recherche."
    },
    {
      q: "Comment fonctionne le vote en couple ?",
      a: "1. Générez des prénoms et cliquez sur ❤️ pour remplir votre sélection.<br>2. Ouvrez <strong>Ma sélection</strong> et cliquez sur « Décider à deux ».<br>3. Un lien unique est créé — envoyez-le à votre partenaire.<br>4. Chacun vote en secret : ❤️ j'adore, ? peut-être, ✗ non.<br>5. NameSpark vous révèle les prénoms que vous avez tous les deux adorés."
    },
    {
      q: "Comment fonctionne le vote famille ?",
      a: "Même principe que le vote couple, mais ouvert à tous les proches. Depuis <strong>Ma sélection</strong>, choisissez « Décider en famille » et partagez le lien. Chaque participant vote juste avec son prénom, sans créer de compte. Vous suivez le classement en temps réel — qui a voté quoi, pour chaque prénom."
    },
    {
      q: "Comment fonctionne le score de compatibilité ?",
      a: "Renseignez votre nom de famille dans le générateur. Chaque prénom reçoit un score de 1 à 10 estimant la fluidité de la combinaison : longueur totale, équilibre syllabique, enchaînement sonore. C'est une aide indicative — pas une règle absolue — pour repérer les combinaisons naturellement harmonieuses."
    },
    {
      q: "Mes favoris sont-ils sauvegardés si je ferme l'onglet ?",
      a: "Oui. Vos favoris sont sauvegardés automatiquement dans votre navigateur et restent disponibles à la prochaine visite. Pour les retrouver sur un autre appareil ou les partager, créez un espace personnel en laissant votre email — c'est gratuit et facultatif. Aucune donnée n'est vendue ni partagée avec des tiers."
    }
  ],
  en: [
    {
      q: "Where do I start?",
      a: "It's instant: click <strong>Generate names</strong>, browse the results and click ❤️ on any name you like. Your favourites build up in <strong>My Selection</strong>. Generate as many times as you want — new names appear every time. When your list is ready, share it to vote as a couple or with family."
    },
    {
      q: "Is NameSpark Baby free?",
      a: "Yes, completely free. The generator, favourites, meaning search, couple vote, family vote and PDF export are all available without a subscription or credit card. You can create a personal space (email optional) to find your favourites across sessions and devices."
    },
    {
      q: "How is NameSpark Baby different from ChatGPT?",
      a: "ChatGPT produces a static list of names. NameSpark Baby guides you through <strong>the decision</strong>: you generate, you like, you compare, and you invite your partner or family to vote in secret on your selection. The tool then reveals the names you truly agree on — without having influenced each other. It's a shared decision tool, not just a search."
    },
    {
      q: "How does the couple vote work?",
      a: "1. Generate names and click ❤️ to build your selection.<br>2. Open <strong>My Selection</strong> and click 'Decide together'.<br>3. A unique link is created — send it to your partner.<br>4. Each of you votes in secret: ❤️ love it, ? maybe, ✗ no.<br>5. NameSpark reveals the names you both loved."
    },
    {
      q: "How does the family vote work?",
      a: "Same principle as the couple vote, but open to everyone. From <strong>My Selection</strong>, choose 'Decide with family' and share the link. Each participant votes with just their first name — no account needed. You follow the real-time ranking: who voted what, for each name."
    },
    {
      q: "How does the compatibility score work?",
      a: "Enter your last name in the generator. Each first name gets a score from 1 to 10 estimating how well the combination flows: total length, syllable balance, sound transition. It's a helpful guide — not a hard rule — for spotting naturally harmonious combinations."
    },
    {
      q: "Are my favourites saved if I close the tab?",
      a: "Yes. Your favourites are automatically saved in your browser and will be there on your next visit. To access them on another device or share them, create a personal space by leaving your email — it's free and optional. No data is sold or shared with third parties."
    }
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
let _authMode     = "unknown"; /* "unknown" | "existing" | "new" — détection email en temps réel */
let _authEmailTimer = null;   /* debounce pour la détection email */
let _genShown   = new Set(); /* prénoms déjà affichés dans la session filtre courante */
let _genFilSig  = "";        /* signature JSON des filtres de la dernière génération */
let _genDepth   = 0;         /* nombre de générations successives sur la même recherche */
let _genInProgress = false;  /* garde contre le double-clic pendant l'état de recherche */

/* =============================================================
   CACHE DE PRÉNOMS
   -------------------------------------------------------------
   L'app ne stocke que des CHAÎNES de prénoms (favoris, historique,
   votes, liens de partage). Pour les afficher, il faut retrouver
   l'objet complet. Historiquement c'était NAMES.find(...) sur la base
   chargée dans le navigateur ; ce cache est l'indirection qui permet
   de basculer cette source vers /api/names sans toucher aux 12
   endroits qui en dépendent.

   Tant que data.js est chargé, le cache est intégralement pré-rempli
   au démarrage : aucun appel réseau, comportement inchangé.
   ============================================================= */
const _nameCache = new Map();

function cacheNames(list) {
  if (!Array.isArray(list)) return;
  for (const n of list) if (n && n.name && !_nameCache.has(n.name)) _nameCache.set(n.name, n);
}
function nameFromCache(name) { return _nameCache.get(name) || null; }
function namesFromCache(list) { return (list || []).map((n) => _nameCache.get(n)).filter(Boolean); }

/* Récupère du serveur les prénoms absents du cache, par lots.
   Renvoie false si l'API a échoué — l'appelant affiche alors un état
   d'erreur plutôt que du contenu incomplet. */
async function ensureNames(list, opts = {}) {
  const missing = [...new Set((list || []).filter(
    (n) => typeof n === "string" && n && !_nameCache.has(n)))];
  if (!missing.length) return true;
  try {
    for (let i = 0; i < missing.length; i += 300) {
      const res = await fetch("/api/names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names: missing.slice(i, i + 300), detail: !!opts.detail }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      cacheNames(data.names);
    }
    return true;
  } catch { return false; }
}
let _heartHintShown    = false; /* popup incitation favoris — une seule fois par session */
let _heartHintSeenCount = 0;   /* nb de cartes vues sans favori */

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

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const val = I18N[lang][el.getAttribute("data-i18n-html")];
    if (typeof val === "string") el.innerHTML = val;
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
/* Retourne une clé courte représentant la combinaison de filtres actifs */
function filterSignature(f) {
  return JSON.stringify([f.gender||"", f.origin||"", f.letter||"",
                         f.style||"",  f.meaning||"", f.length||""]);
}

/* =============================================================
   Ranking progressif par popularité/établissement
   -------------------------------------------------------------
   popularityTier (calculé hors-ligne dans data.js, voir
   tools/compute-popularity-tiers.js) : "classic" | "established" |
   "rare" | "very_rare" | "unknown_popularity".
   "unknown_popularity" signifie uniquement "pas encore de donnée de
   fréquence fiable" — ce n'est jamais interprété comme rare/bizarre.
   La distribution ci-dessous détermine la part de chaque tier selon
   la profondeur de génération sur une même recherche (_genDepth).
   ============================================================= */
const TIER_ORDER = ["classic", "established", "rare", "very_rare", "unknown_popularity"];
const TIER_DISTRIBUTION = {
  0: { classic: 58, established: 34, rare: 5,  very_rare: 0,  unknown_popularity: 3  },
  1: { classic: 37, established: 37, rare: 16, very_rare: 2,  unknown_popularity: 8  },
  2: { classic: 17, established: 30, rare: 30, very_rare: 8,  unknown_popularity: 15 },
  3: { classic: 8,  established: 21, rare: 33, very_rare: 20, unknown_popularity: 18 },
};

function pickProgressive(pool, limit, depth) {
  const d = Math.min(Math.max(depth, 0), 3);
  const dist = TIER_DISTRIBUTION[d];

  const buckets = {};
  TIER_ORDER.forEach((t) => (buckets[t] = []));
  pool.forEach((s) => {
    const tier = TIER_ORDER.includes(s.n.popularityTier) ? s.n.popularityTier : "unknown_popularity";
    buckets[tier].push(s);
  });

  const picked = [];
  /* 1ère passe : jusqu'au quota cible de chaque tier (clampé pour ne
     jamais dépasser `limit` malgré les arrondis indépendants) */
  TIER_ORDER.forEach((t) => {
    const target = Math.min(Math.round((dist[t] / 100) * limit), limit - picked.length);
    picked.push(...buckets[t].splice(0, target));
  });
  /* 2e passe : un tier trop petit pour son quota -> on comble avec les
     tiers voisins (dans l'ordre classic -> ... -> unknown_popularity)
     plutôt que de renvoyer moins de résultats que demandé. */
  let deficit = limit - picked.length;
  if (deficit > 0) {
    for (const t of TIER_ORDER) {
      if (deficit <= 0) break;
      const take = Math.min(deficit, buckets[t].length);
      if (take > 0) picked.push(...buckets[t].splice(0, take));
      deficit -= take;
    }
  }
  /* mélange léger pour ne pas afficher les tiers groupés visuellement */
  for (let i = picked.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picked[i], picked[j]] = [picked[j], picked[i]];
  }
  return picked.map((s) => s.n);
}

/* ⚠️ generateDemo / getSimilarDemo ne sont PLUS appelés par l'interface :
   la génération se fait côté serveur (/api/generate). Ils sont conservés
   ici comme IMPLÉMENTATION DE RÉFÉRENCE — tools/parity-check.js les
   extrait de ce fichier et vérifie que api/_ranking.js produit
   exactement les mêmes résultats, à graine aléatoire égale. Les
   supprimer ferait sauter ce filet de sécurité. Ils s'exécutent en Node
   avec data.js chargé par le harnais, pas dans le navigateur. */
function generateDemo(f, limit = 20, exclude = null, depth = 0) {
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

  let pool = scored
    .filter((s) => !s.hardFail && !(exclude && exclude.has(s.n.name)))
    .sort((a, b) => b.score - a.score);
  pool = shuffleByScore(pool);

  /* Le filtre explicite "style = rare" doit basculer immédiatement vers
     une distribution orientée rare/very_rare, sans forcer l'utilisateur
     à traverser classic/established d'abord. */
  const effectiveDepth = f.style === "rare" ? Math.max(depth, 2) : depth;
  return pickProgressive(pool, limit, effectiveDepth);
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
      if (nowFaved) { _dismissHeartHint(); window.plausible?.("Favori ajouté"); }

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
    btn.addEventListener("click", async () => {
      const name = btn.dataset.similar;
      const similar = await fetchSimilar(name);
      if (!similar.length) return;
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

  /* Compteur de cartes vues — déclenche l'incitation favoris après 5 cartes sans cœur */
  if (!_heartHintShown) {
    const hintObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        hintObs.unobserve(entry.target);
        if (_heartHintShown || favorites.size > 0) return;
        _heartHintSeenCount++;
        if (_heartHintSeenCount >= 5) _showHeartHint(_heartHintSeenCount);
      });
    }, { threshold: 0.3 });
    wrap.querySelectorAll(".name-card").forEach((c) => hintObs.observe(c));
  }
}

/* =============================================================
   13) FORMULAIRE
   ============================================================= */
/* État de recherche : ~1.6s, deux phases de texte, pas de blocage réel —
   c'est un temps d'anticipation, la génération elle-même est instantanée
   (pas d'IA, pas d'appel réseau : filtrage + tri local sur data.js). */
const SEARCHING_PHASE_MS = 800;

function showSearchingState(deep = false) {
  const wrap = document.getElementById("results");
  wrap.innerHTML = `
    <div class="searching">
      <span class="spark-loader" aria-hidden="true">✶</span>
      <p id="searchingText">${t("gen_searching_1")}</p>
    </div>`;
  const textEl = document.getElementById("searchingText");
  const swapTimer = setTimeout(() => {
    if (textEl.isConnected) textEl.textContent = t(deep ? "gen_searching_2_deep" : "gen_searching_2");
  }, SEARCHING_PHASE_MS);
  return () => clearTimeout(swapTimer); /* annule le swap si les résultats arrivent avant */
}

/* Prénoms similaires via /api/names (mode hydrate). Alimente le cache
   au passage. Renvoie [] si l'API échoue — l'appelant n'affiche alors
   rien plutôt que des résultats inventés. */
async function fetchSimilar(name) {
  try {
    const res = await fetch("/api/names", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ names: [name], detail: true, similarFor: name }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    cacheNames(data.names);
    cacheNames(data.similar);
    return Array.isArray(data.similar) ? data.similar : [];
  } catch { return []; }
}

/* Appelle /api/generate. Renvoie { names, reset } ou null en cas
   d'échec (réseau, 4xx/5xx, JSON invalide) — jamais de résultat
   partiel ou inventé. */
async function fetchGenerate(f, depth, exclude) {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filters: {
          gender: f.gender || "", origin: f.origin || "", style: f.style || "",
          meaning: f.meaning || "", length: f.length || "", letter: f.letter || "",
        },
        depth,
        exclude,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data && Array.isArray(data.names) ? data : null;
  } catch { return null; }
}

/* État d'erreur du générateur : honnête, et réessayable en un clic.
   Pas de repli sur une base locale — on ne veut pas de résultats
   différents de ceux du serveur sans le dire. */
function renderGeneratorError(onRetry) {
  const wrap = document.getElementById("results");
  if (!wrap) return;
  wrap.innerHTML = `
    <div class="searching">
      <p>${t("gen_error")}</p>
      <button class="btn btn-ghost" id="genRetryBtn" type="button">${t("gen_retry")}</button>
    </div>`;
  document.getElementById("genRetryBtn")?.addEventListener("click", onRetry, { once: true });
}

function initForm() {
  const form = document.getElementById("genForm");
  const submitBtn = form.querySelector('[type="submit"]');

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (_genInProgress) return; /* anti double-clic / double-soumission */
    _genInProgress = true;

    const origBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = t("f_submit_loading");

    const f = readFilters();
    lastSurname = f.surname;
    /* ── Génération progressive : on exclut les noms déjà montrés et on
       augmente la profondeur tant que la recherche (signature de filtres)
       reste la même ── */
    const sig = filterSignature(f);
    let nextDepth;
    if (sig !== _genFilSig) {
      /* Les filtres ont changé → on repart de zéro */
      _genShown  = new Set();
      _genFilSig = sig;
      _genDepth  = 0;
      nextDepth  = 0;
    } else {
      nextDepth = Math.min(_genDepth + 1, 3);
    }
    /* La profondeur n'est validée qu'en cas de succès : une tentative
       échouée ne doit pas faire progresser la recherche vers les
       prénoms rares sans avoir rien montré. */
    const effectiveDepth = f.style === "rare" ? Math.max(nextDepth, 2) : nextDepth;

    const cancelSwap = showSearchingState(effectiveDepth >= 2);

    /* L'appel réseau part IMMÉDIATEMENT, en parallèle du délai
       d'anticipation de ~1,6 s déjà présent. On attend ensuite les deux :
       tant que la fonction est chaude (~0,35 s), la latence est
       intégralement absorbée par ce délai et rien ne change pour
       l'utilisateur. */
    const apiCall = fetchGenerate(f, effectiveDepth, [..._genShown]);
    const minDelay = new Promise((r) => setTimeout(r, SEARCHING_PHASE_MS * 2));

    Promise.all([apiCall, minDelay]).then(([payload]) => {
      cancelSwap();

      const finish = () => {
        submitBtn.disabled = false;
        submitBtn.textContent = origBtnText;
        _genInProgress = false;
      };

      /* Échec de l'API : message propre + bouton Réessayer. On ne
         dégrade pas silencieusement et on ne perd pas l'état de session. */
      if (!payload) {
        renderGeneratorError(() => form.requestSubmit());
        finish();
        return;
      }

      const results = payload.names || [];
      cacheNames(results);
      _genDepth = nextDepth; /* succès → la profondeur progresse */

      /* Pool épuisé : le serveur a déjà régénéré sans exclusion et nous
         le signale. Même comportement visible qu'avant (remise à zéro
         des vus + toast), mais en un seul aller-retour. */
      if (payload.reset) {
        _genShown  = new Set();
        _genFilSig = sig;
        _genDepth  = 0;
        showToast(lang === "fr"
          ? "Vous avez vu tous les prénoms correspondants — on recommence !"
          : "You've seen all matching names — starting over!");
      }

      results.forEach((n) => _genShown.add(n.name));

      renderResults(results, t("res_title"));
      addToHistory(f, results);            // ← sauvegarde dans l'historique
      window.plausible?.("Génération", { props: { genre: f.gender || "tous", origine: f.origin || "toutes" } });
      if (favorites.size > 0) renderFavorites();
      updateSelPanel();

      document.querySelector(".results-head")?.scrollIntoView({ behavior: "smooth", block: "start" });

      finish();
    });
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
    chip.addEventListener("click", async () => {
      const name = chip.dataset.pop;
      const similar = await fetchSimilar(name);
      if (!similar.length) return;
      renderResults(similar, t("similar_title")(name));
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
      .map((n) => nameFromCache(n))
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
    .map((name) => nameFromCache(name))
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
function shareSelection(anchor) {
  if (favorites.size === 0) { showToast(t("share_no_fav")); return; }

  const url = new URL(window.location.href);
  url.searchParams.delete("share");
  url.searchParams.delete("surname");
  url.searchParams.delete("lang");
  url.searchParams.set("share", [...favorites].join(","));
  if (lastSurname) url.searchParams.set("surname", lastSurname);
  url.searchParams.set("lang", lang);
  url.hash = "";

  shareLink(url.toString(), t("share_selection_text"), anchor instanceof HTMLElement ? anchor : undefined);
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

/* Menu de partage desktop (WhatsApp / Email / Copier) — affiché quand
   navigator.share n'existe pas (= ordinateur). Positionné sous le bouton. */
function showShareMenu(url, text, anchor) {
  document.querySelector(".share-menu")?.remove();
  const menu = document.createElement("div");
  menu.className = "share-menu";
  menu.innerHTML = `
    <button type="button" data-sm="whatsapp"><span>💬</span> WhatsApp</button>
    <button type="button" data-sm="email"><span>✉️</span> Email</button>
    <button type="button" data-sm="copy"><span>📋</span> ${t("copy_link_btn").replace(/^[^\w]+\s*/, "")}</button>`;
  document.body.appendChild(menu);

  const r = anchor.getBoundingClientRect();
  menu.style.top  = `${Math.min(r.bottom + 8, window.innerHeight - menu.offsetHeight - 8)}px`;
  menu.style.left = `${Math.max(8, Math.min(r.left, window.innerWidth - menu.offsetWidth - 8))}px`;

  const close = () => menu.remove();
  menu.querySelector('[data-sm="whatsapp"]').onclick = () => { _shareWhatsApp(url, text); close(); window.plausible?.("Lien partagé", { props: { type: "whatsapp" } }); };
  menu.querySelector('[data-sm="email"]').onclick    = () => { _shareEmail(url, t("share_invite_text"), text); close(); window.plausible?.("Lien partagé", { props: { type: "email" } }); };
  menu.querySelector('[data-sm="copy"]').onclick     = () => { _copyToClipboard(url); close(); };

  setTimeout(() => {
    const onDoc = (e) => { if (!menu.contains(e.target) && e.target !== anchor) { close(); document.removeEventListener("click", onDoc); } };
    document.addEventListener("click", onDoc);
  }, 50);
}

/* Partage : feuille native sur mobile, menu (WhatsApp/Email/Copier) sur desktop,
   fallback clipboard si aucun ancrage fourni. */
async function shareLink(url, text, anchor) {
  if (navigator.share) {
    try {
      await navigator.share({ title: "NameSpark Baby", text, url });
      window.plausible?.("Lien partagé", { props: { type: "natif" } });
    } catch (e) {
      /* AbortError = l'utilisateur a annulé le sélecteur — pas une erreur */
      if (e.name !== "AbortError") await _copyToClipboard(url);
    }
  } else if (anchor) {
    showShareMenu(url, text, anchor);
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

function _showHeartHint(count) {
  if (_heartHintShown) return;
  _heartHintShown = true;
  const el = document.getElementById("heartHint");
  if (!el) return;
  document.getElementById("heartHintTitle").textContent = t("heart_hint_title")(count);
  document.getElementById("heartHintText").textContent  = t("heart_hint_text");
  el.classList.add("show");
}

function _dismissHeartHint() {
  document.getElementById("heartHint")?.classList.remove("show");
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
      if (trimmed && nameFromCache(trimmed)) favorites.add(trimmed);
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

  const results = generateDemo(readFilters(), 20);
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
  syncWeeksSelectValue();
  // Ouvre la modale
  document.getElementById("saveListeModal").classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("saveListeEmail").focus(), 240);
}

function closeSaveListeModal() {
  document.getElementById("saveListeModal").classList.remove("open");
  document.body.style.overflow = "";
}

/* =============================================================
   SUIVI DE GROSSESSE — compte à rebours « temps restant pour choisir »
   -------------------------------------------------------------
   On stocke la semaine déclarée ET la date de déclaration, pas un
   simple nombre : la semaine avance toute seule d'une visite à
   l'autre, donc le compte à rebours reste juste sans que la
   personne ait à le mettre à jour.
   Valeur spéciale : "born" (bébé déjà né).
   ============================================================= */
const TERM_WEEKS = 40;               /* terme de référence */
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

/* Lecture/écriture via storage.js (getPregnancy/savePregnancy) — pas d'accès
   localStorage direct ici, comme pour le reste des données de l'app. */

/* Semaine actuelle = semaine déclarée + semaines écoulées depuis. */
function currentPregnancyWeek() {
  const p = getPregnancy();
  if (!p || !p.week) return null;
  if (p.week === "born") return "born";
  const declared = parseInt(p.week, 10);
  if (!Number.isFinite(declared)) return null;
  const elapsed = Math.floor((Date.now() - new Date(p.declaredAt).getTime()) / MS_PER_WEEK);
  const week = declared + Math.max(0, elapsed);
  return week > TERM_WEEKS + 2 ? "born" : week;
}

function populateWeeksSelect() {
  const sel = document.getElementById("saveListeWeeks");
  if (!sel || sel.dataset.filled === "1") return;
  const frag = document.createDocumentFragment();
  for (let w = 4; w <= TERM_WEEKS; w++) {
    const o = document.createElement("option");
    o.value = String(w);
    o.textContent = t("weeks_opt_week").replace("{n}", w);
    frag.appendChild(o);
  }
  const born = document.createElement("option");
  born.value = "born";
  born.textContent = t("weeks_opt_born");
  frag.appendChild(born);
  sel.appendChild(frag);
  sel.dataset.filled = "1";
  syncWeeksSelectValue();
}

/* Aligne le select sur la semaine CALCULEE (pas la valeur brute declaree) :
   sans ca, rouvrir le formulaire des semaines plus tard puis valider sans
   toucher au champ ecraserait la date de declaration et ferait reculer
   le compte a rebours. Appelee a chaque ouverture de la modale. */
function syncWeeksSelectValue() {
  const sel = document.getElementById("saveListeWeeks");
  if (!sel) return;
  const week = currentPregnancyWeek();
  sel.value = week === null ? "" : String(week);
}

function renderPregnancyCountdown() {
  const el = document.getElementById("pregnancyCountdown");
  if (!el) return;
  const week = currentPregnancyWeek();
  if (week === null) { el.hidden = true; el.textContent = ""; return; }

  let msg;
  if (week === "born") {
    msg = t("weeks_cd_born");
  } else {
    const left = TERM_WEEKS - week;
    if (left <= 0)      msg = t("weeks_cd_soon").replace("{w}", week);
    else if (left === 1) msg = t("weeks_cd_last").replace("{w}", week);
    else                 msg = t("weeks_cd_left").replace("{w}", week).replace("{n}", left);
  }
  el.textContent = msg;
  el.hidden = false;
}

async function handleSaveListeSubmit(e) {
  e.preventDefault();
  const email     = document.getElementById("saveListeEmail").value.trim();
  const firstName = document.getElementById("saveListeFirstName").value.trim();
  const weeks     = document.getElementById("saveListeWeeks")?.value || "";
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
    savePregnancy(weeks);
    renderPregnancyCountdown();
    await fetch("/api/save-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, firstName, names: [...favorites], lang, weeks: weeks || null }),
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
  populateWeeksSelect();
  renderPregnancyCountdown();
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
  clearAdminSession(); // ← effacer aussi la session admin, sinon elle persiste après déconnexion
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

  /* ── En-tête profil ── */
  const initial = (currentUser.firstName || currentUser.email)[0].toUpperCase();
  document.getElementById("drawerAvatar").textContent = initial;
  const greetFn = t("bonjour");
  document.getElementById("drawerGreeting").textContent =
    typeof greetFn === "function" ? greetFn(currentUser.firstName) : "Mon espace";
  document.getElementById("drawerUserEmail").textContent = currentUser.email || "";

  const favList     = namesFromCache([...favorites]);
  const history     = loadHistory();
  const comparisons = loadComparisons();
  const allDecisions = (typeof getAllDecisions === "function") ? getAllDecisions() : [];
  let html = "";

  /* ══════════════════════════════════════════════════
     SECTION 1 — Ma sélection
  ══════════════════════════════════════════════════ */
  html += `<div class="drawer-section">
    <div class="drawer-section-label">
      ${t("drawer_selection_title")}
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
  /* Nom de famille inline dans la section sélection */
  const snVal = lastSurname || currentUser.surname || "";
  html += `<div style="margin-top:12px;">
    <div class="drawer-section-label" style="margin-bottom:8px;">${t("drawer_surname_title")}</div>
    <div class="drawer-surname-row">
      <input type="text" id="drawerSurnameInput" value="${snVal}"
             placeholder="${t("drawer_surname_ph")}" />
      <button id="drawerSurnameBtn">${t("drawer_surname_save")}</button>
    </div>
  </div>`;
  html += `</div>`;

  /* ══════════════════════════════════════════════════
     SECTION 2 — Mes votes & invitations
  ══════════════════════════════════════════════════ */
  html += `<div class="drawer-section">
    <div class="drawer-section-label">${t("drawer_votes_title")}</div>`;

  if (!allDecisions.length) {
    html += `<p class="drawer-empty">${t("drawer_votes_empty")}</p>`;
  } else {
    html += allDecisions.slice(0, 5).map((dec) => {
      const modeLabel  = dec.mode === "family" ? t("drawer_vote_family") : t("drawer_vote_couple");
      const nameCount  = Array.isArray(dec.items) ? dec.items.length : 0;
      const participants = dec.participants ? Object.values(dec.participants) : [];
      const voterCount = participants.filter((p) => p.role !== "creator").length;
      const nameFn     = t("drawer_vote_names");
      const nameStr    = typeof nameFn === "function" ? nameFn(nameCount) : `${nameCount} prénoms`;
      const isCurrent  = decideState.decisionId === dec.id;
      return `<div class="drawer-vote-card ${isCurrent ? "drawer-vote-active" : ""}" data-dec="${dec.id}">
        <div class="drawer-vote-meta">
          <span class="drawer-vote-mode">${modeLabel}</span>
          <span class="drawer-vote-info">${nameStr} · ${voterCount} votant${voterCount > 1 ? "s" : ""}</span>
        </div>
        <div class="drawer-vote-date">${formatDate(dec.createdAt)}</div>
        <button class="drawer-vote-resume" data-resume="${dec.id}">${t("drawer_vote_resume")}</button>
      </div>`;
    }).join("");
  }
  html += `</div>`;

  /* ══════════════════════════════════════════════════
     SECTION 3 — Historique des générations
  ══════════════════════════════════════════════════ */
  html += `<div class="drawer-section">
    <div class="drawer-section-label">${t("drawer_history_title")}</div>`;
  if (!history.length) {
    html += `<p class="drawer-empty">${t("drawer_history_empty")}</p>`;
  } else {
    html += history.slice(0, 5).map((entry, i) => `
      <div class="drawer-hist-item" data-hist="${i}">
        <div class="drawer-hist-date">${formatDate(entry.date)}</div>
        <div class="drawer-hist-filters">${formatFilters(entry.filters)}</div>
        <div class="drawer-hist-names">${entry.results.slice(0, 4).join(", ")}${entry.results.length > 4 ? "…" : ""}</div>
      </div>`).join("");
  }
  html += `</div>`;

  /* Aucun lien admin dans l'espace utilisateur : le panneau admin est volontairement
     ABSENT du drawer « Mon espace » pour rester totalement invisible aux utilisateurs.
     L'accès admin se fait uniquement via /admin.html (login serveur /api/admin-login). */

  document.getElementById("drawerBody").innerHTML = html;

  /* ── Événements ── */
  if (favList.length) {
    document.getElementById("dPdfBtn").addEventListener("click", () => { exportPDF(); closeEspace(); });
    document.getElementById("dEmailBtn").addEventListener("click", sendEmailFromEspace);
    document.getElementById("dCmpBtn").addEventListener("click", () => { closeEspace(); openCompare(); });
  }
  document.getElementById("drawerSurnameBtn")?.addEventListener("click", saveDrawerSurname);
  document.querySelectorAll("[data-hist]").forEach((el) => {
    el.addEventListener("click", () => loadHistoryEntry(history[+el.dataset.hist]));
  });
  document.querySelectorAll("[data-resume]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const decId = el.dataset.resume;
      closeEspace();
      /* Rouvre la décision EXISTANTE (ne crée jamais une nouvelle décision)
         et affiche les votes déjà reçus. */
      reopenDecide(decId);
    });
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
  const names = namesFromCache(entry.results);
  renderResults(names, t("drawer_history_from"));
  closeEspace();
  document.getElementById("generateur").scrollIntoView({ behavior: "smooth" });
}

/* ---- Ouverture / Fermeture drawer ---- */
function openEspace() {
  /* Non connecté : Mon espace nécessite un compte → ouvrir la modale d'auth.
     Ma sélection (selSeeBtn) reste accessible sans compte. */
  if (!currentUser) { openAuthModal(); return; }
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
/* Met à jour la modale auth selon que l'email est connu ou nouveau */
function setAuthMode(mode) {
  _authMode = mode;
  const titleEl  = document.getElementById("authModalTitle");
  const descEl   = document.querySelector("#authModal .auth-modal-desc");
  const fnField  = document.getElementById("authFirstName")?.closest(".field");
  const submitEl = document.getElementById("authSubmit");
  const statusEl = document.getElementById("authEmailStatus");
  if (!titleEl || !submitEl || !statusEl) return;

  if (mode === "existing") {
    titleEl.textContent   = t("login_title");
    descEl.textContent    = t("login_desc");
    if (fnField) fnField.style.display = "none";
    submitEl.textContent  = t("login_btn");
    statusEl.textContent  = t("login_found");
    statusEl.className    = "auth-email-status auth-found";
  } else {
    /* "new" ou "unknown" → formulaire inscription par défaut */
    titleEl.textContent   = t("create_space_title");
    descEl.textContent    = t("create_space_desc");
    if (fnField) fnField.style.display = "";
    submitEl.textContent  = t("create_space_btn");
    statusEl.textContent  = "";
    statusEl.className    = "auth-email-status";
  }
}

function openAuthModal() {
  document.getElementById("authEmail").value = "";
  document.getElementById("authFirstName").value = "";
  document.getElementById("authEmail").classList.remove("field-error");
  document.getElementById("authEmailError").classList.remove("visible");
  clearTimeout(_authEmailTimer);
  setAuthMode("unknown"); // ← réinitialise le mode à chaque ouverture
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

    /* Détection en temps réel : email existant → mode connexion, nouveau → mode inscription */
    clearTimeout(_authEmailTimer);
    const email = document.getElementById("authEmail").value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) { if (_authMode !== "unknown") setAuthMode("unknown"); return; }

    _authEmailTimer = setTimeout(async () => {
      /* Vérifier que l'utilisateur n'a pas changé l'email entre-temps */
      const current = document.getElementById("authEmail")?.value.trim();
      if (current !== email) return;
      try {
        const existing = await findUserByEmail(email);
        if (document.getElementById("authEmail")?.value.trim() !== email) return;
        setAuthMode(existing ? "existing" : "new");
      } catch (_) {
        setAuthMode("unknown");
      }
    }, 700); /* 700 ms de debounce — évite de spammer à chaque frappe */
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
    .map((n) => nameFromCache(n))
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
  const favList = namesFromCache([...favorites]);

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
  role:          null, // "creator" | "partner" | "family"
  participantId: null,
  status:        null, // "open" | "closed"
};
/* Timer d'auto-polling (s'active quand le créateur est sur l'écran d'attente) */
let _pollTimer = null;
const POLL_INTERVAL = 5000; /* 5 secondes — sync conjoint plus réactive */

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
  /* Tentative admin détectée (à consommer côté appelant). La vérification du
     mot de passe est asynchrone (serveur) — on ne bloque pas le flux. */
  Promise.resolve(adminLogin((password || "").trim())).then((ok) => {
    if (ok) window.location.href = "admin.html";
    else showToast(t("admin_wrong_pass"));
  });
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

/* Vérifie la qualité d'un email via l'API (MX + domaines jetables).
   Fail-open : si l'API est indisponible ou timeout, on laisse passer. */
async function _checkEmailQuality(email) {
  try {
    const r = await fetch("/api/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) return { ok: true };
    const data = await r.json();
    if (data.valid) return { ok: true };
    if (data.reason === "disposable") return { ok: false, msg: t("email_disposable") };
    if (data.reason === "no_mx")      return { ok: false, msg: t("email_no_mx") };
    return { ok: true };
  } catch {
    return { ok: true }; /* réseau indisponible → on laisse passer */
  }
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
      const quality = await _checkEmailQuality(email);
      if (!quality.ok) {
        document.getElementById("voteStartEmail").classList.add("field-error");
        document.getElementById("voteStartEmailError").textContent = quality.msg;
        document.getElementById("voteStartEmailError").classList.add("visible");
        return;
      }
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
    decideState = { decisionId: decision.id, role: "creator", participantId, mode: "couple", status: 'open' };
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

/* ---- Créateur : ROUVRIR une décision existante (sans en créer une nouvelle) ----
   Utilisé par « Reprendre » dans Mon espace et par le lien email ?decision=<id>.
   Différence clé avec openDecide() : ne crée AUCUNE décision — recharge l'existante
   depuis Supabase et affiche directement les votes/matchs reçus. */
async function reopenDecide(decisionId) {
  if (!decisionId) return false;
  try {
    const decision = await getDecision(decisionId);
    if (!decision) { showToast(t("decide_invite_invalid")); return false; }

    /* participantId du créateur : cet appareil d'abord, sinon le créateur de la décision
       (ex : ouverture du lien email depuis un autre appareil). */
    let myPid = (typeof getMyParticipantId === "function") ? getMyParticipantId(decisionId) : null;

    /* Valide que le PID stocké est bien celui du créateur — pas d'un votant
       (scénario : même appareil utilisé successivement comme créateur et partenaire). */
    if (myPid && decision.participants[myPid]?.role !== "creator") {
      myPid = null;
    }

    if (!myPid) {
      const creatorEntry = Object.entries(decision.participants || {})
        .find(([, p]) => p.role === "creator");
      if (creatorEntry) {
        myPid = creatorEntry[0];
        if (typeof _setMyParticipant === "function") _setMyParticipant(decisionId, myPid);
      }
    }

    const mode = decision.mode === "family" ? "family" : "couple";
    decideState = {
      decisionId,
      role:          "creator",
      participantId: myPid,
      mode,
      status:        decision.status || "open",
    };
    if (decision.surname) lastSurname = decision.surname;

    setDecideHeader(mode === "family" ? "family_creator" : "couple_creator");
    const overlay = document.getElementById("decideOverlay");
    if (overlay) { overlay.classList.add("open"); document.body.style.overflow = "hidden"; }

    /* Affiche les résultats adaptés au mode :
       - couple → décide-résultats (matchs + détail)
       - famille → classement famille */
    if (mode === "family") {
      generateFamilyLink();
      renderFamilyResults();
      showDecideStep("familyResults");
    } else {
      await showDecideResults();
    }
    return true;
  } catch (err) {
    console.error("[NS:reopenDecide]", err?.message || err);
    showToast(t("err_session_load"));
    return false;
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

/* ---- Lien d'invitation : /vote/<decisionId> (path-based, jamais strippé) ---- */
function generateInviteLink() {
  if (!decideState.decisionId) return;
  const inviteUrl = `${location.origin}/?invite=${decideState.decisionId}&lang=${lang}`;
  const input = document.getElementById("inviteLinkInput");
  if (!input) return;
  input.value = inviteUrl;
  try { input.select(); } catch (_) {}
}

/* ---- Partager le lien d'invitation (feuille native / clipboard) ---- */
async function copyInviteLink() {
  const url = _getOrBuildInviteUrl();
  if (!url) { showToast(t("err_generic")); return; }
  await shareLink(url, t("share_invite_text"), document.getElementById("copyInviteLinkBtn"));
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
    url = `${location.origin}/?invite=${decideState.decisionId}&lang=${lang}`;
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
  decideState = { decisionId, role: "partner", participantId, mode: "couple", status: decision.status || 'open' };
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

  /* Validation prénom (seul champ obligatoire) */
  if (!firstName) {
    document.getElementById("partnerFirstName").classList.add("field-error");
    document.getElementById("partnerFirstNameError").textContent = t("partner_reg_firstname_required");
    document.getElementById("partnerFirstNameError").classList.add("visible");
    document.getElementById("partnerFirstName").focus();
    return;
  }

  /* Email facultatif : on ne valide le format que s'il a été renseigné */
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
    if (email) {
      const quality = await _checkEmailQuality(email);
      if (!quality.ok) {
        document.getElementById("partnerEmail").classList.add("field-error");
        document.getElementById("partnerEmailError").textContent = quality.msg;
        document.getElementById("partnerEmailError").classList.add("visible");
        document.getElementById("partnerEmail").focus();
        return;
      }
      const existing = await findUserByEmail(email);
      currentUser = existing || {
        email, firstName, createdAt: new Date().toISOString(), surname: lastSurname || null,
      };
    } else {
      currentUser = { email: null, firstName, createdAt: new Date().toISOString(), surname: lastSurname || null };
    }
  } catch (_) {
    currentUser = { email: email || null, firstName, createdAt: new Date().toISOString(), surname: lastSurname || null };
  } finally {
    btn.disabled = false;
    btn.textContent = origText;
  }

  saveUser();
  registerLead(email, firstName, 0); /* no-op silencieux si email vide */
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
  const isClosed = decision.status === 'closed';

  /* Sync status dans decideState (utile pour handleFamilyNameSubmit → handleVote) */
  decideState.status = decision.status || 'open';

  document.getElementById("decideVoteSub").textContent =
    isFamily ? t("family_vote_sub") : t("decide_vote_sub");
  const seeBtn = document.getElementById("seeMatchsBtn");
  if (seeBtn) seeBtn.textContent = isFamily ? t("family_finish_vote") : t("decide_see_matchs");

  /* Bandeau "vote terminé" */
  const banner = document.getElementById("voteClosedBanner");
  if (banner) {
    if (isClosed) {
      banner.textContent = t("vote_closed_banner");
      banner.style.display = "";
    } else {
      banner.style.display = "none";
    }
  }

  const myVotes = getVotes(decideState.decisionId)[decideState.participantId] || {};
  const reactions = [
    { r: "yes",   txt: t("vote_yes")   },
    { r: "maybe", txt: t("vote_maybe") },
    { r: "no",    txt: t("vote_no")    },
  ];

  const wrap = document.getElementById("voteList");
  wrap.innerHTML = decision.items.map((name) => {
    const n = nameFromCache(name);
    return `
      <div class="vote-item" data-vote-name="${name}">
        <span class="vote-name">${n ? n.name : name}</span>
        <div class="vote-actions">
          ${reactions.map((x) =>
            `<button class="vote-btn vote-${x.r}${myVotes[name] === x.r ? " selected" : ""}" data-react="${x.r}"${isClosed ? ' data-closed="true"' : ""}>${x.txt}</button>`
          ).join("")}
        </div>
      </div>`;
  }).join("");

  if (isClosed) return; /* Pas d'écouteurs sur un vote clôturé */

  wrap.querySelectorAll(".vote-item").forEach((item) => {
    const name = item.dataset.voteName;
    item.querySelectorAll("[data-react]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        /* Mise à jour optimiste immédiate */
        item.querySelectorAll("[data-react]").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        try {
          await handleVote(name, btn.dataset.react);
        } catch (err) {
          /* Annule la mise à jour optimiste si l'enregistrement Supabase échoue */
          btn.classList.remove("selected");
          showToast(err?.message === 'decision_closed' ? t("err_vote_closed") : t("err_vote_failed"));
        }
      });
    });
  });
}

/* ---- Enregistrer un vote (créateur OU partenaire) ---- */
async function handleVote(prenameName, reaction) {
  if (decideState.status === 'closed') throw Object.assign(new Error('decision_closed'), { code: 'VOTE_CLOSED' });
  await saveVote(decideState.decisionId, decideState.participantId, prenameName, reaction);
  window.plausible?.("Vote effectué", { props: { mode: decideState.mode, reaction } });
}

/* ---- Afficher les résultats (matchs DÉRIVÉS depuis Supabase en temps réel) ---- */
async function showDecideResults() {
  showDecideStep("decideResults");

  /* Re-fetch systématique avant tout calcul : garantit que les matchs et le détail
     affichés sont toujours synchronisés avec Supabase, même après un long délai ou
     un changement d'appareil. Un seul aller-retour réseau. */
  const d = await getDecision(decideState.decisionId);

  /* Calcul des matchs directement depuis la décision fraîche (bypass cache) */
  const matchs = d ? d.items.filter((name) => {
    const reactions = Object.values(d.votes)
      .map((byName) => byName[name])
      .filter(Boolean);
    return reactions.length > 0 && reactions.every((r) => r === "yes");
  }) : computeMatches(decideState.decisionId); /* fallback cache si Supabase indisponible */

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
    const names = namesFromCache(matchs);
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

  /* Utilise la décision déjà fetchée — pas de deuxième aller-retour Supabase */
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

    /* Identifie le PID créateur de façon fiable : d'abord via decideState si le rôle
       est confirmé dans Supabase, sinon en cherchant le créateur dans les participants.
       Évite d'exclure les votes du partenaire si decideState.participantId est erroné
       (appareil ayant servi à la fois de créateur et de partenaire). */
    const participants = decision?.participants || {};
    const creatorPid = (() => {
      const pid = decideState.participantId;
      if (pid && participants[pid]?.role === "creator") return pid;
      const entry = Object.entries(participants).find(([, p]) => p.role === "creator");
      return entry ? entry[0] : pid; /* fallback : garder le pid en mémoire si inconnu */
    })();

    console.log("[NS:refresh] participants avec votes:", Object.keys(votes).length, "creatorPid:", creatorPid);

    let yes = 0, no = 0, maybe = 0, voteCount = 0;
    Object.entries(votes).forEach(([pid, byName]) => {
      if (pid === creatorPid) return; /* ignorer les votes du créateur */
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

  /* Créateur : actualiser sur l'écran résultats (re-fetch Supabase + re-render) */
  document.getElementById("refreshResultsBtn")?.addEventListener("click", async (e) => {
    await _withBtnLoading(e.currentTarget, showDecideResults);
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

  document.getElementById("closeVoteBtn")?.addEventListener("click", async () => {
    if (!confirm(t("family_close_confirm"))) return;
    const btn = document.getElementById("closeVoteBtn");
    const orig = btn.textContent;
    btn.disabled = true; btn.textContent = "…";
    try {
      await closeDecision(decideState.decisionId);
      decideState.status = "closed";
      renderFamilyResults();
      showToast(t("vote_closed_banner"));
    } catch (err) {
      console.error("[NameSpark] closeDecision:", err);
      showToast(t("err_network"));
    } finally {
      btn.disabled = false; btn.textContent = orig;
    }
  });
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
    decideState = { decisionId: decision.id, role: "creator", participantId, mode: "family", status: 'open' };
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

/* ---- Lien partageable : /family/<decisionId> (path-based, jamais strippé) ---- */
function generateFamilyLink() {
  const url = `${location.origin}/?familyVote=${decideState.decisionId}&lang=${lang}`;
  const input = document.getElementById("familyLinkInput");
  if (input) input.value = url;
}
/* ---- Partager le lien famille (feuille native / clipboard) ---- */
async function copyFamilyLink() {
  const url = _getOrBuildFamilyUrl();
  if (!url) { showToast(t("err_generic")); return; }
  await shareLink(url, t("share_family_text"), document.getElementById("copyFamilyLinkBtn"));
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
    url = `${location.origin}/?familyVote=${decideState.decisionId}&lang=${lang}`;
    if (input) input.value = url;
  }
  return url;
}

/* ---- Votant : ouvre via ?familyVote=<decisionId> ---- */
async function openFamilyVoteAsVoter(decisionId) {
  try {
    const decision = await getDecision(decisionId);
    if (!decision) { showToast(t("decide_invite_invalid")); return false; }

    if (decision.surname) lastSurname = decision.surname;

    /* Si l'utilisateur connecté est le créateur de cette décision,
       le reconnaître par email et l'emmener directement aux résultats. */
    if (currentUser?.email) {
      const creatorEntry = Object.entries(decision.participants || {}).find(
        ([, p]) => p.role === "creator" && p.email &&
                   p.email.toLowerCase() === currentUser.email.toLowerCase()
      );
      if (creatorEntry) {
        const [pid] = creatorEntry;
        decideState = { decisionId, role: "creator", participantId: pid, mode: "family", status: decision.status || 'open' };
        setDecideHeader("family_creator");
        generateFamilyLink();
        renderFamilyResults();
        showDecideStep("familyResults");
        document.getElementById("decideOverlay").classList.add("open");
        document.body.style.overflow = "hidden";
        return true;
      }
    }

    /* Flux votant normal */
    decideState = { decisionId, role: "family", participantId: null, mode: "family", status: decision.status || 'open' };
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
  if (currentUser?.email) {
    const msg = lang === "fr"
      ? `✅ Vous serez prévenu·e par email dès que votre partenaire a voté.`
      : `✅ You'll be notified by email as soon as your partner has voted.`;
    nudge.innerHTML = `<p class="email-nudge-text" style="color:#27ae60;font-weight:600;">${msg}</p>`;
    nudge.style.display = "";
    return;
  }

  nudge.style.display = "";
  const input = document.getElementById("inviteNudgeEmail");
  const saveBtn = document.getElementById("inviteNudgeSave");
  if (!input || !saveBtn) return;

  saveBtn.onclick = async () => {
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.style.borderColor = "var(--error, #e74c3c)";
      return;
    }
    input.style.borderColor = "";
    saveBtn.disabled = true;
    const quality = await _checkEmailQuality(email);
    saveBtn.disabled = false;
    if (!quality.ok) {
      input.style.borderColor = "var(--error, #e74c3c)";
      input.title = quality.msg;
      return;
    }
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

  /* Bouton Clôturer : visible seulement pour le créateur sur un vote encore ouvert */
  const closeBtn = document.getElementById("closeVoteBtn");
  if (closeBtn) {
    const showClose = decideState.role === "creator" && decideState.status !== "closed";
    closeBtn.textContent = t("family_close_vote");
    closeBtn.style.display = showClose ? "" : "none";
  }

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
  /* Amorçage du cache de prénoms.
     Tant que data.js est chargé dans le navigateur, on pré-remplit
     intégralement le cache : aucun appel réseau, comportement
     strictement identique à l'historique. Quand data.js sera retiré
     du client, ce bloc ne fera rien et le cache se remplira à la
     demande via ensureNames() / les réponses de /api/generate. */
  if (typeof NAMES !== "undefined" && Array.isArray(NAMES)) cacheNames(NAMES);

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

  // Popup incitation favoris — bouton fermer
  document.getElementById("closeHeartHint").addEventListener("click", _dismissHeartHint);

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

  /* Liens de vote : ?invite= (couple) et ?familyVote= (famille)
     Les URLs path-based (/vote/:id, /family/:id) sont redirigées vers ces params par Vercel */
  const params       = new URLSearchParams(location.search);
  const inviteId     = params.get("invite");
  const familyVoteId = params.get("familyVote");
  const decisionId   = params.get("decision");   /* lien email « Voir les résultats » (créateur) */
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
  } else if (decisionId) {
    /* Créateur revenant depuis l'email de notification de vote → rouvrir ses résultats */
    if (urlLang === "fr" || urlLang === "en") applyLang(urlLang);
    showLoadingScreen(t("loading_session"));
    reopenDecide(decisionId)
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
let currentSigName = null; // prénom actuellement affiché (pour re-render i18n)

/* Prénoms similaires de la fiche courante, alimentés par /api/names.
   Remplace le balayage local de toute la base. */
let _sigSimilar = new Map();   // nom -> [cartes similaires]

/* Autocomplétion via /api/search.
   Deux verrous complémentaires contre les réponses désordonnées quand
   l'utilisateur tape vite :
     - un numéro de séquence : seule la réponse de la DERNIÈRE requête
       émise est appliquée (c'est ce qui garantit la correction — une
       requête annulée peut malgré tout se résoudre) ;
     - un AbortController, qui coupe la requête en vol (économie de
       bande passante, pas une garantie de correction à lui seul). */
let _searchSeq = 0;
let _searchAbort = null;
/* Sentinelle distincte de "aucun résultat" : une réponse périmée doit
   être IGNORÉE, surtout pas rendue — sinon elle efface les suggestions
   fraîches déjà affichées. */
const STALE = Symbol("stale");

async function sigSearchRemote(q) {
  const seq = ++_searchSeq;
  if (_searchAbort) _searchAbort.abort();
  const ctrl = new AbortController();
  _searchAbort = ctrl;
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&lang=${encodeURIComponent(lang)}`,
                            { signal: ctrl.signal });
    if (seq !== _searchSeq) return STALE;  /* une frappe plus récente a pris la main */
    if (!res.ok) return null;
    const data = await res.json();
    if (seq !== _searchSeq) return STALE;   /* re-vérifié après le parsing */
    return Array.isArray(data.results) ? data.results : null;
  } catch { return seq !== _searchSeq ? STALE : null; }
}

function renderSigDetail(name) {
  const detail = document.getElementById("sigDetail");
  if (!detail) return;
  const n = nameFromCache(name);
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

  const similar = _sigSimilar.get(name) || [];
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

async function selectSigName(name, opts = {}) {
  const input = document.getElementById("sigInput");
  const sug = document.getElementById("sigSuggest");
  if (input) input.value = name;
  if (sug) { sug.hidden = true; sug.innerHTML = ""; }

  /* La fiche a besoin des champs détaillés (thèmes, variantes) et de
     ses prénoms proches : un seul aller-retour pour les deux. */
  if (!_sigSimilar.has(name) || !nameFromCache(name)) {
    const similar = await fetchSimilar(name);
    _sigSimilar.set(name, similar);
  }
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

  let _lastResults = [];

  const renderSuggest = (results) => {
    _lastResults = results || [];
    if (!_lastResults.length) { sug.hidden = true; sug.innerHTML = ""; return; }
    sug.innerHTML = _lastResults.map((e) => {
      const o = (t("origins") || {})[e.origin] || e.origin;
      return `<li role="option" data-name="${e.name}"><span class="s-name">${e.name}</span><span class="s-meta">${o} — ${e.meaning || ""}</span></li>`;
    }).join("");
    sug.hidden = false;
    sug.querySelectorAll("li").forEach((li) =>
      li.addEventListener("mousedown", (ev) => { ev.preventDefault(); selectSigName(li.getAttribute("data-name")); }));
  };

  const showSuggest = async () => {
    const q = input.value.trim();
    if (!q) { renderSuggest([]); return; }
    const res = await sigSearchRemote(q);
    if (res === STALE) return;  /* périmé : on ne touche pas à l'affichage */
    renderSuggest(res);
  };

  /* Debounce : on n'interroge pas le serveur à chaque frappe. */
  let _sugTimer = null;
  const showSuggestDebounced = () => {
    clearTimeout(_sugTimer);
    _sugTimer = setTimeout(showSuggest, 200);
  };

  input.addEventListener("input", showSuggestDebounced);
  input.addEventListener("focus", () => { if (input.value.trim()) showSuggestDebounced(); });
  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      /* On privilégie la suggestion déjà affichée ; sinon on interroge. */
      if (_lastResults.length) { selectSigName(_lastResults[0].name); return; }
      const res = await sigSearchRemote(input.value.trim());
      if (res && res !== STALE && res.length) selectSigName(res[0].name);
    } else if (e.key === "Escape") { sug.hidden = true; }
  });
  document.addEventListener("click", (e) => {
    if (!sug.contains(e.target) && e.target !== input) sug.hidden = true;
  });

  // Deep-link : #/prenom/<slug>
  /* Le navigateur n'a plus la base pour faire slug -> prénom :
     c'est le serveur qui résout. */
  const routeFromHash = async () => {
    const m = location.hash.match(/^#\/prenom\/(.+)$/);
    if (!m) return false;
    const slug = decodeURIComponent(m[1]);
    try {
      const res = await fetch("/api/names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: [slug], detail: true }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      cacheNames(data.names);
      if (data.names && data.names.length) {
        selectSigName(data.names[0].name, { noScroll: false });
        return true;
      }
    } catch { /* silencieux : deep-link non résolu */ }
    return false;
  };
  window.addEventListener("hashchange", routeFromHash);
  routeFromHash();
}
