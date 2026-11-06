import { moreCases } from "./cases2";
import { lang } from "./i18n";
import { frAbout, frAlbums, frCases, frEducation, frHero, frRoles, frSkills, frToolkit } from "./fr";
/* All copy lives here. Items marked TODO are placeholders to replace with real details. */

export interface Media { src: string; alt: string; caption?: string; wide?: boolean }
export interface VideoMedia { src: string; caption: string; poster?: string }
export interface ExternalVideoMedia { src: string; caption: string }
export interface DataTable { caption?: string; head: string[]; rows: string[][] }
export interface Step {
  title: string;
  copy?: string;
  slots: string[];
  media?: Media[];
  videos?: VideoMedia[];
  externalVideos?: ExternalVideoMedia[];
  bullets?: string[];
  table?: DataTable;
  note?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  kind: string;
  blurb: string;
  facts: [string, string][];
  brief: string;
  steps: Step[];
  decisions: [string, string][];
  outcome: { title: string; copy?: string; slot: string; media?: Media }[];
  video?: { src: string; poster: string; caption: string };
  links?: { label: string; hint: string; href: string }[];
  principles?: { intro: string[]; table: DataTable };
  scenario?: { label: string; items: [string, string][] }[];
  future?: string[];
  evaluation?: string[];
  evaluationNote?: string;
  reflection: string[];
  hero: string;
  heroMedia?: Media | Media[];
  poster?: Media;
  embed?: { src: string; caption: string };
}

export const hero = {
  name: ["Lydia’s", "World"],
  role: "HCI Master’s student · Product & UX designer",
  tagline: "I turn complex ideas into clear, considered digital experiences.",
  status: "Open to internships",
  place: "Île-de-France",
};

export const about = {
  photoAlt: "Lydia Benosmane smiling in a car",
  paragraphs: [
    "Bonjour! I’m <b>Lydia</b>, a Master’s student in Human-Computer Interaction (HCI) and a Product & UX designer based in Île-de-France, with my head somewhere between a fashion editorial, an art gallery and the seaside.",
    "I love design that has character: a little unexpected, a little dramatic, sometimes pink (just like this portfolio). I’m all about the details that make something feel special.",
    "Outside of design? I’m probably listening to music, getting lost on Pinterest, admiring pretty things or wishing I was sitting by the sea with a fresh drink in my hand and the sun on my skin.",
  ],
  tags: ["Île-de-France", "HCI Master’s", "Product & UX", "Art & fashion"],
  favourites: [
    ["Colour crush", "Pink, obviously."],
    ["Forever inspired by", "Fashion, art and everything visual."],
    ["My happy place", "Somewhere by the sea."],
    ["Current mood", "Mermaid meets glamour."],
    ["Always open", "Pinterest and my music playlists."],
  ] as [string, string][],
};

export interface ExperienceRole {
  title: string;
  place: string;
  /** city */
  where?: string;
  dates: string;
  copy?: string;
  bullets?: string[];
  /** tools, as they appear on the CV */
  tags?: string[];
}

/* mirrors the CV (public/cv-en.pdf), newest first */
export const roles: ExperienceRole[] = [
  {
    title: "Summer internship",
    place: "Inria · Ex-Situ team",
    where: "Gif-sur-Yvette",
    dates: "May – July 2026",
    bullets: [
      "Participated in the 3-day La Suite Numérique Design-a-thon, redesigning the government’s interface using new interaction techniques.",
      "Worked on organising workshops for the redesign of La Suite Numérique tools.",
      "Attended weekly design workshops using participatory design methods.",
      "Reviewed the current version of the DOIT book (Wendy Mackay) and identified areas for interactive video, collaborating on the design of interactive sections.",
    ],
    tags: ["Figma", "Paper prototyping", "Video editing"],
  },
  {
    title: "Magistère internship",
    place: "LISN · Venise team",
    where: "Gif-sur-Yvette",
    dates: "May – July 2025",
    bullets: [
      "Design and implementation of an early-stage prototype of a music therapy application for post-stroke physical rehabilitation on Meta Quest 3.",
      "Combined technical development with research activities: a literature review and on-site observation sessions.",
    ],
    tags: ["Unity", "Blender", "C#", "Meta Quest SDK", "Pure Data", "XR Interaction Toolkit"],
  },
  {
    title: "Research internship",
    place: "LISN · Venise team",
    where: "Gif-sur-Yvette",
    dates: "January – April 2025",
    bullets: ["Ported an XR music therapy application from HTC Vive to Meta Quest 3.", "Developed a collaborative mode for two users."],
    tags: ["Unity", "C#", "Meta Quest SDK", "XR Interaction Toolkit"],
  },
  {
    title: "School tutor",
    place: "Parkours",
    where: "Paris",
    dates: "2024 – present",
    bullets: [
      "Providing homework help and academic support for primary and middle-school students in all subjects.",
      "Adapting to each student’s needs, which builds active listening and teaching skills.",
    ],
  },
];

