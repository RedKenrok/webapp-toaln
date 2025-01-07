import { LOCALES } from './locales.js'

export const translate = (
  state,
  key,
  locale = null,
) => {
  locale ??= state.sourceLocale
  if (!(locale in TRANSLATIONS)) {
    console.warn('Er is geen vertaling beschikbaar voor de taal "' + (locale) + '"')
    return key
  }
  if (!(key in TRANSLATIONS[locale])) {
    console.warn('Er is geen vertaling beschikbaar voor de taal "' + (locale) + '" met de sleutel "' + key + '".')
    return key
  }

  /**
   * Replaces parts of a text surrounded by {% and %} with values from the state or other translations. Use {%s:%} to look something up in the state, and use {%t:text_here%} to look something up in the translations.
   * @param {string} text Text to replace parts of.
   * @returns {string} Replaced text.
   */
  const replace = (text) => {
    if (!text) {
      return text
    }
    if (Array.isArray(text)) {
      return text.map(item => replace(item))
    }

    return text
      .replace(
        /{%s:([^%]+)%}/g,
        (match, key) => {
          let value = key.split('.').reduce(
            (innerState, keySegment) => innerState?.[keySegment],
            state
          )
          if (
            value !== undefined
            && value !== null
          ) {
            if (Array.isArray(value)) {
              return value.join(' ')
            }
            return value.toString()
          }
          return match
        })
      .replace(
        /{%t:([^%]+)%}/g,
        (match, key) => {
          if (key in TRANSLATIONS[locale]) {
            let value = TRANSLATIONS[locale][key]
            if (
              value !== undefined
              && value !== null
            ) {
              if (Array.isArray(value)) {
                return value.join(' ')
              }
              return value.toString()
            }
          }
          return match
        })
  }
  return replace(TRANSLATIONS[locale][key])
}

