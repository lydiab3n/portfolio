/* French copy. Merged over the English content when the language is French. */

export interface StepFr {
  title: string;
  copy?: string;
  bullets?: string[];
  note?: string;
  table?: { caption?: string; head: string[]; rows: string[][] };
  media?: string[];
  videos?: string[];
  externalVideos?: string[];
}
export interface CaseFr {
  kind: string;
  blurb: string;
  facts: [string, string][];
  brief: string;
  videoCaption?: string;
  heroCaption?: string;
  heroCaptions?: string[];
  posterCaption?: string;
  embedCaption?: string;
  links?: { label: string; hint: string }[];
  steps: StepFr[];
  principles?: { intro: string[]; caption: string; head: string[]; rows: string[][] };
  scenario?: { label: string; items: [string, string][] }[];
  decisions: [string, string][];
  outcome: { title: string; copy?: string; caption?: string }[];
  evaluation?: string[];
  evaluationNote?: string;
  future?: string[];
  reflection: string[];
}

export const frHero = {
  role: "Étudiante en Master IHM · Product & UX designer",
  tagline: "Je transforme des idées complexes en expériences numériques claires et soignées.",
  status: "À la recherche d’un stage",
};

export const frAbout = {
  photoAlt: "Lydia Benosmane souriant dans une voiture",
  paragraphs: [
    "Bonjour ! Je suis <b>Lydia</b>, étudiante en Master d’Interaction Homme-Machine (IHM) et designer Product & UX en Île-de-France, la tête quelque part entre un éditorial de mode, une galerie d’art et le bord de mer.",
    "J’aime le design qui a du caractère : inattendu, dramatique et parfois rose (comme ce portfolio). Ce sont les détails qui rendent quelque chose de spécial.",
    "En dehors du design ? Je suis dehors à écouter de la musique, à me perdre dans la vie parfaite que ce serait si ma vie ressemblait à mes tableaux Pinterest, à admirer de jolies choses ou à rêver d’être au bord de la mer, un verre frais à la main et le soleil sur la peau.",
  ],
  tags: ["Île-de-France", "Master IHM", "Product & UX", "Art & mode"],
  favourites: [
    ["Couleur préférée du moment", "Le rose, évidemment."],
    ["Toujours inspirée par", "La mode, l’art et tout ce qui est visuel."],
    ["Mon endroit préféré", "Quelque part au bord de la mer."],
    ["Toujours ouverts", "Pinterest et mes playlists."],
  ] as [string, string][],
};

export const frSkills = ["Design d’interaction", "Design UX/UI", "Prototypage", "Direction artistique", "Design spatial", "Photographie", "Figma", "Blender", "Unity", "C#", "Java", "Python", "HTML/CSS/JS"];

export const frRoles = [
  {
    title: "Stage d’été",
    place: "Inria · équipe Ex-Situ",
    where: "Gif-sur-Yvette",
    dates: "Mai – juillet 2026",
    copy: "Sous la supervision de Wendy E. Mackay.",
    bullets: [
      "Participation au Design-a-thon de 3 jours de La Suite Numérique, avec refonte de l’interface du gouvernement à l’aide de nouvelles techniques d’interaction.",
      "Contribution à l’organisation d’ateliers pour la refonte des outils de La Suite Numérique.",
      "Participation à des ateliers de design hebdomadaires utilisant des méthodes de conception participative.",
      "Analyse de la version actuelle du livre DOIT (Wendy Mackay) et identification de pistes pour la vidéo interactive, en collaborant à la conception de sections interactives.",
    ],
    tags: ["Figma", "Prototypage papier", "Montage vidéo"],
  },
  {
    title: "Stage de Magistère",
    place: "LISN · équipe Venise",
    where: "Gif-sur-Yvette",
    dates: "Mai – juillet 2025",
    copy: "Sous la supervision de Tifanie Bouchara.",
    bullets: [
      "Conception et implémentation d’un prototype préliminaire d’une application de musicothérapie pour la rééducation physique post-AVC sur Meta Quest 3.",
      "Combinaison de développement technique et d’activités de recherche : revue de littérature et séances d’observation sur site.",
    ],
    tags: ["Unity", "Blender", "C#", "Meta Quest SDK", "Pure Data", "XR Interaction Toolkit"],
  },
  {
    title: "Stage de recherche",
    place: "LISN · équipe Venise",
    where: "Gif-sur-Yvette",
    dates: "Janvier – avril 2025",
    copy: "Sous la supervision de Tifanie Bouchara.",
    bullets: ["Portage d’une application XR de musicothérapie de HTC Vive vers Meta Quest 3.", "Développement d’un mode collaboratif pour deux utilisateurs."],
    tags: ["Unity", "C#", "Meta Quest SDK", "XR Interaction Toolkit"],
  },
  {
    title: "Tutrice scolaire",
    place: "Parkours",
    where: "Paris",
    dates: "2024 – aujourd’hui",
    bullets: [
      "Aide aux devoirs et soutien scolaire auprès d’élèves de primaire et de collège dans toutes les matières.",
      "Adaptation aux besoins de chaque élève et développement de l’écoute active et des compétences pédagogiques.",
    ],
  },
];

export const frEducation = [
  {
    title: "Master en interaction humain-machine",
    place: "Université Paris-Saclay",
    dates: "2025 – aujourd’hui",
    bullets: ["Conception de systèmes interactifs (fondamental et avancé)", "Fondamentaux de l’interaction humain-machine, réalité augmentée", "Développement web avancé", "Projet de conception", "Visualisation interactive de l’information"],
    tags: ["Figma", "Blender", "Unity", "C++/C#"],
  },
  {
    title: "Double diplôme en informatique et mathématiques, parcours Magistère d’informatique",
    place: "Université Paris-Saclay",
    dates: "2022 – 2025",
    bullets: ["Introduction à l’interaction humain-machine", "Programmation avancée d’interfaces interactives", "Développement web"],
  },
];

export const frToolkit = [
  { label: "Langages de programmation", items: "C#, Java, Python" },
  { label: "Développement web", items: "HTML, CSS, JavaScript" },
  { label: "3D / 2D / XR", items: "Unity, Blender" },
  { label: "Prototypage", items: "Papier, Figma" },
  { label: "Langues", items: "Anglais (C2, Linguaskill), français (langue maternelle)" },
  { label: "Centres d’intérêt", items: "Art (peinture acrylique, calligraphie), guitare acoustique" },
];