export const education: ExperienceRole[] = [
  {
    title: "Master’s in Human-Computer Interaction",
    place: "Université Paris-Saclay",
    dates: "2025 – present",
    bullets: ["Design of interactive systems (basic and advanced)", "Fundamentals of human-computer interaction, augmented reality", "Advanced web development", "Design project", "Interactive information visualisation"],
    tags: ["Figma", "Blender", "Unity", "C++/C#"],
  },
  {
    title: "Double degree in Computer Science and Mathematics, CS Magistère track",
    place: "Université Paris-Saclay",
    dates: "2022 – 2025",
    bullets: ["Introduction to human-computer interaction", "Advanced programming of interactive interfaces", "Web development"],
  },
];

/* the CV's skills, languages and interests */
export const toolkit: { label: string; items: string }[] = [
  { label: "Programming languages", items: "C#, Java, Python" },
  { label: "Web development", items: "HTML, CSS, JavaScript" },
  { label: "3D / 2D / XR", items: "Unity, Blender" },
  { label: "Prototyping", items: "Paper, Figma" },
  { label: "Languages", items: "English (C2, Linguaskill), French (native)" },
  { label: "Interests", items: "Art (acrylic painting, calligraphy), acoustic guitar" },
];

export const skills = ["Interaction design", "UX/UI design", "Prototyping", "Art direction", "Spatial design", "Photography"];

export const extras = [
  // TODO: swap the slots for real images.
  { title: "Drawing & illustration", copy: "Observational sketches, character studies and visual experiments.", slot: "Add a sketch" },
  { title: "Photography", copy: "A visual diary of colour, light, people and place.", slot: "Add a photo" },
  { title: "Collage & image making", copy: "Unexpected references arranged into new visual stories.", slot: "Add a collage" },
];

export const contact = {
  // TODO: replace with real details.
  email: "lydiabenosmane@gmail.com",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/lydia-benosmane-327a1925b/" }
    // { label: "Instagram", href: "https://instagram.com/" },
    // { label: "TikTok", href: "https://tiktok.com/" },
  ],
};

