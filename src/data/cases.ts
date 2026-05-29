import { t, type L10n } from '../lib/i18n';

export type LineKey = 'ai' | 'ent' | 'pers';

export type CaseSlug =
  | 'epilog'
  | 'cal'
  | 'sim-racing'
  | 'brightly'
  | 'fleet'
  | 'pqdr'
  | 'about'
  | 'contact';

export type CaseMetric = {
  num: L10n;
  label: L10n;
  linkText?: string;
  linkHref?: string;
};

export type CaseBody = {
  domains: L10n[];
  outcome: L10n;
  visualLabel: L10n;
  visualImage?: string;
  visualImageAlt?: L10n;
  visualLayout?: 'split' | 'full';
  metrics: CaseMetric[];
  claim: L10n;
  ctaHref: string;
};

export type CaseDecision = { title: L10n; body: L10n };
export type CaseScreenshot = { src: string; alt: L10n; caption?: L10n };
export type CaseScreenshotGrid = { columns: 2 | 3; images: CaseScreenshot[] };

export type CaseSection = {
  title: L10n;
  subtitle: L10n;
  paragraphs: L10n[];
  decisions?: CaseDecision[];
  italicOutro?: L10n;
  tryIts?: L10n[];
  screenshots?: CaseScreenshotGrid;
};

export type CaseDetail = {
  demoUrl?: string;
  chips?: L10n[];
  hook: L10n[];
  sections: CaseSection[];
  outcomeBeat?: {
    title: L10n;
    paragraphs: L10n[];
    highlight?: L10n;
  };
};

export type ContactLink = {
  href: string;
  icon: 'email' | 'linkedin';
  label: L10n;
  value: string;
};

export type GalleryPiece = {
  src: string;
  title: string;
  subtitle: L10n;
};

export type PersonalBody = {
  paragraphs?: L10n[];
  links?: ContactLink[];
  gallery?: GalleryPiece[];
};

export type CaseEntry = {
  slug: CaseSlug;
  name: string;
  tagline: L10n;
  line: LineKey;
  readingMinutes: number;
  body?: CaseBody;
  detail?: CaseDetail;
  personal?: PersonalBody;
};