export const frCases: Record<string, CaseFr> = {
  lineup: {
    kind: "Design produit",
    blurb: "Repenser la prise de parole en visioconférence avec une file d’attente visuelle des intervenants.",
    facts: [
      ["Rôle", "Design d’interaction · Design UX/UI · Prototypage"],
      ["Équipe", "Lydia Benosmane, Sidonie Minodier, Victoria Myot, Ayda Yurtoglu"],
      ["Période", "Janvier–février 2026"],
      ["Outils", "Figma (prototype) · analyse d’interface, cartographie des objets conceptuels, modélisation d’interaction, brainstorming, prototypage papier, conception de scénarios, critique itérative"],
      ["Contexte", "Situated Interaction 2026 · Master IHM, Université Paris-Saclay"],
    ],
    brief:
      "Les plateformes de visioconférence comme Zoom, Teams et Google Meet soutiennent la communication, mais coordonner une réunion demande encore beaucoup d’efforts manuels : les modérateurs doivent gérer les tours de parole, suivre le temps et organiser les transitions à la main. Notre défi de conception : comment rendre l’ordre de parole, le temps et les supports de présentation visibles et adaptables, tout en réduisant la charge de coordination du modérateur ?",
    videoCaption: "Prototype vidéo : une réunion d’équipe hebdomadaire menée avec LineUP, de la création de la file d’attente à son enregistrement comme modèle.",
    steps: [
      {
        title: "Recherche",
        copy: "Nous avons analysé l’interface de Zoom non seulement au niveau des écrans, mais à travers ses objets conceptuels sous-jacents (participants, groupes, réunions, messages, chats, écrans partagés, minuteurs) en cartographiant les propriétés, la représentation visuelle et les opérations de chacun, puis en décrivant la commande de l’utilisateur, le retour et la réponse du système pour chaque opération. Constat principal : l’ordre de parole n’avait aucune représentation dédiée et manipulable ; le partage de contenu et la prise de parole étaient traités comme des interactions séparées et déconnectées. Nous avons aussi relevé des frictions du quotidien : les messages privés arrivent encore dans le chat principal, les salles séparées peuvent encore écrire à tout le monde, et il est difficile de trouver où partager le lien.",
        media: ["Débat modéré en visioconférence", "Vue galerie d’une réunion d’équipe", "Commandes de réunion et contenu partagé"],
        table: {
          caption: "Objets conceptuels de Zoom. Les substrats (groupe, chat) sont marqués d’un astérisque.",
          head: ["Objet conceptuel", "Propriétés", "Représentation", "Opérations"],
          rows: [
            ["Participant", "Nom · rôle (hôte ou participant) · statut (micro coupé, main levée, épinglé)", "Nom · photo de profil, écran ou caméra", "Épingler · envoyer un message privé · lever la main · couper le micro"],
            ["Groupe *", "Liste de participants", "Sous-réunion", "Créer · dissoudre · ajouter ou retirer des participants · voir la liste"],
            ["Réunion", "Identifiant · heure de début", "Fenêtre avec une liste de participants et une barre de menu", "Créer · rejoindre · quitter"],
            ["Message", "Expéditeur · texte · horodatage · statut (livré, vu)", "Bulle de texte · notification", "Envoyer · modifier · supprimer · épingler"],
            ["Chat *", "Ordre des messages · expéditeur", "Bulles de texte", "Enregistrer"],
            ["Écran partagé", "Type de fenêtre · propriétaire (participant)", "Écran réduit", "Démarrer · arrêter · changer de fenêtre"],
            ["Minuteur", "Durée · statut (en marche, en pause, arrêté)", "Compte à rebours", "Démarrer · mettre en pause · arrêter · changer la durée"],
          ],
        },
      },
      {
        title: "Le problème utilisateur",
        copy: "Aujourd’hui, la prise de parole en réunion repose sur des habitudes informelles : le modérateur distribue les tours de parole à l’oral, et quand un intervenant termine, il doit arrêter son partage avant que le suivant puisse commencer.",
        bullets: [
          "Pas de file d’attente structurée. Les participants ne savent pas quand ils parleront, et l’ordre devient flou.",
          "Charge cognitive élevée pour le modérateur, qui doit retenir l’ordre et interrompre les intervenants quand le temps est écoulé, au lieu de se concentrer sur la présentation.",
          "Mauvaise gestion du temps. Les réunions débordent, aucun temps n’est alloué visiblement, et personne n’est prévenu que son tour approche.",
          "Difficulté à gérer les médias. Diaporamas, vidéos et documents compliquent encore les choses, et les gens ne veulent pas toujours partager tout leur écran.",
        ],
      },
      {
        title: "Synthèse",
        copy: "Nous avons exploré plusieurs pistes (documents partagés, espaces de travail, ordres du jour, contrôles par rôle) avant de converger vers une opportunité : transformer l’ordre du jour lui-même en objet interactif, une file unique qui représente ensemble les intervenants, les supports et le temps. Notre scénario de test : une réunion hebdomadaire de start-up d’une heure maximum, avec un modérateur et trois employés.",
        bullets: [
          "Pistes explorées : des documents que tout le monde peut modifier, un tableau blanc, plusieurs espaces partagés avec glisser-déposer entre eux, l’affichage du propriétaire d’un écran partagé, et un ordre du jour lié aux personnes avec des rangs de priorité.",
          "Une règle posée tôt : plusieurs participants peuvent être attachés à un même média, ou plusieurs médias à un même participant, mais pas les deux à la fois. Cette combinaison devient trop compliquée.",
        ],
        note: "La solution : une file structurée dans la réunion. Elle organise visuellement l’ordre de parole des participants, les médias partagés et les pauses, aide les modérateurs à gérer le temps et prévient les gens quand leur tour approche.",
      },
      {
        title: "Idéation",
        copy: "Guidés par les principes du design génératif (réification : faire de l’ordre de parole un objet tangible ; polymorphisme : les mêmes outils fonctionnent pour les participants et les médias ; feedforward et feedback ; ajustement et réutilisation), nous avons dessiné des outils d’ordonnancement, des interactions par glisser-déposer, des groupes d’intervenants, des blocs de temps et des modèles réutilisables. Chaque principe a été appliqué deux fois : à un instrument (la commande) et à un substrat (l’effet).",
        bullets: [
          "Neuf interactions esquissées : glisser du contenu pour réordonner, ajouter un participant, réordonner, créer un groupe, importer un média, voir le détail d’un contenu, demander à rejoindre la file, approuver une demande en tant qu’hôte, se retirer de la file.",
          "Deux nouveaux outils : un outil d’ordonnancement pour l’hôte et un outil « rejoindre la file » pour les participants.",
          "Les groupes se créent en empilant un participant sur un autre et se comportent comme une seule entrée de la file.",
        ],
        media: [
          "Le cadre avec lequel nous avons conçu : sept principes, appliqués aux instruments et aux substrats",
          "La bande de la file, avec les outils d’ordonnancement et « rejoindre la file »",
          "Ajouter, réordonner et grouper des participants",
          "Importer un média et voir le détail d’une entrée",
          "Demander à rejoindre, et l’hôte qui approuve",
          "Se retirer de la file, ou demander plus de temps",
        ],
      },
      {
        title: "Prototype",
        copy: "Nous avons prototypé LineUP dans Figma et l’avons filmé sous forme de prototype vidéo, autour de quatre personas et d’un scénario : M. Fishman, l’hôte et chef d’équipe, lance la première d’une série de réunions d’équipe hebdomadaires. Il crée une réunion et les autres reçoivent une notification pour la rejoindre. Les écrans ci-dessous viennent du prototype Figma.",
        media: [
          "M. Fishman anime. Lillie et Pygo sont employés. Egg et les autres PNJ sont stagiaires.",
          "Le substrat file d’attente : intervenants, groupes et médias, avec un temps modifiable directement",
          "Accueil : nouvelle réunion, rejoindre, modèles, et un calendrier pour les planifier",
          "Vue réunion avec la file au-dessus de l’appel",
        ],
      },
    ],
    principles: {
      intro: [
        "Permettre aux utilisateurs de traiter la file comme un véritable objet et de la manipuler directement.",
        "Aller au-delà de l’interface WIMP traditionnelle.",
        "Offrir plus de fonctionnalités avec des interactions intuitives et agréables à utiliser.",
        "Offrir plus de personnalisation et de flexibilité.",
      ],
      caption: "Principes et interactions",
      head: ["Principe", "Instruments (focus sur la commande)", "Substrats (focus sur l’effet)"],
      rows: [
        ["Réification", "Créer la file · outils de modèle de réunion pour planifier", ""],
        ["Polymorphisme", "Ajouter des participants à la file · l’outil d’ordonnancement fonctionne pareil pour les médias et les participants", "Ajouter des participants ou des groupes à la file (substrat : file)"],
        ["Réutilisation", "Utiliser un modèle de réunion", "Des groupes réutilisables plus tard (substrat : groupe)"],
        ["Feedforward", "Quand c’est votre tour de parler · ajouter des participants à la file", ""],
        ["Feedback", "Minuteur visible à l’écran", ""],
        ["Spécialisation", "Boutons personnalisés pour chaque modèle de réunion", "Créer un modèle de réunion (substrat : modèle)"],
        ["Ajustement", "Ajouter du temps de présentation", "Modifier l’ordre de la file (substrat : file)"],
      ],
    },
    scenario: [
      {
        label: "Avant la réunion",
        items: [["", "M. Fishman crée une nouvelle réunion en un clic. Lillie et Pygo reçoivent une notification."]],
      },
      {
        label: "Pendant la réunion",
        items: [
          ["Réification", "L’hôte crée la file avec un temps par défaut, ajoute Pygo et Lillie, crée un groupe avec les stagiaires, l’ajoute à la file et réordonne le tout."],
          ["Ajustement", "Pygo ajuste son propre temps. Une demande est envoyée à l’hôte."],
          ["", "L’hôte reçoit la demande et l’accepte."],
          ["Polymorphisme", "Pygo ajoute quatre fichiers à sa fiche d’intervenant, les rend visibles à tous, puis utilise le même outil d’ordonnancement pour en placer deux dans sa file."],
          ["Feedforward", "Le micro de Lillie devient plus vert à mesure que son tour approche, et elle reçoit une notification deux minutes avant."],
          ["", "Un compte à rebours 3, 2, 1 se lance, puis son micro est activé."],
          ["Feedback", "Lillie termine en avance, et le minuteur affiche toujours le temps qui lui reste."],
          ["", "L’hôte passe au participant suivant."],
        ],
      },
      {
        label: "Après la réunion",
        items: [
          ["Spécialisation", "Quelques instants plus tard, l’hôte enregistre la file comme modèle de réunion."],
          ["Réutilisation", "Il planifie une réunion hebdomadaire en glissant le modèle sur le calendrier. Un double-clic ouvre une réunion avec le modèle appliqué."],
        ],
      },
    ],
    decisions: [
      ["Une file unifiée plutôt que des outils séparés", "L’ordre de parole, les supports partagés et le temps étaient gérés par des interactions déconnectées. Nous les avons fusionnés en une seule chronologie persistante et manipulable : toute la structure de la réunion (qui parle, ce qui est partagé, combien de temps reste) est visible et ajustable au même endroit."],
      ["Un retour progressif et anticipé pour les changements de tour", "Les rappels oraux laissaient les participants incertains sur le moment de leur tour. Nous avons conçu un indicateur de micro qui change visiblement à l’approche du tour, plus un compte à rebours avant la transition, pour que chacun puisse se préparer au lieu d’être pris de court."],
    ],
    outcome: [
      { title: "Avant", copy: "L’hôte construit une première file d’intervenants avant la réunion.", caption: "Partir d’un modèle ou d’une réunion vierge" },
      { title: "Pendant", copy: "Les intervenants joignent leurs supports, demandent des changements de temps, reçoivent des notifications de tour et avancent dans la file en direct.", caption: "La file en direct au-dessus de l’appel" },
      { title: "Après", copy: "L’hôte enregistre la file terminée comme modèle réutilisable pour les prochaines réunions.", caption: "Modèles enregistrés, prêts à être planifiés" },
    ],
    evaluation: [
      "Découvrabilité : l’outil d’ordonnancement n’était pas immédiatement reconnu comme réutilisable.",
      "Clarté : les relations entre intervenants, groupes et médias partagés étaient parfois peu claires.",
      "Anticipation : certaines notifications n’expliquaient pas quoi faire ensuite.",
      "Hiérarchie visuelle : regrouper des participants risquait de réduire leur visibilité individuelle.",
      "Compréhension des modèles : les modèles réutilisables demandaient une représentation plus claire.",
    ],
    evaluationNote: "Évalué par critique de conception et revue de scénarios. Des tests utilisateurs formels et une validation quantitative ne faisaient pas partie de ce projet académique.",
    future: [
      "Réification : utiliser les groupes comme outil pour créer des salles de sous-groupes.",
      "Réutilisation : modèles d’intervenants, par exemple 10 minutes de présentation et 5 minutes de questions.",
      "Polymorphisme : laisser les questions rejoindre la file pendant les séances de Q&R.",
      "Multiplicité : permettre plusieurs intervenants principaux et médias partagés dans la file en même temps.",
      "Au-delà des réunions : entretiens d’embauche et débats.",
    ],
    reflection: [
      "Concevoir des interactions, c’est concevoir des relations entre des objets. Ce projet m’a poussée à penser au-delà des écrans et des fonctionnalités isolés, vers la façon dont objets, actions et retours forment un système cohérent. La leçon principale : une interaction peut être puissante en théorie mais échouer si les gens ne comprennent pas ce que fait un outil ni comment l’utiliser.",
      "Ce que je ferais autrement : intégrer plus tôt des tests d’usabilité (vérifier si modérateurs et participants comprennent et manipulent la file sans explication) et regarder de plus près l’accessibilité, surtout autour des notifications de temps et du comportement du micro.",
    ],
  },

  "zen-rooms": {
    kind: "Design immersif · VR",
    blurb: "Un espace de bien-être en VR de cinq salles qui aident à réguler l’anxiété, construit avec Blender et Unity.",
    facts: [
      ["Rôle", "Water Room, design et interactions · interactions d’interface dans toute l’expérience"],
      ["Équipe", "Lydia Benosmane, Yousra Bourguiba, Maryatou Kante, Gleda Uisetiawan"],
      ["Période", "Janvier–février 2026"],
      ["Outils", "Blender · Unity · XR Interaction Toolkit · VFX Graph · ressources de Sketchfab, Pixabay et de l’Unity Asset Store"],
      ["Contexte", "Advanced Immersive Interactions · Master 1 IHM, Université Paris-Saclay"],
    ],
    brief:
      "Le stress et l’anxiété font partie du quotidien de nombreuses personnes. Zen Rooms se demande si un espace de VR peut aider : un lieu calme et immersif pour s’éloigner des pressions extérieures, se concentrer sur l’instant présent et apprendre des moyens simples de gérer des émotions difficiles. Chaque salle évoque des sensations différentes, pour que chacun trouve le cadre qui lui convient le mieux.",
    heroCaption: "La Water Room, dans Unity",
    steps: [
      {
        title: "De la première ambition aux salles finales",
        copy: "Notre premier prototype imaginait une seule salle guidée de régulation de l’anxiété : un humain virtuel conduisant respiration rythmée et ancrage, des visuels réagissant au rythme de la respiration, une interaction avec les mains et une navigation simple entre les zones, jusqu’à une courte scène de réflexion. En chemin, l’idée est devenue un hub et quatre salles. Nous avons gardé le thème des environnements pour la variété, mais les interactions imaginées ont changé au fil de la construction.",
        bullets: [
          "Hub principal : un espace neutre et apaisant pour s’orienter et choisir son parcours.",
          "Meditation Room : présence, patience et interaction subtile avec un guide semblable à un esprit.",
          "Water Room : libérer la colère, puis le calme, avec des objets à briser et une cascade.",
          "Nature Room : exercices de respiration et exploration lente dans un jardin japonais.",
          "Library Room : réflexion et pleine conscience, avec des papiers d’émotions à trier et à relâcher.",
        ],
      },
      {
        title: "Hub principal",
        copy: "Le hub est la porte d’entrée centrale. Il a été construit de zéro dans Blender puis importé dans Unity, dans un noir et blanc minimaliste qui évoque le yin et le yang : l’équilibre entre les états émotionnels. C’est une zone neutre où l’on peut se recentrer avant de choisir une salle, puis avancer grâce à un système de téléportation intuitif et un bouton interactif par salle.",
        media: ["Construit de zéro dans Blender", "La zone neutre avant de choisir une salle"],
      },
      {
        title: "Meditation Room",
        copy: "Cette salle est un environnement réactif plutôt qu’un parcours linéaire. Le style monochrome continue, réchauffé par une lumière dorée, pour une énergie calme, presque divine. Toute la séance se contrôle par les mouvements naturels de la tête, aucune manette n’est nécessaire.",
        bullets: [
          "Hocher la tête pour commencer : le guide demande la permission et un hochement répond oui. À la fin, un hochement ou un bâillement donne un retour différent.",
          "Vérification de l’immobilité : la salle suit la rotation de la tête. Si la personne s’agite, le guide s’arrête doucement, puis reprend exactement là où il s’était arrêté.",
          "Une cloche entre les interactions confirme chaque étape.",
          "Les bols chantants se frappent avec des maillets, chaque coup choisissant parmi plusieurs sons pour ne jamais sembler robotique.",
          "Des tapis sonores au sol lancent des drones ambiants quand on marche dessus, pour que chacun puisse jouer la salle et créer sa propre atmosphère.",
        ],
        media: ["Piliers sombres, tapis clairs et une main dorée", "« Êtes-vous prêt à commencer la méditation ? Hochez la tête si oui. »", "Des tapis qui déclenchent des drones ambiants", "Bols chantants et maillets"],
      },
      {
        title: "Water Room",
        copy: "C’était ma salle. Elle repose sur deux phases, car pour beaucoup de gens le calme ne vient qu’après avoir relâché la tension. D’abord une libération cathartique, puis une tranquillité immersive : on lâche prise physiquement avant de se poser.",
        bullets: [
          "Phase 1, libération : la salle est pleine de tasses, de vases et d’assiettes que l’on peut attraper et fracasser au sol, une manière sûre de laisser sortir la frustration au lieu de la garder.",
          "Phase 2, calme : un environnement de cascade où l’on ramasse des galets pour les jeter dans l’eau. Chacun envoie des ondes concentriques et un son doux, synchronisés, pour ralentir et observer.",
          "Construction : j’ai conçu la salle dans Blender, avec des textures et objets de bibliothèques en ligne, et un prefab de fontaine pour l’anneau de la cascade. Les objets cassables existent en double au même endroit, un intact et un pré-fracturé, et s’échangent à l’impact pour que les morceaux tombent sous l’effet de la physique. Tout est attrapable via le XR Interaction Toolkit.",
          "Ondes : l’effet de l’eau réagit aux galets qui y entrent plutôt qu’au joueur, avec un script sur chaque galet qui joue son son.",
        ],
        media: ["Premier design, dans Blender", "Salle finale, dans Unity", "Le salon, éclairé par une arche de coucher de soleil", "Phase 1 : des objets à briser", "Phase 1 : tasses, vases et assiettes", "Phase 2 : galets et ondes"],
      },
      {
        title: "Nature Room",
        copy: "Un jardin d’inspiration japonaise bâti sur la retenue et le consentement. Le calme est invité, pas imposé. Un renard guide sans forcer à avancer, et une orbe de respiration propose un exercice d’ancrage facultatif. L’audio ne démarre que lorsque quelqu’un entre volontairement dans la zone.",
        bullets: [
          "Orbe de respiration : elle se disperse quand la respiration est agitée et se rassemble quand elle se stabilise, avec une inspiration, une pause et une expiration guidées dont le rythme est réglable. Elle se met en pause quand on s’éloigne.",
          "Renard guide : il vous accueille à votre approche et ne se met à marcher qu’après avoir touché une pierre rituelle. Il avance lentement, s’arrête pour poser des questions de réflexion et vous fait face quand il parle.",
          "Un rituel d’encens facultatif apaise les visuels et débloque l’étape suivante.",
        ],
        media: ["Le jardin japonais", "Le renard attend sur le chemin", "Une statue se transforme en particules", "L’orbe de respiration"],
      },
      {
        title: "Library Room",
        copy: "Une salle pour mettre ses sentiments hors de soi. On choisit des papiers d’émotions (anxiété, tristesse, colère, calme, bonheur, sérénité) et on les place dans une boîte de tri. Le système lit un niveau de stress à partir des choix et l’affiche sous forme d’une sphère qui change de taille, de couleur, de vitesse de pulsation et de son. Un guide virtuel répond par des paroles rassurantes adaptées, puis on dépose les papiers dans une corbeille, qui les libère dans une explosion de particules, et on appuie sur Fin pour terminer.",
        bullets: [
          "Sphère de stress : plus grande quand le stress monte, du vert au jaune puis au rouge, avec une pulsation plus rapide et un son plus aigu.",
          "Guide : un personnage rigué avec une cinquantaine de blendshapes pour les expressions faciales, animé avec Mixamo, qui prononce des phrases en synthèse vocale choisies selon le niveau de stress.",
        ],
        media: ["La salle de bibliothèque", "Papiers d’émotions et boîte de tri", "Le guide virtuel"],
      },
    ],
    decisions: [
      ["Le consentement plutôt que l’automatisme", "Rien ne démarre tout seul. Un hochement de tête lance la méditation, le guidage audio ne joue qu’une fois dans une zone volontairement, et le renard attend un toucher avant de marcher. Le but est d’inviter au calme plutôt que de l’imposer."],
      ["Libérer d’abord, apaiser ensuite", "Dans la Water Room, nous avons donné un moyen de laisser sortir la tension, en brisant des objets, avant de demander de ralentir avec la cascade. Deux phases, un seul parcours émotionnel."],
      ["Un hub calme et neutre", "Un hub monochrome avec un bouton par salle garde le point de départ simple et équilibré, pour que les salles portent elles-mêmes la couleur et le ressenti."],
    ],
    outcome: [
      { title: "Choisir", copy: "Un hub neutre avec des boutons de téléportation vers chaque salle.", caption: "Hub principal" },
      { title: "Libérer", copy: "Briser des objets, puis lancer des galets dans la cascade.", caption: "Water Room" },
      { title: "Respirer", copy: "Un renard et une orbe de respiration dans un jardin tranquille.", caption: "Nature Room" },
      { title: "Réfléchir", copy: "Trier ses émotions et regarder son stress se calmer.", caption: "Library Room" },
    ],
    future: [
      "Des séances plus personnalisées : choisir un objectif (moins de stress, meilleure concentration, détente) et laisser les salles s’adapter.",
      "De meilleurs visuels et sons : éclairage, particules et audio spatial améliorés.",
      "Des entrées plus naturelles : reconnaissance de gestes ou détection de la respiration.",
      "Davantage d’environnements, avec de nouveaux thèmes et techniques de méditation.",
      "Des tests utilisateurs pour améliorer l’usabilité, l’immersion et l’impact émotionnel.",
      "Une optimisation pour fonctionner sur des ordinateurs moins puissants et des casques autonomes.",
    ],
    reflection: [
      "Garder la VR fluide a été la plus grande contrainte. Certains objets et effets ont dû être simplifiés pour éviter les ralentissements et les plantages, et les limites matérielles nous ont freinés. La Water Room a été la plus difficile pour moi : faire réagir l’eau aux galets a demandé de nombreux essais. Comme chacun de nous construisait une salle différente, nous avons aussi dû tester avec soin pour que les interactions se comportent de façon cohérente dans toute l’expérience.",
      "Les interactions naturelles comme les gestes et la détection de mouvement ont demandé beaucoup d’expérimentation pour paraître intuitives sans casser l’immersion. Certaines salles étaient aussi plus techniques que prévu, et le temps était serré. La prochaine fois, je testerais plus tôt avec de vrais utilisateurs.",
    ],
  },

  "magic-map": {
    kind: "Système interactif · Carte tangible",
    blurb: "Une carte interactive pliable qui permet à de jeunes visiteurs de planifier ensemble un voyage à Paris, et de l’adapter en chemin.",
    facts: [
      ["Équipe", "Lydia Benosmane, Sidonie Minodier, Victoria Myot, Ayda Yurtoglu"],
      ["Mon rôle", "Contribution à toutes les étapes : recherche, conception du système et des interactions, prototypage, tests, refonte, diagrammes et storyboard"],
      ["Période", "Novembre–décembre 2025"],
      ["Méthodes", "8 entretiens · personas · diagrammes système · prototypes papier et vidéo · generative walkthrough · atelier de conception participative"],
      ["Méthode de conception", "Le cercle DOIT de Wendy Mackay"],
      ["Contexte", "Design of Interactive Systems · Master 1 IHM, Université Paris-Saclay"],
    ],
    brief:
      "Les étudiants internationaux de 18 à 26 ans qui visitent Paris sont à l’aise avec la technologie, utilisent des applications de voyage pour explorer efficacement, cherchent des activités qui correspondent à leurs centres d’intérêt et à leur emploi du temps, et voyagent souvent avec des amis. Nous nous sommes penchés sur deux problèmes : il est difficile d’accorder les intérêts, préférences et besoins de chacun quand on prépare un voyage à plusieurs, et il est difficile d’adapter le plan en temps réel quand un imprévu survient, comme une grève ou un lieu fermé.",
    posterCaption: "L’affiche Magic Map, en entier. Touchez pour agrandir.",
    steps: [
      {
        title: "Problème et utilisateurs",
        copy: "Huit entretiens sur les récits de voyage ont révélé deux difficultés récurrentes : accorder les intérêts et les besoins d’un groupe, puis adapter le plan lorsque survient un imprévu. Nous avons conçu pour des étudiants internationaux de 18 à 26 ans, à l’aise avec la technologie et découvrant Paris.",
        bullets: [
          "Le groupe cible aime voyager avec des amis et trouver des activités adaptées à ses centres d’intérêt, son budget et son emploi du temps.",
        ],
      },
      {
        title: "Trois personas",
        copy: "Trois profils nous ont aidés à explorer des besoins différents, dont Cam, un persona extrême dont l’emploi du temps chargé peut l’éloigner du groupe.",
        bullets: [
          "Alf, 20 ans, veut découvrir un maximum de lieux et utilise les réseaux sociaux pour trouver des idées.",
          "Béa, 21 ans, connaît Paris et devient la décideuse et la navigatrice du groupe.",
          "Cam, 21 ans, étudiante et assistante de recherche, est très occupée et doit parfois se séparer de ses amis.",
        ],
        media: ["Alf, Béa et Cam"],
      },
      {
        title: "Première itération : un système papier modulable",
        copy: "Plutôt que de créer une application de plus, nous avons exploré comment une carte papier familière pouvait soutenir la planification collective grâce au pliage, au toucher et à un stylo connecté.",
        bullets: [
          "Plier le côté gauche révélait les listes d’intérêts ; plier le côté droit affichait la chronologie.",
          "Les lieux pouvaient être ajoutés aux listes ou déplacés de la carte vers un itinéraire.",
          "Les cartes pouvaient s’assembler en une surface commune ou se séparer en cartes reliées.",
          "La première version explorait aussi une vue 3D et le vote du groupe.",
        ],
      },
      {
        title: "Premier prototype vidéo et walkthrough",
        copy: "Nous avons présenté le premier prototype vidéo à un autre groupe et mené un generative walkthrough. Les retours ont révélé des interactions ambiguës, des informations masquées par le pliage et des marqueurs difficiles à suivre.",
        bullets: [
          "Le transfert d’un lieu depuis TikTok, son ajout aux listes et l’ajout de lieux absents de la carte manquaient de clarté.",
          "Le mode navigation et l’approbation individuelle des itinéraires prêtaient à confusion ou ralentissaient le groupe.",
          "Le clavier et la disparition des marqueurs étaient difficiles à remarquer dans la vidéo.",
        ],
        videos: ["Premier prototype vidéo"],
      },
      {
        title: "Deuxième itération : des interactions plus claires",
        copy: "À partir du walkthrough, nous avons simplifié le système et mieux pris en compte les changements de plan et les problèmes de connexion.",
        bullets: [
          "Le pliage ouvre un menu de fonctions et d’onglets ; la carte se redimensionne.",
          "Un double-tap sur le stylo permet de passer du tracé automatique au tracé personnalisé.",
          "Les itinéraires peuvent se diviser et proposer une alternative en cas d’imprévu.",
          "Les itinéraires enregistrés restent disponibles hors ligne.",
          "Nous avons retiré la vue 3D et le vote, jugés peu clairs ou redondants.",
        ],
        media: ["Améliorations de la deuxième itération"],
      },
      {
        title: "Un atelier de conception participative",
        copy: "Pendant la phase de refonte, nous avons imaginé et animé notre propre atelier de conception participative. Il comportait deux activités : un défi papier sur la mise en page d’une carte pliable et partagée, et un jeu de rôle sur l’organisation d’une journée à Paris avec des objectifs contradictoires.",
      },
      {
        title: "Activité 1 : le défi papier",
        copy: "Chaque groupe recevait une feuille A3 et pouvait dessiner, coller, plier ou découper à sa guise. Il fallait concevoir la mise en page d’une carte avec quatre éléments : une zone de carte, une liste de lieux à visiter, une frise des activités prévues et une fonction de recherche. Nous fournissions des composants prêts à l’emploi, et les participants pouvaient en créer d’autres, de tailles et de formes différentes. Nous leur avons demandé d’ignorer le contenu et de se concentrer sur la mise en page.",
        bullets: [
          "Le papier doit être plié au moins deux fois.",
          "Il doit être divisible : le design doit permettre de le déchirer ou de le séparer en deux parties fonctionnelles.",
          "Il doit être utilisable par deux personnes en même temps, sur la même carte.",
        ],
      },
      {
        title: "Activité 2 : le jeu de rôle",
        copy: "Sept amis organisent une même journée à Paris, de 8 h à 20 h. Chaque joueur lit sa carte de rôle en silence et garde un objectif personnel secret. Il le défend autant qu’il peut, car l’atteindre fait gagner une petite surprise, pendant que le groupe négocie un itinéraire commun en 15 minutes. Les participants construisaient la journée avec des cartes de lieux (monuments, restaurants, cafés, musées et autres sorties) sur un planning de 8 h à 20 h, découpé en matin, déjeuner, après-midi et soir.",
        bullets: [
          "Trois rôles simples : la Matcha Lover, le fan de Fancy Resto et la Museum Enthusiast.",
          "Quatre rôles complexes : le Vegan, le Non-walker, le Try-Hard et la Time-Sensitive Person, qui veut son café à 10 h et la tour Eiffel au coucher du soleil.",
          "Parmi les lieux : Veggie Heaven, un Fancy Steakhouse trois étoiles, Shodai Matcha, le Louvre, la tour Eiffel, une croisière sur la Seine et un karaoké.",
        ],
        media: ["Cartes de rôle : les rôles simples et le Vegan", "Cartes de rôle : le Non-walker, le Try-Hard et la Time-Sensitive Person"],
      },
      {
        title: "Storyboard révisé et tests du prototype papier",
        copy: "Le storyboard suit Alf, Béa et Cam de la préparation de leur séjour à leur déplacement dans Paris, avec un itinéraire qui se divise et une consultation hors ligne. Nous avons testé le premier prototype papier, puis sa version modifiée.",
        media: ["Storyboard : des idées sur des post-it", "Storyboard : dessiner les parcours", "Images de storyboard et l’interaction qui va avec chacune"],
      },
      {
        title: "Prototype vidéo final",
        copy: "Le prototype final met en scène les changements de la deuxième itération : planifier ensemble, séparer l’itinéraire et continuer à naviguer malgré une connexion instable.",
        videos: ["Deuxième prototype vidéo"],
      },
    ],
    evaluation: [
      "Le generative walkthrough a révélé des ambiguïtés dans le transfert de lieux, les gestes de pliage, l’approbation des itinéraires et le mode navigation.",
      "La deuxième itération a répondu à ces retours avec un menu de fonctions, plusieurs modes de tracé, des itinéraires divisibles et la navigation hors ligne.",
    ],
    decisions: [
      ["Une carte physique, pas une application de plus", "Les voyageurs jonglent déjà avec plusieurs applications. Une carte pliable offre une surface partagée que tout le monde peut voir et toucher en même temps, et qui fonctionne même sans wifi."],
      ["Plier pour passer d’ensemble à séparés", "Le même objet permet la planification partagée quand il est ouvert et la concentration individuelle quand il est plié, exactement la tension révélée par le persona de Cam."],
      ["Concevoir pour l’imprévu", "Les itinéraires peuvent être scindés et déviés, et les scénarios incluent grèves et fermetures, car des plans qui ne changent jamais ne sont pas la réalité d’un voyage."],
    ],
    outcome: [],
    future: [
      "Filtrer les lieux par catégories.",
      "Gérer un très grand nombre de lieux enregistrés.",
      "Orientation de la carte.",
      "Planification du budget.",
    ],
    reflection: [
      "J’ai contribué à toutes les étapes du projet, de la recherche et la conception jusqu’au prototypage, aux tests et à la refonte. Concevoir pour un groupe demande de penser à la personne qui mène, celle qui suit et celle qui doit partir plus tôt ; le jeu de rôle avec des objectifs concrets a révélé des problèmes que les croquis seuls ne montraient pas.",
    ],
  },

  javarista: {
    kind: "Jeu sérieux · Apprentissage du Java",
    blurb: "Un jeu chaleureux autour du café qui enseigne la logique Java à travers des recettes, des blocs de code et l’expérimentation.",
    facts: [
      ["Équipe", "Lydia Benosmane, Sidonie Minodier, Victoria Myot"],
      ["Mon rôle", "Contribution à toutes les étapes, avec un accent sur le game design Unity, l’interface, les interactions avec le code et les visuels"],
      ["Période", "Novembre–décembre 2025"],
      ["Méthodes", "Revue de littérature · conception système · prototypage Unity · étude d’utilisabilité · think-aloud · questionnaire de charge de travail"],
      ["Outils", "Unity · C#"],
      ["Contexte", "Design of Interactive Systems · Master 1 IHM, Université Paris-Saclay"],
    ],
    brief:
      "Javarista est un jeu sérieux destiné aux personnes qui connaissent quelques concepts informatiques mais débutent en Java. Le jeu enseigne la logique de programmation à travers une activité familière : préparer des boissons en manipulant des ingrédients, des actions et des blocs de code visuels.",
    heroCaption: "Interface du jeu Javarista",
    heroCaptions: ["", "Croquis initial de l’interface : espace de code à côté de la scène de préparation du café"],
    links: [
      { label: "Lire le rapport final", hint: "Recherche, conception et étude d’utilisabilité du projet" },
    ],
    steps: [
      {
        title: "Apprendre Java à travers le jeu",
        copy: "Nous avons conçu un jeu 2D de préparation de café, centré sur la logique Java plutôt que sur les types élémentaires comme int ou string. Deux panneaux rendent visible le lien entre les instructions et leurs effets.",
        bullets: [
          "Les joueurs assemblent des blocs de code préécrits dans une fonction Main, puis lancent une recette.",
          "La scène anime la préparation ; une logique incorrecte entraîne un retour visuel.",
          "La métaphore du café relie les ingrédients, les actions et la répétition aux concepts de programmation.",
        ],
        media: ["Le prototype associe un espace de code à la scène de jeu"],
        externalVideos: ["Présentation du jeu Javarista"],
      },
      {
        title: "Niveau 1 : de la scène au code",
        copy: "Les joueurs préparent un café glacé en interagissant directement avec la scène. Chaque ingrédient ajouté crée une ligne de code, pour introduire les méthodes et les boucles à travers la répétition des actions.",
        media: ["Niveau 1 : les actions dans la scène génèrent du code"],
        externalVideos: ["Prototype de gameplay du niveau 1"],
      },
      {
        title: "Niveau 2 : du code à la scène",
        copy: "Les joueurs déplacent et assemblent des blocs de code pour suivre une recette. Ils appliquent la logique découverte au niveau précédent ; des indices indiquent la prochaine étape lorsqu’ils sont bloqués.",
        media: [
          "Niveau 2 : le code commande la préparation de la boisson",
          "Concept d’un niveau ultérieur où les joueurs écriraient des méthodes",
        ],
        externalVideos: ["Prototype de gameplay du niveau 2"],
      },
      {
        title: "Étude d’utilisabilité",
        copy: "Nous avons évalué les deux niveaux jouables avec 11 personnes d’une vingtaine d’années ayant une expérience ou des bases en informatique. Des séances de think-aloud, les erreurs observées et les temps de réalisation ont été associés à un questionnaire inspiré du NASA-TLX et à des entretiens.",
        media: ["Charge de travail moyenne avec et sans indices"],
      },
    ],
    decisions: [
      ["Enseigner la logique avec une métaphore familière", "Préparer une boisson rend les idées abstraites plus concrètes, tout en gardant le jeu centré sur les méthodes, les fonctions et la répétition."],
      ["Explorer les deux sens entre action et code", "Le premier niveau transforme les interactions en code ; le deuxième demande aux joueurs de créer du code qui modifie la scène."],
      ["Utiliser des retours et des indices pour accompagner", "Les animations montrent l’effet du code, tandis que les indices aident les joueurs bloqués sans supprimer le défi."],
    ],
    outcome: [],
    evaluation: [
      "7 personnes sur 11 ont préféré le niveau code-vers-scène ; la logique entre les panneaux de jeu et de code a obtenu une note moyenne de 4,7/5.",
      "10 personnes sur 11 ont trouvé les consignes claires, et 4 des 6 personnes ayant essayé les indices les ont trouvés utiles.",
      "Les 11 personnes ont déclaré avoir apprécié le jeu.",
      "5 personnes sur 11 ont estimé le prototype efficace pour apprendre ; la plupart avaient déjà un niveau intermédiaire ou supérieur en Java.",
      "Le niveau 1 a duré 61 secondes en moyenne. Les temps du niveau 2 variaient beaucoup, donc la comparaison avec et sans indices n’était pas concluante.",
    ],
    evaluationNote: "Cette petite étude d’utilisabilité menée auprès de 11 personnes n’était pas une étude contrôlée des résultats d’apprentissage. Leur expérience préalable en Java limite les conclusions sur l’efficacité du jeu pour des débutants.",
    future: [
      "Ajouter un tutoriel et davantage de concepts Java : classes, conditions, boucles et objets.",
      "Réduire les difficultés du glisser-déposer avec une fonction annuler et une interaction mixte entre code et scène.",
      "Améliorer la lisibilité et le découpage des blocs de code, et ajouter des retours en temps réel, du son et des animations.",
      "Développer les fonctionnalités prévues : plusieurs commandes et une évaluation des performances.",
    ],
    reflection: [
      "J’ai contribué à toutes les étapes du projet, en particulier au game design Unity, aux interactions entre l’interface et le code, et aux visuels. L’étude a confirmé l’importance de vérifier non seulement si l’interface est comprise, mais aussi si le lien pédagogique imaginé par le design est clair.",
    ],
  },

  bookerfly: {
    kind: "Projet de design · Lecture sociale",
    blurb: "Une plateforme de lecture communautaire où lectures de groupe, annotations et extraits se font dans le livre, sans quitter la page.",
    facts: [
      ["Équipe", "Lydia Benosmane, Sidonie Minodier, Victoria Myot, Alizée Xia"],
      ["Période", "2026, en deux temps : un pictorial, puis un article complet"],
      ["Outils", "Prototypage papier · prototype HTML, CSS et JavaScript · NASA-TLX · pensée à voix haute"],
      ["Contexte", "Projets de design · Master 1 IHM, Université Paris-Saclay"],
    ],
    links: [
      { label: "Article : Bookerfly, a Community-Based, Collaborative Reading System", hint: "PDF · 8 pages · processus de conception et évaluation d’usabilité (en anglais)" },
      { label: "Pictorial : Bookerfly, a Community-Driven and Collaborative Reading System", hint: "PDF · 5 pages · concept, scénario et première étude de prototype papier (en anglais)" },
    ],
    brief:
      "La lecture est devenue un loisir plus populaire chez les étudiants depuis la pandémie, et les plateformes numériques comme Apple Books, Wattpad, Webtoon ou Goodreads ne cessent de croître. Pourtant, quand les lecteurs veulent discuter d’un passage ou partager une citation, ils doivent généralement quitter le livre pour une messagerie externe, ce qui casse l’immersion. Bookerfly garde la communauté dans l’espace de lecture, pour les étudiants et les jeunes, sur ordinateur et tablette.",
    heroCaption: "Des prototypes papier à la mise en œuvre",
    steps: [
      {
        title: "Écouter les lecteurs",
        copy: "Nous avons mené huit entretiens narratifs avec des lecteurs numériques fréquents, six étudiants et deux jeunes adultes, qui lisent tous les jours sur téléphone, tablette et ordinateur. Deux problèmes ressortaient.",
        bullets: [
          "Les lecteurs aiment échanger avec les autres, mais pour cela ils doivent quitter l’espace de lecture, ce qui casse l’immersion.",
          "Les lecteurs manquent de moyens d’interagir avec l’histoire dans son contexte. Souvent, tout ce qu’ils ont, ce sont des marque-pages et des surlignages.",
        ],
      },
      {
        title: "Lire la littérature",
        copy: "Nous avons lu dans trois domaines pour ancrer la conception.",
        bullets: [
          "Communauté : la lecture est une pratique socialement située. L’influence sociale façonne ce que l’on choisit, comment on lit et comment on interprète, et un sentiment de présence sociale améliore la satisfaction et l’engagement.",
          "Usabilité des e-books : fatigue visuelle, mauvaise navigation et usage restrictif par rapport au papier. La cohérence avec le monde réel, un texte lisible, des marque-pages faciles et des annotations flexibles comptent.",
          "Annotations numériques : le besoin de niveaux public et privé, d’annotations visuellement distinctes du texte et qui interrompent le moins possible la lecture. Trop d’annotations peuvent surcharger le lecteur.",
        ],
      },
      {
        title: "Choisir les fonctionnalités principales",
        copy: "Nous avons fait un brainstorming avec la technique 10+10 autour de deux dimensions : l’interaction avec le contenu et l’interaction avec les autres lecteurs. Pour trancher, nous avons mené une procédure Delphi : chacune a listé 5 à 10 fonctionnalités, un autre groupe d’experts les a consolidées en 11 énoncés, et chacune les a classées. Trois sont arrivées en tête : lectures de groupe, annotations et extraits.",
        media: ["Espace de conception, partie 1", "Espace de conception, partie 2"],
      },
      {
        title: "Les fonctionnalités",
        bullets: [
          "Annotations : surligner, dessiner ou écrire directement sur la page, comme sur un livre papier. Un double toucher efface l’interface et ouvre un menu avec stylo, surligneur et gomme. Les annotations des autres lecteurs peuvent être affichées ou masquées avec un interrupteur.",
          "Extraits : sélectionner un passage, toucher l’icône ciseaux, puis l’enregistrer dans sa collection ou l’envoyer dans une discussion. Un extrait est un lien vers sa place dans le livre. Si le destinataire n’a pas encore atteint ce point, il apparaît comme un spoiler qu’il peut choisir de révéler.",
          "Lectures de groupe : lire, annoter et discuter du même livre de façon asynchrone. Une discussion glisse depuis le bord de la page pour ne jamais recouvrir le texte.",
          "Statistiques de lecture : vitesse de lecture et activité hebdomadaire, mensuelle ou annuelle, publiques ou privées, avec des statistiques de groupe pour les lectures de groupe.",
        ],
        media: ["Le scénario, tiré du pictorial : Anne lit, extrait un passage et le partage avec son groupe"],
      },
      {
        title: "Papier, puis code",
        copy: "Nous avons d’abord esquissé chaque fonctionnalité sur papier, en nous inspirant des mises en page d’Apple Books et de Wattpad pour que l’accueil soit familier. Notre première étude a utilisé des prototypes papier avec trois participants, deux conditions de prototype et la technique du magicien d’Oz. Nous avons ensuite construit un prototype web multi-pages en HTML, CSS et JavaScript avec des vues Bibliothèque, Lecteur, Discussions, Extraits et Profil, un fichier de données simulant un serveur et le localStorage pour conserver les actions.",
        media: ["Premières esquisses", "Prototype papier et mise en œuvre", "Des esquisses à la mise en œuvre, tiré de l’article"],
      },
      {
        title: "Test avec huit lecteurs",
        copy: "Huit étudiants (quatre femmes, quatre hommes, tous d’une vingtaine d’années, lisant environ cinq heures par semaine en numérique) ont testé le prototype sur tablette et ordinateur. Notre hypothèse : les participants peuvent découvrir et utiliser les fonctionnalités principales sans aide et dans un temps raisonnable. Ils ont ouvert une lecture de groupe, trouvé la discussion intégrée, tourné des pages, annoté avec des dessins et des surlignages, affiché et masqué les annotations des autres, partagé un extrait dans la discussion du groupe, puis exploré librement jusqu’à dix minutes. Nous avons recueilli des enregistrements de pensée à voix haute, des journaux de clics, des notes d’observation, un questionnaire NASA-TLX et des retours ouverts.",
        media: ["Résultats NASA-TLX", "Découvrabilité et fonctionnalités préférées"],
      },
    ],
    decisions: [
      ["Garder la communauté dans le livre", "La discussion de groupe est un panneau au bord de la page et les extraits vont directement dans une discussion : les lecteurs n’ont jamais à quitter l’histoire pour en parler."],
      ["Des annotations qui savent s’effacer", "Les dessins peuvent être masqués par les autres lecteurs. Un participant a dit que cela évitait de culpabiliser de recouvrir des mots."],
      ["Un partage conscient des spoilers", "Un extrait d’une partie du livre que vous n’avez pas atteinte est masqué jusqu’à ce que vous choisissiez de le révéler."],
    ],
    outcome: [],
    evaluation: [
      "La demande mentale était en moyenne de 3,5 sur 7, neutre. La demande temporelle était un peu plus élevée, à 3,88, probablement parce que les participants étaient observés en permanence. La frustration et la charge de travail étaient faibles.",
      "L’interface était facile à parcourir. Cinq participants sur huit ont trouvé les fonctionnalités faciles à découvrir, tandis que trois ont trouvé les extraits et les annotations difficiles à trouver.",
      "Fonctionnalités préférées : les extraits (3), les annotations à main levée (2), les statistiques d’activité (2) et l’avertissement de spoiler des extraits (1).",
      "Cinq participants sur huit pensaient que les lectures de groupe se trouvaient dans les discussions, alors que l’onglet s’appelait Groupes.",
      "« J’aimerais vraiment avoir ça dans la vraie vie. » Tous les participants ont dit aimer Bookerfly.",
    ],
    evaluationNote: "Les participants ont été recrutés sur notre propre campus, ce qui peut biaiser les retours.",
    future: [
      "Un bouton d’aide accessible depuis chaque écran, avec un court tutoriel pour les nouveaux utilisateurs.",
      "Rendre les fonctionnalités plus découvrables : sélectionner du texte ouvre aussi le mode annotation et surligne le texte.",
      "Une icône ciseaux pour les extraits, une Collection d’extraits à la place d’une galerie, et plus d’extraits d’images.",
      "Des icônes et boutons plus grands et plus explicites, avec une icône de surligneur plus claire.",
      "Des annotations saisies au clavier sur tablette et ordinateur, l’annulation, et des profils explorables.",
    ],
    reflection: [
      "Bookerfly m’a montré à quel point une fonctionnalité peut être juste et pourtant difficile à trouver. Les participants ont adoré les extraits et les annotations une fois découverts : la plupart de nos améliorations concernent donc l’accueil et la clarté, pas de nouvelles fonctions.",
    ],
  },

  khamsa: {
    kind: "Impression 3D · Interface tangible",
    blurb: "Un tableau de Khamsas imprimées en 3D qui unit la broderie algérienne à un symbole protecteur. « Une seule main ne peut pas applaudir. »",
    facts: [
      ["Titre", "يد واحدة ما تصفق · Yedd ouahda ma tsafek · Une seule main ne peut pas applaudir"],
      ["Période", "10 mars au 23 avril 2026"],
      ["Outils", "Autodesk Fusion avec courbes de Bézier dessinées à la main · PrusaSlicer · impression 3D FDM"],
      ["Contexte", "The Art of Fabricating Tangible Interfaces 2026 · Université Paris-Saclay"],
    ],
    links: [{ label: "Journal de fabrication", hint: "Documentation hebdomadaire de tout le processus (en anglais)" }],
    brief:
      "Je voulais mêler ma culture à l’expression créative. J’ai associé la broderie algérienne, en particulier celle d’Alger, à Al Khamsa, la main de Fatma, un symbole utilisé dans toute l’Afrique du Nord comme emblème protecteur contre les énergies négatives et le mauvais œil. Le résultat est une mosaïque de mains imprimées réunies en un seul tableau : chaque pièce seule est un symbole, ensemble elles forment un tout.",
    heroCaption: "La pièce complète au Tangible Interface Show, le 23 avril 2026",
    steps: [
      {
        title: "Semaine 1 : trouver le dessin",
        copy: "J’avais déjà utilisé Fusion et PrusaSlicer dans un cours de CAO le semestre précédent, cette semaine a donc servi à trouver l’idée. J’ai trouvé l’inspiration sur Pinterest, puis dessiné chaque spirale à la main avec des courbes de Bézier dans Fusion, jusqu’à ce que l’esquisse atteigne environ 5 000 points et ralentisse beaucoup Fusion. Pour le premier test, j’ai imprimé la moitié du dessin en creux et l’autre moitié en relief, pour choisir entre une version évidée et une version en relief.",
        media: ["Inspiration", "Le dessin commence", "Spirale après spirale", "Le premier dessin complet", "Découpé pour le premier test"],
      },
      {
        title: "Semaine 2 : en creux ou en relief, et comment relier",
        copy: "L’impression a pris beaucoup de temps. J’ai choisi la version évidée parce qu’elle rendait mieux. Certaines parties du motif n’étaient pas reliées et l’impression se défaisait facilement : j’ai donc supprimé toutes les pièces non connectées. J’ai relié les Khamsas en mosaïque, remarqué une forme au milieu et l’ai dessinée comme une pièce à part entière. Pour les connecteurs, j’ai d’abord essayé une fente avec une languette, puis des pièces de puzzle, mais une impression fine comme du papier rendait les pièces de puzzle peu judicieuses.",
        media: ["Première impression", "Les parties non reliées se sont défaites", "Relier les Khamsas", "Premier connecteur", "Pièces de puzzle, abandonnées"],
      },
      {
        title: "Semaine 3 : moins de détails, meilleure impression",
        copy: "J’ai appris que chaque impression devait faire 5 cm² au maximum : les détails n’auraient donc même pas été visibles, et la version détaillée prenait beaucoup trop de temps. J’ai fortement réduit les détails, choisi de nouvelles inspirations, et à nouveau dessiné à la main dans Fusion plutôt que d’importer un SVG. L’impression a échoué de nombreuses fois. J’ai testé des hauteurs de couche de 0,07 et 0,10 et choisi 0,07 car elle donnait le plus de finesse.",
        media: ["Nouvelle inspiration", "Le dessin final, point par point", "Une des nombreuses impressions ratées", "0,07 contre 0,10", "Réglages et taille finaux", "Première disposition"],
      },
      {
        title: "Semaine 4 : impressions ratées et connecteurs",
        copy: "Une semaine d’impressions ratées. Je me suis concentrée sur les connecteurs. Les premiers n’étaient pas jolis, et les idées suivantes étaient trop en volume, alors je les ai abandonnées.",
        media: ["Un autre échec", "Un peut-être", "Un non"],
      },
      {
        title: "Semaine 5 : nouvelle disposition et impression en série",
        copy: "Surtout de l’impression en série du dessin finalisé, et le choix d’une nouvelle disposition des pièces.",
        media: ["Une nouvelle disposition"],
      },
      {
        title: "Semaine 6 : enfin les connecteurs",
        copy: "L’impression en série était réussie et j’avais recouvert la moitié de mon support en carton, mais je n’avais toujours aucun connecteur qui me plaise. J’en ai dessiné beaucoup à la main, soit en gardant le thème des arabesques, soit avec des formes de lune et d’étoile, qui représentent ma religion et le drapeau de l’Algérie. Ils n’étaient pas assez solides, les étoiles aux extrémités cassaient sans cesse, alors je les ai transformés en flèches. J’ai pu ensuite assembler, avec l’aide de Marya.",
        media: ["Essai doré, raté", "À mi-parcours du recouvrement du tableau", "Essais de connecteurs", "Les étoiles cassaient sans cesse", "Les connecteurs finaux", "Assemblage, avec Marya"],
      },
    ],
    decisions: [
      ["En creux plutôt qu’en relief", "La version évidée montrait bien mieux la broderie que le relief."],
      ["Des courbes dessinées à la main, pas un SVG", "Chaque spirale et chaque connecteur a été dessiné à la main avec des courbes de Bézier, même quand cela coûtait du temps. Le dessin fait partie de l’œuvre."],
      ["Des connecteurs transparents", "J’ai choisi des connecteurs transparents à dessein, pour préserver l’harmonie visuelle des pièces."],
    ],
    outcome: [{ title: "Le tableau", copy: "Des Khamsas noires et dorées réunies en une seule mosaïque.", caption: "Le tableau final" }],
    reflection: [
      "Le Tangible Interface Show a eu lieu le 23 avril 2026. Le nom de la pièce est un proverbe : une seule main ne peut pas applaudir. Une Khamsa seule est une main, et ce n’est qu’ensemble que les pièces forment quelque chose que l’on peut regarder et toucher.",
      "L’essentiel du travail a été d’échouer : impressions ratées, connecteurs ratés et étoiles cassées. La leçon : simplifier, et tester à la taille réelle, 5 cm², avant de dessiner les détails.",
    ],
  },

  "suite-numerique": {
    kind: "Designathon · Outils numériques publics",
    blurb: "Et si la suite numérique de l’État n’avait plus d’applications ? Dans SuiteSpace, Tchap, Grist, Visio et les autres deviennent des objets sur un seul canevas partagé, et Cagette permet de les emporter d’un espace à l’autre.",
    facts: [
      ["Contexte", "Stage à l’Inria (Ex-Situ), designathon co-organisé avec la DINUM et ENSEMBLE"],
      ["Dirigé par", "Wendy Mackay, Michel Beaudouin-Lafon et Janin Koch"],
      ["Mon équipe", "Groupe 5, SuiteSpace : Lydia Benosmane, Emma-Jade De Moor, Victoria Myot"],
      ["Calendrier", "Ateliers en mai 2026, designathon en juin 2026"],
      ["Méthodes", "Conception participative · Prototypage papier · Prototypage vidéo"],
    ],
    links: [{ label: "Ouvrir le prototype Figma", hint: "Prototype interactif de La Suite numérique" }],
    heroCaption: "Le prototype SuiteSpace dans Figma",
    embedCaption: "Le prototype Figma, en direct : cliquez pour l’essayer",
    videoCaption: "Prototype vidéo de SuiteSpace, fait en papier : une équipe réorganise son planning quand une collègue est malade",
    brief:
      "La Suite numérique regroupe les outils numériques de l’État pour les agents publics : Tchap pour les messages, Visio pour les appels, Grist pour les tableaux, Docs et d’autres. Chaque outil est une application séparée : un même travail se retrouve éparpillé dans plusieurs fenêtres, et faire passer une information de l’une à l’autre oblige à copier, re-téléverser et chercher. Le designathon posait une question audacieuse : et si on arrêtait de penser en applications ? Nous sommes partis des substrats d’interaction, un concept développé par Wendy Mackay et Michel Beaudouin-Lafon, où l’information devient des objets que l’on voit, déplace et combine, et où les outils deviennent des instruments qui agissent sur ces objets.",
    steps: [
      {
        title: "Ateliers : une frustration, un prototype papier",
        copy: "Pendant les semaines précédant le designathon, nous avons participé à des ateliers hebdomadaires de conception participative. En petits groupes, nous choisissions une frustration du quotidien avec La Suite, y répondions par des prototypes papier, puis filmions chaque idée en court prototype vidéo.",
        videos: [
          "File alternative de partage d’écran : les présentateurs alignent ce qu’ils vont partager, et changer se fait d’un geste (19 mai 2026)",
          "Agenda en frise : survoler un appel affiche l’ordre du jour sous forme de frise ; une section ouvre la vue détaillée (21 mai 2026)",
          "Marqueurs visuels : un clic pose un marqueur dans la transcription en direct, pour le retrouver, le modifier ou l’annoter plus tard",
          "Calendrier dans Visio : glisser « Nouvelle réunion » sur le calendrier pour la planifier, et rejoindre une réunion en cours depuis l’accueil",
        ],
      },
      {
        title: "Le brief du designathon : des applications aux substrats",
        copy: "Plutôt qu’améliorer une application, le designathon nous demandait de supprimer les frontières entre elles.",
        bullets: [
          "Un message, un fichier ou une ligne de tableau vit sur un canevas, pas dans une application.",
          "Les outils deviennent des instruments que l’on peut combiner en instruments plus spécialisés.",
          "Les espaces peuvent être personnels, partagés avec une équipe, ou collaboratifs.",
        ],
      },
      {
        title: "Une situation réelle comme point de départ",
        copy: "Nous sommes partis d’un scénario que toute équipe connaît : une collègue est malade. Mandy, la manageuse, doit refaire le planning de l’équipe, garder une trace de ses changements, prévenir tout le monde et envoyer un récapitulatif à sa hiérarchie en fin de journée. Les personnages étaient communs à tous les groupes : Mandy la manageuse, Abby absente, Laeticia en retard et Ross le chef.",
      },
      {
        title: "Premier essai sur papier",
        copy: "Avant de filmer, nous avons joué l’idée avec des découpages en papier : une SuiteSpace pour un « Projet Éducation Numérique », où membres de l’équipe, fichiers et mails sont des objets que l’on prend et déplace. Dérouler le scénario à la main nous a permis de vérifier chaque étape avant de tourner la vidéo.",
        videos: ["La version papier de SuiteSpace, testée à la main"],
      },
      {
        title: "SuiteSpace : un seul canevas pour toute l’équipe",
        copy: "SuiteSpace remplace les applications séparées par un canevas unique. Dans le prototype Figma, les icônes de La Suite (Tchap, Docs, Visio, Grist…) deviennent des outils que l’on peut combiner. Dans notre prototype vidéo, fait en papier (en haut de cette page) :",
        bullets: [
          "Mandy crée une SuiteSpace et la partage avec son équipe.",
          "Le message d’Abby, malade, arrive comme un objet dans l’espace, avec son arrêt maladie en pièce jointe.",
          "Mandy réattribue les tâches d’Abby directement dans le planning de l’équipe, et note pourquoi.",
          "Chaque collègue organise les mêmes éléments partagés dans sa propre disposition.",
          "En fin de journée, Mandy rassemble ce dont elle a besoin dans sa Cagette et en fait un modèle pour le prochain récapitulatif.",
        ],
      },
      {
        title: "Cagette : un panier pour vos informations",
        copy: "Cagette est un instrument de sélection : on y glisse des documents, des messages ou des lignes de tableau, puis on les emporte de sa SuiteSpace personnelle vers celle de l’équipe, ou vers n’importe quel espace. Cagette vient du groupe voisin (Groupe 4 : Yousra Bourguiba, Mathys Caetano, Mélodie Sanchez), et SuiteSpace l’utilise pour déplacer des éléments entre les espaces.",
        videos: ["Le prototype vidéo de Cagette : après la suppression d’un document, l’équipe rassemble les morceaux depuis ses espaces de travail pour le refaire"],
      },
    ],
    decisions: [
      ["Des objets, pas des applications", "Tout ce dont Mandy a besoin est sur un seul canevas : rien ne se perd entre les fenêtres et le contexte reste visible."],
      ["Des données, plusieurs dispositions", "Chacun organise les mêmes éléments partagés à sa façon, tandis que les données restent identiques pour tous."],
      ["Un panier plutôt qu’un copier-coller", "Cagette rassemble des éléments et les transporte d’un espace à l’autre. Enregistrée comme modèle, une sélection devient un instrument réutilisable."],
    ],
    outcome: [],
    future: ["Une file d’attente pour Visio, dans la continuité de l’atelier sur le partage d’écran", "Des transcriptions interactives en direct, dans la continuité de l’atelier sur les marqueurs visuels"],
    reflection: [
      "Ce que nous avons montré à la fin : plusieurs dispositions personnelles peuvent coexister sur un même ensemble de données, des outils généraux peuvent se combiner en outils spécialisés, et une sélection peut devenir un modèle.",
    ],
  },
  "color-ai-t": {
    kind: "Système interactif · Application de coloriages par IA",
    blurb: "Une application pour tablette, au stylet, qui transforme vos idées en coloriages grâce à l’IA, et vous laisse modifier seulement la partie que vous voulez.",
    facts: [
      ["Équipe", "Groupe 2 : Moizza Azhar, Lydia Benosmane, Jay Gupte, Daniyal Nasiri Bavil, Ayda Yurtoglu"],
      ["Mon rôle", "Entretiens, puis concept, scénarios, storyboards, refonte et étude utilisateur avec l’équipe"],
      ["Période", "Janvier–février 2026"],
      ["Méthodes", "8 entretiens sur les récits d’usage · alternatives de conception · scénarios et storyboards · prototypes papier et vidéo · generative walkthrough · étude utilisateur comparative"],
      ["Méthode de conception", "Le cercle DOIT de Wendy Mackay"],
      ["Contexte", "Advanced Design of Interactive Systems · Master 1 IHM, Université Paris-Saclay"],
    ],
    videoCaption: "Prototype vidéo final, fait en papier : dessiner, sélectionner une partie de l’image et donner une instruction à l’IA",
    brief:
      "Créer un coloriage avec l’IA devrait être rapide, mais les personnes que nous avons interrogées se heurtaient aux mêmes obstacles : elles ne trouvaient pas les mots pour décrire ce qu’elles imaginaient, les traits n’étaient pas toujours faciles à colorier, et elles ne pouvaient pas modifier une partie de l’image sans tout recommencer. Nous avons conçu une application pour tablette, au stylet, destinée aux amateurs de coloriage, aux parents qui veulent des pages sur mesure pour leurs enfants et à toute personne qui souhaite son propre livre de coloriage.",
    steps: [
      {
        title: "Entretiens sur les récits d’usage",
        copy: "Nous avons commencé par écouter comment les gens créent vraiment des coloriages avec l’IA. Notre groupe a mené huit entretiens avec des personnes ayant essayé Colorify AI et ChatGPT. J’en ai mené deux, avec une étudiante en architecture de 19 ans et un étudiant en informatique de 25 ans.",
        bullets: [
          "Il est difficile de décrire une image avec des mots. « Je dis un joli papillon avec des ailes, mais je ne sais pas être plus précise. »",
          "Les images générées ne sont pas toujours bonnes à colorier : des artefacts sans sens, des traits difficiles à suivre. « La rose ne ressemblait pas du tout à une rose… on aurait dit un horrible champignon. »",
          "On recommence plusieurs fois, et on s’arrête par fatigue plutôt que par satisfaction. « Quand avez-vous décidé que le coloriage était assez bien ? » « Quand j’ai été fatigué. »",
          "Modifier est difficile : on ne peut pas facilement changer une partie de l’image.",
        ],
        media: ["Ce que les entretiens ont montré"],
      },
      {
        title: "Des entretiens aux besoins",
        copy: "Nous avons lu les transcriptions côte à côte pour en tirer ce qui revenait sans cesse. Trois problèmes ressortaient : la difficulté à formuler des prompts, une mise en page mobile qui déroute, et l’absence d’historique visuel pour comparer les résultats. Mes propres constats après mes deux entretiens :",
        bullets: [
          "L’IA échoue souvent quand la demande est précise ou imaginative.",
          "Quand ils ne sont pas satisfaits, les gens ajoutent des mots-clés au lieu de changer d’approche.",
          "Si une page est « assez bien », on l’accepte et on passe à autre chose.",
          "De petits choix d’interface frustrent même quand l’outil est simple, comme remonter faire défiler pour trouver « Générer », ou perdre les images précédentes sauf à les télécharger.",
          "On fait davantage confiance aux outils qui expliquent leurs limites et proposent des alternatives qu’à ceux qui échouent en silence.",
        ],
      },
      {
        title: "Brainstorming : quatre directions",
        copy: "Avant de choisir, nous avons esquissé quatre façons différentes d’aider quelqu’un à créer un coloriage.",
        bullets: [
          "Création par nœuds : construire une page à partir de prompts reliés.",
          "Search One : partir d’une recherche sur internet plutôt que d’un prompt.",
          "Usage éducatif : un outil qui enseigne une notion grâce au coloriage.",
          "Livre d’histoires : IA, coloriages et récit réunis, pour les enfants.",
        ],
        media: ["Les alternatives que nous avons envisagées"],
      },
      {
        title: "Le concept",
        copy: "Nous avons approfondi un seul problème : les mots ne suffisent pas pour modifier une partie précise d’un coloriage. Color-AI-t génère des contours de coloriage avec l’IA à partir d’un texte, d’un croquis ou d’une photo, et permet de modifier une partie à la fois ou d’appliquer un style.",
        bullets: [
          "L’IA propose et la personne a toujours le dernier mot.",
          "On peut sélectionner et modifier des parties précises du contour, localement ou globalement.",
          "On peut corriger le résultat de l’IA directement sur le canevas, et revenir à n’importe quelle version précédente.",
        ],
        media: ["L’idée de conception", "Comment la personne et l’IA se partagent le contrôle"],
      },
      {
        title: "Scénarios et storyboards",
        copy: "Nous avons écrit des scénarios autour d’Anna, 24 ans, créative, qui colorie par passion, et les avons dessinés sous forme de storyboards avec des consignes de tournage, pour pouvoir filmer un prototype papier. Un second storyboard, le 12 février, a intégré ce que le walkthrough nous avait appris.",
        bullets: [
          "Dessiner avec une aide aux formes : on trace un cercle approximatif, le système en propose un propre.",
          "Appliquer un style à partir d’une photo ou d’une référence Pinterest.",
          "Annuler et rétablir d’un double tap, et un panneau d’historique pour revoir les versions passées.",
          "Enregistrer un personnage dans une bibliothèque et le réutiliser sur une autre page.",
        ],
        media: ["Storyboard, première page", "Dessiner une référence, déplacer un objet, extraire du texte", "Historique et composants réutilisables"],
      },
      {
        title: "Prototype papier et première vidéo",
        copy: "Nous avons construit une tablette en papier avec une barre d’outils, une zone de dessin et un assistant IA, et filmé notre premier prototype vidéo le 29 janvier.",
        videos: ["Premier prototype vidéo (29 janvier)"],
      },
      {
        title: "Generative walkthrough : cinq retours",
        copy: "Un autre groupe a parcouru notre prototype vidéo. Leurs retours se résument en cinq points. Pour chacun, nous avons nommé le principe socio-technique et la règle d’or d’interface qui le sous-tendent avant de modifier la conception.",
        table: {
          head: ["Ce qu’ils nous ont dit", "Ce que nous avons changé", "Principe derrière le changement"],
          rows: [
            ["Le prompt spatial avec trois points prête à confusion", "Une ancre IA que l’on glisse : on la dépose sur la partie de l’image à modifier", "Action située · Garder l’utilisateur aux commandes, prévenir les erreurs"],
            ["L’IA ne donne qu’un seul résultat", "Après un prompt, 3 à 5 variantes apparaissent directement sur le canevas", "Co-adaptation réciproque · Garder l’utilisateur aux commandes"],
            ["Photo, prompt et dessin semblent séparés et déroutants", "Un seul panneau IA qui montre à la fois photo, texte et dessin", "Cognition distribuée · Réduire la charge de mémoire à court terme, rester cohérent"],
            ["La mise en page et le style des icônes ne sont pas clairs", "Une nouvelle mise en page et des icônes plus claires", "Explicabilité · Rester cohérent"],
            ["Certaines interactions sont peu claires ou manquantes", "Une bibliothèque de composants réutilisables, un historique des prompts et plusieurs pages", "Cognition distribuée · Réduire la charge de mémoire à court terme, permettre d’annuler facilement"],
          ],
        },
        media: ["L’ancre IA, glissée sur une partie du dessin", "Des variantes apparaissent sur le canevas", "Un seul panneau pour la photo, le texte et le dessin", "Bibliothèque, historique et plusieurs pages"],
      },
      {
        title: "Étude utilisateur : Color-AI-t contre Colorify",
        copy: "Pour voir si la refonte fonctionnait, nous avons préparé une étude comparative le 17 février. Deux participants ont utilisé le système A, Colorify, puis le système B, notre prototype papier de Color-AI-t, et ont rempli un questionnaire après chacun.",
        bullets: [
          "Les deux participants ont préféré Color-AI-t : plus facile à utiliser, avec plus de fonctionnalités.",
          "Les plus appréciés : dessiner par prompt et la localisation par l’IA (l’ancre).",
          "Le plus déroutant : la navigation entre les écrans. Il faut apprendre un peu l’interface avant de l’utiliser pleinement.",
        ],
        media: ["Les deux systèmes comparés", "Les participants ont préféré notre système", "La navigation était la partie la plus déroutante"],
      },
      {
        title: "Faisabilité, contrôle et impact",
        copy: "Nous nous sommes aussi demandé ce qu’il faudrait pour le construire, et ce qu’il change pour les personnes qui l’utilisent.",
        bullets: [
          "Faisable aujourd’hui : des IA existantes comme ChatGPT ou Leonardo peuvent transformer un texte en dessin au trait propre. La nouveauté, c’est l’interface qui assemble vos dessins et ce que génère l’IA.",
          "Contrôle : trois choix pour chaque prompt, un bouton pour régénérer, et un historique pour revenir en arrière.",
          "Compétences : l’outil fait passer de simple consommateur d’IA à collaborateur actif, qui réfléchit dans l’espace et avec des mots.",
          "Précision : des boucles de retour pour affiner une sélection, et des « aperçus fantômes » de la zone sélectionnée.",
        ],
        media: ["Impact et contrôle"],
      },
    ],
    decisions: [
      ["Sélectionner une partie plutôt que la décrire", "Les mots ne permettaient pas de désigner une partie de l’image. L’ancre IA se dépose sur la partie à modifier : le changement reste local et c’est la personne, pas le prompt, qui décide."],
      ["Proposer plusieurs options, pas une seule", "Les gens s’arrêtaient par fatigue, pas par satisfaction. Renvoyer trois à cinq variantes sur le canevas leur permet de choisir et limite les essais-erreurs."],
      ["Un seul panneau pour toutes les entrées", "Photo, texte et dessin étaient dispersés dans des modes séparés. Un seul panneau garde visible, au même endroit, tout ce que vous avez donné à l’IA."],
      ["Aucune erreur n’est définitive", "Un historique des versions et des prompts, et une bibliothèque de personnages, permettent de revenir en arrière et de garder un style cohérent d’une page à l’autre."],
    ],
    outcome: [],
    evaluation: [
      "Deux participants ont comparé Colorify et Color-AI-t à l’aide d’un questionnaire.",
      "Tous deux ont préféré Color-AI-t, plus facile à utiliser et plus riche en fonctionnalités.",
      "Le cercle de localisation (l’ancre) et le dessin par prompt étaient les fonctionnalités les plus appréciées.",
      "La navigation était la partie la plus déroutante de l’interface.",
    ],
    evaluationNote: "Deux participants, c’est une petite étude : elle montre où aller ensuite plutôt qu’elle ne prouve la conception.",
    future: [
      "Une navigation plus claire.",
      "Des consignes de l’IA pour différents angles et perspectives.",
      "Une retouche locale qui conserve le style de ce qui entoure la partie modifiée.",
      "Une sélection plus précise : affinage et aperçus fantômes de la zone sélectionnée.",
    ],
    reflection: [
      "Les entretiens ont montré que le problème tenait moins à la qualité des images qu’au contrôle : les gens ne pouvaient pas dire ce qu’ils voyaient dans leur tête, ni changer une seule partie du résultat. Chaque grand changement après le walkthrough (l’ancre, les variantes, un seul panneau, la bibliothèque et l’historique) a rendu le contrôle à la personne qui dessine.",
    ],
  },
};