export const cases: CaseStudy[] = [
  {
    id: "lineup",
    title: "LineUP",
    kind: "Product design",
    blurb: "Rethinking turn-taking in video meetings with a visual speaker queue.",
    facts: [
      ["Role", "Interaction design · UX/UI design · Prototyping"],
      ["Team", "Lydia Benosmane, Sidonie Minodier, Victoria Myot, Ayda Yurtoglu"],
      ["Timeframe", "January–February 2026"],
      ["Tools", "Figma (prototype) · interface analysis, conceptual object mapping, interaction modeling, brainstorming, paper prototyping, scenario design, iterative critique"],
      ["Context", "Situated Interaction 2026 · HCI Master’s, Paris-Saclay University"],
    ],
    brief:
      "Video-conferencing platforms like Zoom, Teams and Google Meet support communication, but coordinating a meeting still takes real manual effort — moderators have to manage speaking turns, track time and handle transitions by hand. Our design challenge: how might we make speaking order, time and presentation materials visible and adaptable, while reducing the coordination load on moderators?",
    video: {
      src: "lineup/lineup.mp4",
      poster: "lineup/meeting.jpg",
      caption: "Video prototype: a weekly team meeting run with LineUP, from creating the queue to saving it as a template.",
    },
    steps: [
      {
        title: "Research",
        copy: "We analysed Zoom’s interface not just at the screen level, but through its underlying conceptual objects — participants, groups, meetings, messages, chats, shared screens, timers — mapping each one’s properties, visual representation and available operations, then writing out the user command, feedback and system response for each operation. Key finding: speaking order had no dedicated, manipulable representation; content-sharing and turn-taking were handled as separate, disconnected interactions. Along the way we also noticed everyday friction: private messages still land in the main chat, separate rooms can still message everyone, and it is hard to find where to share the link.",
        slots: [],
        media: [
          { src: "lineup/context-laptop.jpg", alt: "A laptop showing a debate held over video call, with a speaker list visible in the participant panel", caption: "Moderated debate on a video call" },
          { src: "lineup/context-zoom.jpg", alt: "A Zoom gallery view of a team meeting", caption: "Gallery view in a team meeting" },
          { src: "lineup/context-dashboard.jpg", alt: "A video-meeting interface mock-up with a row of participants above a dashboard and call controls", caption: "Meeting controls and shared content" },
        ],
        table: {
          caption: "Conceptual objects in Zoom. Substrates (group, chat) are marked with an asterisk.",
          head: ["Conceptual object", "Properties", "Representation", "Operations"],
          rows: [
            ["Participant", "Name · role (host or participant) · status (muted, hand raised, pinned)", "Name · profile picture, screen or camera", "Pin · send a private message · raise hand · mute"],
            ["Group *", "Participants list", "Sub-meeting", "Create · disband · add or remove participants · view list"],
            ["Meeting", "Meeting ID · starting time", "Window with a list of participants and a menu bar", "Create · join · leave"],
            ["Message", "Sender · text · timestamp · status (delivered, seen)", "Text bubble · notification", "Send · edit · delete · pin"],
            ["Chat *", "Message order · sender", "Text bubbles", "Save"],
            ["Shared screen", "Type of window · owner (participant)", "Smaller screen", "Start · stop · switch window"],
            ["Timer", "Time · status (on, paused, stopped)", "Countdown", "Start · pause · stop · change time"],
          ],
        },
      },
      {
        title: "The user problem",
        copy: "Today, turn-taking in meetings rests on informal habits: the moderator hands out speaking turns by voice, and when one presenter finishes they have to stop sharing before the next one can start.",
        bullets: [
          "No structured speaking queue. Participants don’t know when they will speak, and the order becomes unclear.",
          "High cognitive load on the moderator, who has to remember the order and stop speakers when time is up, instead of focusing on the presentation.",
          "Poor time management. Meetings overrun, no time is allocated visibly, and nobody is warned that their turn is coming.",
          "Difficulty managing media. Slides, videos and documents make it harder still, and people don’t always want to share their whole screen.",
        ],
        slots: [],
      },
      {
        title: "Synthesis",
        copy: "We explored several directions (shared documents, workspaces, agendas, role-based controls) before converging on one opportunity: turning the meeting agenda itself into an interactive object — a single queue representing speakers, materials and timing together. Our test scenario was a weekly start-up meeting of one hour at most, with a moderator and three employees.",
        bullets: [
          "Directions explored: documents everyone can edit, a whiteboard, several shared spaces with drag and drop between them, showing who owns a shared screen, and an agenda linked to people with priority ranks.",
          "One rule we set early: several participants can be attached to one media, or several media to one participant, but not both at once. That combination gets too complicated.",
        ],
        slots: [],
        note: "The solution: a structured queue inside the meeting. It visually organises the speaking order of participants, shared media and break times, helps moderators manage time, and notifies people when their turn is approaching.",
      },
      {
        title: "Ideation",
        copy: "Guided by generative design principles — reification (turning speaking order into a tangible object), polymorphism (the same tools working across participants and media), feedforward and feedback, and adjustment and reuse — we sketched ordering tools, drag-and-drop interactions, speaker groups, time blocks and reusable templates. Each principle was applied twice: once to an instrument (the command) and once to a substrate (the effect).",
        bullets: [
          "Nine interactions sketched: drag content to reorder, add a participant, reorder, create a group, upload media, see content details, request to join the queue, approve a request as host, withdraw from the queue.",
          "Two new tools: an ordering tool for the host, and a join-queue tool for participants.",
          "Groups are made by stacking one participant on another, and behave like a single entry in the queue.",
        ],
        slots: [],
        media: [
          { src: "lineup/framework.jpg", alt: "Table of the Generative Theories of Interaction, crossing instruments and substrates with seven principles", caption: "The framework we designed with: seven principles, applied to instruments and to substrates", wide: true },
          { src: "lineup/sketch-queue.jpg", alt: "Hand-drawn sketch of a meeting screen with a queue strip on top and two new tools, ordering and join queue", caption: "The queue strip, with the ordering and join-queue tools", wide: true },
          { src: "lineup/sketch-groups.jpg", alt: "Hand-drawn sketches showing participants being added, reordered and stacked into a group", caption: "Adding, reordering and grouping participants" },
          { src: "lineup/sketch-b.jpg", alt: "Hand-drawn sketches of the upload media flow and a details card for a queue entry", caption: "Uploading media and seeing the details of an entry" },
          { src: "lineup/sketch-a.jpg", alt: "Hand-drawn sketches of a participant requesting to join the queue and the host approving it", caption: "Requesting to join, and the host approving" },
          { src: "lineup/sketch-withdraw.jpg", alt: "Hand-drawn sketch of a menu on a participant tile with modify attachments, request time change and withdraw", caption: "Withdrawing from the queue, or asking for more time" },
        ],
      },
      {
        title: "Prototype",
        copy: "We prototyped LineUP in Figma and filmed it as a video prototype, built around four personas and one scenario: Mr. Fishman, the host and team leader, starts the first of a series of weekly team meetings. He creates a meeting and the others receive a notification to join. The screens below are from the Figma prototype.",
        slots: [],
        media: [
          { src: "lineup/personas.jpg", alt: "Personas slide: Mr. Fishman, Lillie, Pygo and Egg", caption: "Mr. Fishman hosts. Lillie and Pygo are employees. Egg and the other NPCs are interns.", wide: true },
          { src: "lineup/queue.jpg", alt: "The queue: a row of speaker tiles with a time of ten minutes each and a break-time popover", caption: "The queue substrate: speakers, groups and media, with time you can tweak directly", wide: true },
          { src: "lineup/home.jpg", alt: "Home screen with new meeting and join buttons, meeting templates and a weekly calendar", caption: "Home: new meeting, join, templates, and a calendar to schedule them" },
          { src: "lineup/meeting.jpg", alt: "Meeting view with a queue strip above a grid of participants and a toolbar", caption: "Meeting view with the queue running above the call" },
        ],
      },
    ],
    principles: {
      intro: [
        "Allow users to treat the queue as a real object and manipulate it directly.",
        "Go beyond the traditional WIMP interface.",
        "Provide greater functionality with interactions that are intuitive and pleasant to use.",
        "Offer greater personalizability and flexibility.",
      ],
      table: {
        caption: "Principles against interactions",
        head: ["Principle", "Instruments (command focus)", "Substrates (effect focus)"],
        rows: [
          ["Reification", "Creating the queue · meeting template tools to schedule", ""],
          ["Polymorphism", "Adding participants to the queue · the ordering tool works the same for media and participants", "Adding participants or groups to the queue (substrate: queue)"],
          ["Reuse", "Using a meeting template", "Groups that can be reused later (substrate: group)"],
          ["Feedforward", "When it’s your turn to speak · adding participants to the queue", ""],
          ["Feedback", "Timer visible on screen", ""],
          ["Specialization", "Custom buttons for each meeting template", "Creating a meeting template (substrate: template)"],
          ["Adjustment", "Adding more presentation time", "Tweaking the queue order (substrate: queue)"],
        ],
      },
    },
    scenario: [
      {
        label: "Before the meeting",
        items: [
          ["", "Mr. Fishman creates a new meeting with one click. Lillie and Pygo get a notification."],
        ],
      },
      {
        label: "During the meeting",
        items: [
          ["Reification", "The host creates the queue with a default time, adds Pygo and Lillie, creates a group with the interns, adds it to the queue and reorders everything."],
          ["Adjustment", "Pygo adjusts his own time. A request is sent to the host."],
          ["", "The host gets the request and accepts it."],
          ["Polymorphism", "Pygo adds four files to his speaker details, makes them visible to anyone, then uses the same ordering tool to put two of them in his queue."],
          ["Feedforward", "Lillie’s mic turns greener as her turn approaches, and she gets a notification two minutes before."],
          ["", "A 3, 2, 1 countdown plays, then her mic unmutes."],
          ["Feedback", "Lillie finishes early, and the timer still shows the time she has left."],
          ["", "The host switches to the next participant."],
        ],
      },
      {
        label: "After the meeting",
        items: [
          ["Specialization", "A few moments later, the host saves the queue as a meeting template."],
          ["Reuse", "He schedules a weekly meeting by dragging the template onto the calendar. Double-clicking it opens a meeting with the template applied."],
        ],
      },
    ],
    decisions: [
      ["One unified queue instead of separate tools", "Speaking order, shared materials and timing were managed through disconnected interactions. We merged them into a single, persistent, manipulable timeline so the whole meeting structure — who’s speaking, what they’re sharing, how much time is left — is visible and adjustable in one place."],
      ["Progressive, anticipatory feedback for turn transitions", "Relying on verbal reminders left participants unsure when their turn was coming. We designed a microphone indicator that visibly changes as a turn approaches, plus a countdown before the transition, so people can prepare instead of being caught off guard."],
    ],
    outcome: [
      { title: "Before", copy: "The host builds an initial speaker queue ahead of the meeting.", slot: "Mockup: host prepares the speaker queue", media: { src: "lineup/home.jpg", alt: "Home screen with meeting templates and calendar", caption: "Start from a template or a blank meeting" } },
      { title: "During", copy: "Speakers attach materials, request timing changes, get turn notifications and move through the queue live.", slot: "Mockup: live queue and turn transitions", media: { src: "lineup/meeting.jpg", alt: "Meeting view with the queue above the participant grid", caption: "The live queue above the call" } },
      { title: "After", copy: "The host saves the finished queue as a reusable template for future meetings.", slot: "Mockup: save and reuse the template", media: { src: "lineup/home-2.jpg", alt: "Home screen showing saved templates next to the weekly calendar", caption: "Saved templates, ready to schedule" } },
    ],
    evaluation: [
      "Discoverability: the ordering tool wasn’t immediately recognisable as reusable.",
      "Clarity: relationships between speakers, groups and shared media were sometimes unclear.",
      "Anticipation: some notifications didn’t explain what to do next.",
      "Visual hierarchy: grouping participants risked reducing their individual visibility.",
      "Template comprehension: reusable templates needed a clearer representation.",
    ],
    evaluationNote: "Evaluated through design critique and scenario review. Formal user testing and quantitative validation were not part of this academic project.",
    future: [
      "Reification: use groups as a tool to create breakout rooms.",
      "Reuse: speaker templates, for example 10 minutes of presentation and 5 minutes of Q&A.",
      "Polymorphism: let questions join the queue during Q&A sessions.",
      "Multiplicity: allow several main speakers and shared media in the queue at the same time.",
      "Beyond meetings: job interviews and debates.",
    ],
    reflection: [
      "Designing interactions means designing relationships between objects. This project pushed me to think beyond individual screens and features, toward how objects, actions and feedback form a coherent system. The biggest lesson: an interaction can be powerful in theory but still fail if people can’t understand what a tool does or how to use it.",
      "What I’d do differently: bring in usability testing earlier — testing whether moderators and participants can understand and manipulate the queue without explanation — and look more closely at accessibility, especially around timing notifications and microphone behaviour.",
    ],
    hero: "Key visual of the speaker-queue concept",
  },
  {
    id: "zen-rooms",
    title: "Zen Rooms",
    kind: "Immersive design · VR",
    blurb: "A VR wellness space of five rooms that help people regulate anxiety, built in Blender and Unity.",
    facts: [
      ["Role", "Water Room, design and interactions · UI interactions across the experience"],
      ["Team", "Lydia Benosmane, Yousra Bourguiba, Maryatou Kante, Gleda Uisetiawan"],
      ["Timeframe", "January–February 2026"],
      ["Tools", "Blender · Unity · XR Interaction Toolkit · VFX Graph · assets from Sketchfab, Pixabay and the Unity Asset Store"],
      ["Context", "Advanced Immersive Interactions · M1 HCI, Paris-Saclay University"],
    ],
    brief:
      "Stress and anxiety are part of daily life for many people. Zen Rooms asks whether a VR space can help: a calm, immersive place to step away from outside pressure, focus on the present moment and learn simple ways to manage difficult emotions. Each room evokes different sensations, so people can find the setting that supports them best.",
    heroMedia: { src: "zen/water3.jpg", alt: "The waterfall pool in the Water Room, lit from an opening in the ceiling", caption: "The Water Room, in Unity" },
    steps: [
      {
        title: "From first ambition to final rooms",
        copy: "Our first prototype imagined a single guided anxiety-regulation room: a virtual human leading paced breathing and grounding, visuals that react to breathing rhythm, hand-based interaction and simple navigation between zones, ending with a short reflection scene. Along the way the idea grew into a hub and four rooms. We kept the environment theme for variety, but the interactions we imagined changed as we built.",
        bullets: [
          "Main hub: a neutral, grounding space to orient people and let them choose their journey.",
          "Meditation Room: presence, patience and subtle interaction with a spirit-like guide.",
          "Water Room: anger release, then calm, with object-breaking and a waterfall.",
          "Nature Room: breathing exercises and slow exploration in a Japanese garden.",
          "Library Room: reflection and mindfulness, with emotion papers to sort and release.",
        ],
        slots: [],
      },
      {
        title: "Main hub",
        copy: "The hub is the central way in. It was built from scratch in Blender and brought into Unity, in a minimalist black and white that nods to yin and yang: balance between emotional states. It acts as a neutral zone where people can ground themselves before choosing a room, then move on with an intuitive teleportation system and one interactive button per room.",
        slots: [],
        media: [
          { src: "zen/hub1.jpg", alt: "The monochrome main hub built in Blender", caption: "Built from scratch in Blender" },
          { src: "zen/hub2.jpg", alt: "The main hub seen in Unity, with a large sphere and a long, softly lit hall", caption: "The neutral zone before choosing a room" },
        ],
      },
      {
        title: "Meditation Room",
        copy: "This room is a responsive environment rather than a linear path. The monochrome look continues, warmed by gold light, aiming for a calm, almost divine energy. The whole session is controlled by natural head movement, so no controllers are needed.",
        bullets: [
          "Nod to start: the guide asks for permission and a nod answers yes. At the end, a nod or a yawn gives different feedback.",
          "Stillness check: the room tracks head rotation. If the person gets restless, the guide gently pauses, then resumes exactly where it stopped.",
          "A bell between interactions confirms each step.",
          "Singing bowls can be struck with mallets, each strike picking one of several sounds so it never feels robotic.",
          "Sound mats on the floor start ambient drones when stepped on, so people can play the room and make their own atmosphere.",
        ],
        slots: [],
        media: [
          { src: "zen/med1.jpg", alt: "The meditation room: dark pillars, light mats and a large golden hand", caption: "Dark pillars, light mats and a golden hand" },
          { src: "zen/med3.jpg", alt: "The guide above the golden hand asking: Are you ready to start the meditation? Nod if yes.", caption: "“Are you ready to start the meditation? Nod if yes.”" },
          { src: "zen/med4.jpg", alt: "Mats laid out on the meditation room floor", caption: "Mats that trigger ambient drones" },
          { src: "zen/med5.jpg", alt: "Tibetan singing bowls and mallets on the floor", caption: "Singing bowls and mallets" },
        ],
      },
      {
        title: "Water Room",
        copy: "This was my room. It is built around two phases, because for many people calm only comes after tension has been released. First a cathartic release, then immersive tranquillity: people physically let go before they settle.",
        bullets: [
          "Phase 1, release: the room is full of cups, vases and plates that you can grab and smash on the floor, a safe way to let frustration out instead of holding it in.",
          "Phase 2, calm: a waterfall environment where you pick up pebbles and throw them in the water. Each one sends out concentric ripples and a soft sound, timed together, so you slow down and watch.",
          "Building it: I designed the room in Blender, with textures and objects from online libraries, and a fountain prefab for the waterfall ring. Breakables exist twice in the same spot, one intact and one pre-fractured, and swap on impact so the pieces fall under physics. Everything is grabbable through the XR Interaction Toolkit.",
          "Ripples: the water effect reacts to pebbles entering the water rather than to the player, with a script on each pebble that plays its sound.",
        ],
        slots: [],
        media: [
          { src: "zen/waterblender.jpg", alt: "The first version of the Water Room modelled in Blender", caption: "First design, in Blender", wide: true },
          { src: "zen/waterfinal.jpg", alt: "The final Water Room in Unity, with a pool, rocks and a waterfall", caption: "Final room, in Unity" },
          { src: "zen/waterlounge.jpg", alt: "A pink lounge area in the Water Room lit by a sunset arch", caption: "The lounge, lit by a sunset arch" },
          { src: "zen/water1.jpg", alt: "The release phase: a pink lounge floor with objects to break", caption: "Phase 1: objects to break" },
          { src: "zen/water2.jpg", alt: "Vases and bottles on the floor next to a green wall", caption: "Phase 1: cups, vases and plates" },
          { src: "zen/water4.jpg", alt: "The calm phase: a pool with a waterfall and pebbles to throw", caption: "Phase 2: pebbles and ripples" },
        ],
      },
      {
        title: "Nature Room",
        copy: "A Japanese-inspired garden built on restraint and consent. Calm is invited, not imposed. A fox guides people without forcing them forward, and a breathing orb offers an optional grounding exercise. Audio only starts once someone steps into the zone on purpose.",
        bullets: [
          "Breathing orb: it disperses when breathing is unsettled and comes together as it steadies, with a guided inhale, hold and exhale whose timing can be adjusted. It pauses when you leave.",
          "Fox guide: it greets you as you approach and only starts walking after you touch a ritual stone. It moves slowly, stops to ask reflective questions and faces you when it speaks.",
          "An optional incense ritual calms the visuals and unlocks the next stage.",
        ],
        slots: [],
        media: [
          { src: "zen/nature1.jpg", alt: "The Japanese garden with cherry trees, a red bridge and bamboo", caption: "The Japanese garden", wide: true },
          { src: "zen/nature2.jpg", alt: "The fox waiting on the path in the garden", caption: "The fox waits on the path" },
          { src: "zen/nature3.jpg", alt: "A fox statue releasing magical particles", caption: "A statue turns into particles" },
          { src: "zen/nature4.jpg", alt: "The breathing orb made of tiny particles", caption: "The breathing orb" },
        ],
      },
      {
        title: "Library Room",
        copy: "A room for putting feelings outside yourself. People pick emotion papers (anxiety, sadness, anger, calm, happiness, serenity) and place them in a sorting box. The system reads a stress level from the choices and shows it as a sphere that changes size, colour, pulse speed and sound. A virtual guide answers with adapted reassurance, then people drop the papers in a bin, which releases them in a burst of particles, and press End to finish.",
        bullets: [
          "Stress sphere: bigger as stress rises, green to yellow to red, and a faster pulse with a rising pitch.",
          "Guide: a rigged character with around 50 blendshapes for facial expressions, animated with Mixamo, speaking text-to-speech lines chosen by stress level.",
        ],
        slots: [],
        media: [
          { src: "zen/lib1.jpg", alt: "The library room with shelves, a table and candlelight", caption: "The library room" },
          { src: "zen/lib2.jpg", alt: "Coloured emotion papers laid on a table next to the sorting box", caption: "Emotion papers and the sorting box" },
          { src: "zen/lib3.jpg", alt: "The virtual guide standing among the bookshelves", caption: "The virtual guide" },
        ],
      },
    ],
    decisions: [
      ["Consent over automation", "Nothing starts by itself. A nod begins the meditation, audio guidance only plays once someone enters a zone on purpose, and the fox waits for a touch before it walks. The goal is to invite calm rather than push it."],
      ["Release first, then calm", "In the Water Room we gave people a way to let tension out, by smashing objects, before asking them to slow down with the waterfall. Two phases, one emotional journey."],
      ["A quiet, neutral hub", "A monochrome hub with one button per room keeps the starting point simple and balanced, so the rooms themselves can carry the colour and feeling."],
    ],
    outcome: [
      { title: "Choose", copy: "A neutral hub with teleport buttons to each room.", slot: "Main hub", media: { src: "zen/hub2.jpg", alt: "The main hub", caption: "Main hub" } },
      { title: "Release", copy: "Smash objects, then throw pebbles into the waterfall.", slot: "Water Room", media: { src: "zen/water3.jpg", alt: "The waterfall in the Water Room", caption: "Water Room" } },
      { title: "Breathe", copy: "A fox and a breathing orb in a quiet garden.", slot: "Nature Room", media: { src: "zen/nature4.jpg", alt: "The breathing orb in the Nature Room", caption: "Nature Room" } },
      { title: "Reflect", copy: "Sort your emotions and watch your stress settle.", slot: "Library Room", media: { src: "zen/lib2.jpg", alt: "Emotion papers in the Library Room", caption: "Library Room" } },
    ],
    future: [
      "More personalised sessions: choose a goal such as less stress, better focus or relaxation, and let the rooms adapt.",
      "Better visuals and sound: improved lighting, particles and spatial audio.",
      "More natural input: gesture recognition or breathing detection.",
      "More environments, with new themes and meditation techniques.",
      "User testing to improve usability, immersion and emotional impact.",
      "Optimisation so it runs on less powerful computers and standalone headsets.",
    ],
    reflection: [
      "Keeping VR smooth was the biggest constraint. Some objects and effects had to be simplified to avoid lag and crashes, and hardware limits slowed us down. The Water Room was the hardest for me: making the water react to pebbles took many attempts. Because each of us built a different room, we also had to test carefully so the interactions behaved consistently across the whole experience.",
      "Natural interactions such as gestures and movement detection needed a lot of experimentation to feel intuitive without breaking immersion. Some rooms were also more technical than expected, so time was tight. Next time I would test with real users earlier.",
    ],
    hero: "Hero render of the Zen Rooms environment",
  },
];