export const TRANSLATIONS = Object.freeze({
  [LOCALES.da_dk]: {
    'da_dk': 'Dansk',
    'de_de': 'Tysk',
    'en_gb': 'Engelsk (Storbritannien)',
    'nl_nl': 'Hollandsk',

    'proficiency_name-a1': 'A1: Begynder',
    'proficiency_description-a1': [
      'Læsning: Du kan forstå velkendte navne, ord og meget enkle sætninger, for eksempel på skilte, plakater eller i kataloger.',
      'Skrivning: Du kan skrive et kort, enkelt postkort, for eksempel sende en feriehilsen. Du kan udfylde formularer med personlige oplysninger, for eksempel indtaste dit navn, nationalitet og adresse på en hotelregistreringsformular.',
    ],
    'proficiency_example-a1': '"Hej! Mit navn er Maria. Jeg bor i et lille hus i London med min familie. Jeg har en bror og en søster. Jeg kan godt lide at spise æbler og pærer. Hvad er din yndlingsfrugt?"',
    'proficiency_name-a2': 'A2: Let øvet',
    'proficiency_description-a2': [
      'Læsning: Du kan læse meget korte, enkle tekster. Du kan finde specifikke, forudsigelige oplysninger i enkle hverdagstekster såsom annoncer, brochurer, menuer og køreplaner, og du kan forstå korte, simple personlige breve.',
      'Skrivning: Du kan skrive korte, enkle noter og beskeder om emner, der vedrører umiddelbare behov. Du kan skrive et meget simpelt personligt brev, for eksempel takke nogen for noget.',
    ],
    'proficiency_example-a2': '"Sidste weekend gik jeg i parken med mine venner. Vi havde en picnic med sandwiches og juice. Vejret var solrigt, og vi spillede fodbold. Derefter gik vi på café og fik is. Det var en sjov dag!"',
    'proficiency_name-b1': 'B1: Mellem',
    'proficiency_description-b1': [
      'Læsning: Du kan forstå tekster, der hovedsageligt består af hverdags- eller jobrelateret sprog med høj frekvens. Du kan forstå beskrivelser af begivenheder, følelser og ønsker i personlige breve.',
      'Skrivning: Du kan skrive enkle sammenhængende tekster om emner, der er velkendte eller af personlig interesse. Du kan skrive personlige breve, der beskriver oplevelser og indtryk.',
    ],
    'proficiency_example-b1': '"Jeg nyder at læse bøger, især krimier. For nylig læste jeg en historie om en detektiv, der løste en vanskelig sag. Det var meget spændende, og jeg kunne ikke stoppe med at læse. Jeg kan godt lide krimier, fordi de får mig til at tænke og prøve at gætte slutningen."',
    'proficiency_name-b2': 'B2: Over middel',
    'proficiency_description-b2': [
      'Læsning: Du kan læse artikler og rapporter om aktuelle problemer, hvor skribenterne indtager bestemte holdninger eller synspunkter. Du kan forstå moderne litterær prosa.',
      'Skrivning: Du kan skrive klar, detaljeret tekst om en bred vifte af emner, der er relateret til dine interesser. Du kan skrive et essay eller en rapport, hvor du videregiver information eller giver grunde for eller imod et bestemt synspunkt. Du kan skrive breve, der fremhæver den personlige betydning af begivenheder og oplevelser.',
    ],
    'proficiency_example-b2': '"Konceptet om fjernarbejde er blevet stadig mere populært i de seneste år. Det giver fleksibilitet og bekvemmelighed for medarbejdere, så de kan arbejde hvor som helst fra. Dog medfører det også udfordringer som opretholdelse af produktivitet og kommunikation med kollegaer. Samlet set synes jeg, at fordelene opvejer ulemperne."',
    'proficiency_name-c1': 'C1: Avanceret',
    'proficiency_description-c1': [
      'Læsning: Du kan forstå lange og komplekse faktuelle og litterære tekster og værdsætte stilistiske forskelle. Du kan forstå specialiserede artikler og længere tekniske instruktioner, selv når de ikke er relateret til dit fagområde.',
      'Skrivning: Du kan udtrykke dig klart i velstruktureret tekst og uddybe synspunkter. Du kan skrive om komplekse emner i et brev, essay eller rapport og understrege de væsentligste punkter. Du kan vælge en stil, der passer til læseren.',
    ],
    'proficiency_example-c1': '"Klimaændringer er et af de mest presserende problemer i vor tid. Selvom vedvarende energikilder som vind- og solenergi bliver stadig vigtigere, er overgangen væk fra fossile brændstoffer stadig en stor udfordring. Regeringerne skal samarbejde med industrien og lokalsamfundene om at skabe bæredygtige politikker, der balancerer økonomisk vækst med miljøbeskyttelse."',
    'proficiency_name-c2': 'C2: Kompetent',
    'proficiency_description-c2': [
      'Læsning: Du kan uden besvær læse næsten alle former for skrevet sprog, inklusive abstrakte, strukturelt eller sprogligt komplekse tekster såsom manualer, specialartikler og litterære værker.',
      'Skrivning: Du kan skrive klar, flydende tekst i en passende stil. Du kan skrive komplekse breve, rapporter eller artikler, der præsenterer en sag med en effektiv logisk struktur, som hjælper modtageren med at bemærke og huske væsentlige punkter. Du kan skrive resuméer og anmeldelser af professionelle eller litterære værker.',
    ],
    'proficiency_example-c2': '"Nuancerne i den sproglige udvikling afslører meget om kulturelle og samfundsmæssige skift over tid. For eksempel signalerer optagelsen af låneord ofte en periode med kulturel udveksling eller indflydelse. Analyse af sådanne mønstre forbedrer ikke kun vores forståelse af sprogudvikling, men giver også dybe indsigter i historiske forhold mellem civilisationer. Dette dynamiske samspil understreger kompleksiteten og sammenhængen i menneskelig kommunikation."',

    'prompt-context': 'Du er ekspert i og underviser i {%t:{%s:targetLocale%}%}. Brugeren studerer {%t:{%s:targetLocale%}%}. Brugeren behersker allerede sproget på CEFR-niveau {%s:proficiencyLevel%}. Dette betyder, at brugeren allerede har følgende færdigheder: "{%t:proficiency_description-{%s:proficiencyLevel%}%}". Dog ønsker brugeren at forbedre sine færdigheder yderligere.',
    'prompt-comprehension': 'Lav en læseforståelsesøvelse, hvor brugeren modtager en tekst på {%t:{%s:targetLocale%}%} sammen med et spørgsmål på {%t:{%s:sourceLocale%}%}, som skal besvares på {%t:{%s:targetLocale%}%}. Giv derefter kort feedback på {%t:{%s:targetLocale%}%} med stor dybde, passende til brugerens sprogniveau på {%t:{%s:targetLocale%}%}. Fokuser udelukkende på sproglige aspekter og ignorer indholdsmæssige vurderinger eller fortolkninger af budskabet. Skriv altid i ren tekst uden formatering, etiketter eller overskrifter.',
    'prompt-conversation': 'Du vil simulere en samtale med brugeren på {%t:{%s:targetLocale%}%}. Giv ikke yderligere instruktioner eller forklaringer til brugeren. Skriv altid i ren tekst uden formatering, etiketter eller overskrifter. Skriv den første besked i samtalen og introducer straks et emne at diskutere.',
    'prompt-conversation-follow_up': 'Du simulerer en samtale med brugeren på {%t:{%s:targetLocale%}%}. Giv først kort, grundig feedback på beskeden med fokus udelukkende på sproglige aspekter, og ignorér indholdsmæssige vurderinger eller fortolkninger. Besvar derefter beskeden på {%t:{%s:targetLocale%}%}. Giv ikke yderligere instruktioner eller forklaringer til brugeren. Skriv altid i ren tekst uden formatering, etiketter eller overskrifter.',
    'prompt-clarification': 'Brugeren har et spørgsmål nedenfor, svar kortfattet med dybdegående feedback, passende til brugerens sprogniveau. Skriv altid i ren tekst uden formatering, etiketter eller overskrifter. Besvar ikke spørgsmålet, hvis det ikke er sprogligt relateret.',
    'prompt-topic': 'Inkorporér følgende emne i din besked "{%topic%}".',

    'greeting': 'Hej!',
    'button-go_back': 'Tilbage',
    'button-reset': 'Nulstil',
    'button-generate': 'Generér',
    'button-answer': 'Svar',
    'button-reply': 'Svar',
    'button-ask': 'Spørg',

    'setup-source_language': 'Så, du vil forbedre dine færdigheder i et sprog? Lad denne app hjælpe dig med at øve. Vi skal starte med at vælge et sprog, du allerede kender.',
    'setup-target_language': 'Nu til næste trin, hvilket sprog vil du gerne lære?',
    'setup-proficiency_leven': 'Hvor god vil du sige, du allerede er i sproget? Se forklaringen nedenfor sammen med en eksempeltekst for at få en idé om, hvilken slags tekster du kan forvente.',
    'setup-topics_of_interest': 'Det er meget sjovere, hvis øvelserne nogle gange indeholder et emne, du finder interessant. Udfyld derfor et par emner nedenfor, som jævnligt kan dukke op. Tænk især på hobbyer eller andre interesser. Jo flere, jo bedre!',
    'setup-api_code': 'Denne app bruger en "stor sprogmodel" til at generere og vurdere øvelser. Du har måske hørt om det, alle i tech-sektoren taler om udviklingen inden for kunstig intelligens. Appen bruger en LLM, men leveres ikke med en, så vi skal linke den til en LLM-udbyder. Hvilken udbyder vil du bruge?',
    'setup-api_credentials': 'Nu er det vigtige spørgsmål nøglen. Du kan få den fra udviklerens dashboard. Der står sandsynligvis, at du ikke bør dele den med tredjeparter. Heldigvis sender denne app aldrig nøglen videre. Stadig ikke overbevist? Tjek appens kildekode eller vent på en version, der ikke længere kræver dette.',
    'setup-test_api_credentials': 'Test nøgle',
    'setup-api_credentials_untested': 'Test legitimationsoplysningerne, før du fortsætter.',
    'setup-api_credentials_tested': 'Den angivne nøgle virker. Nu kan du vælge, hvilken "stor sprogmodel" du vil bruge. Ikke sikker på forskellene? Intet problem, vi anbefaler at vælge "{%preferredModel%}". Det bør være fint.',
    'setup-outro': 'Held og lykke, og hav det sjovt!',
    'setup-next': 'Begynd at øve',

    'overview-intro': 'Hvad vil du gerne gøre?',
    'overview-comprehension-title': 'Besvar spørgsmål om tekster',
    'overview-comprehension-description': 'Du modtager en kort tekst på {%t:{%s:targetLanguage%}%} sammen med et spørgsmål, der skal besvares på {%t:{%s:targetLanguage%}%}.',
    'overview-conversation-title': 'Øv samtaler',
    'overview-conversation-description': 'En kort samtale vil blive simuleret på {%t:{%s:targetLanguage%}%}, for eksempel om at bestille mad eller diskutere en hobby.',
    'overview-clarification-title': 'Bed om afklaring',
    'overview-clarification-description': 'Få forklaringer om {%t:{%s:targetLanguage%}%}, såsom en grammatisk regel som bøjninger eller kasus.',
    'overview-statistics-title': 'Se statistik',
    'overview-statistics-description': 'Se antallet af aktiviteter, du har gennemført.',
    'overview-options-title': 'Justér indstillinger',
    'overview-options-description': 'Skift det sprog, du vil lære, de emner, du finder interessante, eller den anvendte LLM.',

    'options-source_language': 'Hvilket sprog kender du allerede?',
    'options-target_language': 'Hvilket sprog vil du gerne lære?',
    'options-proficiency_leven': 'Hvor god er du til sproget? Se forklaringen nedenfor sammen med en eksempeltekst for at få en idé om, hvilken slags tekster du kan forvente.',
    'options-topics_of_interest': 'Udfyld et par emner nedenfor, som jævnligt kan dukke op i øvelserne.',
    'options-api_code': 'Denne app bruger en "stor sprogmodel" til at generere og vurdere øvelser. Hvilken udbyder vil du linke?',
    'options-api_credentials': 'Indtast nøglen fra udviklerens dashboard.',
    'options-test_api_credentials': 'Test nøgle',
    'options-api_credentials_untested': 'Test legitimationsoplysningerne, før du fortsætter.',
    'options-api_credentials_tested': 'Den angivne nøgle virker. Vælg en "stor sprogmodel" at bruge, vi anbefaler "{%preferredModel%}".',

    'statistics-activity_per_category': 'I alt har du besvaret {%s:statisticComprehensionActivity%} spørgsmål om tekster, sendt {%s:statisticConversationActivity%} beskeder i øvelsessamtaler og stillet {%s:statisticClarificationActivity%} spørgsmål.',
    'statistics-no_activity': 'Desværre har du endnu ikke gennemført nok aktiviteter til at blive vist her. Gå til oversigten, og vælg en øvelse for at komme i gang. Din fremgang vil blive sporet i baggrunden.',
    'statistics-no_activity_streak': 'Du har i øjeblikket ingen igangværende aktivitetsrække. Du kan opbygge en ved at gennemføre mindst én øvelse på flere på hinanden følgende dage.',
    'statistics-current_activity_streak': 'Din nuværende aktivitetsrække er {%s:statisticCurrentActivityStreak%} dage lang.',
    'statistics-longest_activity_streak': 'Din længste aktivitetsrække nogensinde var {%s:statisticLongestActivityStreak%} dage lang.',

    'clarification-intro': 'Hvad vil du gerne have mere information om?',
    'clarification-placeholder': 'Jeg undrer mig over...',

    'comprehension-intro': 'Du vil snart læse en tekst på {%t:{%s:targetLanguage%}%} sammen med et spørgsmål om den. Besvar spørgsmålet på {%t:{%s:targetLanguage%}%}. Derefter vil du modtage noget feedback om dit svar.',

    'conversation-intro': 'Du vil snart simulere en samtale på {%t:{%s:targetLanguage%}%}, så svar altid på {%t:{%s:targetLanguage%}%}. Du kan modtage feedback undervejs.',
  },
  [LOCALES.de_de]: {
    'da_dk': 'Dänisch',
    'de_de': 'Deutsch',
    'en_gb': 'Englisch (Vereinigtes Königreich)',
    'nl_nl': 'Duits',

    'proficiency_name-a1': 'A1: Anfänger',
    'proficiency_description-a1': [
      'Lesen: Sie können vertraute Namen, Wörter und sehr einfache Sätze verstehen, zum Beispiel auf Schildern, Plakaten oder in Katalogen.',
      'Schreiben: Sie können eine kurze, einfache Postkarte schreiben, zum Beispiel Urlaubsgrüße verschicken. Sie können Formulare mit persönlichen Angaben ausfüllen, z. B. Name, Staatsangehörigkeit und Adresse in einem Hotelanmeldeformular eintragen.',
    ],
    'proficiency_example-a1': '"Hallo! Mein Name ist Maria. Ich wohne mit meiner Familie in einem kleinen Haus in London. Ich habe einen Bruder und eine Schwester. Ich esse gerne Äpfel und Birnen. Was ist dein Lieblingsobst?"',

    'proficiency_name-a2': 'A2: Grundlegende Kenntnisse',
    'proficiency_description-a2': [
      'Lesen: Sie können sehr kurze, einfache Texte lesen. Sie können spezifische, vorhersehbare Informationen in einfachen Alltagsmaterialien wie Anzeigen, Prospekten, Speisekarten und Fahrplänen finden und kurze einfache persönliche Briefe verstehen.',
      'Schreiben: Sie können kurze, einfache Notizen und Mitteilungen zu unmittelbaren Bedürfnissen schreiben. Sie können einen sehr einfachen persönlichen Brief schreiben, zum Beispiel, um jemandem für etwas zu danken.',
    ],
    'proficiency_example-a2': '"Letztes Wochenende bin ich mit meinen Freunden in den Park gegangen. Wir hatten ein Picknick mit Sandwiches und Saft. Das Wetter war sonnig und wir haben Fußball gespielt. Danach sind wir in ein Café gegangen und haben Eis gegessen. Es war ein schöner Tag!"',

    'proficiency_name-b1': 'B1: Mittelstufe',
    'proficiency_description-b1': [
      'Lesen: Sie können Texte verstehen, die hauptsächlich aus häufig gebrauchten Alltags- oder beruflichen Ausdrücken bestehen. Sie können Beschreibungen von Ereignissen, Gefühlen und Wünschen in persönlichen Briefen verstehen.',
      'Schreiben: Sie können einfache, zusammenhängende Texte zu vertrauten Themen oder Themen von persönlichem Interesse schreiben. Sie können persönliche Briefe schreiben, in denen Erfahrungen und Eindrücke beschrieben werden.',
    ],
    'proficiency_example-b1': '"Ich lese gerne Bücher, besonders Krimis. Kürzlich habe ich eine Geschichte über einen Detektiv gelesen, der einen schwierigen Fall gelöst hat. Es war sehr spannend, und ich konnte nicht aufhören zu lesen. Ich mag Krimis, weil sie mich zum Nachdenken bringen und ich das Ende erraten möchte."',

    'proficiency_name-b2': 'B2: Fortgeschrittene Kenntnisse',
    'proficiency_description-b2': [
      'Lesen: Sie können Artikel und Berichte lesen, die sich mit aktuellen Problemen befassen, bei denen die Verfasser bestimmte Haltungen oder Standpunkte einnehmen. Sie können moderne literarische Texte verstehen.',
      'Schreiben: Sie können klare, detaillierte Texte zu einer Vielzahl von Themen schreiben, die mit Ihren Interessen zusammenhängen. Sie können Aufsätze oder Berichte schreiben, in denen Sie Informationen weitergeben oder Gründe für oder gegen einen bestimmten Standpunkt darlegen. Sie können Briefe schreiben, in denen die persönliche Bedeutung von Ereignissen und Erfahrungen hervorgehoben wird.',
    ],
    'proficiency_example-b2': '"Das Konzept des Remote-Arbeitens wird in den letzten Jahren immer beliebter. Es bietet Flexibilität und Komfort für Mitarbeiter, da sie von überall aus arbeiten können. Allerdings gibt es auch Herausforderungen, wie zum Beispiel die Aufrechterhaltung der Produktivität und der Kommunikation mit Kollegen. Insgesamt denke ich, dass die Vorteile die Nachteile überwiegen."',

    'proficiency_name-c1': 'C1: Fortgeschritten',
    'proficiency_description-c1': [
      'Lesen: Sie können lange und komplexe Sach- und literarische Texte verstehen und Stilunterschiede würdigen. Sie können spezialisierte Artikel und längere technische Anweisungen verstehen, selbst wenn sie nicht in Ihrem Fachgebiet liegen.',
      'Schreiben: Sie können sich in klaren, gut strukturierten Texten ausdrücken und Standpunkte ausführlich darlegen. Sie können über komplexe Themen in einem Brief, Aufsatz oder Bericht schreiben und dabei hervorheben, was Sie für besonders wichtig halten. Sie können den Stil an die Zielgruppe anpassen.',
    ],
    'proficiency_example-c1': '"Der Klimawandel ist eines der drängendsten Probleme unserer Zeit. Während erneuerbare Energiequellen wie Wind- und Solarenergie an Bedeutung gewinnen, bleibt der Übergang weg von fossilen Brennstoffen eine große Herausforderung. Regierungen müssen mit Industrien und Gemeinschaften zusammenarbeiten, um nachhaltige Richtlinien zu schaffen, die wirtschaftliches Wachstum mit Umweltschutz in Einklang bringen."',

    'proficiency_name-c2': 'C2: Kompetente Sprachverwendung',
    'proficiency_description-c2': [
      'Lesen: Sie können nahezu alle Formen der geschriebenen Sprache mühelos lesen, einschließlich abstrakter, strukturell oder sprachlich komplexer Texte wie Handbücher, spezialisierte Artikel und literarische Werke.',
      'Schreiben: Sie können klar und flüssig schreiben und dabei einen Stil verwenden, der dem jeweiligen Kontext entspricht. Sie können komplexe Briefe, Berichte oder Artikel verfassen, die einen Sachverhalt effektiv darstellen und eine logische Struktur aufweisen, die dem Leser hilft, wichtige Punkte zu erkennen und sich zu merken. Sie können Zusammenfassungen und Rezensionen professioneller oder literarischer Werke schreiben.',
    ],
    'proficiency_example-c2': '"Die Nuancen der sprachlichen Evolution offenbaren viel über kulturelle und gesellschaftliche Veränderungen im Laufe der Zeit. Beispielsweise signalisiert die Übernahme von Lehnwörtern oft eine Phase kulturellen Austauschs oder Einflusses. Die Analyse solcher Muster erweitert nicht nur unser Verständnis der Sprachentwicklung, sondern bietet auch tiefgehende Einblicke in historische Beziehungen zwischen Zivilisationen. Dieses dynamische Zusammenspiel unterstreicht die Komplexität und Vernetzung menschlicher Kommunikation."',

    'prompt-context': 'Sie sind ein Experte in und Lehrer für {%t:{%s:targetLocale%}%}. Der Benutzer lernt {%t:{%s:targetLocale%}%}. Der Benutzer beherrscht die Sprache bereits auf dem GER-Niveau {%s:proficiencyLevel%}. Das bedeutet, dass der Benutzer bereits über die folgenden Fähigkeiten verfügt: "{%t:proficiency_description-{%s:proficiencyLevel%}%}". Allerdings möchte der Benutzer seine Sprachkenntnisse weiter verbessern.',
    'prompt-comprehension': 'Erstellen Sie eine Leseverständnisübung, bei der der Benutzer einen Text in {%t:{%s:targetLocale%}%} sowie eine Frage in {%t:{%s:sourceLocale%}%} zum Text erhält, die in {%t:{%s:targetLocale%}%} beantwortet werden soll. Geben Sie dem Benutzer keine weiteren Anweisungen oder Erklärungen. Geben Sie anschließend ein kurzes Feedback auf {%t:{%s:targetLocale%}%}, das der Sprachkompetenz des Benutzers auf diesem Niveau entspricht. Konzentrieren Sie sich ausschließlich auf sprachliche Aspekte und ignorieren Sie inhaltliche Bewertungen oder Interpretationen der Nachricht. Schreiben Sie immer im Klartext ohne Formatierungen, Labels oder Überschriften.',
    'prompt-conversation': 'Sie werden eine Konversation mit dem Benutzer in {%t:{%s:targetLocale%}%} simulieren. Geben Sie dem Benutzer keine weiteren Anweisungen oder Erklärungen. Schreiben Sie immer im Klartext ohne Formatierungen, Labels oder Überschriften. Schreiben Sie die erste Nachricht der Konversation, indem Sie sofort ein Gesprächsthema einführen.',
    'prompt-conversation-follow_up': 'Sie simulieren eine Konversation mit dem Benutzer in {%t:{%s:targetLocale%}%}. Geben Sie zuerst ein kurzes, tiefgehendes Feedback zur Nachricht und konzentrieren Sie sich dabei ausschließlich auf sprachliche Aspekte, ohne inhaltliche Bewertungen oder Interpretationen vorzunehmen. Antworten Sie anschließend auf die Nachricht in {%t:{%s:targetLocale%}%}. Geben Sie keine weiteren Anweisungen oder Erklärungen. Schreiben Sie immer im Klartext ohne Formatierungen, Labels oder Überschriften.',
    'prompt-clarification': 'Der Benutzer hat eine Frage unten gestellt, beantworten Sie diese präzise mit einem tiefgehenden Feedback, das der Sprachkompetenz des Benutzers entspricht. Schreiben Sie immer im Klartext ohne Formatierungen, Labels oder Überschriften. Beantworten Sie die Frage nicht, wenn sie nicht sprachbezogen ist.',
    'prompt-topic': 'Integrieren Sie das folgende Thema in Ihre Nachricht: "{%topic%}".',

    'greeting': 'Hallo!',
    'button-go_back': 'Zurück',
    'button-reset': 'Zurücksetzen',
    'button-generate': 'Generieren',
    'button-answer': 'Antworten',
    'button-reply': 'Antworten',
    'button-ask': 'Fragen',

    'setup-source_language': 'Sie möchten also Ihre Sprachkenntnisse verbessern? Lassen Sie diese App Ihnen beim Üben helfen. Wir müssen zunächst eine Sprache auswählen, die Sie bereits beherrschen.',
    'setup-target_language': 'Nun der nächste Schritt: Welche Sprache möchten Sie lernen?',
    'setup-proficiency_leven': 'Wie gut schätzen Sie Ihre Kenntnisse in der Sprache ein? Siehe die Erklärung unten zusammen mit einem Beispieltext, um eine Vorstellung davon zu bekommen, welche Art von Texten Sie erwarten können.',
    'setup-topics_of_interest': 'Es macht viel mehr Spaß, wenn die Übungen manchmal ein Thema behandeln, das Sie interessant finden. Füllen Sie daher unten einige Themen ein, die regelmäßig vorkommen können. Denken Sie vor allem an Hobbys oder andere Interessen. Je mehr, desto besser!',
    'setup-api_code': 'Diese App verwendet ein "Large Language Model", um Übungen zu generieren und zu bewerten. Vielleicht haben Sie schon davon gehört, jeder in der Tech-Branche spricht über die Entwicklungen in der künstlichen Intelligenz. Die App nutzt ein LLM, bringt jedoch keines mit, daher müssen wir es mit einem LLM-Anbieter verknüpfen. Welchen Anbieter möchten Sie verwenden?',
    'setup-api_credentials': 'Nun die wichtige Frage: der Schlüssel. Sie können ihn im Entwickler-Dashboard erhalten. Dort steht wahrscheinlich, dass Sie ihn nicht mit Dritten teilen sollen. Zum Glück sendet diese App den Schlüssel niemals weiter. Immer noch nicht überzeugt? Schauen Sie sich den Quellcode der App an oder warten Sie auf eine Version, die diesen nicht mehr benötigt.',
    'setup-test_api_credentials': 'Schlüssel testen',
    'setup-api_credentials_untested': 'Testen Sie die Zugangsdaten, bevor Sie fortfahren.',
    'setup-api_credentials_tested': 'Der angegebene Schlüssel funktioniert. Jetzt können Sie auswählen, welches "Large Language Model" Sie verwenden möchten. Nicht sicher, welche Unterschiede es gibt? Kein Problem, wir empfehlen Ihnen die Auswahl von "{%preferredModel%}". Das sollte passen.',
    'setup-outro': 'Viel Erfolg und viel Spaß!',
    'setup-next': 'Mit dem Üben beginnen',

    'overview-intro': 'Was möchten Sie tun?',
    'overview-comprehension-title': 'Fragen zu Texten beantworten',
    'overview-comprehension-description': 'Sie erhalten einen kurzen Text in {%t:{%s:targetLanguage%}%} zusammen mit einer Frage, die in {%t:{%s:targetLanguage%}%} beantwortet werden soll.',
    'overview-conversation-title': 'Konversationen üben',
    'overview-conversation-description': 'Es wird eine kurze Konversation in {%t:{%s:targetLanguage%}%} simuliert, beispielsweise über das Bestellen von Essen oder das Diskutieren eines Hobbys.',
    'overview-clarification-title': 'Erklärung anfordern',
    'overview-clarification-description': 'Erhalten Sie Erklärungen zu {%t:{%s:targetLanguage%}%}, z. B. zu einer Grammatikregel wie Konjugationen oder Fällen.',
    'overview-statistics-title': 'Statistiken ansehen',
    'overview-statistics-description': 'Werfen Sie einen Blick auf die Anzahl der abgeschlossenen Aktivitäten.',
    'overview-options-title': 'Optionen anpassen',
    'overview-options-description': 'Ändern Sie die Sprache, die Sie lernen möchten, die Themen, die Sie interessieren, oder das verwendete LLM.',

    'options-source_language': 'Welche Sprache beherrschen Sie bereits?',
    'options-target_language': 'Welche Sprache möchten Sie lernen?',
    'options-proficiency_leven': 'Wie gut sind Sie in der Sprache? Siehe die Erklärung unten zusammen mit einem Beispieltext, um eine Vorstellung davon zu bekommen, welche Art von Texten Sie erwarten können.',
    'options-topics_of_interest': 'Füllen Sie unten einige Themen ein, die regelmäßig in den Übungen vorkommen können.',
    'options-api_code': 'Diese App verwendet ein "Large Language Model", um Übungen zu generieren und zu bewerten. Welchen Anbieter möchten Sie verknüpfen?',
    'options-api_credentials': 'Geben Sie den Schlüssel aus dem Entwickler-Dashboard ein.',
    'options-test_api_credentials': 'Schlüssel testen',
    'options-api_credentials_untested': 'Testen Sie die Zugangsdaten, bevor Sie fortfahren.',
    'options-api_credentials_tested': 'Der angegebene Schlüssel funktioniert. Wählen Sie ein "Large Language Model", das Sie verwenden möchten. Wir empfehlen "{%preferredModel%}".',

    'statistics-activity_per_category': 'Insgesamt haben Sie {%s:statisticComprehensionActivity%} Fragen zu Texten beantwortet, {%s:statisticConversationActivity%} Nachrichten in Übungsgesprächen gesendet und {%s:statisticClarificationActivity%} Fragen gestellt.',
    'statistics-no_activity': 'Leider haben Sie noch nicht genügend Aktivitäten abgeschlossen, um hier angezeigt zu werden. Gehen Sie zur Übersicht und wählen Sie eine Übung, um zu beginnen. Ihr Fortschritt wird im Hintergrund verfolgt.',
    'statistics-no_activity_streak': 'Sie haben derzeit keine laufende Aktivitätsserie. Sie können eine aufbauen, indem Sie an mehreren aufeinanderfolgenden Tagen mindestens eine Übung abschließen.',
    'statistics-current_activity_streak': 'Ihre aktuelle Aktivitätsserie beträgt {%s:statisticCurrentActivityStreak%} Tage.',
    'statistics-longest_activity_streak': 'Ihre längste Aktivitätsserie war jemals {%s:statisticLongestActivityStreak%} Tage lang.',

    'clarification-intro': 'Wozu möchten Sie mehr Informationen?',
    'clarification-placeholder': 'Ich frage mich...',

    'comprehension-intro': 'Sie werden gleich einen Text in {%t:{%s:targetLanguage%}%} lesen, zusammen mit einer Frage dazu. Beantworten Sie die Frage in {%t:{%s:targetLanguage%}%}. Anschließend erhalten Sie ein Feedback zu Ihrer Antwort.',

    'conversation-intro': 'Sie werden gleich eine Konversation in {%t:{%s:targetLanguage%}%} simulieren. Antworten Sie stets in {%t:{%s:targetLanguage%}%}. Möglicherweise erhalten Sie zwischendurch Feedback.',
  },
  [LOCALES.en_gb]: {
    'da_dk': 'Danish',
    'de_de': 'German',
    'en_gb': 'English (United Kingdom)',
    'nl_nl': 'Dutch',

    'proficiency_name-a1': 'A1: Beginner',
    'proficiency_description-a1': [
      // 'Spoken interaction: You can interact in a simple way provided the other person is prepared to repeat or rephrase things at a slower rate of speech and help me formulate what you are trying to say. You can ask and answer simple questions in areas of immediate need or on very familiar topics.',
      // 'Spoken production: You can use simple phrases and sentences to describe where you live and people you know.',
      // 'Listening: You can recognise familiar words and very basic phrases concerning yourself, your family and immediate concrete surroundings when people speak slowly and clearly.',
      'Reading: You can understand familiar names, words and very simple sentences, for example on notices and posters or in catalogues.',
      'Writing: You can write a short, simple postcard, for example sending holiday greetings. You can fill in forms with personal details, for example entering my name, nationality and address on a hotel registration form.',
    ],
    'proficiency_example-a1': '"Hello! My name is Maria. I live in a small house in London with my family. I have one brother and one sister. I like to eat apples and pears. What is your favourite fruit?"',
    'proficiency_name-a2': 'A2: Pre-intermediate',
    'proficiency_description-a2': [
      // 'Spoken interaction: You can communicate in simple and routine tasks requiring a simple and direct exchange of information on familiar topics and activities. You can handle very short social exchanges, even though I can\'t usually understand enough to keep the conversation going yourself.',
      // 'Spoken production: You can use a series of phrases and sentences to describe in simple terms your family and other people, living conditions, your educational background and your present or most recent job.',
      // 'Listening: You can understand phrases and the highest frequency vocabulary related to areas of most immediate personal relevance (e.g. very basic personal and family information, shopping, local area, employment). You can catch the main point in short, clear, simple messages and announcements.',
      'Reading: You can read very short, simple texts. You can find specific, predictable information in simple everyday material such as advertisements, prospectuses, menus and timetables and you can understand short simple personal letters.',
      'Writing: You can write short, simple notes and messages relating to matters in areas of immediate needs. You can write a very simple personal letter, for example thanking someone for something.',
    ],
    'proficiency_example-a2': '"Last weekend, I went to the park with my friends. We had a picnic with sandwiches and juice. The weather was sunny, and we played football. After that, we went to a café and had some ice cream. It was a fun day!"',
    'proficiency_name-b1': 'B1: Intermediate',
    'proficiency_description-b1': [
      // 'Spoken interaction: You can deal with most situations likely to arise whilst travelling in an area where the language is spoken. You can enter unprepared into conversation on topics that are familiar, of personal interest or pertinent to everyday life (e.g. family, hobbies, work, travel and current events).',
      // 'Spoken production: You can connect phrases in a simple way in order to describe experiences and events, your dreams, hopes and ambitions. You can briefly give reasons and explanations for opinions and plans. You can narrate a story or relate the plot of a book or film and describe your reactions.',
      // 'Listening: You can understand the main points of clear standard speech on familiar matters regularly encountered in work, school, leisure, etc. You can understand the main point of many radio or TV programmes on current affairs or topics of personal or professional interest when the delivery is relatively slow and clear.',
      'Reading: You can understand texts that consist mainly of high frequency every day or job-related language. You can understand the description of events, feelings and wishes in personal letters.',
      'Writing: You can write simple connected text on topics which are familiar or of personal interest. You can write personal letters describing experiences and impressions.',
    ],
    'proficiency_example-b1': '"I enjoy reading books, especially mystery novels. Recently, I finished a story about a detective who solved a difficult case. It was very interesting, and I couldn\'t stop reading. I like mysteries because they make me think and try to guess the ending."',
    'proficiency_name-b2': 'B2: Upper-intermediate',
    'proficiency_description-b2': [
      // 'Spoken interaction: You can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible. You can take an active part in discussion in familiar contexts, accounting for and sustaining your views.',
      // 'Spoken production: You can present clear, detailed descriptions on a wide range of subjects related to your field of interest. You can explain a viewpoint on a topical issue giving the advantages and disadvantages of various options.',
      // 'Listening: You can understand extended speech and lectures and follow even complex lines of argument provided the topic is reasonably familiar. You can understand most TV news and current affairs programmes. You can understand the majority of films in standard dialect.',
      'Reading: You can read articles and reports concerned with contemporary problems in which the writers adopt particular attitudes or viewpoints. You can understand contemporary literary prose.',
      'Writing: You can write clear, detailed text on a wide range of subjects related to my interests. You can write an essay or report, passing on information or giving reasons in support of or against a particular point of view. You can write letters highlighting the personal significance of events and experiences.',
    ],
    'proficiency_example-b2': '"The concept of remote work has become increasingly popular in recent years. It offers flexibility and convenience for employees, allowing them to work from anywhere. However, it also presents challenges, such as maintaining productivity and communication with colleagues. Overall, I think the benefits outweigh the drawbacks."',
    'proficiency_name-c1': 'C1: Advanced',
    'proficiency_description-c1': [
      // 'Spoken interaction: You can express yourself fluently and spontaneously without much obvious searching for expressions. You can use language flexibly and effectively for social and professional purposes. You can formulate ideas and opinions with precision and relate your contribution skilfully to those of other speakers.',
      // 'Spoken production: You can present clear, detailed descriptions of complex subjects integrating sub-themes, developing particular points and rounding off with an appropriate conclusion.',
      // 'Listening: You can understand extended speech even when it is not clearly structured and when relationships are only implied and not signalled explicitly. You can understand television programmes and films without too much effort.',
      'Reading: You can understand long and complex factual and literary texts, appreciating distinctions of style. You can understand specialised articles and longer technical instructions, even when they do not relate to your field.',
      'Writing: You can express yourself in clear, well-structured text, expressing points of view at some length. You can write about complex subjects in a letter, an essay or a report, underlining what you consider to be the salient issues. You can select style appropriate to the reader in mind.',
    ],
    'proficiency_example-c1': '"Climate change is one of the most pressing issues of our time. While renewable energy sources such as wind and solar power are growing in importance, transitioning away from fossil fuels remains a significant challenge. Governments must collaborate with industries and communities to create sustainable policies that balance economic growth with environmental conservation."',
    'proficiency_name-c2': 'C2: Proficient',
    'proficiency_description-c2': [
      // 'Spoken interaction: You can take part effortlessly in any conversation or discussion and have a good familiarity with idiomatic expressions and colloquialisms. You can express yourself fluently and convey finer shades of meaning precisely. If you do have a problem you can backtrack and restructure around the difficulty so smoothly that other people are hardly aware of it.',
      // 'Spoken production: You can present a clear, smoothly-flowing description or argument in a style appropriate to the context and with an effective logical structure which helps the recipient to notice and remember significant points.',
      // 'Listening: You have no difficulty in understanding any kind of spoken language, whether live or broadcast, even when delivered at fast native speed, provided. You have some time to get familiar with the accent.',
      'Reading: You can read with ease virtually all forms of the written language, including abstract, structurally or linguistically complex texts such as manuals, specialised articles and literary works.',
      'Writing: You can write clear, smoothly-flowing text in an appropriate style. You can write complex letters, reports or articles which present a case with an effective logical structure which helps the recipient to notice and remember significant points. You can write summaries and reviews of professional or literary works.',
    ],
    'proficiency_example-c2': '"The nuances of linguistic evolution reveal much about cultural and societal shifts over time. For instance, the adoption of loanwords often signals a period of cultural exchange or influence. Analysing such patterns not only enhances our understanding of language development but also offers profound insights into historical relationships between civilizations. This dynamic interplay underscores the complexity and interconnectedness of human communication."',

    'prompt-context': 'You are an expert in and teacher of {%t:{%s:targetLocale%}%}. The user is studying {%t:{%s:targetLocale%}%}. The user already masters the language at CEFR level {%s:proficiencyLevel%}. This means that the user already has the following skills: "{%t:proficiency_description-{%s:proficiencyLevel%}%}". However, the user wants to improve their proficiency further.',
    'prompt-comprehension': 'Create a reading comprehension exercise where the user receives a text in {%t:{%s:targetLocale%}%} along with a question in {%t:{%s:sourceLocale%}%} about the text, to be answered in {%t:{%s:targetLocale%}%}. Do not provide any further instructions or explanations to the user. Then give brief feedback on {%t:{%s:targetLocale%}%} with a great deal of depth, appropriate to the user\'s proficiency level in {%t:{%s:targetLocale%}%}. Focus solely on linguistic aspects and ignore any content-related evaluations or interpretations of the message. Always write in plain text without any formatting, labels, or headings.',
    'prompt-conversation': 'You will simulate a conversation with the user in {%t:{%s:targetLocale%}%}. Do not provide any further instructions or explanations to the user. Always write in plain text without any formatting, labels, or headings. Write the first message in the conversation, immediately introducing a topic to discuss.',
    'prompt-conversation-follow_up': 'You are simulating a conversation with the user in {%t:{%s:targetLocale%}%}. First, provide brief, in-depth feedback on the message, focusing solely on linguistic aspects and ignoring any content-related evaluations or interpretations. Then, respond to the message in {%t:{%s:targetLocale%}%}. Do not provide any further instructions or explanations to the user. Always write in plain text without any formatting, labels, or headings.',
    'prompt-clarification': 'The user has a question below, answer it concisely with in-depth feedback, appropriate to the user\'s proficiency level. Always write in plain text without any formatting, labels, or headings. Do not answer the question if it is not language-related.',
    'prompt-topic': 'Incorporate the following topic into your message "{%topic%}".',

    'greeting': 'Hi!',
    'button-go_back': 'Go back',
    'button-reset': 'Reset',
    'button-generate': 'Generate',
    'button-answer': 'Answer',
    'button-reply': 'Reply',
    'button-ask': 'Ask',

    'setup-source_language': 'So, you want to improve your proficiency in a language? Let this app help you practise. We need to start by choosing a language you already know.',
    'setup-target_language': 'Now the next step, which language would you like to learn?',
    'setup-proficiency_leven': 'How proficient would you say you already are in the language? See the explanation below along with an example text to get an idea of what kind of texts to expect.',
    'setup-topics_of_interest': 'It\'s much more enjoyable if the exercises sometimes feature a topic you find interesting. Therefore, fill in a few topics below that can regularly appear. Think mainly of any hobbies or other interests. The more, the better!',
    'setup-api_code': 'This app uses a "Large Language Model" to generate and assess exercises. You may have heard about it, everyone in the tech sector keeps talking about developments in artificial intelligence. The app uses an LLM, but doesn\'t come with one, so we need to link it to an LLM provider. Which provider would you like to use?',
    'setup-api_credentials': 'Now, the important question is the key. You can get it from the developer\'s dashboard. It probably states that you shouldn\'t share it with third parties. Fortunately, this app never sends the key elsewhere. Still not convinced? Check out the app\'s source code or wait for a version that no longer requires this.',
    'setup-test_api_credentials': 'Test key',
    'setup-api_credentials_untested': 'Test the credentials before proceeding.',
    'setup-api_credentials_tested': 'The provided key works. Now you can choose which "Large Language Model" to use. Not sure what the differences are? No problem, we recommend selecting "{%preferredModel%}". That should be fine.',
    'setup-outro': 'Good luck and have fun!',
    'setup-next': 'Start practising',

    'overview-intro': 'What would you like to do?',
    'overview-comprehension-title': 'Answer questions about texts',
    'overview-comprehension-description': 'You\'ll receive a short text in {%t:{%s:targetLanguage%}%} along with a question to be answered in {%t:{%s:targetLanguage%}%}.',
    'overview-conversation-title': 'Practise conversations',
    'overview-conversation-description': 'A short conversation will be simulated in {%t:{%s:targetLanguage%}%}, for example, about ordering food or discussing a hobby.',
    'overview-clarification-title': 'Ask for clarification',
    'overview-clarification-description': 'Get explanations about {%t:{%s:targetLanguage%}%}, such as a grammar rule like conjugations or cases.',
    'overview-statistics-title': 'View statistics',
    'overview-statistics-description': 'Take a look at the number of activities you have completed.',
    'overview-options-title': 'Adjust options',
    'overview-options-description': 'Change the language you want to learn, the topics you find interesting, or the LLM used.',

    'options-source_language': 'Which language do you already know?',
    'options-target_language': 'Which language would you like to learn?',
    'options-proficiency_leven': 'How proficient are you in the language? See the explanation below along with an example text to get an idea of what kind of texts to expect.',
    'options-topics_of_interest': 'Fill in a few topics below that can regularly appear in the exercises.',
    'options-api_code': 'This app uses a "Large Language Model" to generate and assess exercises. Which provider would you like to link?',
    'options-api_credentials': 'Enter the key from the developer\'s dashboard.',
    'options-test_api_credentials': 'Test key',
    'options-api_credentials_untested': 'Test the credentials before proceeding.',
    'options-api_credentials_tested': 'The provided key works. Choose a "Large Language Model" to use, we recommend "{%preferredModel%}".',

    'statistics-activity_per_category': 'In total, you have answered {%s:statisticComprehensionActivity%} questions about texts, sent {%s:statisticConversationActivity%} messages in practice conversations, and asked {%s:statisticClarificationActivity%} questions.',
    'statistics-no_activity': 'Unfortunately, you haven\'t completed enough activities yet to display here. Go to the overview and choose an exercise to start. Your progress will be tracked in the background.',
    'statistics-no_activity_streak': 'You currently have no ongoing activity streak. You can build one by completing at least one exercise on multiple consecutive days.',
    'statistics-current_activity_streak': 'Your current activity streak is {%s:statisticCurrentActivityStreak%} days long.',
    'statistics-longest_activity_streak': 'Your longest activity streak ever was {%s:statisticLongestActivityStreak%} days long.',

    'clarification-intro': 'What would you like more information about?',
    'clarification-placeholder': 'I wondering...',

    'comprehension-intro': 'You will soon read a text in {%t:{%s:targetLanguage%}%} along with a question about it. Answer the question in {%t:{%s:targetLanguage%}%}. You will then receive some feedback regarding your answer.',

    'conversation-intro': 'You will soon simulate a conversation in {%t:{%s:targetLanguage%}%}, so always respond in {%t:{%s:targetLanguage%}%}. You may receive feedback along the way.',
  },
  [LOCALES.nl_nl]: {
    'da_dk': 'Deens',
    'de_de': 'Duits',
    'en_gb': 'Engels (Verenigd Koninkrijk)',
    'nl_nl': 'Nederlands',
    'da': 'Deens',
    'de': 'Duits',
    'en': 'Engels',
    'nl': 'Nederlands',

    'proficiency_name-a1': 'A1: Beginner',
    'proficiency_description-a1': [
      'Lezen: Je kunt vertrouwde namen, woorden en zeer eenvoudige zinnen begrijpen, bijvoorbeeld op aankondigingen en posters of in catalogi.',
      'Schrijven: Je kunt een korte, eenvoudige ansichtkaart schrijven, bijvoorbeeld om vakantiegroeten te sturen. Je kunt formulieren invullen met persoonlijke gegevens, zoals je naam, nationaliteit en adres op een hotelregistratieformulier.',
    ],
    'proficiency_example-a1': '"Hallo! Ik heet Maria. Ik woon in een klein huis in Amsterdam met mijn familie. Ik heb een broer en een zus. Ik hou van appels en peren. Wat is jouw favoriete fruit?"',
    'proficiency_name-a2': 'A2: Pre-intermediair',
    'proficiency_description-a2': [
      'Lezen: Je kunt zeer korte, eenvoudige teksten lezen. Je kunt specifieke, voorspelbare informatie vinden in eenvoudig alledaags materiaal zoals advertenties, folders, menu\'s en dienstregelingen, en je kunt korte eenvoudige persoonlijke brieven begrijpen.',
      'Schrijven: Je kunt korte, eenvoudige notities en berichten schrijven die betrekking hebben op zaken van directe noodzaak. Je kunt een heel eenvoudige persoonlijke brief schrijven, bijvoorbeeld om iemand te bedanken.',
    ],
    'proficiency_example-a2': '"Afgelopen weekend ging ik met mijn vrienden naar het park. We hadden een picknick met broodjes en sap. Het weer was zonnig, en we speelden voetbal. Daarna gingen we naar een café en aten we ijs. Het was een leuke dag!"',
    'proficiency_name-b1': 'B1: Intermediair',
    'proficiency_description-b1': [
      'Lezen: Je kunt teksten begrijpen die voornamelijk bestaan uit alledaagse of werkgerelateerde taal met een hoge frequentie. Je kunt de beschrijving van gebeurtenissen, gevoelens en wensen begrijpen in persoonlijke brieven.',
      'Schrijven: Je kunt eenvoudige, samenhangende teksten schrijven over onderwerpen die vertrouwd of van persoonlijk belang zijn. Je kunt persoonlijke brieven schrijven waarin je ervaringen en indrukken beschrijft.',
    ],
    'proficiency_example-b1': '"Ik lees graag boeken, vooral detectiveverhalen. Onlangs heb ik een verhaal gelezen over een rechercheur die een moeilijk mysterie oploste. Het was erg interessant, en ik kon niet stoppen met lezen. Ik hou van dit genre omdat het me aan het denken zet en ik probeer het einde te raden."',
    'proficiency_name-b2': 'B2: Upper-intermediair',
    'proficiency_description-b2': [
      'Lezen: Je kunt artikelen en rapporten lezen die gaan over actuele problemen waarin de schrijvers specifieke houdingen of standpunten innemen. Je kunt eigentijdse literaire proza begrijpen.',
      'Schrijven: Je kunt duidelijke, gedetailleerde teksten schrijven over een breed scala aan onderwerpen die verband houden met je interesses. Je kunt een essay of rapport schrijven waarin je informatie doorgeeft of redenen geeft ter ondersteuning of afwijzing van een bepaald standpunt. Je kunt brieven schrijven waarin je de persoonlijke betekenis van gebeurtenissen en ervaringen benadrukt.',
    ],
    'proficiency_example-b2': '"Het concept van thuiswerken is de laatste jaren steeds populairder geworden. Het biedt flexibiliteit en gemak voor werknemers, waardoor ze overal kunnen werken. Maar het brengt ook uitdagingen met zich mee, zoals het behouden van productiviteit en communicatie met collega\'s. Over het algemeen denk ik dat de voordelen groter zijn dan de nadelen."',
    'proficiency_name-c1': 'C1: Gevorderd',
    'proficiency_description-c1': [
      'Lezen: Je kunt lange en complexe feitelijke en literaire teksten begrijpen en waarderen, waarbij je onderscheid maakt in stijl. Je kunt gespecialiseerde artikelen en langere technische instructies begrijpen, zelfs wanneer deze niet in je vakgebied liggen.',
      'Schrijven: Je kunt jezelf duidelijk en goed gestructureerd uitdrukken in tekst, waarbij je standpunten uitvoerig uiteenzet. Je kunt schrijven over complexe onderwerpen in een brief, essay of rapport, en daarbij benadrukken wat je als de belangrijkste kwesties beschouwt. Je kunt een stijl kiezen die geschikt is voor de beoogde lezer.',
    ],
    'proficiency_example-c1': '"Klimaatverandering is een van de meest urgente problemen van deze tijd. Hoewel hernieuwbare energiebronnen zoals wind- en zonne-energie steeds belangrijker worden, blijft de overgang van fossiele brandstoffen een grote uitdaging. Overheden moeten samenwerken met industrieën en gemeenschappen om duurzame beleidsmaatregelen te creëren die economische groei en milieubescherming in balans brengen."',
    'proficiency_name-c2': 'C2: Proficient',
    'proficiency_description-c2': [
      'Lezen: Je kunt vrijwel alle vormen van geschreven taal met gemak lezen, inclusief abstracte, structureel of taalkundig complexe teksten zoals handleidingen, gespecialiseerde artikelen en literaire werken.',
      'Schrijven: Je kunt heldere, vloeiende teksten schrijven in een passende stijl. Je kunt complexe brieven, rapporten of artikelen schrijven die een zaak presenteren met een effectieve logische structuur die de ontvanger helpt belangrijke punten op te merken en te onthouden. Je kunt samenvattingen en recensies schrijven van professionele of literaire werken.',
    ],
    'proficiency_example-c2': '"De nuances van taalontwikkeling onthullen veel over culturele en maatschappelijke veranderingen door de tijd heen. Zo duidt de opname van leenwoorden vaak op een periode van culturele uitwisseling of invloed. Het analyseren van dergelijke patronen verrijkt niet alleen ons begrip van taalontwikkeling, maar biedt ook waardevolle inzichten in historische relaties tussen beschavingen. Deze dynamiek benadrukt de complexiteit en verbondenheid van menselijke communicatie."',

    'prompt-context': 'Je bent een expert in en docent van het {%t:{%s:targetLocale%}%}. De gebruiker is {%t:{%s:targetLocale%}%} aan het studeren. De gebruiker beheerst de taal al tot CEFR niveau {%s:proficiencyLevel%}. Dit betekend dat de gebruiker al de volgende vaardigheden beheerst: "{%t:proficiency_description-{%s:proficiencyLevel%}%}" Maar de gebruiker wil de taal nog beter leren beheersen.',
    'prompt-comprehension': 'Schrijf een leesvaardigheidsoefening waarbij de gebruiker een tekst in het {%t:{%s:targetLocale%}%} krijgt samen met een vraag in het {%t:{%s:sourceLocale%}%} over de tekst waarop de gebruiker moet antwoorden in het {%t:{%s:targetLocale%}%}. Geef geen verdere instructies of uitleg aan de gebruiker. Vervolgens geef je beknopt feedback over het {%t:{%s:targetLocale%}%} met veel diepgang dat duidelijk genoeg is voor het kennis niveau van de gebruiker in het {%t:{%s:targetLocale%}%}. Richt je hierbij uitsluitend op taalkundige aspecten en negeer inhoudelijke evaluaties of interpretaties van het bericht Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten.',
    'prompt-conversation': 'Je gaat met de gebruiker een gesprek simuleren in het {%t:{%s:targetLocale%}%}. Geef geen verdere instructies of uitleg aan de gebruiker. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten. Schrijf het eerste bericht in een gesprek dat al gelijk een onderwerp introduceert om het over te hebben.',
    'prompt-conversation-follow_up': 'Je bent met de gebruiker een gesprek aan het simuleren in het {%t:{%s:targetLocale%}%}. Geef als antwoord op een bericht eerst beknopt feedback met veel diepgang dat duidelijk genoeg is voor het kennis niveau van de gebruiker in het {%t:{%s:sourceLocale%}%}. Richt je hierbij uitsluitend op taalkundige aspecten en negeer inhoudelijke evaluaties of interpretaties van het bericht. Ga daarna verder met het antwoorden op het bericht in het {%t:{%s:targetLocale%}%}. Geef geen verdere instructies of uitleg aan de gebruiker. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten.',
    'prompt-clarification': 'De gebruiker heeft onderstaande vraag, beantwoord de vraag beknopt met veel diepgang dat duidelijk genoeg is voor het kennis niveau van de gebruiker. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten. Beantwoord de vraag niet als het absoluut niet taal gerelateerd is.',
    'prompt-topic': 'Verwerk het volgende onderwerp in jouw bericht "{%topic%}".',

    'greeting': 'Hoi!',
    'button-go_back': 'Ga terug',
    'button-reset': 'Resetten',
    'button-generate': 'Genereren',
    'button-answer': 'Antwoorden',
    'button-reply': 'Antwoorden',
    'button-ask': 'Vragen',

    'setup-source_language': 'Dus jij wilt een taal beter beheersen? Laat deze app je helpen met oefenen. We moeten beginnen met een taal te kiezen die je al kent.',
    'setup-target_language': 'Nu het volgende probleem, welke taal wil je leren?',
    'setup-proficiency_leven': 'Hoe goed zou jij zeggen dat je al in de taal bent? Zie de uitleg hieronder samen met een voorbeeld tekst om een idee te geven wat voor teksten je kan verwachten.',
    'setup-topics_of_interest': 'Het is natuurlijk veel leuker als er af en toe een onderwerp voorbij komt wat je interessant vind. Vul daarom hieronder een aantal onderwerpen in die regelmatig terug kunnen komen. Denk hierbij vooral aan enige hobbies of andere interesses. Des te meer des te beter!',
    'setup-api_code': 'Om te oefenen wordt gebruik gemaakt van een "Large Language Model". Je hebt er vast wel van gehoord, iedereen in de technologie sector houdt maar niet op over de ontwikkelingen in kunstmatige intelligentie. De app maakt dus gebruik van een LLM om de oefening te maken en te beoordelen. Helaas komt de app niet zelf met een eentje, dus moeten we een koppeling maken met een LLM. Met welke aanbieder wil je een koppeling maken?',
    'setup-api_credentials': 'Nu is de grote vraag nog de sleutel. Deze kun je bij het ontwikkelaars paneel. Er staat waarschijnlijk al bij vermeld dat je deze niet met derden moet delen. Gelukkig stuurt deze app nooit de sleutel door. Vertrouw je het toch niet? Bekijk dan de brondcode van deze app, of wacht wellicht tot er een variant gemaakt is waarbij dat niet meer nodig is.',
    'setup-test_api_credentials': 'Sleutel testen',
    'setup-api_credentials_untested': 'Test de gegevens eerst voordat je verder gaat.',
    'setup-api_credentials_tested': 'De opgegeven sleutel werkt, nu kan je nog kiezen uit welke "Large Language Model" je wilt gebruiken. Heb je geen idee wat de verschillen zijn? Geen probleem, we raden aan dat je "{%preferredModel%}" selecteert, daarmee komt het vast wel goed.',
    'setup-outro': 'Heel veel succes en plezier!',
    'setup-next': 'Begin met oefenen',

    'overview-intro': 'Wat wil je gaan doen?',
    'overview-comprehension-title': 'Vragen over teksten beantwoorden',
    'overview-comprehension-description': 'Je krijgt een korte tekst in het {%t:{%s:targetLanguage%}%} samen met een vraag die kan beantwoorden in natuurlijk het {%t:{%s:targetLanguage%}%}.',
    'overview-conversation-title': 'Gesprekken oefenen',
    'overview-conversation-description': 'Er zal een kort gesprekje gespeeld worden in het {%t:{%s:targetLanguage%}%} over bijvoorbeeld het bestellen van eten of over een hobby.',
    'overview-clarification-title': 'Uitleg vragen',
    'overview-clarification-description': 'Krijg verduidelijk over het {%t:{%s:targetLanguage%}%}, bijvoorbeeld een grammatica regel zoals vervoegingen en naamvallen.',
    'overview-statistics-title': 'Statistieken inzien',
    'overview-statistics-description': 'Neem een kijkje in het aantal activiteiten dat je gedaan hebt.',
    'overview-options-title': 'Opties aanpassen',
    'overview-options-description': 'Pas aan welke taal je wilt leren, welke onderwerpen je interessant vind of welke LLM gebruikt wordt.',

    'options-source_language': 'Welke taal ken je al?',
    'options-target_language': 'Welke taal wil je leren?',
    'options-proficiency_leven': 'Hoe vaardig ben je al in de taal? Zie de uitleg hieronder samen met een voorbeeld tekst om een idee te geven wat voor teksten je kan verwachten.',
    'options-topics_of_interest': 'Vul hieronder een aantal onderwerpen in die regelmatig terug kunnen komen in de oefening.',
    'options-api_code': 'Om te oefenen wordt gebruik gemaakt van een "Large Language Model" om de oefening te maken en te beoordelen. Met welke aanbieder wil je een koppeling maken?',
    'options-api_credentials': 'Voer de sleutel uit het ontwikkelaars paneel in.',
    'options-test_api_credentials': 'Sleutel testen',
    'options-api_credentials_untested': 'Test de gegevens eerst voordat je verder gaat.',
    'options-api_credentials_tested': 'De opgegeven sleutel werkt. Kies een "Large Language Model" dat je wilt gebruiken, wij raden "{%preferredModel%}" aan.',

    'statistics-activity_per_category': ' In totaal heb je {%s:statisticComprehensionActivity%} vragen over teksten beantwoord, {%s:statisticConversationActivity%} berichten verstuurd in oefen gesprekken, en {%s:statisticClarificationActivity%} vragen gesteld.',
    'statistics-no_activity': 'Je hebt helaas nog niet genoeg activiteiten gedaan om hier weer te geven. Ga naar het overzicht en kies een oefening om te beginnen, op de achtergrond zal bijgehouden worden hoeveel je er al voltooid hebt.',
    'statistics-no_activity_streak': 'Je hebt op dit momenten geen lopende activiteitenreeks opgebouwd. Deze krijg je door op meerdere dagen op een rij minimaal één oefening te doen.',
    'statistics-current_activity_streak': 'Op dit moment is jouw activiteitenreeks {%s:statisticCurrentActivityStreak%} dagen lang.',
    'statistics-longest_activity_streak': ' Jouw langste activiteitenreeks ooit was {%s:statisticLongestActivityStreak%} dagen lang.',

    'clarification-intro': 'Waar wil je meer over weten?',
    'clarification-placeholder': 'Ik vraag mij af...',

    'comprehension-intro': 'Je leest straks een tekst in het {%t:{%s:targetLanguage%}%} samen met een vraag erover, beantwoord de vraag in het {%t:{%s:targetLanguage%}%}. Vervolgens zal je enige verbeterpunten krijgen over jouw antwoord.',

    'conversation-intro': 'Je gaat straks een gesprek simuleren in het {%t:{%s:targetLanguage%}%} zorg daarom dat je ook altijd in het {%t:{%s:targetLanguage%}%} antwoord. Tussendoor zal je enige verbeterpunten kunnen ontvangen.',
  },
})