export const frAlbums: Record<string, { title: string; copy: string; captions: string[] }> = {
  khamsa: {
    title: "La Khamsa",
    copy: "Yedd ouahda ma tsafek, des premières impressions à l’exposition.",
    captions: [
      "La pièce terminée, 23 avril 2026",
      "Moi et ma pièce",
      "Gros plan, noir et or",
      "Gros plan, les connecteurs en flèche",
      "Gros plan, la mosaïque",
      "Le tableau, assemblé",
      "À mi-parcours du recouvrement du tableau",
      "Assemblage avec Marya",
      "Les connecteurs finaux",
      "Les étoiles cassaient sans cesse",
      "Un essai doré, raté",
      "Impression en série, nouvelle disposition",
      "0,07 contre 0,10",
      "L’impression à sa taille finale",
      "La toute première impression",
      "Le premier dessin, dans Fusion",
    ],
  },
  zen: {
    title: "Zen Rooms",
    copy: "Un hub et quatre salles, construits dans Blender et Unity.",
    captions: [
      "Water Room, le bassin et la cascade",
      "Water Room, le salon",
      "Galets et ondes",
      "Des objets à briser",
      "Le hub, construit dans Blender",
      "Le hub, dans Unity",
      "Meditation Room",
      "« Hochez la tête si oui »",
      "Bols chantants",
      "Nature Room, le jardin",
      "Le renard attend sur le chemin",
      "L’orbe de respiration",
      "Library Room",
      "Papiers d’émotions",
      "Le guide virtuel",
    ],
  },
  lineup: {
    title: "LineUP",
    copy: "Une file d’intervenants pour les réunions hybrides.",
    captions: [
      "L’écran d’accueil",
      "La file d’attente",
      "Accueil, deuxième itération",
      "Personas",
      "Cadre théorique",
      "Une réunion hybride",
      "Contexte, le tableau de bord",
      "Contexte, l’ordinateur portable",
      "Contexte, dans Zoom",
    ],
  },
  sketches: {
    title: "Croquis & ateliers",
    copy: "Stylos, post-it et premières idées.",
    captions: [
      "LineUP, la file",
      "LineUP, les groupes",
      "LineUP, se retirer",
      "LineUP, croquis A",
      "LineUP, croquis B",
      "Magic Map, des idées sur des post-it",
      "Magic Map, dessiner les parcours",
      "Bookerfly, premières esquisses",
      "La Khamsa, inspiration",
    ],
  },
  posters: {
    title: "Affiches & articles",
    copy: "L’affiche, le pictorial et l’article.",
    captions: [
      "Magic Map, l’affiche",
      "Magic Map, personas",
      "Pictorial Bookerfly, le scénario",
      "Article Bookerfly, page 4",
      "Article Bookerfly, page 5",
      "Bookerfly, espace de conception",
      "Bookerfly, espace de conception, partie 2",
    ],
  },
};