cases.push(...moreCases);

/* Photo piles. These are PLACEHOLDERS: swap `ph(...)` for a real file in /public, e.g. p("photos/trip-1.jpg", "On the bridge"). */
export interface AlbumPhoto { src: string; caption: string }
export interface Album { id: string; title: string; copy: string; tone: [string, string]; ink: string; photos: AlbumPhoto[] }
const holder = (n: number, a: string, b: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="640" viewBox="0 0 480 640"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="480" height="640" fill="url(#g)"/><g fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><rect x="150" y="250" width="180" height="130" rx="16"/><circle cx="240" cy="315" r="34"/><path d="M200 250l12-22h56l12 22"/></g><text x="240" y="440" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="40" fill="#fff" fill-opacity=".9">${n}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
};
const pile = (id: string, title: string, copy: string, tone: [string, string], n: number): Album => ({
  id,
  title,
  copy,
  tone,
  ink: "#fff1ee",
  photos: Array.from({ length: n }, (_, i) => ({
    src: holder(i + 1, tone[0], tone[1]),
    caption: (lang === "fr" ? "Photo provisoire " : "Placeholder photo ") + (i + 1),
  })),
});
export const albums: Album[] = [
  pile("lifedump", lang === "fr" ? "Vrac" : "Lifedump", "", ["#ff7aa8", "#c62e5e"], 8),
  pile("outside", lang === "fr" ? "Dehors" : "Out and about", "", ["#ffb38a", "#e0527a"], 6),
  pile("food", lang === "fr" ? "À table" : "Food", "", ["#f78fb3", "#8a1b45"], 7),
  pile("sketches", lang === "fr" ? "Croquis" : "Sketchbook", "", ["#ffc2d6", "#d6336c"], 9),
];