export const CASES: CaseEntry[] = [
  {
    slug: 'epilog',
    name: 'Epilog',
    tagline: t(
      'AI caught a drug interaction. The neurologist confirmed it.',
      'Die KI hat eine Wechselwirkung erkannt. Der Neurologe hat sie bestätigt.',
    ),
    line: 'ai',
    readingMinutes: 4,
    body: {
      domains: [
        t('Healthcare', 'Gesundheitswesen'),
        t('Personal AI', 'Persönliche KI'),
        t('Wearables-adjacent', 'Wearables-nah'),
      ],
      outcome: t(
        "An app built for one user with epilepsy. It's used daily to log events as the user experiences them. The AI Insights built into the app used the tracked data to surface an adverse drug interaction. A drug prescribed by the user's primary care physician was inhibiting the absorption of the anti-epileptic drugs the user depends on. This information was brought to the neurologist and they confirmed the interaction. The neurologist independently arrived at the same treatment direction the AI had suggested.",
        'Eine App für einen einzigen Nutzer mit Epilepsie. Wird täglich genutzt, um Ereignisse direkt nach dem Erleben zu protokollieren. Die in die App eingebauten KI-Insights haben aus den Daten eine schädliche Wechselwirkung erkannt. Ein vom Hausarzt verschriebenes Medikament hemmte die Aufnahme der Anti-Epileptika, auf die der Nutzer angewiesen ist. Diese Information wurde dem Neurologen vorgelegt, und er hat die Wechselwirkung bestätigt. Der Neurologe ist unabhängig zur selben Behandlungsrichtung gekommen, die die KI vorgeschlagen hatte.',
      ),
      visualLabel: t('EPILOG · INSIGHTS SCREEN', 'EPILOG · INSIGHTS-SCREEN'),
      visualImage: '/images/cases/epilog/epilog-events-framed.png',
      visualImageAlt: t(
        'Epilog app Events screen in an iPhone frame, listing tracked seizures and auras',
        'Epilog App Events-Screen in einem iPhone-Rahmen, mit aufgelisteten Anfällen und Auren',
      ),
      visualLayout: 'split',
      metrics: [
        { num: t('1', '1'), label: t('Active daily user with epilepsy', 'Aktiver Nutzer mit Epilepsie, täglich') },
        {
          num: t('Confirmed', 'Bestätigt'),
          label: t(
            'Neurologist independently reached the same conclusion',
            'Neurologe ist unabhängig zur selben Schlussfolgerung gekommen',
          ),
        },
        {
          num: t('Live', 'Live'),
          label: t('PWA running at', 'PWA läuft unter'),
          linkText: 'epilog-demo.scottgerstl.com',
          linkHref: 'https://epilog-demo.scottgerstl.com',
        },
      ],
      claim: t(
        'I design AI features that produce clinical-grade outcomes. Surfacing patterns a clinician verifies and acts on.',
        'Ich entwerfe KI-Features, die klinisch verwertbare Ergebnisse liefern. Muster zutage bringen, die ein Arzt bestätigen und auf die er reagieren kann.',
      ),
      ctaHref: '/work/epilog',
    },
    detail: {
      demoUrl: 'https://epilog-demo.scottgerstl.com',
      chips: [t('Personal', 'Persönlich'), t('Health', 'Gesundheit'), t('AI', 'KI'), t('PWA', 'PWA')],
      hook: [
        t(
          'A seizure and aura tracker built for a family member. Log an event in seconds, find patterns across months, and surface insights that change a clinical conversation.',
          'Ein Anfalls- und Aura-Tracker, gebaut für ein Familienmitglied. Ein Ereignis in Sekunden erfassen, Muster über Monate erkennen, und Erkenntnisse zutage bringen, die ein klinisches Gespräch verändern können.',
        ),
        t(
          "Its AI analysis caught a drug interaction their GP had missed: a fiber supplement was interfering with their anti-epileptic medication. They brought the finding to their neurologist, stopped the supplement, and seizure activity went down.",
          'Die KI-Analyse hat eine Wechselwirkung erkannt, die der Hausarzt übersehen hatte: ein Ballaststoff-Präparat hat die Anti-Epileptika gestört. Die Erkenntnis wurde dem Neurologen vorgelegt, das Präparat abgesetzt, und die Anfallsaktivität ist zurückgegangen.',
        ),
      ],
      sections: [
        {
          title: t('Understanding the constraint', 'Die Einschränkung verstehen'),
          subtitle: t('What it took to define the right problem', 'Was nötig war, um das richtige Problem zu definieren'),
          paragraphs: [
            t(
              "Someone you love has epilepsy. You watch them try to log an event after a seizure or aura, still foggy, motor control off, cognitive function not fully back online. The event is over, but the aftermath is real. That's not a user story you write on a whiteboard. It's something you understand by being in the room.",
              'Jemand, den du liebst, hat Epilepsie. Du siehst zu, wie diese Person versucht, ein Ereignis nach einem Anfall oder einer Aura zu protokollieren, noch benommen, Motorik beeinträchtigt, kognitive Funktion noch nicht ganz wieder da. Das Ereignis ist vorbei, aber die Nachwirkungen sind real. Das ist keine User Story, die man auf einem Whiteboard schreibt. Das versteht man, indem man im Raum ist.',
            ),
            t('Three constraints came out of that proximity:', 'Drei Einschränkungen sind aus dieser Nähe entstanden:'),
          ],
          decisions: [
            {
              title: t('Log in seconds while still recovering.', 'In Sekunden protokollieren, noch während der Erholung.'),
              body: t(
                "Events get logged in the aftermath, when brain function is still impaired. If the logging flow requires concentration, the data doesn't get captured. This wasn't a performance goal. It was a clinical one.",
                'Ereignisse werden in den Nachwirkungen protokolliert, wenn die Gehirnfunktion noch beeinträchtigt ist. Wenn der Erfassungsablauf Konzentration erfordert, werden die Daten nicht erfasst. Das war kein Performance-Ziel. Das war ein klinisches.',
              ),
            },
            {
              title: t('Find correlations without being a data analyst.', 'Korrelationen finden, ohne Datenanalyst zu sein.'),
              body: t(
                'The calendar and insights views needed to surface patterns visually, without an interpretation step. A list of events tells you what happened. A calendar tells you what the pattern is.',
                'Die Kalender- und Insights-Ansichten mussten Muster visuell zutage bringen, ohne einen Interpretationsschritt. Eine Liste von Ereignissen sagt dir, was passiert ist. Ein Kalender sagt dir, was das Muster ist.',
              ),
            },
            {
              title: t('Serve the caregiver relationship too.', 'Auch die Arzt-Patient-Beziehung bedienen.'),
              body: t(
                'Data collected for personal use is only half the value. The other half is the conversation between a patient and their neurologist. Designing for that conversation was a first-class requirement.',
                'Daten, die für die persönliche Nutzung erfasst werden, sind nur die Hälfte des Werts. Die andere Hälfte ist das Gespräch zwischen einem Patienten und seinem Neurologen. Für dieses Gespräch zu entwerfen, war eine Anforderung erster Klasse.',
              ),
            },
          ],
          italicOutro: t(
            'AI can build a health tracker in an afternoon. Knowing which three constraints actually matter requires sitting in the room where the problem lives.',
            'KI kann einen Gesundheits-Tracker an einem Nachmittag bauen. Zu wissen, welche drei Einschränkungen tatsächlich zählen, erfordert es, im Raum zu sitzen, in dem das Problem lebt.',
          ),
          tryIts: [
            t(
              'Open the add flow and walk through logging a seizure. Every input is a single gesture: no typing, no scrolling, no decisions that require concentration.',
              'Öffne den Hinzufügen-Ablauf und gehe das Protokollieren eines Anfalls durch. Jede Eingabe ist eine einzige Geste: kein Tippen, kein Scrollen, keine Entscheidungen, die Konzentration erfordern.',
            ),
          ],
          screenshots: {
            columns: 3,
            images: [
              { src: '/images/cases/epilog/epilog-log-event.jpeg', alt: t('Event type selection', 'Auswahl des Ereignistyps'), caption: t('Type selection', 'Typauswahl') },
              { src: '/images/cases/epilog/epilog-aura-details.jpeg', alt: t('Severity and duration', 'Schweregrad und Dauer'), caption: t('Severity + duration', 'Schweregrad + Dauer') },
              { src: '/images/cases/epilog/epilog-aura-characteristics.jpeg', alt: t('Characteristics', 'Eigenschaften'), caption: t('Characteristics', 'Eigenschaften') },
            ],
          },
        },
        {
          title: t('Knowing what to kill', 'Wissen, was zu streichen ist'),
          subtitle: t('Why the best design decision was deleting a feature', 'Warum die beste Designentscheidung das Löschen eines Features war'),
          paragraphs: [
            t(
              "Early on, I built a medication reminder system. Push notifications at dosing times, confirmation flows, the whole pattern you'd expect. It didn't survive first contact with real use.",
              'Früh habe ich ein Medikamenten-Erinnerungssystem gebaut. Push-Benachrichtigungen zu Dosierungszeiten, Bestätigungsabläufe, das ganze Muster, das man erwartet. Es hat den ersten Kontakt mit echter Nutzung nicht überlebt.',
            ),
            t(
              "The problem wasn't the reminders. It was the assumption. Most of the time, medication is taken on schedule. Building a system that demanded confirmation twice a day created friction on the 95% of days when everything was fine. The user stopped engaging with the app entirely.",
              'Das Problem waren nicht die Erinnerungen. Es war die Annahme. Die meiste Zeit wird Medikation planmäßig eingenommen. Ein System zu bauen, das zweimal täglich eine Bestätigung verlangt, hat an den 95 % der Tage Reibung erzeugt, an denen alles in Ordnung war. Der Nutzer hat aufgehört, die App überhaupt zu nutzen.',
            ),
            t(
              'So I stripped it out and inverted the model: assume adherence, only capture deviations. A "Missed Dose" event type replaced the entire notification system. One tap when something goes wrong, silence when it doesn\'t.',
              'Also habe ich es rausgenommen und das Modell umgedreht: Einhaltung annehmen, nur Abweichungen erfassen. Ein Ereignistyp "Verpasste Dosis" hat das gesamte Benachrichtigungssystem ersetzt. Ein Tipp, wenn etwas schiefgeht, Stille, wenn nicht.',
            ),
          ],
          italicOutro: t(
            'AI can generate a notification system in minutes. Recognizing that the right move is to delete it requires judgment that only comes from watching someone actually use it.',
            'KI kann ein Benachrichtigungssystem in Minuten generieren. Zu erkennen, dass der richtige Zug ist, es zu löschen, erfordert ein Urteilsvermögen, das nur aus dem Beobachten von jemandem entsteht, der es tatsächlich nutzt.',
          ),
          tryIts: [
            t(
              'Tap the + button and look at the event types. "Missed Medication" is a first-class event, not a setting buried in a menu. That\'s the entire medication tracking system.',
              'Tippe auf den +-Button und schau dir die Ereignistypen an. "Medikation verpasst" ist ein Ereignis erster Klasse, keine Einstellung, die in einem Menü vergraben ist. Das ist das gesamte Medikamenten-Tracking-System.',
            ),
          ],
        },
        {
          title: t('The outcome', 'Das Ergebnis'),
          subtitle: t('How the AI caught something a doctor missed', 'Wie die KI etwas erkannt hat, das ein Arzt übersehen hatte'),
          paragraphs: [
            t(
              "The user's seizure activity had been increasing over several weeks. They'd been logging consistently: seizures, auras, missed doses, sleep data from their wearable. They ran the AI analysis.",
              'Die Anfallsaktivität des Nutzers war über mehrere Wochen gestiegen. Er hatte konsistent protokolliert: Anfälle, Auren, verpasste Dosen, Schlafdaten vom Wearable. Er hat die KI-Analyse laufen lassen.',
            ),
            t(
              "The analysis flagged something unexpected: a potential interaction between psyllium husk, a fiber supplement their GP had prescribed for digestive issues, and their anti-epileptic medication. Psyllium husk can interfere with drug absorption when taken at the same time. The GP hadn't considered this. It's not their domain.",
              'Die Analyse hat etwas Unerwartetes markiert: eine potenzielle Wechselwirkung zwischen Flohsamenschalen, einem Ballaststoff-Präparat, das der Hausarzt gegen Verdauungsbeschwerden verschrieben hatte, und den Anti-Epileptika. Flohsamenschalen können die Aufnahme von Medikamenten stören, wenn sie gleichzeitig eingenommen werden. Der Hausarzt hatte das nicht in Betracht gezogen. Das ist nicht seine Domäne.',
            ),
            t(
              'The user brought the finding to their neurologist. The neurologist confirmed the concern. They stopped the supplement. Seizure activity decreased.',
              'Der Nutzer hat die Erkenntnis zu seinem Neurologen gebracht. Der Neurologe hat die Sorge bestätigt. Sie haben das Präparat abgesetzt. Die Anfallsaktivität ist zurückgegangen.',
            ),
            t(
              "An AI tool, built by one designer, caught something a doctor missed. Not because the AI was smarter than the doctor. Because it had the right data, in the right context, and surfaced the right question.",
              'Ein KI-Tool, gebaut von einem einzigen Designer, hat etwas erkannt, das ein Arzt übersehen hatte. Nicht weil die KI schlauer war als der Arzt. Sondern weil sie die richtigen Daten hatte, im richtigen Kontext, und die richtige Frage zutage gebracht hat.',
            ),
          ],
          italicOutro: t(
            "The AI didn't replace clinical judgment. The designer's job was knowing what data to collect, how to frame the output, and when to get out of the way. That's the part AI can't do for you.",
            'Die KI hat klinisches Urteilsvermögen nicht ersetzt. Die Aufgabe des Designers war es, zu wissen, welche Daten zu erheben sind, wie das Ergebnis zu rahmen ist, und wann man aus dem Weg geht. Das ist der Teil, den die KI nicht für dich erledigen kann.',
          ),
          tryIts: [
            t(
              'Open the Insights tab and switch to "AI Analysis." Tap "Analyze my data" to see the kind of output the tool produces. The demo uses a curated dataset, but the structure mirrors real results.',
              'Öffne den Insights-Tab und wechsle zu "KI-Analyse". Tippe auf "Meine Daten analysieren", um die Art von Ausgabe zu sehen, die das Tool erzeugt. Die Demo verwendet einen kuratierten Datensatz, aber die Struktur spiegelt echte Ergebnisse wider.',
            ),
            t(
              'Head to the Export tab and tap "Export PDF." The generated report is structured for a neurologist visit: findings, medication history, and event timeline in a format that respects their time.',
              'Gehe zum Export-Tab und tippe auf "PDF exportieren". Der erzeugte Bericht ist für einen Neurologen-Besuch strukturiert: Befunde, Medikationsverlauf und Ereigniszeitlinie in einem Format, das ihre Zeit respektiert.',
            ),
          ],
          screenshots: {
            columns: 2,
            images: [
              { src: '/images/cases/epilog/epilog-summary.jpeg', alt: t('Insights summary', 'Insights-Zusammenfassung'), caption: t('Pattern analysis', 'Musteranalyse') },
              { src: '/images/cases/epilog/epilog-export.jpeg', alt: t('PDF export', 'PDF-Export'), caption: t('Clinical PDF export', 'Klinischer PDF-Export') },
            ],
          },
        },
      ],
    },
  },
  {
    slug: 'cal',
    name: 'Cal',
    tagline: t(
      'AI as deliverable. AI as builder. AI inside the product.',
      'KI als Ergebnis. KI als Erbauer. KI im Produkt selbst.',
    ),
    line: 'ai',
    readingMinutes: 3,
    body: {
      domains: [
        t('Cycling', 'Radsport'),
        t('Personal AI', 'Persönliche KI'),
        t('Practice', 'Praxis'),
      ],
      outcome: t(
        'Workout planning app with AI at three layers: as design deliverable, as builder, and inside the product. Research to shipped in 5 days. Three real users. End-to-end ownership from prompt to PWA.',
        'Workout-Planungs-App mit KI auf drei Ebenen: als Design-Ergebnis, als Erbauer und im Produkt selbst. Von der Recherche bis zur Auslieferung in 5 Tagen. Drei echte Nutzer. End-to-End-Verantwortung vom Prompt bis zur PWA.',
      ),
      visualLabel: t('CAL · LIVE PLAN DEMO', 'CAL · LIVE PLAN DEMO'),
      visualImage: '/images/cases/cal/cal-dashboard.jpeg',
      visualImageAlt: t('Cal app dashboard screen', 'Cal App Dashboard-Screen'),
      visualLayout: 'split',
      metrics: [
        {
          num: t('3', '3'),
          label: t(
            'Layers of AI: as deliverable, as builder, in product',
            'Ebenen von KI: als Ergebnis, als Erbauer, im Produkt',
          ),
        },
        {
          num: t('5 days', '5 Tage'),
          label: t('Research to shipped, end-to-end', 'Von der Recherche bis zur Auslieferung, End-to-End'),
        },
        {
          num: t('Live', 'Live'),
          label: t('Working app at', 'Funktionierende App unter'),
          linkText: 'cal-demo.scottgerstl.com',
          linkHref: 'https://cal-demo.scottgerstl.com',
        },
      ],
      claim: t(
        'I am AI-fluent at every layer of design. Research, analysis, building, shipping.',
        'Ich bin KI-versiert auf jeder Design-Ebene. Recherche, Analyse, Bauen, Ausliefern.',
      ),
      ctaHref: '/work/cal',
    },
    detail: {
      demoUrl: 'https://cal-demo.scottgerstl.com',
      chips: [t('Personal', 'Persönlich'), t('AI', 'KI'), t('Fitness', 'Fitness'), t('PWA', 'PWA')],
      hook: [
        t(
          "The code didn't take long. What took time was everything the AI couldn't do: deciding what to build, evaluating whether the output was trustworthy, and catching the interaction patterns that were technically correct but experientially wrong.",
          'Der Code hat nicht lange gedauert. Was Zeit gekostet hat, war alles, was die KI nicht konnte: zu entscheiden, was zu bauen ist, zu bewerten, ob das Ergebnis vertrauenswürdig ist, und Interaktionsmuster zu fangen, die technisch korrekt, aber im Erleben falsch waren.',
        ),
        t(
          "When production velocity is cheap, judgment becomes expensive. That's the shift this project is about.",
          'Wenn Umsetzung kostenlos ist, wird Urteilsvermögen teuer. Um diese Verschiebung geht es in diesem Projekt.',
        ),
      ],
      sections: [
        {
          title: t('When execution is free, judgment is expensive', 'Wenn Umsetzung kostenlos ist, ist Urteilsvermögen teuer'),
          subtitle: t('What building at speed revealed', 'Was das Bauen unter Zeitdruck offengelegt hat'),
          paragraphs: [
            t(
              "Cal shipped in 5 days. Claude Code produced functioning UI, wired-up components, and working API integrations faster than any developer handoff I've experienced. But the timeline isn't a boast. It's a data point about where the design effort went.",
              'Cal ist in 5 Tagen ausgeliefert worden. Claude Code hat funktionierende UI, verdrahtete Komponenten und funktionierende API-Integrationen schneller erzeugt als jede Entwickler-Übergabe, die ich erlebt habe. Aber die Zeitspanne ist keine Angeberei. Sie ist ein Datenpunkt darüber, wohin der Designaufwand geflossen ist.',
            ),
            t(
              'What took time was the evaluation loop. Running each generated plan through the same criteria a human trainer would: Does this progression make sense for someone at this fitness level? Are the rest periods appropriate for the intensity? Would a real athlete trust this enough to follow it for six weeks?',
              'Was Zeit gekostet hat, war die Bewertungsschleife. Jeden generierten Plan durch dieselben Kriterien laufen zu lassen, die ein menschlicher Trainer anwenden würde: Ergibt diese Progression Sinn für jemanden auf diesem Fitnessniveau? Sind die Pausenzeiten passend zur Intensität? Würde ein echter Athlet dem genug vertrauen, um es sechs Wochen lang zu befolgen?',
            ),
            t(
              'Zero visible AI scaffolding. The experience reads as a polished, intentional product, not a prototype. That\'s not because the AI was good enough on its own. It\'s because the evaluation criteria were specific enough to catch what "good enough" actually means.',
              'Kein sichtbares KI-Gerüst. Das Erleben liest sich als poliertes, absichtsvolles Produkt, nicht als Prototyp. Das liegt nicht daran, dass die KI von selbst gut genug war. Das liegt daran, dass die Bewertungskriterien spezifisch genug waren, um zu erkennen, was "gut genug" tatsächlich bedeutet.',
            ),
          ],
          italicOutro: t(
            "The role stops being about making things and starts being about deciding what's worth making and whether what was made is good enough.",
            'Die Rolle hört auf, vom Dinge-Machen zu handeln, und beginnt davon zu handeln, zu entscheiden, was es wert ist, gemacht zu werden, und ob das Gemachte gut genug ist.',
          ),
          tryIts: [
            t(
              'Browse the plan overview and tap into a day. The warmup sets, progressive overload, and rest periods are all AI-generated from one profile. Notice how injury accommodations (lower back) shape exercise selection across every session.',
              'Stöbere durch die Plan-Übersicht und tippe in einen Tag hinein. Die Aufwärmsätze, die progressive Steigerung und die Pausenzeiten sind alle KI-generiert aus einem einzigen Profil. Beachte, wie Verletzungs-Anpassungen (unterer Rücken) die Übungsauswahl in jeder Session prägen.',
            ),
          ],
          screenshots: {
            columns: 2,
            images: [
              { src: '/images/cases/cal/cal-active-workout.jpeg', alt: t('Active workout', 'Aktives Workout'), caption: t('Live workout', 'Live-Workout') },
              { src: '/images/cases/cal/cal-workout-detail.jpeg', alt: t('Workout detail', 'Workout-Detail'), caption: t('Workout detail', 'Workout-Detail') },
            ],
          },
        },
        {
          title: t('The prompt is the deliverable', 'Der Prompt ist das Ergebnis'),
          subtitle: t("Why the most important design artifact isn't visual", 'Warum das wichtigste Designartefakt nicht visuell ist'),
          paragraphs: [
            t(
              "The AI prompt for plan generation is a 400-word structured brief that reads more like a creative brief than a software function. It defines Cal's persona, communication style, hard constraints (training days, injuries, equipment), soft constraints (weekly progression themes, RPE modulation), and the exact JSON schema the UI depends on.",
              'Der KI-Prompt für die Plan-Generierung ist ein 400 Wörter langes, strukturiertes Briefing, das sich eher wie ein Kreativ-Briefing liest als wie eine Softwarefunktion. Er definiert Cals Persona, den Kommunikationsstil, harte Einschränkungen (Trainingstage, Verletzungen, Ausrüstung), weiche Einschränkungen (wöchentliche Progressionsthemen, RPE-Modulation) und das exakte JSON-Schema, von dem die UI abhängt.',
            ),
            t(
              "I treated this prompt the way I'd treat any design artifact: iterating on it, running heuristic evaluations against its output, and refining based on what the AI produced rather than what I expected. The prompt went through more revisions than any single screen in the app.",
              'Ich habe diesen Prompt wie jedes andere Designartefakt behandelt: daran iteriert, seine Ausgabe heuristisch bewertet und auf Basis dessen verfeinert, was die KI tatsächlich produziert hat, nicht auf Basis dessen, was ich erwartet hatte. Der Prompt hat mehr Revisionen durchlaufen als irgendein einzelner Screen in der App.',
            ),
          ],
          decisions: [
            {
              title: t('Persona in two sentences, not two paragraphs.', 'Persona in zwei Sätzen, nicht in zwei Absätzen.'),
              body: t(
                '"Be direct, technical, and motivational. Avoid mechanical metaphors." That second sentence came from v1 output that read like an instruction manual. One exclusion changed the entire tone.',
                '„Sei direkt, technisch und motivierend. Vermeide mechanische Metaphern." Dieser zweite Satz kam aus v1-Ausgaben, die sich wie eine Bedienungsanleitung lasen. Ein Ausschluss hat den gesamten Ton verändert.',
              ),
            },
            {
              title: t('"No exceptions" is load-bearing.', '„Keine Ausnahmen" ist das tragende Element.'),
              body: t(
                '"Max 3 working sets per exercise. No exceptions." Removed that phrase once in testing. The model added a 4th set "for advanced athletes." Constraint specificity replaces judgment calls you don\'t want delegated.',
                '„Maximal 3 Arbeitssätze pro Übung. Keine Ausnahmen." Diesen Satz einmal beim Testen entfernt. Das Modell hat einen 4. Satz „für fortgeschrittene Athleten" hinzugefügt. Die Spezifität von Einschränkungen ersetzt Urteile, die man nicht delegieren möchte.',
              ),
            },
            {
              title: t('Phase names over phase numbers.', 'Phasennamen vor Phasennummern.'),
              body: t(
                'Weeks 1-6 became Foundation, Accumulate, Intensify, Peak. Named phases give the model a conceptual anchor for each block. This produced more coherent progressions than numeric targets alone.',
                'Aus Woche 1–6 wurden Foundation, Accumulate, Intensify, Peak. Benannte Phasen geben dem Modell einen konzeptionellen Anker für jeden Block. Das hat kohärentere Progressionen erzeugt als rein numerische Ziele.',
              ),
            },
          ],
          italicOutro: t(
            'Any team shipping AI features needs this distinction: the prompt is a design artifact, not an engineering concern. The quality of AI output is a design outcome.',
            'Jedes Team, das KI-Features ausliefert, braucht diese Unterscheidung: der Prompt ist ein Designartefakt, kein Engineering-Anliegen. Die Qualität der KI-Ausgabe ist ein Design-Ergebnis.',
          ),
          tryIts: [
            t(
              'Watch the plan generate in the demo. The briefing, week themes, and exercise selections all come from a single structured prompt. Tap into any week to see how constraints like "max 3 working sets" and injury accommodations carry through.',
              'Beobachte, wie der Plan in der Demo erzeugt wird. Das Briefing, die Wochenthemen und die Übungsauswahlen kommen alle aus einem einzigen strukturierten Prompt. Tippe in irgendeine Woche hinein, um zu sehen, wie Einschränkungen wie „maximal 3 Arbeitssätze" und Verletzungs-Anpassungen durchgereicht werden.',
            ),
          ],
          screenshots: {
            columns: 2,
            images: [
              { src: '/images/cases/cal/cal-plan-overview.jpeg', alt: t('Plan overview', 'Plan-Übersicht'), caption: t('Plan generation', 'Plan-Generierung') },
              { src: '/images/cases/cal/cal-week-sessions.jpeg', alt: t('Week sessions', 'Wochen-Sessions'), caption: t('Week structure', 'Wochenstruktur') },
            ],
          },
        },
        {
          title: t('What the voice taught me', 'Was mich die Stimme gelehrt hat'),
          subtitle: t('Why the hardest UX problems are physical, not digital', 'Warum die schwersten UX-Probleme physisch sind, nicht digital'),
          paragraphs: [
            t(
              "The voice control system is the feature I'm most honest about. It works. It's also the roughest part of the app, and the reasons why are instructive.",
              'Die Sprachsteuerung ist das Feature, über das ich am ehrlichsten bin. Sie funktioniert. Sie ist auch der rauste Teil der App, und die Gründe dafür sind lehrreich.',
            ),
            t(
              'The architecture is sound: two-tier parsing with local regex handling ~90% of commands instantly (no network round-trip) and Claude Haiku as a fallback for edge cases. ElevenLabs TTS for synthesized coaching cues, with IndexedDB caching to avoid re-fetching repeated phrases.',
              'Die Architektur ist solide: zweistufiges Parsing, bei dem lokale Regex-Verarbeitung etwa 90 % der Befehle sofort verarbeitet (kein Netzwerk-Round-Trip), mit Claude Haiku als Fallback für Sonderfälle. ElevenLabs TTS für synthetisierte Coaching-Hinweise, mit IndexedDB-Caching, um wiederholte Phrasen nicht erneut abzurufen.',
            ),
            t(
              'The failure modes are physical, not digital. A missed "done" command mid-set means the user has to touch their phone between reps, exactly the friction the feature was supposed to eliminate. Commands fired twice when the transcript updated incrementally. Haiku triggered on background noise that regex correctly ignored. Each fix revealed a new edge case.',
              'Die Fehlermodi sind physisch, nicht digital. Ein verpasster „Fertig"-Befehl mitten im Satz bedeutet, dass der Nutzer sein Handy zwischen den Wiederholungen anfassen muss, genau die Reibung, die das Feature eliminieren sollte. Befehle haben zweimal ausgelöst, wenn das Transkript inkrementell aktualisiert wurde. Haiku hat auf Hintergrundgeräusche reagiert, die das Regex korrekt ignoriert hat. Jeder Fix hat einen neuen Sonderfall offenbart.',
            ),
            t(
              "This isn't a solvable problem in the traditional sense. It's a calibration problem that requires real-world testing with real users in gyms. Heuristic evaluation in a quiet office catches maybe 30% of failure modes. The other 70% only appear under physical use conditions.",
              'Das ist kein lösbares Problem im traditionellen Sinn. Es ist ein Kalibrierungsproblem, das echte Tests mit echten Nutzern in Fitnessstudios erfordert. Heuristische Bewertung in einem ruhigen Büro fängt vielleicht 30 % der Fehlermodi ab. Die anderen 70 % tauchen nur unter physischen Nutzungsbedingungen auf.',
            ),
          ],
          italicOutro: t(
            'Voice UX requires a different evaluation methodology than visual UX. If your product has voice features, the test environment is part of the design spec, not an afterthought.',
            'Voice-UX erfordert eine andere Bewertungsmethodik als visuelle UX. Wenn dein Produkt Sprachfunktionen hat, ist die Testumgebung Teil der Designspezifikation, kein nachträglicher Gedanke.',
          ),
          tryIts: [
            t(
              'Start a workout in the demo, then tap the microphone icon at the bottom of the screen to activate voice control. Try saying "done" to complete a set, or "skip rest" to jump ahead. The two-tier parsing handles most commands locally with no network delay.',
              'Starte in der Demo ein Workout und tippe dann unten am Bildschirm auf das Mikrofon-Symbol, um die Sprachsteuerung zu aktivieren. Probiere, „fertig" zu sagen, um einen Satz abzuschließen, oder „Pause überspringen", um vorzuspringen. Das zweistufige Parsing verarbeitet die meisten Befehle lokal, ohne Netzwerk-Verzögerung.',
            ),
          ],
          screenshots: {
            columns: 2,
            images: [
              { src: '/images/cases/cal/cal-session-complete.jpeg', alt: t('Session complete', 'Session abgeschlossen'), caption: t('Session summary', 'Session-Zusammenfassung') },
              { src: '/images/cases/cal/cal-performance.jpeg', alt: t('Performance tracking', 'Performance-Tracking'), caption: t('Progress tracking', 'Fortschritts-Tracking') },
            ],
          },
        },
      ],
      outcomeBeat: {
        title: t('What Cal is now', 'Was Cal jetzt ist'),
        paragraphs: [
          t(
            'Cal runs as the coach I use for my own training. The plans hold up across six-week cycles. Voice control has its rough edges, but it does the one thing it was supposed to do: keeps my hands off the phone between sets. Both plan types, strength and mobility, generate from a single profile, and the two halves of the week support each other instead of competing for attention.',
            'Cal läuft als der Coach, den ich für mein eigenes Training nutze. Die Pläne halten über sechswöchige Zyklen stand. Die Sprachsteuerung hat ihre rauen Kanten, aber sie macht das eine, was sie tun sollte: Sie hält meine Hände zwischen den Sätzen vom Handy fern. Beide Plan-Typen, Kraft und Mobilität, werden aus einem einzigen Profil generiert, und die beiden Wochenhälften unterstützen sich gegenseitig, statt um Aufmerksamkeit zu konkurrieren.',
          ),
        ],
        highlight: t(
          "That's the honest test for an AI-built product. Not whether it shipped fast, but whether it's still the tool you reach for when you have other options.",
          'Das ist der ehrliche Test für ein KI-gebautes Produkt. Nicht, ob es schnell ausgeliefert wurde, sondern ob es immer noch das Werkzeug ist, zu dem du greifst, wenn du andere Optionen hast.',
        ),
      },
    },
  },
  {
    slug: 'sim-racing',
    name: 'Sim Racing Coach',
    tagline: t(
      'Race-engineer practice, designed into an AI product.',
      'Race-Engineer-Praxis, in ein KI-Produkt eingebaut.',
    ),
    line: 'ai',
    readingMinutes: 6,
    body: {
      domains: [
        t('Motorsports', 'Motorsport'),
        t('AI Products', 'KI-Produkte'),
        t('Domain Depth', 'Domänenwissen'),
      ],
      outcome: t(
        "Design consulting on an AI sim-racing telemetry tool. Reframed the analysis app as the AI agent's workspace, not a chat panel beside it. Designed a race engineer pattern that translates expert practice into UX for sim-racers who don't have an engineer. Four worked archetypes shipped against the product's telemetry schemas.",
        'Designberatung für ein KI-Telemetrie-Tool im Sim-Racing. Die Analyse-App umgedeutet als Arbeitsbereich des KI-Agenten, nicht als Chat-Panel daneben. Ein Race-Engineer-Pattern entworfen, das Expertenpraxis in UX für Sim-Racer übersetzt, die keinen Ingenieur haben. Vier ausgearbeitete Archetypen ausgeliefert, gegen die Telemetrie-Schemata des Produkts.',
      ),
      visualLabel: t('SIM RACING COACH · TELEMETRY VIEW', 'SIM RACING COACH · TELEMETRIE-ANSICHT'),
      visualImage: '/images/cases/sim-racing/prototype-web-idle.png',
      visualImageAlt: t(
        'Sim Racing Coach web prototype, idle state with agent rail',
        'Sim Racing Coach Web-Prototyp, Idle-Zustand mit Agenten-Rail',
      ),
      metrics: [
        {
          num: t('Domain', 'Domäne'),
          label: t(
            'Race-engineer perspective brought to AI tooling for sim-racers',
            'Race-Engineer-Perspektive in KI-Tools für Sim-Racer eingebracht',
          ),
        },
        {
          num: t('Reframe', 'Umdeutung'),
          label: t(
            'Analysis surface as agent workspace, not chat panel',
            'Analyse-Oberfläche als Agenten-Arbeitsbereich, nicht als Chat-Panel',
          ),
        },
        {
          num: t('4 archetypes', '4 Archetypen'),
          label: t(
            "Worked patterns shipped against the product's telemetry schemas",
            'Ausgearbeitete Muster, ausgeliefert gegen die Telemetrie-Schemata des Produkts',
          ),
        },
      ],
      claim: t(
        'I bring motorsports domain knowledge to AI product design. I use AI to scale expert practice and analysis so drivers at every level can benefit.',
        'Ich bringe Motorsport-Domänenwissen in KI-Produktdesign ein. Ich nutze KI, um Expertenpraxis und Analyse zu skalieren, damit Fahrer auf jedem Niveau profitieren können.',
      ),
      ctaHref: '/work/sim-racing',
    },
    detail: {
      chips: [t('Consulting', 'Beratung'), t('AI', 'KI'), t('Agent UX', 'Agent-UX'), t('Sim-Racing', 'Sim-Racing')],
      hook: [
        t(
          'A founder shipping an AI sim-racing telemetry product asked for a design pass. The product had real telemetry data, a chat agent, and a polished analysis surface. Three working pieces, living in different containers.',
          'Ein Gründer, der ein KI-Telemetrie-Produkt im Sim-Racing ausliefert, hat um einen Design-Pass gebeten. Das Produkt hatte echte Telemetriedaten, einen Chat-Agenten und eine polierte Analyse-Oberfläche. Drei funktionierende Teile, die in unterschiedlichen Behältern lebten.',
        ),
        t(
          'The user got data, an algorithmic score, and a chat window that could run queries. What they did not get was the experience of being walked through their own session by someone who knew what to look for.',
          'Der Nutzer bekam Daten, einen algorithmischen Score und ein Chat-Fenster, das Abfragen ausführen konnte. Was er nicht bekam, war das Erleben, durch seine eigene Session geführt zu werden, von jemandem, der wusste, worauf zu achten ist.',
        ),
      ],
      sections: [
        {
          title: t('The agent and the workspace', 'Der Agent und der Arbeitsbereich'),
          subtitle: t('What the product already had, and what it was missing', 'Was das Produkt schon hatte, und was ihm fehlte'),
          paragraphs: [
            t(
              'The web app already had an AI surface: ten dimensions scored, each with a short coaching tip, all inside a modal. The desktop capture tool had a chat agent that ran corner queries and returned annotated track visualizations. The analysis surface was dense, accurate, demanding.',
              'Die Web-App hatte bereits eine KI-Oberfläche: zehn Dimensionen bewertet, jede mit einem kurzen Coaching-Tipp, alles in einem Modal. Das Desktop-Aufzeichnungstool hatte einen Chat-Agenten, der Kurven-Abfragen ausführte und annotierte Strecken-Visualisierungen zurückgab. Die Analyse-Oberfläche war dicht, präzise, anspruchsvoll.',
            ),
            t(
              'The team had even shipped the right intent in one agentic feature: click a low-scoring dimension and dots appear on the track marking where the issue occurs. The execution stops halfway. The dots are not labeled. The view does not zoom. The user is left to manually find the corner and read it back to themselves.',
              'Das Team hatte in einem agentischen Feature sogar die richtige Absicht ausgeliefert: Klick auf eine niedrig bewertete Dimension, und Punkte erscheinen auf der Strecke, die markieren, wo das Problem auftritt. Die Umsetzung hört auf halbem Weg auf. Die Punkte sind nicht beschriftet. Die Ansicht zoomt nicht. Der Nutzer muss die Kurve manuell finden und sie sich selbst vorlesen.',
            ),
            t(
              'The agent had the data. The workspace had no agent thinking with the user inside it. Each surface was doing one piece of the job a real race engineer does in a single conversation.',
              'Der Agent hatte die Daten. Der Arbeitsbereich hatte keinen Agenten, der mit dem Nutzer darin nachdachte. Jede Oberfläche machte ein Stück der Aufgabe, die ein echter Race-Engineer in einem einzigen Gespräch erledigt.',
            ),
          ],
          decisions: [
            {
              title: t('Algorithmic scoring returns a conclusion, not an investigation.', 'Algorithmische Bewertung liefert eine Schlussfolgerung, keine Untersuchung.'),
              body: t(
                'A number on a dimension hides the analysis that produced it. The analysis is the part a self-coached racer needs to see, not the score.',
                'Eine Zahl auf einer Dimension verbirgt die Analyse, die sie hervorgebracht hat. Die Analyse ist der Teil, den ein selbst-coachender Racer sehen muss, nicht der Score.',
              ),
            },
            {
              title: t('A chat agent in a separate window is architecturally severed from the workspace.', 'Ein Chat-Agent in einem separaten Fenster ist architektonisch vom Arbeitsbereich getrennt.'),
              body: t(
                'The chat is functional but the user has to carry insights back into their own analysis context by hand. The agent and the work it is supposed to help with are in different rooms.',
                'Der Chat funktioniert, aber der Nutzer muss Erkenntnisse von Hand in seinen eigenen Analyse-Kontext zurücktragen. Der Agent und die Arbeit, bei der er helfen soll, sind in unterschiedlichen Räumen.',
              ),
            },
            {
              title: t('An agentic feature that stops halfway is worse than none.', 'Ein agentisches Feature, das auf halbem Weg aufhört, ist schlimmer als gar keins.'),
              body: t(
                "A few dots on a map without labels or framing tells the user the agent saw something and then declined to explain it. The user does the rest of the agent's job for it.",
                'Ein paar Punkte auf einer Karte ohne Beschriftung oder Rahmung sagen dem Nutzer, dass der Agent etwas gesehen hat und es dann nicht erklären wollte. Der Nutzer erledigt den Rest der Arbeit des Agenten für ihn.',
              ),
            },
          ],
          italicOutro: t(
            'The product had every ingredient. They were architected as if they belonged to different products.',
            'Das Produkt hatte jede Zutat. Sie waren so architektonisch aufgebaut, als gehörten sie zu unterschiedlichen Produkten.',
          ),
        },
        {
          title: t('Agent-as-workspace', 'Der Agent als Arbeitsbereich'),
          subtitle: t('One structural move that reframed the whole product', 'Ein struktureller Zug, der das ganze Produkt umgedeutet hat'),
          paragraphs: [
            t(
              'The reframe was a single architectural commitment. The web app stops being an analysis tool with a chat panel. It becomes an AI agent surface, with the analysis view as the workspace the agent operates inside.',
              'Die Umdeutung war eine einzige architektonische Festlegung. Die Web-App hört auf, ein Analysetool mit einem Chat-Panel zu sein. Sie wird zu einer KI-Agenten-Oberfläche, mit der Analyse-Ansicht als Arbeitsbereich, in dem der Agent operiert.',
            ),
            t(
              'Not chat-adjacent-to-data. Not three modes the user toggles between. Three states of one persistent agent rail: idle when the user opens a session and the agent has the floor, investigating when the agent narrates while the workspace annotates, exploring when the agent recedes and the user drives.',
              'Nicht Chat-neben-Daten. Nicht drei Modi, zwischen denen der Nutzer wechselt. Drei Zustände eines einzigen, dauerhaft präsenten Agenten-Panels: ruhend, wenn der Nutzer eine Session öffnet und der Agent das Wort hat; untersuchend, wenn der Agent erzählt, während der Arbeitsbereich annotiert; erkundend, wenn der Agent zurücktritt und der Nutzer fährt.',
            ),
            t(
              'Under that architecture sits the behavioral spec. A race engineer pattern, not a chat persona. Diagnose before prescribe. One primary correction per cycle. Specificity over generality. Annotate the workspace, do not just describe it. Suggest a follow-up so the conversation has somewhere to go.',
              'Unter dieser Architektur sitzt die Verhaltensspezifikation. Ein Race-Engineer-Pattern, keine Chat-Persona. Diagnose vor Verschreibung. Eine primäre Korrektur pro Zyklus. Spezifität vor Allgemeinheit. Den Arbeitsbereich annotieren, nicht nur beschreiben. Eine Folgefrage vorschlagen, damit das Gespräch irgendwo hingehen kann.',
            ),
          ],
          decisions: [
            {
              title: t('Race engineer, not coach.', 'Race-Engineer, kein Coach.'),
              body: t(
                'Coaching is one of the modes a race engineer operates in. Setup work, strategy, tire management are others. Naming the pattern at the role level keeps the door open wherever the product roadmap goes next, instead of pinning it to one of the modes.',
                'Coaching ist einer der Modi, in denen ein Race-Engineer operiert. Setup-Arbeit, Strategie, Reifenmanagement sind andere. Das Pattern auf der Rollenebene zu benennen hält die Tür offen, wohin die Produkt-Roadmap als Nächstes geht, statt es auf einen der Modi festzunageln.',
              ),
            },
            {
              title: t('Three states, not three modes.', 'Drei Zustände, keine drei Modi.'),
              body: t(
                "States shift the agent's prominence based on what the user is doing. Modes would have made the user choose. The transitions are the agent's responsibility, not the user's.",
                'Zustände verschieben die Prominenz des Agenten basierend darauf, was der Nutzer tut. Modi hätten den Nutzer wählen lassen. Die Übergänge sind die Verantwortung des Agenten, nicht die des Nutzers.',
              ),
            },
            {
              title: t('Diagnose before prescribe.', 'Diagnose vor Verschreibung.'),
              body: t(
                'Tell the user what is wrong before suggesting anything different. The same restraint a real engineer applies, and the restraint that earns trust from a self-coached racer with strong opinions about their own driving.',
                'Sag dem Nutzer, was falsch ist, bevor du etwas anderes vorschlägst. Dieselbe Zurückhaltung, die ein echter Engineer anwendet, und die Zurückhaltung, die Vertrauen von einem selbst-coachenden Racer mit starken Meinungen über sein eigenes Fahren gewinnt.',
              ),
            },
          ],
          italicOutro: t(
            'The architecture is not a coaching tool that will need replacing when the next model arrives. It is the shape of the conversation the user will eventually have with the product wherever it grows.',
            'Die Architektur ist kein Coaching-Tool, das ersetzt werden muss, wenn das nächste Modell kommt. Sie ist die Form des Gesprächs, das der Nutzer am Ende mit dem Produkt führen wird, wohin auch immer es wächst.',
          ),
          screenshots: {
            columns: 2,
            images: [
              {
                src: '/images/cases/sim-racing/prototype-web-idle.png',
                alt: t('Web prototype, idle state with agent rail and surfaced findings', 'Web-Prototyp, ruhender Zustand mit Agenten-Panel und zutage gebrachten Befunden'),
                caption: t('Web: agent rail with findings surfaced', 'Web: Agenten-Panel mit zutage gebrachten Befunden'),
              },
              {
                src: '/images/cases/sim-racing/prototype-desktop-trailer.png',
                alt: t('Desktop prototype, trailer surface with capture and findings preview', 'Desktop-Prototyp, Trailer-Oberfläche mit Aufzeichnung und Befunds-Vorschau'),
                caption: t('Desktop: capture and trailer', 'Desktop: Aufzeichnung und Trailer'),
              },
            ],
          },
        },
        {
          title: t('Four worked archetypes', 'Vier ausgearbeitete Archetypen'),
          subtitle: t('Proving the pattern across question shapes', 'Das Pattern über Fragenformen hinweg belegen'),
          paragraphs: [
            t(
              'The pattern is generalizable, but generalizability needs proof. Four archetypes shipped, each handling a different shape of question, all running inside the same shell.',
              'Das Pattern ist generalisierbar, aber Generalisierbarkeit braucht Beweise. Vier Archetypen ausgeliefert, jeder mit einer anderen Form von Frage, alle laufen in derselben Hülle.',
            ),
            t(
              'Spatial questions: where on the track is this happening? The agent zooms the canvas, labels the moments through a corner, walks through what it sees, suggests the next thread to pull.',
              'Räumliche Fragen: Wo auf der Strecke passiert das? Der Agent zoomt die Leinwand, beschriftet die Momente durch eine Kurve, geht durch, was er sieht, und schlägt den nächsten Faden vor, an dem zu ziehen ist.',
            ),
            t(
              'Temporal questions: where in the session did something change, and why? Same architecture, different canvas, different supporting data, same investigative pattern around it.',
              'Zeitliche Fragen: Wo in der Session hat sich etwas verändert, und warum? Gleiche Architektur, andere Leinwand, andere unterstützende Daten, dasselbe untersuchende Pattern drumherum.',
            ),
            t(
              'Distributional questions: how consistent is the driver across the session, and where should they look closer? The agent walks the lap, points out what is working before flagging what is not, then hands the depth navigation to the user.',
              'Verteilungs-Fragen: Wie konstant ist der Fahrer über die Session, und wo sollte er genauer hinschauen? Der Agent geht die Runde durch, zeigt zuerst, was funktioniert, bevor er das markiert, was nicht funktioniert, und übergibt dann die Tiefen-Navigation an den Nutzer.',
            ),
            t(
              'State-along-line questions: what was the car doing as it moved through that moment? A different visualization shape, the same conversational shell around it.',
              'Zustands-Entlang-Linie-Fragen: Was hat das Auto gemacht, als es sich durch diesen Moment bewegt hat? Eine andere Visualisierungsform, dieselbe Gesprächs-Hülle drumherum.',
            ),
            t(
              'The four archetypes were the proof, not the point. The point was that the architecture can carry the kind of question the product roadmap implies but does not yet have a surface for.',
              'Die vier Archetypen waren der Beweis, nicht der Punkt. Der Punkt war, dass die Architektur die Art von Frage tragen kann, die die Produkt-Roadmap impliziert, für die es aber noch keine Oberfläche gibt.',
            ),
          ],
          decisions: [
            {
              title: t('Each archetype is a question shape, not a screen.', 'Jeder Archetyp ist eine Fragenform, kein Screen.'),
              body: t(
                'Spatial, temporal, distributional, state-along-line. Four examples prove the architecture handles whatever question comes next, not that there are four views to ship.',
                'Räumlich, zeitlich, verteilungsbezogen, Zustand-entlang-Linie. Vier Beispiele beweisen, dass die Architektur jede Frage handhabt, die als Nächstes kommt, nicht, dass es vier Ansichten zu liefern gibt.',
              ),
            },
            {
              title: t('Depth navigation lives inside an archetype.', 'Tiefen-Navigation lebt innerhalb eines Archetyps.'),
              body: t(
                'An overview view and a drill-down view are two states of the same investigation, not two separate ones. The pattern handles the transition without leaving the conversation.',
                'Eine Übersichts-Ansicht und eine Drill-Down-Ansicht sind zwei Zustände derselben Untersuchung, nicht zwei separate. Das Pattern handhabt den Übergang, ohne das Gespräch zu verlassen.',
              ),
            },
            {
              title: t("Designed against the product's existing data.", 'Gegen die bestehenden Daten des Produkts entworfen.'),
              body: t(
                'Each archetype shaped to what the capture layer already produces. The design extends what the team has already built rather than asking for new infrastructure to land first.',
                'Jeder Archetyp ist auf das geformt, was die Aufzeichnungs-Schicht bereits produziert. Das Design erweitert das, was das Team bereits gebaut hat, statt zuerst nach neuer Infrastruktur zu verlangen.',
              ),
            },
          ],
          italicOutro: t(
            'The point of working four archetypes was never that there should be four. It was that one architecture can hold whatever the product asks of it next.',
            'Der Sinn, vier Archetypen auszuarbeiten, war nie, dass es vier sein sollten. Der Sinn war, dass eine Architektur halten kann, was auch immer das Produkt als Nächstes von ihr verlangt.',
          ),
          screenshots: {
            columns: 2,
            images: [
              {
                src: '/images/cases/sim-racing/corner-investigation.png',
                alt: t('Spatial investigation through a corner', 'Räumliche Untersuchung durch eine Kurve'),
                caption: t('Spatial question', 'Räumliche Frage'),
              },
              {
                src: '/images/cases/sim-racing/session-arc.png',
                alt: t('Temporal investigation across a session', 'Zeitliche Untersuchung über eine Session'),
                caption: t('Temporal question', 'Zeitliche Frage'),
              },
              {
                src: '/images/cases/sim-racing/consistency-overview.png',
                alt: t('Distributional investigation across the lap', 'Verteilungs-Untersuchung über die Runde'),
                caption: t('Distributional question', 'Verteilungs-Frage'),
              },
              {
                src: '/images/cases/sim-racing/handling-state.png',
                alt: t('State-along-line investigation through a corner', 'Zustands-Entlang-Linie-Untersuchung durch eine Kurve'),
                caption: t('State-along-line question', 'Zustands-Entlang-Linie-Frage'),
              },
            ],
          },
        },
      ],
      outcomeBeat: {
        title: t('What the engagement delivered', 'Was das Engagement geliefert hat'),
        paragraphs: [
          t(
            "A conceptual diagnostic carrying the architectural argument. A working web prototype with the four archetypes. A desktop role redefinition from chat host to capture-and-trailer surface. All designed against the product's existing data layer. All aligned with the long-term direction the founder was building toward.",
            'Eine konzeptionelle Diagnostik, die das architektonische Argument trägt. Ein funktionierender Web-Prototyp mit den vier Archetypen. Eine Desktop-Rollendefinition vom Chat-Host zur Aufzeichnungs-und-Trailer-Oberfläche. Alles gegen die bestehende Datenschicht des Produkts entworfen. Alles auf die langfristige Richtung ausgerichtet, auf die der Gründer hingearbeitet hat.',
          ),
          t(
            'The 20-hour timebox held. The handoff carried the architectural commitment, the worked archetypes, and a clean list of open questions for the next round.',
            'Die 20-Stunden-Timebox hat gehalten. Die Übergabe trug die architektonische Festlegung, die ausgearbeiteten Archetypen und eine saubere Liste offener Fragen für die nächste Runde.',
          ),
        ],
        highlight: t(
          "The honest test of a design engagement isn't whether it shipped. It's whether the architecture can carry the product where the founder said he wanted to take it.",
          'Der ehrliche Test eines Design-Engagements ist nicht, ob es ausgeliefert wurde. Sondern ob die Architektur das Produkt dorthin tragen kann, wohin der Gründer gesagt hat, dass er es bringen wollte.',
        ),
      },
    },
  },
  {
    slug: 'brightly',
    name: 'Brightly',
    tagline: t(
      'Design direction for a $1.575B acquisition.',
      'Designrichtung für eine 1,575 Mrd. $ Übernahme.',
    ),
    line: 'ent',
    readingMinutes: 6,
    body: {
      domains: [
        t('Manufacturing', 'Fertigung'),
        t('Healthcare', 'Gesundheitswesen'),
        t('Education', 'Bildung'),
        t('Government', 'Behörden'),
      ],
      outcome: t(
        'Vision design across 12 siloed products at Brightly. A unified design language and integration model proposed across the portfolio. Designs were used in acquisition-stage presentations to Siemens to demonstrate the platform vision and integration roadmap. Brightly was acquired for $1.575B.',
        'Vision-Design über 12 isolierte Produkte bei Brightly. Eine vereinheitlichte Designsprache und ein Integrationsmodell für das gesamte Portfolio vorgeschlagen. Die Designs wurden in den Akquisitionspräsentationen an Siemens verwendet, um die Plattform-Vision und Integrations-Roadmap zu demonstrieren. Brightly wurde für 1,575 Mrd. $ übernommen.',
      ),
      visualLabel: t('BRIGHTLY · PLATFORM VISION HERO', 'BRIGHTLY · PLATFORM-VISION-HERO'),
      visualImage: '/images/cases/brightly/brightly-dashboard.jpeg',
      visualImageAlt: t(
        'Brightly platform dashboard with planned maintenance and at-risk assets',
        'Brightly Plattform-Dashboard mit geplanter Wartung und gefährdeten Anlagen',
      ),
      metrics: [
        { num: t('$1.575B', '1,575 Mrd. $'), label: t('Siemens acquisition', 'Siemens-Übernahme') },
        {
          num: t('74%', '74 %'),
          label: t(
            'Customers excited by the future product direction',
            'Kunden begeistert von der zukünftigen Produktrichtung',
          ),
        },
        {
          num: t('5×', '5×'),
          label: t(
            'Increase in time on dashboard pages in user testing',
            'Mehr Zeit auf Dashboard-Seiten im User Testing',
          ),
        },
      ],
      claim: t(
        'I lead design vision that holds up under acquisition-grade scrutiny.',
        'Ich führe Design-Visionen an, die einer Akquisitions-Prüfung standhalten.',
      ),
      ctaHref: '/work/brightly',
    },
    detail: {
      chips: [t('Enterprise', 'Enterprise'), t('Platform Vision', 'Plattform-Vision'), t('Design System', 'Designsystem'), t('B2B SaaS', 'B2B-SaaS')],
      hook: [
        t(
          'Brightly was acquired by Siemens for $1.575B. Before the deal closed, the platform vision was previewed to existing customers: 74% of conference attendees expressed excitement about the future product direction, 36% said they were more likely to renew. User testing on the functional prototypes saw time on dashboard pages increase 5×. NPS verbatims, gathered independently, validated the survey findings.',
          'Brightly wurde von Siemens für 1,575 Mrd. $ übernommen. Bevor der Deal abgeschlossen war, wurde die Plattform-Vision bestehenden Kunden vorgestellt: 74 % der Konferenzteilnehmer äußerten Begeisterung für die zukünftige Produktrichtung, 36 % sagten, sie würden wahrscheinlicher verlängern. User Tests an den funktionalen Prototypen zeigten eine 5-fache Steigerung der Zeit auf Dashboard-Seiten. Unabhängig erhobene NPS-Stimmen haben die Umfrageergebnisse bestätigt.',
        ),
        t(
          'The work behind those signals: vision design across 12 siloed products at Brightly, anchored to a complete corporate rebrand and a major client conference. A new design language. A unified design system and front-end-agnostic component library. North star designs for the integrated portfolio. A transition plan from siloed products to platform.',
          'Die Arbeit hinter diesen Signalen: Vision-Design über 12 isolierte Produkte bei Brightly, verankert in einem vollständigen Corporate Rebrand und einer großen Kundenkonferenz. Eine neue Designsprache. Ein vereinheitlichtes Designsystem und eine Frontend-agnostische Komponentenbibliothek. North-Star-Designs für das integrierte Portfolio. Ein Übergangsplan von isolierten Produkten zur Plattform.',
        ),
      ],
      sections: [
        {
          title: t('Three surfaces, three arguments', 'Drei Oberflächen, drei Argumente'),
          subtitle: t('The hero screens, and the design intention behind each', 'Die Hero-Screens, und die Designabsicht hinter jedem'),
          paragraphs: [
            t(
              'Three hero surfaces did most of the work of carrying the platform claim. Each was a different argument the vision had to make.',
              'Drei Hero-Oberflächen haben den größten Teil der Arbeit übernommen, den Plattform-Anspruch zu tragen. Jede war ein anderes Argument, das die Vision zu machen hatte.',
            ),
            t(
              'The dashboard was the moment a customer landed in the product and saw all of their work in one place: planned maintenance, team availability, at-risk assets, work orders waiting on triage. The decision was that the dashboard had to be role-based, customizable, actionable, and data-driven. Every part of that list answered a specific complaint customers had raised in the research.',
              'Das Dashboard war der Moment, in dem ein Kunde im Produkt landete und seine gesamte Arbeit an einem Ort sah: geplante Wartung, Teamverfügbarkeit, gefährdete Anlagen, Arbeitsaufträge, die auf Triage warteten. Die Entscheidung war, dass das Dashboard rollenbasiert, anpassbar, handlungsfähig und datengetrieben sein musste. Jeder Teil dieser Liste beantwortete eine spezifische Beschwerde, die Kunden in der Recherche geäußert hatten.',
            ),
            t(
              "Asset health and suggested actions extended the dashboard's logic. Asset health was the system saying which equipment was likely to fail, on what timeline, with what financial exposure: predicted failure, estimated losses, recommended course of action. Suggested actions was the system proposing the next move with the recommended option marked. Together they collapsed the old workflow (jump between tools, read the data yourself, decide alone) into a single surface where the system did the analysis and the operator made the call.",
              'Asset Health und Suggested Actions haben die Logik des Dashboards erweitert. Asset Health war das System, das sagte, welche Anlage wahrscheinlich ausfallen würde, in welcher Zeitspanne, mit welcher finanziellen Auswirkung: vorhergesagter Ausfall, geschätzte Verluste, empfohlene Vorgehensweise. Suggested Actions war das System, das den nächsten Zug vorschlug, mit markierter empfohlener Option. Zusammen haben sie den alten Workflow (zwischen Tools springen, die Daten selbst lesen, allein entscheiden) auf eine einzige Oberfläche reduziert, auf der das System die Analyse machte und der Operator die Entscheidung traf.',
            ),
            t(
              'The design system itself was the third surface. A front-end-agnostic component library, branded and unified, paired with the new corporate design language. Not a documentation site. A working library that any product team could pull from regardless of stack, which is what made the platform claim implementable across 12 different products at once.',
              'Das Designsystem selbst war die dritte Oberfläche. Eine Frontend-agnostische Komponentenbibliothek, gebrandet und vereinheitlicht, gepaart mit der neuen Corporate-Designsprache. Keine Dokumentationsseite. Eine funktionierende Bibliothek, aus der jedes Produktteam unabhängig vom Stack ziehen konnte, und das ist es, was den Plattform-Anspruch über 12 verschiedene Produkte hinweg umsetzbar machte.',
            ),
          ],
          decisions: [
            {
              title: t('Dashboard principles framed as customer answers.', 'Dashboard-Prinzipien als Antworten an die Kunden gerahmt.'),
              body: t(
                'Role-based, customizable, actionable, data-driven. Each principle answered a specific complaint surfaced in the research mix (Pendo analytics, Aha! product feedback, Client Advisory Boards, client visits, internal SME interviews). The principles were not aesthetic. They were arguments back at the field.',
                'Rollenbasiert, anpassbar, handlungsfähig, datengetrieben. Jedes Prinzip beantwortete eine spezifische Beschwerde, die im Recherche-Mix zutage trat (Pendo-Analytics, Aha!-Produkt-Feedback, Client Advisory Boards, Kundenbesuche, interne SME-Interviews). Die Prinzipien waren nicht ästhetisch. Sie waren Argumente zurück ins Feld.',
              ),
            },
            {
              title: t('Asset health as a three-part decision support surface.', 'Asset Health als dreiteilige Entscheidungshilfe-Oberfläche.'),
              body: t(
                'Predicted failure plus estimated losses plus recommended course of action. The three together turn the surface from "data point about a piece of equipment" into "decision the operator can make right now." The pattern propagated through the suggested actions surface and gave the platform a consistent operator-AI relationship across products.',
                'Vorhergesagter Ausfall plus geschätzte Verluste plus empfohlene Vorgehensweise. Die drei zusammen verwandeln die Oberfläche von „Datenpunkt über eine Anlage" in „Entscheidung, die der Operator jetzt treffen kann". Das Muster hat sich durch die Suggested-Actions-Oberfläche fortgesetzt und der Plattform eine konsistente Operator-KI-Beziehung über die Produkte hinweg gegeben.',
              ),
            },
            {
              title: t('Component library as front-end agnostic.', 'Komponentenbibliothek als Frontend-agnostisch.'),
              body: t(
                'A unified design system is worth less than a unified component library, because a design system still has to be re-implemented by every product team. The library was built front-end-agnostic so any product, on any stack, in any office, could pull components directly. That is what made the platform claim implementable rather than aspirational.',
                'Ein vereinheitlichtes Designsystem ist weniger wert als eine vereinheitlichte Komponentenbibliothek, weil ein Designsystem von jedem Produktteam neu implementiert werden muss. Die Bibliothek wurde Frontend-agnostisch gebaut, damit jedes Produkt, auf jedem Stack, in jedem Büro, Komponenten direkt ziehen konnte. Das ist es, was den Plattform-Anspruch umsetzbar statt aspirativ machte.',
              ),
            },
          ],
          italicOutro: t(
            'Hero screens earn their position by showing what the platform claim looks like when a customer scrolls through it. The argument lives in the screens, not next to them.',
            'Hero-Screens verdienen sich ihre Position, indem sie zeigen, wie der Plattform-Anspruch aussieht, wenn ein Kunde durchscrollt. Das Argument lebt in den Screens, nicht daneben.',
          ),
          screenshots: {
            columns: 3,
            images: [
              {
                src: '/images/cases/brightly/brightly-dashboard.jpeg',
                alt: t('Brightly admin dashboard with planned maintenance, work performance, team center, and at-risk assets', 'Brightly Admin-Dashboard mit geplanter Wartung, Arbeitsleistung, Team-Center und gefährdeten Anlagen'),
                caption: t('The Dashboard', 'Das Dashboard'),
              },
              {
                src: '/images/cases/brightly/brightly-asset-health.jpeg',
                alt: t('Asset health surface with predicted failure trend, estimated losses, and recommended actions', 'Asset-Health-Oberfläche mit vorhergesagtem Ausfall-Trend, geschätzten Verlusten und empfohlenen Aktionen'),
                caption: t('Asset Health', 'Asset Health'),
              },
              {
                src: '/images/cases/brightly/brightly-suggested-actions.jpeg',
                alt: t('Suggested actions modal with options and a recommended action highlighted', 'Suggested-Actions-Modal mit Optionen und einer hervorgehobenen empfohlenen Aktion'),
                caption: t('Suggested Actions', 'Suggested Actions'),
              },
            ],
          },
        },
        {
          title: t('Twelve silos, one platform vision', 'Zwölf Silos, eine Plattform-Vision'),
          subtitle: t('What the vision had to compress into a single product story', 'Was die Vision in eine einzige Produktgeschichte verdichten musste'),
          paragraphs: [
            t(
              "Brightly had assembled a portfolio of 12 siloed software products serving manufacturing, healthcare, education, and government. The portfolio's strategy said \"platform.\" The user experience said twelve different products under one logo, each with its own dashboard, its own data, its own workflows. Customers were saying it directly: poor landing-page experience, products that did not share datasets, disjointed workflows, no clear expectation for what the future looked like.",
              'Brightly hatte ein Portfolio von 12 isolierten Softwareprodukten zusammengestellt, die Fertigung, Gesundheitswesen, Bildung und Behörden bedienten. Die Portfolio-Strategie sagte „Plattform". Das Nutzererleben sagte zwölf verschiedene Produkte unter einem Logo, jedes mit seinem eigenen Dashboard, seinen eigenen Daten, seinen eigenen Workflows. Die Kunden sagten es direkt: schlechtes Landing-Page-Erleben, Produkte, die keine Datensätze teilten, abgehackte Workflows, keine klare Erwartung dafür, wie die Zukunft aussehen würde.',
            ),
            t(
              'Two business events anchored the work. A complete corporate rebrand, which gave the design language room to be redrawn from scratch rather than nudged from where it had been. And a major client conference, which set a deadline that everything had to be ready to show to existing customers in functional prototype form.',
              'Zwei Geschäftsereignisse haben die Arbeit verankert. Ein vollständiges Corporate Rebrand, das der Designsprache Raum gab, von Grund auf neu gezeichnet zu werden, statt aus ihrer bisherigen Position heraus angepasst zu werden. Und eine große Kundenkonferenz, die eine Deadline setzte, an der alles bereit sein musste, bestehenden Kunden in funktionaler Prototyp-Form gezeigt zu werden.',
            ),
            t(
              'As Manager of Product Design at Brightly, I led a team of seven designers distributed across Melbourne, London, Noida, Montreal, and the US. The structural work, the executive presentation, and the case for the reframe were mine. A senior designer on the team paired with me on the visual execution; most of what you would see in the prototypes is their craft. The two halves of the work fit together: the architecture decided what to argue, the visual design decided how to argue it.',
              'Als Manager of Product Design bei Brightly habe ich ein Team von sieben Designern geführt, verteilt über Melbourne, London, Noida, Montreal und die USA. Die strukturelle Arbeit, die Executive-Präsentation und das Argument für die Umdeutung waren meine. Eine Senior-Designerin im Team hat sich mit mir an der visuellen Umsetzung gepaart; das meiste, was du in den Prototypen sehen würdest, ist ihr Handwerk. Die beiden Hälften der Arbeit passten zusammen: die Architektur entschied, was zu argumentieren ist, das visuelle Design entschied, wie es zu argumentieren ist.',
            ),
            t(
              'The deliverables stacked on each other. A new corporate design language anchored to the rebrand. A unified design system built on top. A front-end-agnostic UI component library any product team could implement against. North star designs for the integrated portfolio. A transition plan from current siloed products to the platform shape. The point of the stack was that each layer made the next one implementable rather than aspirational.',
              'Die Ergebnisse haben aufeinander aufgebaut. Eine neue Corporate-Designsprache, verankert im Rebrand. Ein vereinheitlichtes Designsystem darauf gebaut. Eine Frontend-agnostische UI-Komponentenbibliothek, gegen die jedes Produktteam implementieren konnte. North-Star-Designs für das integrierte Portfolio. Ein Übergangsplan von den derzeit isolierten Produkten zur Plattform-Form. Der Sinn des Stapels war, dass jede Schicht die nächste umsetzbar machte statt aspirativ.',
            ),
          ],
          decisions: [
            {
              title: t('Tie the vision to two business events, not one.', 'Die Vision an zwei Geschäftsereignisse binden, nicht an eines.'),
              body: t(
                'The rebrand gave the design language permission to break with the past. The client conference gave the prototypes a real deadline and a real audience. Anchoring the vision to both meant the work had business justification on two axes, not just one.',
                'Das Rebrand hat der Designsprache die Erlaubnis gegeben, mit der Vergangenheit zu brechen. Die Kundenkonferenz hat den Prototypen eine echte Deadline und ein echtes Publikum gegeben. Die Vision an beide zu verankern hieß, dass die Arbeit eine Geschäftsrechtfertigung auf zwei Achsen hatte, nicht nur auf einer.',
              ),
            },
            {
              title: t('Lead the structure, partner on the craft.', 'Die Struktur führen, beim Handwerk partnern.'),
              body: t(
                'Managing a distributed seven-person design team while running the structural and presentation work meant getting clear on what I owned and what others owned. I led the architecture, the systems thinking, and the case to executives. A senior designer led the visual execution. Both halves had to be excellent for the work to be defensible.',
                'Ein verteiltes siebenköpfiges Designteam zu managen, während ich die strukturelle und die Präsentations-Arbeit führte, hieß, klar darüber zu werden, was ich besaß und was andere besaßen. Ich habe die Architektur geführt, das Systemdenken und das Argument vor der Führungsebene. Eine Senior-Designerin hat die visuelle Umsetzung geführt. Beide Hälften mussten exzellent sein, damit die Arbeit zu verteidigen war.',
              ),
            },
            {
              title: t('A transition plan, not just a destination.', 'Ein Übergangsplan, nicht nur ein Ziel.'),
              body: t(
                'Vision design is easy to dismiss as aspirational. Pairing the North star designs with a transition plan from current products to platform made the work answerable to engineering: here is what we propose, here is how the existing portfolio gets there from where it is.',
                'Vision-Design wird leicht als aspirativ abgetan. Die North-Star-Designs mit einem Übergangsplan von den aktuellen Produkten zur Plattform zu paaren, hat die Arbeit gegenüber Engineering verantwortlich gemacht: Hier ist, was wir vorschlagen; hier ist, wie das bestehende Portfolio von dort, wo es ist, dorthin kommt.',
              ),
            },
          ],
          italicOutro: t(
            'Strategic narratives say "platform." Design evidence says what the platform actually looks like when a customer clicks through it, what the design language allows, and how the existing products get there.',
            'Strategische Erzählungen sagen „Plattform". Design-Beweise sagen, wie die Plattform tatsächlich aussieht, wenn ein Kunde durchklickt, was die Designsprache erlaubt und wie die bestehenden Produkte dorthin kommen.',
          ),
          screenshots: {
            columns: 2,
            images: [
              {
                src: '/images/cases/brightly/brightly-new-brand.jpeg',
                alt: t('New Brightly brand identity with photography treatment showing three customers across industries', 'Neue Brightly-Markenidentität mit Fotografie-Treatment, das drei Kunden über Branchen hinweg zeigt'),
                caption: t('The new brand', 'Die neue Marke'),
              },
              {
                src: '/images/cases/brightly/brightly-design-system.jpeg',
                alt: t('Lumos Design System rendered as a product page, showing input field states and information graphics', 'Lumos Design System, gerendert als Produktseite, mit Eingabefeld-Zuständen und Informationsgrafiken'),
                caption: t('Design system as a product', 'Designsystem als Produkt'),
              },
            ],
          },
        },
      ],
      outcomeBeat: {
        title: t('What the work was for', 'Wofür die Arbeit war'),
        paragraphs: [
          t(
            'The Chief Product Officer was happy enough with the work to put the prototypes into multiple high-stakes rooms. They went into board presentations supporting funding requests. They went into the acquisition-stage meetings with Siemens leading up to the deal. Brightly was acquired by Siemens for $1.575B.',
            'Der Chief Product Officer war zufrieden genug mit der Arbeit, um die Prototypen in mehrere Räume mit hohem Einsatz zu bringen. Sie sind in Board-Präsentationen gegangen, die Finanzierungsanträge gestützt haben. Sie sind in die Akquisitions-Besprechungen mit Siemens vor dem Deal gegangen. Brightly wurde von Siemens für 1,575 Mrd. $ übernommen.',
          ),
          t(
            'The design work did not cause the acquisition. It was the part of the story the acquirer needed to see to evaluate whether the platform claim had design proof underneath the strategic narrative.',
            'Die Designarbeit hat die Übernahme nicht verursacht. Sie war der Teil der Geschichte, den der Käufer sehen musste, um zu bewerten, ob der Plattform-Anspruch Design-Beweise unter der strategischen Erzählung hatte.',
          ),
        ],
        highlight: t(
          'Design judgment at the layer above craft is what enterprise design vision actually means. Not making things prettier. Making the strategic claim verifiable before the business commits to it.',
          'Designurteil auf der Ebene über dem Handwerk ist das, was Enterprise-Design-Vision tatsächlich bedeutet. Nicht Dinge hübscher machen. Den strategischen Anspruch überprüfbar machen, bevor das Geschäft sich darauf festlegt.',
        ),
      },
    },
  },
  {
    slug: 'fleet',
    name: 'Fleet',
    tagline: t(
      'Three tools and two forms, consolidated into one.',
      'Drei Tools und zwei Formulare, zu einem zusammengeführt.',
    ),
    line: 'ent',
    readingMinutes: 5,
    body: {
      domains: [
        t('Logistics', 'Logistik'),
        t('Industrial', 'Industrie'),
        t('Cold Chain', 'Kühlkette'),
      ],
      outcome: t(
        '0→1 industrial fleet operations product. Sole UX designer from initial research through shipped pilot. Consolidated three software tools and two paper forms into a single workflow. Gloves, dust, time pressure.',
        '0→1 Industrie-Flottenmanagement-Produkt. Einziger UX-Designer von der ersten Recherche bis zum ausgelieferten Pilot. Drei Softwaretools und zwei Papierformulare zu einem einzigen Workflow zusammengeführt. Handschuhe, Staub, Zeitdruck.',
      ),
      visualLabel: t('FLEET · WORKFLOW BEFORE & AFTER', 'FLEET · WORKFLOW VORHER & NACHHER'),
      visualImage: '/images/cases/fleet/fleet-yard-map.jpeg',
      visualImageAlt: t(
        'Fleet yard management view with aerial map of dock and yard spots',
        'Fleet Hof-Management-Ansicht mit Luftbild von Dock und Hof-Plätzen',
      ),
      metrics: [
        {
          num: t('3 + 2 → 1', '3 + 2 → 1'),
          label: t(
            'Tools and forms consolidated to a single workflow',
            'Tools und Formulare zu einem Workflow zusammengeführt',
          ),
        },
        {
          num: t('Sole UX', 'Einziger UX'),
          label: t('Research, design, and pilot delivery', 'Recherche, Design und Pilot-Auslieferung'),
        },
        {
          num: t('Shipped', 'Ausgeliefert'),
          label: t(
            'Live with industrial users in cold-storage logistics',
            'Live mit Industrienutzern in der Kühlhauslogistik',
          ),
        },
      ],
      claim: t(
        'I own design end-to-end on industrial products that have to work in physical-world conditions.',
        'Ich verantworte Design End-to-End bei Industrieprodukten, die unter realen Bedingungen funktionieren müssen.',
      ),
      ctaHref: '/work/fleet',
    },
    detail: {
      chips: [t('Industrial', 'Industrie'), t('Logistics', 'Logistik'), t('0→1', '0→1'), t('Sole UX', 'Einziger UX')],
      hook: [
        t(
          'Sole UX lead on a 0→1 yard-management product at Ndustrial. The shipped pilot consolidated three software tools and two paper forms into a single yard-management interface, deployed at a cold-storage third-party-logistics facility tracking hybrid electric trailers.',
          'Einziger UX-Lead für ein 0→1 Hof-Management-Produkt bei Ndustrial. Der ausgelieferte Pilot hat drei Softwaretools und zwei Papierformulare in eine einzige Hof-Management-Oberfläche zusammengeführt, eingesetzt in einer Kühllager-Logistik-Einrichtung eines Drittanbieters, die hybride elektrische Trailer verfolgt.',
        ),
        t(
          "Industrial conditions don't tolerate friction. Gloves on. Dust on the screen. Twelve trucks waiting on dock assignments. Every design decision was answerable to whether it survived the dock, not whether it looked clean in design review.",
          'Industrielle Bedingungen tolerieren keine Reibung. Handschuhe an. Staub auf dem Bildschirm. Zwölf Lkw warten auf Dock-Zuweisungen. Jede Designentscheidung musste sich daran messen lassen, ob sie das Dock überlebt, nicht ob sie im Design-Review sauber aussieht.',
        ),
      ],
      sections: [
        {
          title: t('Three surfaces, one workflow', 'Drei Oberflächen, ein Workflow'),
          subtitle: t('The hero screens, and the design intention behind each', 'Die Hero-Screens, und die Designabsicht hinter jedem'),
          paragraphs: [
            t(
              'Three hero surfaces carried the workflow. Each replaced a piece of the old way of doing things. Together they collapsed the jump-between-tools-and-clipboards model into a single screen the yard manager could run their dock from.',
              'Drei Hero-Oberflächen haben den Workflow getragen. Jede hat ein Stück der alten Art zu arbeiten ersetzt. Zusammen haben sie das Springen-zwischen-Tools-und-Klemmbrettern-Modell auf einen einzigen Screen reduziert, von dem aus der Hof-Manager sein Dock führen konnte.',
            ),
            t(
              "The yard management view was the operational center. An aerial map rendered every dock door and yard spot as a chip showing what was plugged in, plugged out, or empty. The trailer list on the left was searchable and sortable. Selecting any chip or list item opened a detail panel alongside the map: trailer ID, carrier, eTRU status, driver, and an audit log, all without losing the manager's sense of the whole yard.",
              'Die Hof-Management-Ansicht war das operative Zentrum. Eine Luftaufnahme hat jedes Docktor und jeden Hof-Platz als Chip dargestellt, der zeigte, was eingesteckt, ausgesteckt oder leer war. Die Trailer-Liste auf der linken Seite war durchsuchbar und sortierbar. Die Auswahl eines Chips oder Listeneintrags öffnete ein Detailpanel neben der Karte: Trailer-ID, Spediteur, eTRU-Status, Fahrer und ein Audit-Log, alles ohne dem Manager das Gefühl für den gesamten Hof zu nehmen.',
            ),
            t(
              'Driver communication moved off radios and phone calls onto text-based messages inside the interface. Asynchronous, recordable, threaded against the trailer. Quick-action templates for the most common messages (load ready for check-out, return to front desk, await further instruction) handled the bulk of routine traffic with one tap.',
              'Die Fahrerkommunikation ist von Funkgeräten und Telefonanrufen auf textbasierte Nachrichten in der Oberfläche umgezogen. Asynchron, aufzeichenbar, am Trailer verknüpft. Quick-Action-Vorlagen für die häufigsten Nachrichten (Ladung bereit zur Auslieferung, zur Anmeldung zurückkehren, weitere Anweisung abwarten) haben den größten Teil des Routinetraffics mit einem Tipp erledigt.',
            ),
            t(
              'Check-in was the consolidation made visible. What used to require three software tools and two paper forms became a single modal: pick a spot, confirm the eTRU status, done. When the yard was at capacity, the waitlist absorbed the overflow without breaking the main flow.',
              'Der Check-in war die Konsolidierung sichtbar gemacht. Was früher drei Softwaretools und zwei Papierformulare erforderte, wurde ein einziges Modal: einen Platz auswählen, den eTRU-Status bestätigen, fertig. Wenn der Hof voll war, hat die Warteliste den Überlauf aufgenommen, ohne den Hauptablauf zu unterbrechen.',
            ),
          ],
          decisions: [
            {
              title: t('Consolidation, not aggregation.', 'Konsolidierung, keine Aggregation.'),
              body: t(
                'Three software tools and two paper forms were not consolidated by bundling them into one screen. They were consolidated by deciding which jobs each had been doing, which jobs the new interface had to do, and which ones could disappear entirely because they had been workarounds in the first place.',
                'Drei Softwaretools und zwei Papierformulare wurden nicht konsolidiert, indem man sie in einen Screen bündelt. Sie wurden konsolidiert, indem man entschied, welche Aufgaben jedes erfüllt hatte, welche Aufgaben die neue Oberfläche erfüllen musste und welche ganz verschwinden konnten, weil sie von Anfang an Workarounds waren.',
              ),
            },
            {
              title: t('Driver comms as text, not radio.', 'Fahrer-Kommunikation als Text, nicht als Funk.'),
              body: t(
                'Radio works for one person speaking to one driver at a time, in real time, in their general direction. Text works for a yard manager handling twelve trucks in parallel. The change was not a UI choice. It was a choice about which job comms was supposed to do in this product.',
                'Funk funktioniert für eine Person, die mit einem Fahrer auf einmal spricht, in Echtzeit, in seine allgemeine Richtung. Text funktioniert für einen Hof-Manager, der zwölf Lkw parallel handhabt. Die Änderung war keine UI-Entscheidung. Es war eine Entscheidung darüber, welche Aufgabe die Kommunikation in diesem Produkt erfüllen sollte.',
              ),
            },
            {
              title: t('Detail alongside the map, not a page away from it.', 'Detail neben der Karte, nicht eine Seite davon entfernt.'),
              body: t(
                "The trailer detail opens as a side panel, not as a navigation. The map stays visible the whole time. That decision keeps the yard manager oriented to the whole facility while drilling into one trailer, which matters because the next decision is almost never about the trailer in isolation. It's about how that trailer fits into the dock assignment, the waitlist, and the eight other trailers waiting their turn.",
                'Das Trailer-Detail öffnet sich als Seitenpanel, nicht als Navigation. Die Karte bleibt die ganze Zeit sichtbar. Diese Entscheidung hält den Hof-Manager an der gesamten Einrichtung orientiert, während er in einen Trailer hineindringt, und das ist wichtig, weil die nächste Entscheidung fast nie über den Trailer isoliert geht. Es geht darum, wie dieser Trailer in die Dock-Zuweisung, die Warteliste und die acht anderen Trailer passt, die auf ihren Zug warten.',
              ),
            },
          ],
          italicOutro: t(
            'Three hero screens did the work of replacing three software tools and two paper forms. Each one named what the old way had been doing, what the new way was doing instead, and which job the user was actually trying to get done.',
            'Drei Hero-Screens haben die Arbeit gemacht, drei Softwaretools und zwei Papierformulare zu ersetzen. Jeder einzelne hat benannt, was die alte Art getan hat, was die neue Art stattdessen tut und welche Aufgabe der Nutzer tatsächlich zu erledigen versuchte.',
          ),
          screenshots: {
            columns: 2,
            images: [
              {
                src: '/images/cases/fleet/fleet-yard-map.jpeg',
                alt: t('Yard management view with aerial map showing dock and yard spots, trailer list on the left', 'Hof-Management-Ansicht mit Luftbild von Dock und Hof-Plätzen, Trailer-Liste auf der linken Seite'),
                caption: t('Yard map', 'Hof-Karte'),
              },
              {
                src: '/images/cases/fleet/fleet-trailer-detail.jpeg',
                alt: t('Trailer detail panel with carrier, driver, eTRU status, and audit log, alongside the dock spots', 'Trailer-Detailpanel mit Spediteur, Fahrer, eTRU-Status und Audit-Log, neben den Dock-Plätzen'),
                caption: t('Trailer detail', 'Trailer-Detail'),
              },
              {
                src: '/images/cases/fleet/fleet-driver-comms.jpeg',
                alt: t('Driver messaging panel with auto-sent appointment confirmation and quick-action templates', 'Fahrer-Messaging-Panel mit automatisch gesendeter Termin-Bestätigung und Quick-Action-Vorlagen'),
                caption: t('Driver comms', 'Fahrer-Kommunikation'),
              },
              {
                src: '/images/cases/fleet/fleet-check-in.jpeg',
                alt: t('Check-in trailer modal with yard spot grid and eTRU trailer indicator, with waitlist fallback', 'Check-in-Trailer-Modal mit Hof-Platz-Raster und eTRU-Trailer-Indikator, mit Warteliste als Fallback'),
                caption: t('Check-in', 'Check-in'),
              },
            ],
          },
        },
        {
          title: t('Sole UX, research through ship', 'Einziger UX, von Recherche bis Auslieferung'),
          subtitle: t('What it took to design end-to-end for an industrial pilot', 'Was es brauchte, End-to-End für einen Industrie-Piloten zu entwerfen'),
          paragraphs: [
            t(
              "Sole UX at Ndustrial meant being the only UX resource at the company, not just on this project. Yard management was running in parallel with the Power Quality and Demand Response work for industrial customers, plus whatever else needed design judgment that week. Research, workflow design, visual design, prototypes, hand-off to engineering, pilot support: the work either happened or it didn't get done, across whichever project was loudest at the moment.",
              'Einziger UX bei Ndustrial hieß, die einzige UX-Ressource im Unternehmen zu sein, nicht nur in diesem Projekt. Hof-Management lief parallel zur Power-Quality- und Demand-Response-Arbeit für Industriekunden, plus allem anderen, was in der Woche Designurteil brauchte. Recherche, Workflow-Design, visuelles Design, Prototypen, Übergabe an Engineering, Pilot-Support: Die Arbeit ist entweder passiert oder sie ist liegen geblieben, über das Projekt hinweg, das gerade am lautesten war.',
            ),
            t(
              'Research happened on the dock. The product was not designed in a conference room and shipped to operators to use. It was shaped by watching yard managers work, watching drivers wait, watching paperwork accumulate. The constraints (gloves, dust, time pressure) were not assumptions. They were observations from the people who were going to use the thing.',
              'Recherche ist auf dem Dock passiert. Das Produkt wurde nicht in einem Konferenzraum entworfen und an Operatoren zur Nutzung ausgeliefert. Es wurde geformt, indem man Hof-Managern beim Arbeiten zugesehen hat, Fahrern beim Warten, dem Papierkram beim Anwachsen. Die Einschränkungen (Handschuhe, Staub, Zeitdruck) waren keine Annahmen. Es waren Beobachtungen von den Leuten, die das Ding nutzen würden.',
            ),
            t(
              'Industrial conditions shaped every design decision. Every minute spent in the interface was a minute not spent moving a truck, so cognitive load had to come down. The interface had to compete with paper, radios, and walking the dock, and lose less often than it won.',
              'Industrielle Bedingungen haben jede Designentscheidung geformt. Jede Minute in der Oberfläche war eine Minute, in der kein Lkw bewegt wurde, also musste die kognitive Last runter. Die Oberfläche musste mit Papier, Funkgeräten und dem Ablaufen des Docks konkurrieren und seltener verlieren, als sie gewann.',
            ),
            t(
              "The pilot deployed at one facility. Not an enterprise rollout, not a category-wide product, not a broad-scale launch. One real customer site, with real yard managers running their actual dock through it. That is what 'shipped' meant in this case, and what made the work credible: the interface worked under the actual conditions where it would have to work.",
              'Der Pilot wurde an einem Standort eingesetzt. Kein Enterprise-Rollout, kein kategorieübergreifendes Produkt, kein Launch im großen Maßstab. Eine echte Kundeneinrichtung, mit echten Hof-Managern, die ihr tatsächliches Dock damit geführt haben. Das ist es, was „ausgeliefert" in diesem Fall hieß, und was die Arbeit glaubwürdig gemacht hat: Die Oberfläche hat unter den tatsächlichen Bedingungen funktioniert, unter denen sie funktionieren musste.',
            ),
          ],
          decisions: [
            {
              title: t('Sole UX for the whole company, end to end.', 'Einziger UX für das ganze Unternehmen, End-to-End.'),
              body: t(
                'I was the only UX resource at Ndustrial, owning the entire design function for the company while balancing the needs of multiple active projects in parallel. No design partner to defer to, no specialist to hand off to, and no other UX work happening anywhere else in the org that would have gotten done on its own. A different competency than leading a team, and worth claiming as a separate signal.',
                'Ich war die einzige UX-Ressource bei Ndustrial, habe die gesamte Designfunktion für das Unternehmen verantwortet, während ich die Bedürfnisse mehrerer aktiver Projekte parallel ausbalanciert habe. Kein Design-Partner, an den ich verweisen konnte, kein Spezialist, an den ich übergeben konnte, und keine andere UX-Arbeit, die irgendwo sonst in der Organisation passiert wäre und von selbst erledigt worden wäre. Eine andere Kompetenz als ein Team zu führen, und es wert, als separates Signal in Anspruch genommen zu werden.',
              ),
            },
            {
              title: t('Research where the work happens.', 'Recherche dort, wo die Arbeit passiert.'),
              body: t(
                'User research at the customer site was not a methodology choice. It was the only way to know what the actual constraints were. The conditions a yard manager works under cannot be reproduced in an office, and assumptions that get past the conference room get caught on the dock.',
                'Nutzerforschung am Kundenstandort war keine Methodenentscheidung. Es war der einzige Weg zu wissen, was die tatsächlichen Einschränkungen waren. Die Bedingungen, unter denen ein Hof-Manager arbeitet, lassen sich in einem Büro nicht reproduzieren, und Annahmen, die am Konferenzraum vorbeikommen, werden auf dem Dock erwischt.',
              ),
            },
            {
              title: t('Pilot scope as honest framing.', 'Pilot-Umfang als ehrliche Rahmung.'),
              body: t(
                'One facility shipping a real pilot is different from a category-wide rollout. Naming the scope (a single customer site, a single pilot) keeps the work credible and lets the reader trust the rest of the case. Overclaiming on scale undermines everything else the case is trying to say.',
                'Ein Standort, der einen echten Piloten ausliefert, ist anders als ein kategorieweites Rollout. Den Umfang zu benennen (ein einziger Kundenstandort, ein einziger Pilot) hält die Arbeit glaubwürdig und lässt den Leser dem Rest des Falls vertrauen. Beim Umfang zu übertreiben, untergräbt alles andere, was der Fall zu sagen versucht.',
              ),
            },
          ],
          italicOutro: t(
            "Industrial design judgment doesn't come from working on industrial products. It comes from being in the rooms where industrial work actually happens. The interface either survives those rooms or it doesn't.",
            'Industrielles Designurteil kommt nicht davon, an industriellen Produkten zu arbeiten. Es kommt davon, in den Räumen zu sein, in denen industrielle Arbeit tatsächlich passiert. Die Oberfläche überlebt diese Räume oder sie tut es nicht.',
          ),
        },
      ],
      outcomeBeat: {
        title: t('What shipped', 'Was ausgeliefert wurde'),
        paragraphs: [
          t(
            'The pilot shipped during my tenure at Ndustrial. Yard managers at a cold-storage third-party-logistics facility ran their dock through it instead of jumping between three software tools and two paper forms. The broader Ndustrial program (including shore-power infrastructure for the hybrid electric trailers) continued after I was laid off in mid-2025.',
            'Der Pilot wurde während meiner Zeit bei Ndustrial ausgeliefert. Hof-Manager in einer Kühllager-Logistik-Einrichtung eines Drittanbieters haben ihr Dock damit geführt, statt zwischen drei Softwaretools und zwei Papierformularen zu springen. Das breitere Ndustrial-Programm (einschließlich Landstrom-Infrastruktur für die hybriden elektrischen Trailer) ist weitergelaufen, nachdem ich Mitte 2025 entlassen wurde.',
          ),
          t(
            'The case here is not about scale. It is about whether an industrial product designed by one person, at one company, for one pilot site, can hold up in real industrial conditions. This one did.',
            'Der Fall hier geht nicht um Skalierung. Er geht darum, ob ein Industrieprodukt, das von einer Person, bei einem Unternehmen, für einen Pilotstandort entworfen wurde, unter echten industriellen Bedingungen standhalten kann. Dieser hat es getan.',
          ),
        ],
        highlight: t(
          "Industrial design end-to-end means sole UX, research through ship, no specialists to hand off to, and an interface that either survives the dock or it doesn't.",
          'Industrielles Design End-to-End bedeutet einziger UX, von der Recherche bis zur Auslieferung, keine Spezialisten zur Übergabe, und eine Oberfläche, die entweder das Dock überlebt oder eben nicht.',
        ),
      },
    },
  },
  {
    slug: 'pqdr',
    name: 'Power Quality and Demand Response',
    tagline: t(
      'AI insight, operator decision. 200+ industrial locations.',
      'KI-Erkenntnis, Operator-Entscheidung. 200+ Industriestandorte.',
    ),
    line: 'ent',
    readingMinutes: 5,
    body: {
      domains: [
        t('Energy', 'Energie'),
        t('Industrial', 'Industrie'),
        t('Operator UX', 'Operator-UX'),
      ],
      outcome: t(
        'Operator surfaces for AI-powered energy intelligence. Power Quality and Demand Response as two distinct operator views on one underlying AI system. Deployed across more than 200 industrial sites of a single customer. Penalty avoidance was the structural value, not a measured-savings claim.',
        'Operator-Oberflächen für KI-gestützte Energie-Intelligenz. Power Quality und Demand Response als zwei eigenständige Operator-Ansichten auf einem gemeinsamen KI-System. Eingesetzt an mehr als 200 Industriestandorten eines einzigen Kunden. Strafvermeidung war der strukturelle Wert, kein gemessener Einsparungs-Anspruch.',
      ),
      visualLabel: t('PQ + DR · OPERATOR DASHBOARD', 'PQ + DR · OPERATOR-DASHBOARD'),
      visualImage: '/images/cases/pqdr/pq-one-line.png',
      visualImageAlt: t(
        'Power Quality at-a-glance dashboard surfacing high-impact assets and efficiency losses',
        'Power Quality Übersichts-Dashboard mit Anlagen mit hoher Auswirkung und Effizienzverlusten',
      ),
      metrics: [
        {
          num: t('200+', '200+'),
          label: t('Industrial locations of one customer', 'Industriestandorte eines Kunden'),
        },
        {
          num: t('2 surfaces', '2 Oberflächen'),
          label: t(
            'Power Quality and Demand Response built on one AI system',
            'Power Quality und Demand Response auf einem KI-System gebaut',
          ),
        },
        {
          num: t('Operators', 'Operatoren'),
          label: t('AI surfaces, operators decide', 'KI zeigt, Operatoren entscheiden'),
        },
      ],
      claim: t(
        'I design operator-facing surfaces that turn AI insight into industrial-scale operational decisions.',
        'Ich entwerfe Operator-Oberflächen, die KI-Erkenntnisse in betriebliche Entscheidungen auf Industrieskala übersetzen.',
      ),
      ctaHref: '/work/pqdr',
    },
    detail: {
      chips: [t('Enterprise', 'Enterprise'), t('AI Insight', 'KI-Erkenntnis'), t('Operator UX', 'Operator-UX'), t('Industrial', 'Industrie')],
      hook: [
        t(
          'AI-powered energy intelligence at industrial facilities. Operator-facing surfaces deployed across 200+ industrial locations of a single large customer at Ndustrial.',
          'KI-gestützte Energie-Intelligenz in Industrieanlagen. Operator-Oberflächen, eingesetzt an 200+ Industriestandorten eines einzigen großen Kunden bei Ndustrial.',
        ),
        t(
          'Two distinct surfaces on one underlying AI system. Power Quality, a dashboard where facility managers identify equipment likely causing efficiency losses. Demand Response, an alert surface where operators curtail operations in time to avoid utility penalties that can run into six figures annually. Both fed by the same AI analysis layer underneath.',
          'Zwei eigenständige Oberflächen auf einem gemeinsamen KI-System. Power Quality, ein Dashboard, in dem Anlagenleiter Geräte identifizieren, die wahrscheinlich Effizienzverluste verursachen. Demand Response, eine Alarmoberfläche, in der Operatoren Betrieb rechtzeitig drosseln, um Versorger-Strafen zu vermeiden, die jährlich sechsstellige Beträge erreichen können. Beide werden von derselben KI-Analyseschicht darunter gespeist.',
        ),
      ],
      sections: [
        {
          title: t('Two surfaces, one system', 'Zwei Oberflächen, ein System'),
          subtitle: t('What each surface was designed to make decidable', 'Was jede Oberfläche entscheidbar machen sollte'),
          paragraphs: [
            t(
              'One AI analysis layer. Two operator-facing surfaces. The decision to split the operator view rather than the AI was structural: the AI did the same kind of analysis in both cases, but the human work it triggered was fundamentally different in shape.',
              'Eine KI-Analyseschicht. Zwei Operator-Oberflächen. Die Entscheidung, die Operator-Ansicht zu teilen statt der KI, war strukturell: Die KI hat in beiden Fällen dieselbe Art von Analyse gemacht, aber die menschliche Arbeit, die sie ausgelöst hat, war in ihrer Form grundlegend anders.',
            ),
            t(
              'Power Quality was the diagnostic surface. The AI analyzed power quality data across the facility and the dashboard surfaced which equipment was most likely causing efficiency losses. Facility managers could see, at a glance, where their power was being wasted and which assets to investigate first.',
              'Power Quality war die Diagnose-Oberfläche. Die KI hat Stromqualitäts-Daten über die Anlage hinweg analysiert, und das Dashboard hat zutage gebracht, welche Geräte am wahrscheinlichsten Effizienzverluste verursachen. Anlagenleiter konnten auf einen Blick sehen, wo ihre Energie verschwendet wurde und welche Anlagen zuerst zu untersuchen sind.',
            ),
            t(
              'Demand Response was the time-sensitive surface. When the utility signaled an impending peak-demand event, the alert surface notified facility or regional managers in time to curtail operations and comply with the program. The penalty for non-compliance with peak-shaving events can run into six figures annually for an industrial site. The interface was designed to make the curtailment decision fast, clear, and accountable.',
              'Demand Response war die zeitkritische Oberfläche. Wenn der Versorger ein bevorstehendes Spitzenbedarfs-Ereignis signalisiert hat, hat die Alarmoberfläche Anlagen- oder Regionalmanager rechtzeitig benachrichtigt, um den Betrieb zu drosseln und das Programm einzuhalten. Die Strafe für Nicht-Einhaltung von Peak-Shaving-Ereignissen kann für einen Industriestandort jährlich sechsstellige Beträge erreichen. Die Oberfläche wurde entworfen, um die Drosselungs-Entscheidung schnell, klar und nachvollziehbar zu machen.',
            ),
            t(
              "Treating these as two operator views on one AI system, rather than one combined screen or two separate products, was the move. The AI's job was the same in both cases: analyze the data, surface what mattered. The operator's job was different. Diagnostic decisions take minutes or hours. Demand-response decisions take seconds. The two surfaces let each decision happen at its own speed.",
              'Diese als zwei Operator-Ansichten auf einem KI-System zu behandeln, statt als einen kombinierten Screen oder zwei separate Produkte, war der Zug. Die Aufgabe der KI war in beiden Fällen dieselbe: die Daten analysieren, das zutage bringen, was zählt. Die Aufgabe des Operators war eine andere. Diagnostische Entscheidungen dauern Minuten oder Stunden. Demand-Response-Entscheidungen dauern Sekunden. Die beiden Oberflächen haben jede Entscheidung in ihrer eigenen Geschwindigkeit passieren lassen.',
            ),
          ],
          decisions: [
            {
              title: t('Split the operator view, not the AI.', 'Die Operator-Ansicht teilen, nicht die KI.'),
              body: t(
                'The AI analysis is shared. The decisions it triggers are not. Power Quality is a diagnostic decision (which equipment to investigate next) measured in minutes or hours. Demand Response is a time-sensitive decision (curtail now or pay the penalty) measured in seconds. Pretending one surface could serve both would have made both worse.',
                'Die KI-Analyse wird geteilt. Die Entscheidungen, die sie auslöst, werden es nicht. Power Quality ist eine diagnostische Entscheidung (welche Anlage als Nächstes zu untersuchen ist), gemessen in Minuten oder Stunden. Demand Response ist eine zeitkritische Entscheidung (jetzt drosseln oder die Strafe zahlen), gemessen in Sekunden. So zu tun, als ob eine Oberfläche beiden dienen könnte, hätte beide schlechter gemacht.',
              ),
            },
            {
              title: t('Diagnostic surface: surface what matters, not all the data.', 'Diagnose-Oberfläche: das zutage bringen, was zählt, nicht alle Daten.'),
              body: t(
                "The Power Quality dashboard's job was to point at the equipment most likely causing efficiency losses, not to show every event in the facility's history. Facility managers were already drowning in data. The AI's job was to filter; the design's job was to make the filter trustworthy.",
                'Die Aufgabe des Power-Quality-Dashboards war es, auf das Gerät zu zeigen, das am wahrscheinlichsten Effizienzverluste verursacht, nicht jedes Ereignis in der Geschichte der Anlage zu zeigen. Anlagenleiter sind bereits in Daten ertrunken. Die Aufgabe der KI war es zu filtern; die Aufgabe des Designs war es, den Filter vertrauenswürdig zu machen.',
              ),
            },
            {
              title: t('Time-sensitive surface: design for the window, not the user.', 'Zeitkritische Oberfläche: für das Fenster entwerfen, nicht für den Nutzer.'),
              body: t(
                'Demand Response had a fixed clock. The utility signal arrived, the curtailment window opened, the penalty avoidance depended on action within that window. The surface had to make the decision visible, the consequences clear, and the action trivial to execute. Anything else competed with the window.',
                'Demand Response hatte eine feste Uhr. Das Signal des Versorgers ist eingetroffen, das Drosselungs-Fenster hat sich geöffnet, die Strafvermeidung hing von der Handlung innerhalb dieses Fensters ab. Die Oberfläche musste die Entscheidung sichtbar machen, die Konsequenzen klar und die Handlung trivial zu ausführen. Alles andere hat mit dem Fenster konkurriert.',
              ),
            },
          ],
          italicOutro: t(
            "Operator-facing UX for AI insight is not the same problem as designing the AI itself. The AI's correctness is one question. Whether the operator can act on it within the time the situation allows is a different one.",
            'Operator-UX für KI-Erkenntnisse ist nicht dasselbe Problem wie das Entwerfen der KI selbst. Die Korrektheit der KI ist eine Frage. Ob der Operator in der Zeit handeln kann, die die Situation erlaubt, ist eine andere.',
          ),
          screenshots: {
            columns: 2,
            images: [
              {
                src: '/images/cases/pqdr/pq-one-line.png',
                alt: t('Power Quality at-a-glance dashboard surfacing the assets most likely causing efficiency losses', 'Power Quality Übersichts-Dashboard, das die Anlagen zutage bringt, die am wahrscheinlichsten Effizienzverluste verursachen'),
                caption: t('Power Quality: at a glance', 'Power Quality: auf einen Blick'),
              },
              {
                src: '/images/cases/pqdr/dr-overview.png',
                alt: t('Demand Response overview showing peak-demand events and curtailment status across facilities', 'Demand-Response-Übersicht mit Spitzenbedarfs-Ereignissen und Drosselungs-Status über Anlagen hinweg'),
                caption: t('Demand Response: overview', 'Demand Response: Übersicht'),
              },
            ],
          },
        },
        {
          title: t('AI insight, operator decision', 'KI-Erkenntnis, Operator-Entscheidung'),
          subtitle: t('Where AI output meets the people who have to act on it', 'Wo KI-Ausgaben auf die Menschen treffen, die nach ihnen handeln müssen'),
          paragraphs: [
            t(
              "Designing operator-facing surfaces for AI output is a different competency than designing AI features. The AI engineer's question is whether the model produces correct output. The operator UX designer's question is whether the human downstream can recognize the output, trust it, and act on it within the time the situation allows.",
              'Operator-Oberflächen für KI-Ausgaben zu entwerfen ist eine andere Kompetenz als KI-Features zu entwerfen. Die Frage des KI-Engineers ist, ob das Modell korrekte Ausgaben produziert. Die Frage des Operator-UX-Designers ist, ob der Mensch stromabwärts die Ausgabe erkennen, ihr vertrauen und nach ihr handeln kann, in der Zeit, die die Situation erlaubt.',
            ),
            t(
              "Power Quality and Demand Response were the same answer to two versions of that question. Both surfaces gave the operator a view onto AI-generated analysis. Neither gave the operator the AI itself. The design move in both cases was to find the place where the operator's decision actually happens, then to surface the AI's contribution at that exact place.",
              'Power Quality und Demand Response waren die gleiche Antwort auf zwei Versionen dieser Frage. Beide Oberflächen haben dem Operator einen Blick auf KI-generierte Analyse gegeben. Keine hat dem Operator die KI selbst gegeben. Der Designzug in beiden Fällen war, den Ort zu finden, an dem die Entscheidung des Operators tatsächlich passiert, und dann den Beitrag der KI an genau diesem Ort zutage zu bringen.',
            ),
            t(
              'Deployed across 200+ industrial locations of one customer, the system met operators where their decisions happened. Facility managers at the site for the diagnostic work. Facility or regional managers in the curtailment window for time-sensitive response. The operator was always the actor. The AI was always the analyst.',
              'Eingesetzt an 200+ Industriestandorten eines einzigen Kunden, hat das System die Operatoren dort getroffen, wo ihre Entscheidungen passiert sind. Anlagenleiter vor Ort für die diagnostische Arbeit. Anlagen- oder Regionalmanager im Drosselungs-Fenster für die zeitkritische Reaktion. Der Operator war immer der Handelnde. Die KI war immer die Analystin.',
            ),
            t(
              'The structural value claim is the honest version: penalty avoidance built into the operator decision flow at industrial scale. Measured savings at a given site depended on operational data I never personally saw post-deployment. Naming the structural framing keeps the case credible; claiming dollars I cannot verify would not.',
              'Der strukturelle Wert-Anspruch ist die ehrliche Version: Strafvermeidung, eingebaut in den Operator-Entscheidungsfluss auf Industrieskala. Gemessene Einsparungen an einem bestimmten Standort hingen von Betriebsdaten ab, die ich nach dem Rollout nie persönlich gesehen habe. Die strukturelle Rahmung zu benennen, hält den Fall glaubwürdig; Dollarbeträge zu beanspruchen, die ich nicht überprüfen kann, würde es nicht.',
            ),
          ],
          decisions: [
            {
              title: t('Designing for AI output, not designing the AI.', 'Für KI-Ausgaben entwerfen, nicht die KI entwerfen.'),
              body: t(
                "Different problem than designing the model. The AI's correctness is one question. Whether the operator can act on what the AI surfaces in the time the situation allows is a different one. Operator UX for AI insight is its own design competency.",
                'Anderes Problem als das Modell zu entwerfen. Die Korrektheit der KI ist eine Frage. Ob der Operator nach dem handeln kann, was die KI zutage bringt, in der Zeit, die die Situation erlaubt, ist eine andere. Operator-UX für KI-Erkenntnisse ist eine eigene Designkompetenz.',
              ),
            },
            {
              title: t('The operator is the actor. The AI is the analyst.', 'Der Operator ist der Handelnde. Die KI ist die Analystin.'),
              body: t(
                "The system was never designed to replace the operator's judgment. It was designed to make the operator's judgment faster and better informed. Every surface decision followed from that division of labor.",
                'Das System wurde nie entworfen, um das Urteil des Operators zu ersetzen. Es wurde entworfen, um das Urteil des Operators schneller und besser informiert zu machen. Jede Oberflächen-Entscheidung folgte aus dieser Arbeitsteilung.',
              ),
            },
            {
              title: t('Structural value, not measured savings.', 'Struktureller Wert, keine gemessenen Einsparungen.'),
              body: t(
                'The product was designed to help facilities avoid utility penalties that can run into six figures annually per industrial site. That is the structural framing. Measured savings at a specific site depended on conditions I never saw post-deployment, so the honest version of value is the structural one, not a dollar figure I cannot verify.',
                'Das Produkt wurde entworfen, um Anlagen zu helfen, Versorger-Strafen zu vermeiden, die jährlich pro Industriestandort sechsstellige Beträge erreichen können. Das ist die strukturelle Rahmung. Gemessene Einsparungen an einem bestimmten Standort hingen von Bedingungen ab, die ich nach dem Rollout nie gesehen habe, also ist die ehrliche Version des Werts die strukturelle, kein Dollarbetrag, den ich nicht überprüfen kann.',
              ),
            },
          ],
          italicOutro: t(
            "The portfolio claim is not 'I shipped a feature that saved X dollars.' It is 'I designed the surfaces that turn AI insight into operator action at industrial scale.' One of those is provable from the design. The other depends on operational data I don't have.",
            'Der Portfolio-Anspruch ist nicht „Ich habe ein Feature ausgeliefert, das X Dollar gespart hat". Es ist „Ich habe die Oberflächen entworfen, die KI-Erkenntnisse in Operator-Handlung auf Industrieskala übersetzen". Das eine ist aus dem Design beweisbar. Das andere hängt von Betriebsdaten ab, die ich nicht habe.',
          ),
          screenshots: {
            columns: 2,
            images: [
              {
                src: '/images/cases/pqdr/pq-detail.png',
                alt: t('Power Quality detail view drilling into a specific asset, with event timeline and analysis', 'Power Quality Detailansicht mit Fokus auf eine bestimmte Anlage, mit Ereigniszeitlinie und Analyse'),
                caption: t('Power Quality: asset detail', 'Power Quality: Anlagen-Detail'),
              },
              {
                src: '/images/cases/pqdr/dr-facility-detail.png',
                alt: t('Demand Response facility detail with curtailment window, action, and accountability', 'Demand-Response-Anlagen-Detail mit Drosselungs-Fenster, Aktion und Rechenschaft'),
                caption: t('Demand Response: facility detail', 'Demand Response: Anlagen-Detail'),
              },
            ],
          },
        },
      ],
      outcomeBeat: {
        title: t('What the system was for', 'Wofür das System war'),
        paragraphs: [
          t(
            'Deployed across more than 200 industrial locations of a single large customer at Ndustrial. Two operator surfaces, Power Quality and Demand Response, running on one AI analysis layer underneath. Designed to help facilities avoid utility penalties that can run into six figures annually for non-compliance with peak-shaving events.',
            'Eingesetzt an mehr als 200 Industriestandorten eines einzigen großen Kunden bei Ndustrial. Zwei Operator-Oberflächen, Power Quality und Demand Response, laufen auf einer gemeinsamen KI-Analyseschicht darunter. Entworfen, um Anlagen zu helfen, Versorger-Strafen zu vermeiden, die jährlich sechsstellige Beträge für Nicht-Einhaltung von Peak-Shaving-Ereignissen erreichen können.',
          ),
          t(
            'Post-deployment performance data is not mine to claim. I designed the system; I did not personally see how each of the 200+ sites used it after rollout. The honest version of the work is what was shipped and what it was structured to enable, not a measured outcome number.',
            'Nach dem Rollout zu Leistungsdaten zu greifen ist nicht meine Sache. Ich habe das System entworfen; ich habe nicht persönlich gesehen, wie jeder der 200+ Standorte es nach dem Rollout genutzt hat. Die ehrliche Version der Arbeit ist, was ausgeliefert wurde und was es strukturell ermöglichen sollte, keine gemessene Ergebniszahl.',
          ),
        ],
        highlight: t(
          "Operator UX for AI insight is its own kind of design judgment. The AI can be right and the design can still fail if the operator can't act on what the AI surfaces in the time the situation allows.",
          'Operator-UX für KI-Erkenntnisse ist eine eigene Art von Designurteil. Die KI kann richtig sein, und das Design kann trotzdem versagen, wenn der Operator nicht nach dem handeln kann, was die KI zutage bringt, in der Zeit, die die Situation erlaubt.',
        ),
      },
    },
  },
  {
    slug: 'about',
    name: 'About',
    // TODO: EN tagline pending rewrite (no longer matches paragraph 4 after the
    // 2026-05-28 transit-metaphor addition). DE will need a re-translation
    // pass once EN is updated.
    tagline: t('Wheels, speed, freedom.', 'Räder, Tempo, Freiheit.'),
    line: 'pers',
    readingMinutes: 2,
    personal: {
      paragraphs: [
        t(
          'I love wheeled things. Bikes, cars, and even public transit.',
          'Ich liebe alles, was Räder hat. Fahrräder, Autos, und sogar den öffentlichen Nahverkehr.',
        ),
        t(
          "I've built and prepped cars for high performance track driving, driven them at the limit, and coached others to find theirs. Helping someone get fast means understanding what needs to happen, and what can go wrong, before you suggest anything different.",
          'Ich habe Autos für Trackdays gebaut und vorbereitet, sie an ihrer Grenze gefahren und anderen geholfen, ihre eigene zu finden. Jemandem zu helfen, schnell zu werden, heißt zu verstehen, was passieren muss und was schiefgehen kann, bevor man etwas anderes vorschlägt.',
        ),
        t(
          "I've been a cyclist since the 90s. I cut my teeth on mountain bikes, then fell headlong into road cycling, racing, endurance rides, cyclocross, and commuting. Now I'm combining it all, on and off road, in and around Berlin.",
          'Ich bin seit den 90ern Radfahrer. Angefangen habe ich auf dem Mountainbike, dann bin ich Hals über Kopf in Rennrad, Rennen, Langstreckenfahrten, Cyclocross und Pendeln eingestiegen. Jetzt kombiniere ich alles, auf der Straße und abseits davon, in und um Berlin.',
        ),
        t(
          "Public transit is the third wheel, and the reason this site is built around a transit map. A subway has to work for a tourist who doesn't speak the language, a commuter who is late, a kid riding alone, an elderly rider with a cane, a wheelchair user, and somebody running on no sleep at the end of a long day. The route map, the signage, the ticket machine, the platform announcements, and more, all have to clear the same accessibility and clarity bar for every one of those people, in seconds, with no instructions. That is a serious bar.",
          'Der öffentliche Nahverkehr ist das dritte Rad, und der Grund, warum diese Seite um einen Liniennetzplan herum gebaut ist. Eine U-Bahn muss funktionieren, und zwar für eine Touristin, die kein Deutsch spricht, für einen Pendler, der zu spät dran ist, für ein Kind, das alleine fährt, für eine ältere Frau mit Gehstock, für einen Rollstuhlfahrer und für jemanden, der am Ende eines langen Tages auf dem Zahnfleisch geht. Der Liniennetzplan, die Beschilderung, der Fahrkartenautomat, die Bahnsteigansagen und mehr, alles muss für jede dieser Personen dieselbe hohe Latte bei Zugänglichkeit und Klarheit nehmen, in Sekunden, ohne Anleitung. Das ist eine hohe Latte.',
        ),
        t(
          'It is also the bar I want to clear with my designs. The transit metaphor here is a statement about what design is for, and not simply a styling choice.',
          'Das ist auch die Latte, die ich mit meinen Designs überspringen will. Die ÖPNV-Metapher ist eine inhaltliche Aussage über den Zweck von Design. Und keine bloße Stilfrage.',
        ),
        t('I also like to draw sometimes...', 'Ich zeichne auch manchmal...'),
      ],
      gallery: [
        { src: '/images/gallery/bmw-m3-e30.jpg', title: 'BMW M3 E30', subtitle: t('Digital illustration', 'Digitale Illustration') },
        { src: '/images/gallery/porsche-911-turbo.jpg', title: 'Porsche 911 Turbo', subtitle: t('Digital illustration', 'Digitale Illustration') },
        { src: '/images/gallery/singer-930.jpg', title: 'Singer 930', subtitle: t('Digital illustration', 'Digitale Illustration') },
        { src: '/images/gallery/bmw-m2.jpg', title: 'BMW M2', subtitle: t('Digital illustration', 'Digitale Illustration') },
        { src: '/images/gallery/polestar-2.jpg', title: 'Polestar 2', subtitle: t('Digital illustration', 'Digitale Illustration') },
        { src: '/images/gallery/merc-sl.jpg', title: 'Mercedes SL', subtitle: t('After Shane Baxley', 'Nach Shane Baxley') },
        { src: '/images/gallery/911-night-race.jpg', title: '911 Night Race', subtitle: t('Digital illustration', 'Digitale Illustration') },
      ],
    },
  },
  {
    slug: 'contact',
    name: 'Contact',
    tagline: t('Email or LinkedIn. I read both.', 'E-Mail oder LinkedIn. Ich lese beides.'),
    line: 'pers',
    readingMinutes: 1,
    personal: {
      paragraphs: [
        t(
          'Open to design leadership and senior product design roles, AI product work, and design consulting.',
          'Offen für Design-Führungspositionen und Senior Product Design Rollen, KI-Produktarbeit und Designberatung.',
        ),
      ],
      links: [
        {
          href: 'mailto:scottgerstl@gmail.com',
          icon: 'email',
          label: t('Email', 'E-Mail'),
          value: 'scottgerstl@gmail.com',
        },
        {
          href: 'https://www.linkedin.com/in/scottgerstl',
          icon: 'linkedin',
          label: t('LinkedIn', 'LinkedIn'),
          value: 'linkedin.com/in/scottgerstl',
        },
      ],
    },
  },
];

export const SECTIONS: { line: LineKey; code: string; title: L10n; subtitle: L10n }[] = [
  {
    line: 'ai',
    code: 'CS1',
    title: t('AI Case Studies', 'KI-Fallstudien'),
    subtitle: t(
      '3 stops · AI features, AI products, AI as the design medium',
      '3 Stationen · KI-Features, KI-Produkte, KI als Designmedium',
    ),
  },
  {
    line: 'ent',
    code: 'CS2',
    title: t('Enterprise Case Studies', 'Enterprise-Fallstudien'),
    subtitle: t(
      '3 stops · vision, workflows, and operator surfaces',
      '3 Stationen · Vision, Workflows und Operator-Oberflächen',
    ),
  },
  {
    line: 'pers',
    code: 'P',
    title: t('Personal', 'Persönlich'),
    subtitle: t(
      '2 stops · who I am off the clock, and how to reach me',
      '2 Stationen · wer ich nach Feierabend bin, und wie ich zu erreichen bin',
    ),
  },
];

export function casesForLine(line: LineKey): CaseEntry[] {
  return CASES.filter((c) => c.line === line);
}
