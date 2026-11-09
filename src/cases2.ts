import type { CaseStudy } from "./content";

const FIG = "https://www.figma.com/proto/QqMLKWPJKWYx8Jpt5kvuM0/la-suite-num%C3%A9rique?node-id=691-1270&t=aAb8TCJ121RfSdmI-1";
const FAB_SITE = "https://the-art-of-fabricating-tangible-interfaces-2026.gitlab.dsi.universite-paris-saclay.fr/lydia/";

export const moreCases: CaseStudy[] = [
  /* ------------------------------------------------------------------ MAGIC MAP */
  {
    id: "magic-map",
    title: "Magic Map",
    kind: "Interactive system · Collaborative paper map",
    blurb: "A modular, foldable paper map for planning a Paris trip together and adapting it when plans change.",
    facts: [
      ["Team", "Lydia Benosmane, Sidonie Minodier, Victoria Myot, Ayda Yurtoglu"],
      ["My role", "Contributed across research, system and interaction design, prototyping, testing, redesign, diagrams and storyboard"],
      ["Timeline", "November–December 2025"],
      ["Methods", "8 story interviews · personas · system diagrams · paper and video prototyping · generative walkthrough · participatory design workshop"],
      ["Design method", "Wendy Mackay’s DOIT circle"],
      ["Context", "Design of Interactive Systems · M1 HCI, Paris-Saclay University"],
    ],
    brief:
      "We designed for international students aged 18–26 visiting Paris, often with friends. Eight story interviews surfaced two recurring problems: aligning a group’s interests and needs while planning, and adapting the itinerary when a disruption changes the plan.",
    poster: {
      src: "magicmap/poster.jpg",
      alt: "The complete Magic Map poster: problem, user profile, concept, personas, breakdowns, improvements, design diagram and a five-frame storyboard",
      caption: "The Magic Map poster, complete. Tap to enlarge.",
    },
    steps: [
      {
        title: "Problem and users",
        doit: ["observations", "needs"],
        copy: "Eight story interviews surfaced two recurring breakdowns: it is hard to align a group’s interests and needs while planning, and hard to adapt the itinerary when a disruption changes the plan.",
        bullets: [
          "We designed for international students aged 18–26 visiting Paris, often with friends.",
          "The target group is comfortable with travel apps and wants to find activities that fit its interests, budget and time.",
        ],
        slots: [],
      },
      {
        title: "Three personas",
        doit: ["insights"],
        copy: "We used three personas to explore different needs, including Cam, an extreme user whose busy schedule can pull her away from the group.",
        bullets: [
          "Alf, 20, student: wants to see as much as possible, afraid of missing out, and uses social media to find places.",
          "Béa, 21, French student: the decision-maker and navigator of the group. She knows Paris and the roads they will need to follow.",
          "Cam, 21, student and research assistant (the extreme persona): always busy with work, unpredictable, and often has to be separated from her friends during the trip.",
        ],
        slots: [],
        media: [{ src: "magicmap/slide-03.jpg", alt: "Slide presenting the personas Alf, Béa and Cam", caption: "Alf, Béa and Cam", wide: true }],
      },
      {
        title: "First iteration: a modular paper system",
        doit: ["design-space", "designs"],
        copy: "Rather than make another app, we explored how a familiar paper map could support shared planning through folding, touch and a connected pen.",
        bullets: [
          "Folding the left side opened interest lists; folding the right revealed the itinerary timeline.",
          "Places could be added to lists or moved from the map into an itinerary.",
          "Maps could connect into one shared surface or split into smaller linked maps.",
          "The first version also explored a 3D itinerary view and group voting.",
        ],
        slots: [],
      },
      {
        title: "First video prototype and walkthrough",
        doit: ["prototype", "questions", "implications"],
        copy: "We presented the first video prototype to another student group and ran a generative walkthrough. The feedback showed where the interactions and the video explanation were hard to follow.",
        bullets: [
          "It was unclear how to transfer a place from TikTok, add it to a list, or plan a stop that was not already marked on the map.",
          "Folding could hide information; navigation mode and sequential group approval were confusing or slow.",
          "The keyboard interaction and disappearing markers were not visible enough in the video.",
        ],
        slots: [],
        videos: [{ src: "magicmap/paper-prototype-first.mp4", caption: "First video prototype" }],
      },
      {
        title: "Second iteration: clearer interactions",
        doit: ["implications", "designs"],
        copy: "We simplified the system in response to the walkthrough and designed for a group whose plans and connectivity can change.",
        bullets: [
          "Folding now opens a menu of functions and tabs, and the map resizes to fit.",
          "Double-tapping the pen switches between automatic routing and a user-drawn route.",
          "Itineraries can branch when a group needs to split; disruptions can trigger an alternate route.",
          "Itineraries can be saved for offline navigation.",
          "We removed the confusing 3D view and redundant voting system.",
        ],
        slots: [],
        media: [{ src: "magicmap/slide-07.jpg", alt: "Slide listing the improvements made to Magic Map", caption: "Design changes after the walkthrough", wide: true }],
      },
      {
        title: "A participatory design workshop",
        doit: ["design-inputs", "study-design"],
        copy: "In the redesign phase we imagined and organised a participatory design workshop of our own. We made role-playing cards that give each traveller a goal, so participants had to plan together while wanting different things.",
        bullets: ["Four role-playing cards: the Matcha Lover, the Fancy Resto fan, the Museum Enthusiast and the Vegan."],
        slots: [],
        media: [{ src: "magicmap/nb-59.jpg", alt: "Cards describing the role-play personas: Matcha Lover, Fancy Resto, Museum Enthusiast and The Vegan", caption: "The role-playing cards: each traveller has a goal" }],
      },
      {
        title: "Revised storyboard and paper prototype tests",
        doit: ["designs", "prototype", "questions"],
        copy: "The storyboard follows Alf, Béa and Cam from planning their Paris visit to splitting the map and using a saved itinerary on the metro. We tested the first paper prototype, then tested it again after making changes.",
        slots: [],
        media: [
          { src: "magicmap/nb-40.jpg", alt: "Photo of sticky notes with handwritten ideas on a storyboard template", caption: "Storyboard: ideas on sticky notes" },
          { src: "magicmap/nb-41.jpg", alt: "Photo of sticky notes with sketched interaction flows", caption: "Storyboard: sketching the flows" },
          { src: "magicmap/nb-68.jpg", alt: "Storyboard frames next to the step-by-step description of an interaction", caption: "Storyboard frames and the interaction that goes with each" },
        ],
      },
      {
        title: "Final video prototype",
        doit: ["prototype"],
        copy: "The second video prototype brings the redesigned interactions together: collaborative planning, branching itineraries and adapting the trip on the move.",
        slots: [],
        videos: [{ src: "magicmap/paper-prototype-revised.mp4", caption: "Second video prototype" }],
      },
    ],
    decisions: [
      ["A physical map, not another app", "Travellers already juggle several travel apps. A foldable map gives a shared surface that everyone can see and touch at the same time, and that still works when wifi doesn’t."],
      ["Fold to switch between together and apart", "The same object supports shared planning when open and individual focus when folded, which is exactly the tension Cam’s persona exposed."],
      ["Design for disruption", "Itineraries can be split and rerouted, and the scenarios include strikes and closures, because plans that never change aren’t how trips go."],
    ],
    outcome: [],
    future: [
      "Filtering locations based on categories.",
      "Handling an overwhelming number of saved locations.",
      "Map orientation.",
      "Budget planning.",
    ],
    reflection: [
      "Designing for a group is different from designing for one person: every feature has to work for the person leading, the person following and the person who has to leave early. Role-playing with concrete goals exposed problems that the sketches alone did not show.",
    ],
    hero: "Magic Map foldable map",
  },

  /* ------------------------------------------------------------------ JAVARISTA */
  {
    id: "javarista",
    title: "Javarista",
    kind: "Serious game · Java learning",
    blurb: "A cozy coffee-making game that teaches Java logic through recipes, code blocks and playful experimentation.",
    facts: [
      ["Team", "Lydia Benosmane, Sidonie Minodier, Victoria Myot"],
      ["My role", "Contributed across the project, with a focus on Unity game design, interface and code interactions, and visuals"],
      ["Timeline", "November–December 2025"],
      ["Methods", "Literature review · system design · Unity prototyping · usability study · think-aloud · workload questionnaire"],
      ["Tools", "Unity · C#"],
      ["Context", "Design of Interactive Systems · M1 HCI, Paris-Saclay University"],
    ],
    brief:
      "Javarista is a serious game for learners who understand some computing concepts but have little or no Java experience. It teaches programming logic through a familiar barista task: prepare drinks by interacting with ingredients, actions and visual code blocks.",
    links: [
      { label: "Read the final report", hint: "Project research, design and usability study", href: "https://drive.google.com/file/d/1nIr8xcP-1RntoxgFBSpP-Od0-3PvWSeK/view?usp=sharing" },
    ],
    heroMedia: [
      {
        src: "javarista/game-layout.png",
        alt: "Javarista game screen with code blocks and coffee-making scene",
        caption: "The Javarista game interface",
        wide: true,
      },
      {
        src: "javarista/game-overview.png",
        alt: "Initial sketch of the Javarista interface, with code canvas beside the coffee-making scene",
        caption: "Initial interface sketch",
        wide: true,
      },
    ],
    steps: [
      {
        title: "A game-shaped way to learn Java",
        copy: "We designed a relaxing 2D coffee-making game focused on the logic of Java rather than introductory types such as int or string. A code panel and a game panel make the relationship between instructions and their effects visible.",
        bullets: [
          "Players assemble pre-written code blocks into a Main function and run a recipe.",
          "The game panel animates the drink preparation; incorrect logic produces visible failure feedback.",
          "The barista metaphor connects ingredients, actions and repetition to programming concepts.",
        ],
        slots: [],
        media: [{ src: "javarista/game-layout.png", alt: "Javarista prototype interface with code blocks and a coffee-making scene", caption: "The prototype combines a code workspace with the game scene", wide: true }],
        externalVideos: [{ src: "https://www.youtube-nocookie.com/embed/hZGf8CLuChA", caption: "Javarista game overview" }],
      },
      {
        title: "Level 1: scene to code",
        copy: "Players make an iced coffee by directly interacting with the scene. Each ingredient they add creates a corresponding line of code, introducing methods and loops through repeated actions.",
        slots: [],
        media: [{ src: "javarista/level-one.png", alt: "Storyboard of the scene-to-code level, where adding ingredients generates code blocks", caption: "Level 1: actions in the scene generate code", wide: true }],
        externalVideos: [{ src: "https://www.youtube-nocookie.com/embed/ZGMCn9l_ynQ", caption: "Level 1 gameplay prototype" }],
      },
      {
        title: "Level 2: code to scene",
        copy: "Players use draggable, snapping code blocks to follow a recipe and produce a drink. The reversed direction asks them to apply the logic introduced in the first level; hints highlight the next step when they are stuck.",
        slots: [],
        media: [
          { src: "javarista/level-two.png", alt: "Storyboard of the code-to-scene level, using visual Java blocks to prepare a drink", caption: "Level 2: code controls the drink preparation", wide: true },
          { src: "javarista/level-three-concept.png", alt: "Unimplemented concept for a level where players write Java methods", caption: "A later level was planned around writing methods from scratch", wide: true },
        ],
        externalVideos: [{ src: "https://www.youtube-nocookie.com/embed/ZDY-Jwn6Jb4", caption: "Level 2 gameplay prototype" }],
      },
      {
        title: "Usability study",
        copy: "We evaluated the two playable levels with 11 participants in their twenties who had a background or basic knowledge in computer science. Think-aloud sessions, observed errors and completion times were paired with a NASA-TLX-like workload questionnaire and follow-up interviews.",
        slots: [],
        media: [{ src: "javarista/workload-results.png", alt: "Bar chart comparing task-load scores with and without hints across six workload dimensions", caption: "Average task-load ratings with and without hints", wide: true }],
      },
    ],
    decisions: [
      ["Teach logic through a familiar metaphor", "Making a drink gives abstract programming ideas a concrete setting, while keeping the game focused on methods, functions and repetition."],
      ["Try both directions between action and code", "The first level turns scene interactions into code; the second asks players to build code that changes the scene."],
      ["Use feedback and hints to keep learners moving", "Recipe animations reveal what code does, while hints support players who are stuck without removing the challenge."],
    ],
    outcome: [],
    evaluation: [
      "7 of 11 participants preferred the code-to-scene level; the average rating for the logic between the game and code panels was 4.7/5.",
      "10 of 11 found the instructions clear, and 4 of the 6 participants who tried hints found them useful.",
      "All 11 participants said they enjoyed the game.",
      "5 of 11 participants considered the prototype effective for learning; most participants already had intermediate or higher Java proficiency.",
      "Level 1 took 61 seconds on average. Level 2 completion times varied widely, so the hint/no-hint averages were not conclusive.",
    ],
    evaluationNote: "This was a small usability study with 11 participants, not a controlled learning-outcomes study. The participants’ existing Java experience limits what we can conclude about effectiveness for beginners.",
    future: [
      "Add a tutorial and more Java concepts, including classes, conditionals, loops and objects.",
      "Reduce drag-and-drop friction with undo and a mixed code-and-scene interaction.",
      "Improve code-block readability and clipping, and add real-time feedback, sound and animation.",
      "Complete planned features such as multiple orders and performance ratings.",
    ],
    reflection: [
      "I contributed across the project, with a particular focus on Unity game design, interface and code-block interactions, and visuals. The study reinforced how important it is to test whether players understand not only the interface, but also the learning connection the design is meant to create.",
    ],
    hero: "Javarista Java-learning game",
  },

  /* ------------------------------------------------------------------ BOOKERFLY */
  {
    id: "bookerfly",
    title: "Bookerfly",
    kind: "Design project · Social reading",
    blurb: "A community-based reading platform where group reads, annotations and snippets happen inside the book, without leaving the page.",
    facts: [
      ["Team", "Lydia Benosmane, Sidonie Minodier, Victoria Myot, Alizée Xia"],
      ["Timeframe", "2026, in two stages: a pictorial, then a full paper"],
      ["Tools", "Paper prototyping · HTML, CSS and JavaScript prototype · NASA-TLX · think-aloud"],
      ["Context", "Design projects · M1 HCI, Paris-Saclay University"],
    ],
    links: [
      { label: "Paper: Bookerfly, a Community-Based, Collaborative Reading System", hint: "PDF · 8 pages · design process and usability evaluation", href: "bookerfly/bookerfly-paper.pdf" },
      { label: "Pictorial: Bookerfly, a Community-Driven and Collaborative Reading System", hint: "PDF · 5 pages · concept, scenario and first paper-prototype study", href: "bookerfly/bookerfly-pictorial.pdf" },
    ],
    brief:
      "Reading has become a more popular leisure activity among students since the pandemic, and digital platforms such as Apple Books, Wattpad, Webtoon or Goodreads keep growing. Yet if readers want to discuss a passage or share a quote, they usually have to leave the book for an external messaging app, which breaks immersion. Bookerfly keeps the community inside the reading space, for students and young people on PC and tablets.",
    heroMedia: { src: "bookerfly/slide-12.jpg", alt: "From paper prototypes to the high-fidelity interface of Bookerfly", caption: "From paper prototypes to implementation", wide: true },
    steps: [
      {
        title: "Listening to readers",
        copy: "We ran eight story interviews with frequent digital readers, six university students and two young adults, who read daily on phone, tablet and laptop. Two issues stood out.",
        bullets: [
          "Readers enjoy engaging with others, but to do so they have to leave the reading space, which breaks immersion.",
          "Readers lack ways to interact with the story in its context. Often all they have are bookmarks and highlights.",
        ],
        slots: [],
      },
      {
        title: "Reading the literature",
        copy: "We read across three areas to ground the design.",
        bullets: [
          "Community: reading is a socially situated practice. Social influence shapes what we pick, how we read and how we interpret, and a sense of social presence improves satisfaction and engagement.",
          "E-book usability: eye strain, poor navigation and restrictive use compared with paper. Real-world consistency, legible text, easy bookmarks and flexible annotations matter.",
          "Digital annotations: the need for public and private levels, annotations that are visually distinct from the text, and that interrupt reading as little as possible. Too many annotations can overload the reader.",
        ],
        slots: [],
      },
      {
        title: "Choosing the core features",
        copy: "We brainstormed with the 10+10 technique around two dimensions, interaction with the content and interaction with other readers. To settle on features we ran a Delphi procedure: each of us listed 5 to 10 features, another group of experts consolidated them into 11 statements, and we each ranked them. Three came out on top: group reads, annotations and snippets.",
        slots: [],
        media: [
          { src: "bookerfly/slide-21.jpg", alt: "The design space for Bookerfly: internal sharing, community and visibility, reading statistics, annotatable objects", caption: "Design space, part 1" },
          { src: "bookerfly/slide-22.jpg", alt: "The design space for Bookerfly: device type, homepage layout and scrolling method", caption: "Design space, part 2" },
        ],
      },
      {
        title: "The features",
        bullets: [
          "Annotations: highlight, draw or write directly on the page, as on a paper book. A double tap clears the interface and opens a pen menu with a pen, a highlighter and an eraser. Other readers’ annotations can be shown or hidden with a toggle.",
          "Snippets: select a passage, tap the scissors icon, then save it to your collection or send it to a chat. A snippet is a hyperlink back to its place in the book. If the receiver hasn’t reached that point yet, it appears as a spoiler they can choose to reveal.",
          "Group reads: read, annotate and discuss the same book asynchronously. A chat slides in from the side of the page so discussion never covers the text.",
          "Reading statistics: reading speed and weekly, monthly or yearly activity, shown publicly or kept private, with group statistics for group reads.",
        ],
        slots: [],
        media: [
          { src: "bookerfly/pict-03.jpg", alt: "Page of the pictorial showing Anne’s reading scenario with six interface screens", caption: "The scenario, from the pictorial: Anne reads, snips a passage and shares it with her group", wide: true },
        ],
      },
      {
        title: "Paper, then code",
        copy: "We sketched every feature on paper first, drawing on the layouts of Apple Books and Wattpad so the home page would feel familiar. Our first study used paper prototypes with three participants, two prototype conditions and the Wizard of Oz technique. We then built a multi-page web prototype in HTML, CSS and JavaScript with Library, Reader, Chats, Snippets and Profile views, a mock data file standing in for a backend and localStorage so actions persisted.",
        slots: [],
        media: [
          { src: "bookerfly/slide-09.jpg", alt: "Early sketches of Bookerfly", caption: "Early sketches", wide: true },
          { src: "bookerfly/slide-11.jpg", alt: "Paper prototypes next to the final interface", caption: "Paper prototype and implementation" },
          { src: "bookerfly/paper-05.jpg", alt: "Page of the paper showing the sketches and the move from paper prototype to implementation", caption: "Sketches to implementation, from the paper" },
        ],
      },
      {
        title: "Testing with eight readers",
        copy: "Eight students (four women, four men, all in their early twenties, reading about five hours a week digitally) tested the prototype on a tablet and a laptop. Our hypothesis: participants can discover and use the core features without help and in reasonable time. They opened a group read, found the embedded chat, flipped pages, annotated with drawings and highlights, showed and hid other users’ annotations, shared a snippet to the group chat, and then explored freely for up to ten minutes. We collected think-aloud recordings, click logs, observation notes, a NASA-TLX questionnaire and open-ended feedback.",
        slots: [],
        media: [
          { src: "bookerfly/slide-15.jpg", alt: "Box plots of the NASA-TLX results", caption: "NASA-TLX results" },
          { src: "bookerfly/slide-16.jpg", alt: "Slide with discoverability results and favourite and least favourite features", caption: "Discoverability and favourite features" },
        ],
      },
    ],
    decisions: [
      ["Keep the community inside the book", "Group chat is a panel on the page edge and snippets go straight to a chat, so readers never have to leave the story to talk about it."],
      ["Annotations that can step aside", "Drawings can be toggled off by other readers. One participant said this meant they didn’t feel bad covering up words."],
      ["Spoiler-aware sharing", "A snippet from a part of the book you haven’t reached is hidden until you choose to reveal it."],
    ],
    outcome: [],
    evaluation: [
      "Mental demand averaged 3.5 out of 7, neutral. Time demand was slightly higher, at 3.88, probably because participants were observed throughout. Frustration and workload were low.",
      "The interface was easy to navigate. Five of eight found the features easy to discover, while three found snippets and annotations hard to find.",
      "Favourite features: snippets (3), freehand annotations (2), activity statistics (2) and the snippet spoiler warning (1).",
      "Five of eight thought group reads lived in the group chats, even though the tab was named Groups.",
      "“I would actually love to have that in real life.” Every participant said they liked Bookerfly.",
    ],
    evaluationNote:
      "Participants were recruited on our own campus, which may bias the feedback.",
    future: [
      "A help button reachable from every screen, with a short tutorial for new users.",
      "Make features more discoverable: selecting text also opens annotation mode and highlights the text.",
      "A scissors icon for snippets, a Snippets Collection instead of a gallery, and no more image snippets.",
      "Bigger, more explicit icons and buttons, with a clearer highlighter icon.",
      "Typed annotations on both tablet and laptop, undo, and explorable user profiles.",
    ],
    reflection: [
      "Bookerfly showed me how far a feature can be right and still be hard to find. Participants loved snippets and annotations once they found them, so most of our improvements are about onboarding and clarity, not new functions.",
    ],
    hero: "Bookerfly interface",
  },

  /* ------------------------------------------------------------------ 3D PRINTING */
  {
    id: "khamsa",
    title: "Yedd ouahda ma tsafek",
    kind: "3D printing · Tangible interface",
    blurb: "A board of 3D-printed Khamsas that joins Algerian embroidery with a protective symbol. “One hand can’t applaud.”",
    facts: [
      ["Title", "يد واحدة ما تصفق · Yedd ouahda ma tsafek · One hand can’t applaud"],
      ["Timeframe", "10 March to 23 April 2026"],
      ["Tools", "Autodesk Fusion with hand-drawn Bézier curves · PrusaSlicer · FDM 3D printing"],
      ["Context", "The Art of Fabricating Tangible Interfaces 2026 · Paris-Saclay University"],
    ],
    links: [{ label: "Fabrication journal", hint: "Weekly documentation of the whole process", href: FAB_SITE }],
    brief:
      "I wanted to mix my culture with creative expression. I combined Algerian embroidery, specifically from Algiers, with Al Khamsa, the Hand of Fatima, a symbol used across North Africa as a protective emblem against negative energy and the evil eye. The result is a mosaic of printed hands joined into one board: each piece alone is a symbol, together they form a whole.",
    heroMedia: { src: "fab/expo-1.jpg", alt: "The complete piece, a board of black and gold Khamsas, standing on an easel at the tangible interface show", caption: "The complete piece at the Tangible Interface Show, 23 April 2026" },
    steps: [
      {
        title: "Week 1: finding the design",
        copy: "I had already used Fusion and PrusaSlicer in a CAD class the term before, so this week was about the idea. I found inspiration on Pinterest, then drew every spiral by hand with Bézier curves in Fusion, until the sketch reached about 5,000 points and slowed Fusion down a lot. For the first test I printed half the design cut out and half extruded, to decide between a carved-out and a relief version.",
        slots: [],
        media: [
          { src: "fab/inspo.jpg", alt: "Embroidery inspiration board", caption: "Inspiration" },
          { src: "fab/start.jpg", alt: "The first lines of the Khamsa drawn in Fusion", caption: "Drawing begins" },
          { src: "fab/progress.jpg", alt: "The Khamsa spirals in progress in Fusion", caption: "Spiral by spiral" },
          { src: "fab/w1-final.jpg", alt: "The finished Khamsa drawing in Fusion", caption: "The first full design" },
          { src: "fab/sliced.jpg", alt: "The design in the slicer", caption: "Sliced for the first test" },
        ],
      },
      {
        title: "Week 2: carved or raised, and how to connect",
        copy: "The print took a very long time. I chose the carved-out version because it looked better. Some parts of the pattern weren’t connected and the print fell apart easily, so I removed every unconnected piece. I linked the Khamsas in a mosaic, noticed a shape in the middle and designed that as a piece too. For connectors I first tried a slit with a tab, then puzzle pieces, but a paper-thin print made puzzle pieces a bad idea.",
        slots: [],
        media: [
          { src: "fab/printed-1.jpg", alt: "A purple Khamsa on the print bed", caption: "First print" },
          { src: "fab/printed-destroyed.jpg", alt: "A purple Khamsa that has come apart", caption: "Unconnected parts fell apart" },
          { src: "fab/connections-fullcircle.jpg", alt: "Several Khamsas joined in a circle in Fusion", caption: "Joining the Khamsas" },
          { src: "fab/connectors-first-try.jpg", alt: "A first connector design in Fusion", caption: "First connector" },
          { src: "fab/puzzle-pieces.jpg", alt: "Puzzle-piece connector design in Fusion", caption: "Puzzle pieces, abandoned" },
        ],
      },
      {
        title: "Week 3: less detail, better print",
        copy: "I learned that each print had to be no bigger than 5 cm², so the details would not even be visible, and the detailed one was taking far too long. I dialled the detail down a lot, picked new inspiration, and again drew by hand in Fusion rather than importing an SVG. The print failed many times. I tested layer heights of 0.07 and 0.10 and chose 0.07 because it gave the finest detail.",
        slots: [],
        media: [
          { src: "fab/second-inspo.jpg", alt: "A Khamsa necklace used as second inspiration", caption: "New inspiration" },
          { src: "fab/final-vertices.jpg", alt: "Final design with its vertices in Fusion", caption: "The final design, point by point" },
          { src: "fab/failed-print.jpg", alt: "A failed print on the bed", caption: "One of many failed prints" },
          { src: "fab/07vs10.jpg", alt: "Two prints at 0.07 and 0.10 layer height", caption: "0.07 against 0.10" },
          { src: "fab/new-print-white.jpg", alt: "A white print held up outdoors", caption: "Final settings and size" },
          { src: "fab/disposition-1.jpg", alt: "Printed pieces arranged on a cutting mat", caption: "First arrangement" },
        ],
      },
      {
        title: "Week 4: failed prints and connectors",
        copy: "A week of failed prints. I focused on connectors. The first ones weren’t pretty, and the next ideas were too three-dimensional, so I dropped them.",
        slots: [],
        media: [
          { src: "fab/fail.jpg", alt: "A failed print in the printer", caption: "Another failure" },
          { src: "fab/connectormaybe.jpg", alt: "A connector that might work", caption: "A maybe" },
          { src: "fab/connectorno.jpg", alt: "A connector design that was rejected", caption: "A no" },
        ],
      },
      {
        title: "Week 5: new layout and mass printing",
        copy: "Mostly mass printing the finished design, and deciding on a new arrangement of the pieces.",
        slots: [],
        media: [{ src: "fab/disposition-2.jpg", alt: "Red printed pieces arranged on the print bed", caption: "A new disposition" }],
      },
      {
        title: "Week 6: connectors at last",
        copy: "Mass printing looked good and I was halfway through covering my cardboard base, but I still had no connectors I liked. I designed many by hand, either keeping the arabesque theme or using moon and star shapes, which stand for my religion and for the flag of Algeria. They weren’t sturdy enough, the stars on the tips kept breaking, and so I turned them into arrows. Then I could assemble, with Marya’s help.",
        slots: [],
        media: [
          { src: "fab/goldfail.jpg", alt: "Gold prints that failed", caption: "Gold attempt, failed" },
          { src: "fab/halfway.jpg", alt: "Black pieces laid out on cardboard", caption: "Halfway through covering the board" },
          { src: "fab/connectors-attempts.jpg", alt: "Several connector designs in Fusion", caption: "Connector attempts" },
          { src: "fab/star-break.jpg", alt: "A broken star on a connector tip", caption: "The stars kept breaking" },
          { src: "fab/final-connectors.jpg", alt: "The final arrow connectors", caption: "The final connectors" },
          { src: "fab/maryaqueen.jpg", alt: "A friend assembling pieces at a table", caption: "Assembling, with Marya" },
        ],
      },
    ],
    decisions: [
      ["Carved out, not raised", "The carved version showed the embroidery much better than the relief."],
      ["Hand-drawn curves, not an SVG", "Every spiral and connector was drawn by hand with Bézier curves, even when it cost time. The drawing is part of the work."],
      ["Transparent connectors", "I chose transparent connectors on purpose, to keep the visual harmony of the pieces."],
    ],
    outcome: [
      { title: "The board", copy: "Black and gold Khamsas joined into a single mosaic.", slot: "Final board", media: { src: "fab/final.jpg", alt: "The finished board of black and gold Khamsas", caption: "The final board" } },
    ],
    reflection: [
      "The tangible interface show took place on 23 April 2026. The piece’s name is a proverb: one hand can’t applaud. A single Khamsa is one hand, and only together do the pieces make something you can look at and touch.",
      "Most of the work was failing: failed prints, failed connectors and broken stars. The lesson was to simplify, and to test at the real size, 5 cm², before drawing the details.",
    ],
    hero: "Khamsa mosaic",
  },

  /* ------------------------------------------------------------------ LA SUITE NUMERIQUE */
  {
    id: "suite-numerique",
    title: "La Suite numérique",
    kind: "Designathon · Public digital tools",
    blurb: "What if the government’s digital suite had no apps? In SuiteSpace, Tchap, Grist, Visio and the rest become objects on one shared canvas, and Cagette lets you carry them from one space to another.",
    facts: [
      ["Context", "Internship at Inria (Ex-Situ), designathon co-organised with DINUM and ENSEMBLE"],
      ["Led by", "Wendy Mackay, Michel Beaudouin-Lafon and Janin Koch"],
      ["My team", "Group 5, SuiteSpace: Lydia Benosmane, Emma-Jade De Moor, Victoria Myot"],
      ["Timeline", "Workshops in May 2026, designathon in June 2026"],
      ["Methods", "Participatory design · Paper prototyping · Video prototyping"],
    ],
    links: [{ label: "Open the Figma prototype", hint: "Interactive prototype for La Suite numérique", href: FIG }],
    heroStack: true,
    heroMedia: { src: "suite/figma.jpg", alt: "The SuiteSpace canvas in Figma: an instrument toolbar on the left, La Suite icons in a dock at the bottom, and the Cagette cart in the corner", caption: "The SuiteSpace prototype in Figma" },
    embed: { src: "https://embed.figma.com/proto/QqMLKWPJKWYx8Jpt5kvuM0/la-suite-num%C3%A9rique?node-id=691-1270&embed-host=share", caption: "The Figma prototype, live: click around to try it" },
    video: { src: "suite/suitespace-video.mp4", poster: "suite/suitespace-video.jpg", caption: "SuiteSpace video prototype, made with paper: a team reorganises its schedule when a colleague calls in sick" },
    brief:
      "La Suite numérique is the French government’s set of digital tools for public servants: Tchap for messages, Visio for video calls, Grist for tables, Docs and more. Each tool is a separate app, so one piece of work ends up spread across many windows, and moving information between them means copying, re-uploading and searching. The designathon asked a bold question: what if we stopped thinking in apps at all? We built on interaction substrates, a concept developed by Wendy Mackay and Michel Beaudouin-Lafon, where information becomes objects you can see, move and combine, and tools become instruments that act on those objects.",
    steps: [
      {
        title: "Workshops: one frustration, one paper prototype",
        copy: "In the weeks before the designathon, we took part in weekly participatory design workshops. In small groups we picked an everyday frustration with La Suite, answered it with paper prototypes, and filmed each idea as a short video prototype.",
        slots: [],
        videos: [
          { src: "suite/ws-queue.mp4", poster: "suite/ws-queue.jpg", caption: "Alternative screen-sharing queue: presenters line up what they will share, so switching takes one tap (19 May 2026)" },
          { src: "suite/ws-agenda.mp4", poster: "suite/ws-agenda.jpg", caption: "Agenda timeline: hovering a call shows the meeting’s agenda as a timeline; a section opens the detailed view (21 May 2026)" },
          { src: "suite/ws-markers.mp4", poster: "suite/ws-markers.jpg", caption: "Visual markers: one click drops a marker in the live transcript, to find, edit or annotate later" },
          { src: "suite/ws-calendar.mp4", poster: "suite/ws-calendar.jpg", caption: "Calendar in Visio: drag “New meeting” onto the calendar to schedule it, and join an ongoing meeting from the home page" },
        ],
      },
      {
        title: "The designathon brief: from apps to substrates",
        copy: "Instead of improving one app, the designathon asked us to remove the boundaries between them.",
        slots: [],
        bullets: [
          "A message, a file or a table row lives on a canvas, not inside an app.",
          "Tools become instruments that people can combine into new, more specialised ones.",
          "Spaces can be personal, shared with a team, or collaborative.",
        ],
      },
      {
        title: "A real situation to design for",
        copy: "We started from a scenario every team knows: a colleague calls in sick. Mandy, the manager, has to rework the team’s schedule, keep track of why she changed it, tell everyone, and send a recap to her own manager at the end of the day. The cast was shared across groups: Mandy the manager, Abby who is absent, Laeticia who arrives late, and Ross the boss.",
        slots: [],
      },
      {
        title: "First try on paper",
        copy: "Before filming, we acted the idea out with paper cut-outs: a SuiteSpace for a “Digital Education Project”, with team members, files and mail as objects you can pick up and move. Walking through the scenario by hand let us check each step before building the video.",
        slots: [],
        videos: [{ src: "suite/suitespace-paper.mp4", poster: "suite/suitespace-paper.jpg", caption: "The paper version of SuiteSpace, tested by hand" }],
      },
      {
        title: "SuiteSpace: one canvas for the whole team",
        copy: "SuiteSpace replaces the separate apps with a single canvas. In the Figma prototype, the La Suite icons (Tchap, Docs, Visio, Grist…) become tools you can combine. In our video prototype, made with paper (at the top of this page):",
        slots: [],
        bullets: [
          "Mandy creates a SuiteSpace and shares it with her team.",
          "Abby’s message saying she is sick arrives as an object in the space, with her sick note attached.",
          "Mandy moves Abby’s tasks to other people directly in the team’s schedule, and keeps a note of why.",
          "Each colleague arranges the same shared elements in their own layout.",
          "At the end of the day, Mandy gathers what she needs into her Cagette and turns it into a template for the next recap.",
        ],
      },
      {
        title: "Cagette: a cart for your information",
        copy: "Cagette (French for a crate) is a selection instrument: drag documents, messages or table rows into it, and carry them from your private SuiteSpace into the team’s shared one, or across any space. Cagette came from the neighbouring group (Group 4: Yousra Bourguiba, Mathys Caetano, Mélodie Sanchez), and SuiteSpace uses it to move things between spaces.",
        slots: [],
        videos: [{ src: "suite/cagette-video.mp4", poster: "suite/cagette-video.jpg", caption: "Cagette’s video prototype: after a document is deleted, the team gathers the pieces from their workspaces to rebuild it" }],
      },
    ],
    decisions: [
      ["Objects, not apps", "Everything Mandy needs sits on one canvas, so nothing gets lost between windows and the context stays visible."],
      ["One set of data, many layouts", "Each person arranges the same shared elements their own way, while the data itself stays the same for everyone."],
      ["A cart instead of copy and paste", "Cagette collects elements and carries them across spaces. Saved as a template, a selection becomes a reusable instrument."],
    ],
    outcome: [],
    future: ["A queue for Visio, building on the screen-sharing workshop", "Interactive live transcripts, building on the visual markers workshop"],
    reflection: [
      "What we showed at the end: several personal layouts can live on one shared set of data, general tools can be combined into specialised ones, and a selection can become a template.",
    ],
    hero: "La Suite numérique prototype",
  },
  /* ------------------------------------------------------------------ COLOR-AI-T */
  {
    id: "color-ai-t",
    title: "Color-AI-t",
    kind: "Interactive system · AI coloring-page app",
    blurb: "A pen-based tablet app that turns your ideas into coloring pages with AI, and lets you change just the part you want.",
    facts: [
      ["Team", "Group 2: Moizza Azhar, Lydia Benosmane, Jay Gupte, Daniyal Nasiri Bavil, Ayda Yurtoglu"],
      ["My role", "Story interviews, then concept, scenarios, storyboards, redesign and user study with the team"],
      ["Timeline", "January–February 2026"],
      ["Methods", "8 story interviews · design alternatives · scenarios and storyboards · paper and video prototyping · generative walkthrough · comparative user study"],
      ["Design method", "Wendy Mackay’s DOIT circle"],
      ["Context", "Advanced Design of Interactive Systems · M1 HCI, Paris-Saclay University"],
    ],
    video: { src: "coloraitt/final-video.mp4", poster: "coloraitt/final-video.jpg", caption: "Final video prototype, made with paper: drawing, selecting a part of the image and prompting the AI" },
    brief:
      "Making a coloring page with AI should be quick, but the people we interviewed ran into the same walls: they could not find the words for what they pictured, the lines were not always easy to color, and they could not change one part of an image without starting again. We designed a pen-based tablet app for hobbyists, parents who want custom pages for their kids, and anyone who wants their own coloring book.",
    steps: [
      {
        title: "Story interviews",
        doit: ["observations"],
        copy: "We started by listening to how people really make coloring pages with AI. Our group ran eight story interviews with people who had tried Colorify AI and ChatGPT. I ran two, with a 19-year-old architecture student and a 25-year-old computer science student.",
        bullets: [
          "It is hard to describe an image in words. “I say a pretty butterfly with wings, but I don’t know how to be more specific than this.”",
          "Generated images are not always good for coloring: meaningless artifacts, lines that are hard to follow. “The rose didn’t look like a proper rose at all… it looked like an ugly mushroom.”",
          "People repeat the process many times, and stop when they are tired rather than satisfied. “When did you decide the coloring page was good enough?” “When I got tired.”",
          "Editing is hard: you cannot easily change one part of the image.",
        ],
        slots: [],
        media: [{ src: "coloraitt/slide-04.jpg", alt: "Slide listing the problems found in the story interviews, with quotes from participants", caption: "What the interviews showed", wide: true }],
      },
      {
        title: "From interviews to needs",
        doit: ["needs", "insights"],
        copy: "We read the transcripts side by side and pulled out what kept coming back. Three issues stood out: people struggle with prompt engineering, the phone layout breaks their mental model, and there is no visual history to compare results. My own takeaways from my two interviews:",
        bullets: [
          "AI often fails when the request is specific or imaginative.",
          "When people are not satisfied, they add more keywords rather than change approach.",
          "If a page is “good enough”, people accept it and move on.",
          "Small interface choices frustrate people even when the tool is easy to understand, like scrolling back down to press Generate, or losing previous images unless you download them.",
          "People trust tools that explain their limits and suggest alternatives, rather than tools that just fail silently.",
        ],
        slots: [],
      },
      {
        title: "Brainstorming: four directions",
        doit: ["inspiration", "design-space"],
        copy: "Before choosing, we sketched four different ways to help someone make a coloring page.",
        bullets: [
          "Node-based creation: build a page from connected prompts.",
          "Search One: start from a search on the internet instead of a prompt.",
          "Educational purpose: a tool that teaches a concept through coloring.",
          "Storybook: AI, coloring pages and a story together, for children.",
        ],
        slots: [],
        media: [{ src: "coloraitt/slide-07.jpg", alt: "Slide showing our sketches of the four alternatives: node-based creation, storybook, search one and educational purpose", caption: "Alternatives we considered", wide: true }],
      },
      {
        title: "The design concept",
        doit: ["design-space", "categories"],
        copy: "We went deeper on one problem: words alone are not enough to change a specific part of a coloring page. Color-AI-t generates coloring-page outlines with AI from a text prompt, a sketch or a photo, and lets you modify one part at a time or apply a style.",
        bullets: [
          "The AI suggests and the person always has the final say.",
          "You can select and modify specific parts of the outline, locally or globally.",
          "You can correct the AI’s output directly on the canvas, and go back to any previous version.",
        ],
        slots: [],
        media: [
          { src: "coloraitt/slide-06.jpg", alt: "Slide with the design idea and three sketches: generating via prompt, modifying a selected part, applying a style", caption: "The design idea", wide: true },
          { src: "coloraitt/slide-08.jpg", alt: "Slide describing the collaboration concept: the role of user and system, control by design, error handling", caption: "How the person and the AI share control", wide: true },
        ],
      },
      {
        title: "Scenarios and storyboards",
        doit: ["design-inputs", "designs"],
        copy: "We wrote scenarios around Anna, 24, who is creative and colors as a hobby, and drew each one as a storyboard with shooting instructions, so that we could film a paper prototype. A second storyboard on 12 February reflected what the walkthrough taught us.",
        bullets: [
          "Drawing with smart shape assistance: draw a rough circle and the system offers a clean one.",
          "Applying a style from a photo or a Pinterest reference.",
          "Undo and redo with a double-tap, and a history panel to look at past versions.",
          "Saving a character in a library and reusing it on another page.",
        ],
        slots: [],
        media: [
          { src: "coloraitt/nb-36.jpg", alt: "First page of the storyboard: Anna, 24, creative, loves coloring as a hobby, opening the app and creating a new canvas", caption: "Storyboard, first page" },
          { src: "coloraitt/nb-38.jpg", alt: "Storyboard page: drawing reference, moving and rotating an object, using the text extractor", caption: "Drawing a reference, moving an object, extracting text" },
          { src: "coloraitt/nb-40.jpg", alt: "Storyboard page: looking at past versions, saving and reusing components on different pages", caption: "History and reusable components" },
        ],
      },
      {
        title: "Paper prototype and first video",
        doit: ["prototype"],
        copy: "We built a paper tablet with a toolbar, a drawing area and an AI assistant, and filmed our first video prototype on 29 January.",
        slots: [],
        videos: [{ src: "coloraitt/first-video.mp4", poster: "coloraitt/first-video.jpg", caption: "First video prototype (29 January)" }],
      },
      {
        title: "Generative walkthrough: five pieces of feedback",
        doit: ["questions", "implications"],
        copy: "Another group walked through our video prototype. Their feedback came down to five points. For each one we named the socio-technical principle and the golden rule of interface design behind it before changing the design.",
        slots: [],
        table: {
          head: ["What they told us", "What we changed", "Principle behind the change"],
          rows: [
            ["Spatial prompting with three dots is confusing", "A draggable AI anchor: drop it on the part of the image you want to change", "Situated action · Keep users in control, prevent errors"],
            ["The AI gives only one result", "After a prompt, 3 to 5 variations appear directly on the canvas", "Reciprocal co-adaptation · Keep users in control"],
            ["Photo, prompt and draw feel separate and confusing", "One AI panel that shows photo, text and drawing input at once", "Distributed cognition · Reduce short-term memory load, strive for consistency"],
            ["The layout and icon style are not clear", "A new layout and clearer icons", "Explainability · Strive for consistency"],
            ["Some interactions are unclear or missing", "A reusable components library, a history of prompts and multiple pages", "Distributed cognition · Reduce short-term memory load, permit easy reversal of actions"],
          ],
        },
        media: [
          { src: "coloraitt/slide-09.jpg", alt: "Paper prototype photo: dragging an AI anchor onto part of the drawing", caption: "The AI anchor, dragged onto a part of the drawing" },
          { src: "coloraitt/slide-10.jpg", alt: "Paper prototype photos: the AI panel returns several variations on the canvas", caption: "Variations appear on the canvas" },
          { src: "coloraitt/slide-11.jpg", alt: "Paper prototype photos: one AI panel with photo, text and drawing input", caption: "One panel for photo, text and drawing" },
          { src: "coloraitt/slide-13.jpg", alt: "Paper prototype photos: a library of reusable components, history and multiple pages", caption: "Library, history and multiple pages" },
        ],
      },
      {
        title: "User study: Color-AI-t against Colorify",
        doit: ["study-design", "questions", "implications"],
        copy: "To see whether the redesign worked, we planned a comparative study on 17 February. Two participants used System A, Colorify, then System B, our paper prototype of Color-AI-t, and answered a questionnaire after each.",
        bullets: [
          "Both participants preferred Color-AI-t: easier to use, with more features.",
          "Most liked: drawing by prompting and AI localization (the anchor).",
          "Most confusing: navigating between screens. Some learning of the interface is needed before you can use it fully.",
        ],
        slots: [],
        media: [
          { src: "coloraitt/slide-14.jpg", alt: "Slide showing System A, the Colorify tool, and System B, the Color-AI-t paper prototype", caption: "The two systems we compared", wide: true },
          { src: "coloraitt/slide-15.jpg", alt: "Slide with questionnaire answers: participants preferred Color-AI-t", caption: "Participants preferred our system" },
          { src: "coloraitt/slide-16.jpg", alt: "Slide with questionnaire answers: the interface felt most confusing when navigating", caption: "Navigation was the most confusing part" },
        ],
      },
      {
        title: "Feasibility, control and impact",
        doit: ["implications"],
        copy: "We also asked what it would take to build, and what it does to the people using it.",
        bullets: [
          "Feasible today: existing AI such as ChatGPT or Leonardo can turn text into clean line art. The new part is the interface that snaps your drawings and the AI’s generations together.",
          "Control: three choices for every prompt, a regenerate button, and a history to return to earlier versions.",
          "Skills: the tool moves people from passive consumers of AI to active collaborators who think spatially and in words.",
          "Precision: feedback loops to nudge a selection, and “ghost previews” of the selected area.",
        ],
        slots: [],
        media: [{ src: "coloraitt/slide-19.jpg", alt: "Slide on impact and control: the in-painting challenge, three choices per prompt and a history area", caption: "Impact and control", wide: true }],
      },
    ],
    decisions: [
      ["Select a part instead of describing it", "Words could not point at one part of an image. The AI anchor is dragged onto the part you want to change, so the change stays local and the person, not the prompt, is in charge."],
      ["Show several options, not one", "People stopped when they were tired, not satisfied. Returning three to five variations on the canvas lets them choose, and cuts the trial and error."],
      ["One panel for every kind of input", "Photo, text and drawing were scattered across separate modes. One panel keeps everything you have given the AI visible in one place."],
      ["No mistake is permanent", "A history of versions and prompts, plus a library of characters, lets people go back and keep a consistent look across pages."],
    ],
    outcome: [],
    evaluation: [
      "Two participants compared Colorify and Color-AI-t with a questionnaire.",
      "Both preferred Color-AI-t, finding it easier to use and richer in features.",
      "The localized circle (the anchor) and drawing by prompting were the most liked features.",
      "Navigation was the most confusing part of the interface.",
    ],
    evaluationNote: "Two participants is a small study: it shows where to go next rather than proving the design.",
    future: [
      "Clearer navigation.",
      "AI guidelines for different angles and perspectives.",
      "In-painting that keeps the style of what surrounds the changed part.",
      "More precise selection: nudging, and ghost previews of the selected area.",
    ],
    reflection: [
      "The interviews showed that the problem was less the quality of the images than control: people could not say what they saw in their heads and could not change one part of the result. Every big change after the walkthrough (the anchor, the variations, one panel, the library and history) gave control back to the person drawing.",
    ],
    hero: "Color-AI-t video prototype",
  },
];