/* ---------- French ---------- */
if (lang === "fr") {
  const cap = (m: Media | undefined, c?: string) => {
    if (m && c) {
      m.caption = c;
      m.alt = c;
    }
  };
  Object.assign(hero, frHero);
  about.photoAlt = frAbout.photoAlt;
  about.paragraphs = frAbout.paragraphs;
  about.tags = frAbout.tags;
  about.favourites = frAbout.favourites;
  skills.splice(0, skills.length, ...frSkills);
  roles.splice(0, roles.length, ...frRoles);
  education.splice(0, education.length, ...frEducation);
  toolkit.splice(0, toolkit.length, ...frToolkit);
  for (const c of cases) {
    const f = frCases[c.id];
    if (!f) continue;
    c.kind = f.kind;
    c.blurb = f.blurb;
    c.facts = f.facts;
    c.brief = f.brief;
    if (c.video && f.videoCaption) c.video.caption = f.videoCaption;
    if (Array.isArray(c.heroMedia)) {
      if (f.heroCaption) cap(c.heroMedia[0], f.heroCaption);
      c.heroMedia.forEach((m, i) => {
        if (f.heroCaptions?.[i]) cap(m, f.heroCaptions[i]);
      });
    } else {
      cap(c.heroMedia, f.heroCaption);
    }
    cap(c.poster, f.posterCaption);
    if (c.embed && f.embedCaption) c.embed.caption = f.embedCaption;
    c.links?.forEach((l, i) => {
      const g = f.links?.[i];
      if (g) {
        l.label = g.label;
        l.hint = g.hint;
      }
    });
    c.steps.forEach((st, i) => {
      const g = f.steps[i];
      if (!g) return;
      st.title = g.title;
      if (g.copy !== undefined) st.copy = g.copy;
      if (g.bullets) st.bullets = g.bullets;
      if (g.note !== undefined) st.note = g.note;
      if (g.table && st.table) {
        st.table.caption = g.table.caption;
        st.table.head = g.table.head;
        st.table.rows = g.table.rows;
      }
      st.media?.forEach((m, k) => cap(m, g.media?.[k]));
      st.videos?.forEach((v, k) => {
        if (g.videos?.[k]) v.caption = g.videos[k];
      });
      st.externalVideos?.forEach((v, k) => {
        if (g.externalVideos?.[k]) v.caption = g.externalVideos[k];
      });
    });
    if (f.principles && c.principles) {
      c.principles.intro = f.principles.intro;
      c.principles.table = { caption: f.principles.caption, head: f.principles.head, rows: f.principles.rows };
    }
    if (f.scenario) c.scenario = f.scenario;
    c.decisions = f.decisions;
    c.outcome.forEach((o, i) => {
      const g = f.outcome[i];
      if (!g) return;
      o.title = g.title;
      if (g.copy !== undefined) o.copy = g.copy;
      cap(o.media, g.caption);
    });
    if (f.evaluation) c.evaluation = f.evaluation;
    if (f.evaluationNote) c.evaluationNote = f.evaluationNote;
    if (f.future) c.future = f.future;
    c.reflection = f.reflection;
  }
  for (const a of albums) {
    const f = frAlbums[a.id];
    if (!f) continue;
    a.title = f.title;
    a.copy = f.copy;
    a.photos.forEach((ph, i) => (ph.caption = f.captions[i] ?? ph.caption));
  }
}
