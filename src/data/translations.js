import { LOCALES } from './locales.js'

export const translate = (
  state,
  key,
  locale = null,
) => {
  locale ??= state.sourceLocale
  if (!(locale in TRANSLATIONS)) {
    console.warn('Er zijn geen vertalingen beschikbaar voor de taal "' + (locale) + '"')
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
  [LOCALES.eng]: {
    [LOCALES.dan]: 'Danish',
    [LOCALES.deu]: 'German',
    [LOCALES.eng]: 'English (United Kingdom)',
    [LOCALES.epo]: 'Esperanto',
    [LOCALES.fry]: 'Frisian (West)',
    [LOCALES.isl]: 'Icelandic',
    [LOCALES.nld]: 'Dutch',
    [LOCALES.nno]: 'Norwegian (Nynorsk)',
    [LOCALES.nob]: 'Norwegian (Bokmål)',
    [LOCALES.swe]: 'Swedish',
    [LOCALES.vls]: 'Flamish',

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
    'prompt-comprehension': 'Write a reading and writing exercise where the user receives a text in {%t:{%s:targetLocale%}%} along with a question in {%t:{%s:sourceLocale%}%} about the text, to which the user must respond in {%t:{%s:targetLocale%}%}. Do not provide any further instructions, explanations, or answers to the user. Always write in plain text without any formatting, labels, or headings.',
    'prompt-comprehension-follow_up': 'Provide feedback on the reading and writing exercise given. Offer concise feedback on the {%t:{%s:targetLocale%}%} with in-depth analysis that is clear enough for the user\'s level of knowledge. Write the feedback in {%t:{%s:sourceLocale%}%}. Focus exclusively on linguistic aspects and ignore content-related evaluations or interpretations of the message. Always write in plain text without any formatting, labels, or headings.',
    'prompt-conversation': 'You will simulate a conversation with the user in {%t:{%s:targetLocale%}%}. Do not provide any further instructions or explanations to the user. Always write in plain text without any formatting, labels, or headings. Write the first message in the conversation, immediately introducing a topic to discuss.',
    'prompt-conversation-follow_up': 'You are simulating a conversation with the user in {%t:{%s:targetLocale%}%}. First, provide brief, in-depth feedback on the message in {%t:{%s:sourceLocale%}%}, focusing solely on linguistic aspects and ignoring any content-related evaluations or interpretations. Then, respond to the message in {%t:{%s:targetLocale%}%}. Do not provide any further instructions or explanations to the user. Always write in plain text without any formatting, labels, or headings.',
    'prompt-clarification': 'The user has a question below, answer it concisely with in-depth feedback, appropriate to the user\'s proficiency level. Answer the question {%t:{%s:sourceLocale%}%} and provide examples in {%t:{%s:targetLocale%}%} where appropriate. Always write in plain text without any formatting, labels, or headings. Do not answer the question if it is not language-related.',
    'prompt-topic': ' Incorporate the following topic into your message "{%topic%}".',
    'prompt-vocabulary': 'Write a word along with a definition in {%t:{%s:targetLocale%}%}. The user will then write a sentence in {%t:{%s:targetLocale%}%} in which this word must be used. Take into account the user\'s skill and language level. Do not provide any additional instructions, explanations, or the answer to the user. Always write in plain text without any formatting, labels, or headings.',
    'prompt-vocabulary-follow_up': 'Provide feedback on the sentence in which the user has answered. Check whether the word has been used correctly in the sentence. Provide concise feedback on the {%t:{%s:targetLocale%}%} with considerable depth that is clear enough for the user\'s level of knowledge. Write the feedback in {%t:{%s:sourceLocale%}%}. Focus exclusively on linguistic aspects and ignore content-related evaluations or interpretations of the message. Always write in plain text without any formatting, labels, or headings.',

    'greeting': 'Hi!',
    'button-go_back': 'Go back',
    'button-reset': 'Reset',
    'button-generate': 'Generate',
    'button-answer': 'Answer',
    'button-reply': 'Reply',
    'button-ask': 'Ask',
    'credits-link': 'Made by {%name%}',

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
    'overview-vocabulary-title': 'Learn new words',
    'overview-vocabulary-description': 'You\'ll receive a word and definition in {%t:{%s:targetLanguage%}%}, respond with a scentence using the word in{%t:{%s:targetLanguage%}%}.',

    'options-source_language': 'Which language do you already know?',
    'options-target_language': 'Which language would you like to learn?',
    'options-proficiency_leven': 'How proficient are you in the language? See the explanation below along with an example text to get an idea of what kind of texts to expect.',
    'options-topics_of_interest': 'Fill in a few topics below that can regularly appear in the exercises.',
    'options-api_code': 'This app uses a "Large Language Model" to generate and assess exercises. Which provider would you like to link?',
    'options-api_credentials': 'Enter the key from the developer\'s dashboard.',
    'options-test_api_credentials': 'Test key',
    'options-api_credentials_untested': 'Test the credentials before proceeding.',
    'options-api_credentials_tested': 'The provided key works. Choose a "Large Language Model" to use, we recommend "{%preferredModel%}".',

    'statistics-activity_per_category': 'In total, you have answered {%s:statisticComprehensionActivity%} questions about texts, sent {%s:statisticConversationActivity%} messages in practice conversations, {%s:statisticVocabularyActivity%} words practised, and asked {%s:statisticClarificationActivity%} questions.',
    'statistics-no_activity': 'Unfortunately, you haven\'t completed enough activities yet to display here. Go to the overview and choose an exercise to start. Your progress will be tracked in the background.',
    'statistics-no_activity_streak': 'You currently have no ongoing activity streak. You can build one by completing at least one exercise on multiple consecutive days.',
    'statistics-current_activity_streak': 'Your current activity streak is {%s:statisticCurrentActivityStreak%} days long.',
    'statistics-longest_activity_streak': 'Your longest activity streak ever was {%s:statisticLongestActivityStreak%} days long.',

    'clarification-intro': 'What would you like more information about?',
    'clarification-placeholder': 'I\'m wondering about...',
    'comprehension-intro': 'In a moment you\'ll read a text in {%t:{%s:targetLanguage%}%} along with a question about it. Answer the question in {%t:{%s:targetLanguage%}%}. You\'ll then receive some feedback regarding your answer.',
    'conversation-intro': 'In a moment you\'ll simulate a conversation in {%t:{%s:targetLanguage%}%}, so always respond in {%t:{%s:targetLanguage%}%}. You may receive feedback along the way.',
    'vocabulary-intro': 'In a moment you\'ll read a word together with its definition in {%t:{%s:targetLanguage%}%}. Answer with a scentence that uses the word in {%t:{%s:targetLanguage%}%}. You\'ll then receive some feedback regarding your answer.',
  },
  [LOCALES.nld]: {
    [LOCALES.dan]: 'Deens',
    [LOCALES.deu]: 'Duits',
    [LOCALES.eng]: 'Engels (Verenigd Koninkrijk)',
    [LOCALES.epo]: 'Esperanto',
    [LOCALES.fry]: 'Fries (West)',
    [LOCALES.isl]: 'IJslands',
    [LOCALES.nld]: 'Nederlands',
    [LOCALES.nno]: 'Noors (Nynorsk)',
    [LOCALES.nob]: 'Noors (Bokmål)',
    [LOCALES.swe]: 'Zweeds',
    [LOCALES.vls]: 'Vlaams',

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
    'prompt-comprehension': 'Schrijf een lees en schrijfvaardigheidsoefening waarbij de gebruiker een tekst in het {%t:{%s:targetLocale%}%} krijgt samen met een vraag in het {%t:{%s:sourceLocale%}%} over de tekst waarop de gebruiker moet antwoorden in het {%t:{%s:targetLocale%}%}. Geef geen verdere instructies, uitleg of het antwoord aan de gebruiker. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten.',
    'prompt-comprehension-follow_up': 'Geef feedback op de lees en schrijfvaardigheidsoefening die gesteld is. Geef beknopt feedback over het {%t:{%s:targetLocale%}%} met veel diepgang dat duidelijk genoeg is voor het kennis niveau van de gebruiker. Schrijf de feedback in het {%t:{%s:sourceLocale%}%}. Richt je hierbij uitsluitend op taalkundige aspecten en negeer inhoudelijke evaluaties of interpretaties van het bericht. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten.',
    'prompt-conversation': 'Je gaat met de gebruiker een gesprek simuleren in het {%t:{%s:targetLocale%}%}. Geef geen verdere instructies of uitleg aan de gebruiker. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten. Schrijf het eerste bericht in een gesprek dat al gelijk een onderwerp introduceert om het over te hebben.',
    'prompt-conversation-follow_up': 'Je bent met de gebruiker een gesprek aan het simuleren in het {%t:{%s:targetLocale%}%}. Geef als antwoord op een bericht eerst beknopt feedback met veel diepgang dat duidelijk genoeg is voor het kennis niveau van de gebruiker in het {%t:{%s:sourceLocale%}%}. Richt je hierbij uitsluitend op taalkundige aspecten en negeer inhoudelijke evaluaties of interpretaties van het bericht. Ga daarna verder met het antwoorden op het bericht in het {%t:{%s:targetLocale%}%}. Geef geen verdere instructies of uitleg aan de gebruiker. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten.',
    'prompt-clarification': 'De gebruiker heeft onderstaande vraag, beantwoord de vraag beknopt met veel diepgang dat duidelijk genoeg is voor het kennis niveau van de gebruiker. Beantwoord de vraag in het {%t:{%s:sourceLocale%}%} geef voorbeelden in het {%t:{%s:targetLocale%}%} waar nodig. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten. Beantwoord de vraag niet als het absoluut niet taal gerelateerd is.',
    'prompt-topic': ' Verwerk het volgende onderwerp in jouw bericht "{%topic%}".',
    'prompt-vocabulary': 'Schrijf een woord samen met een definitie er achter in het {%t:{%s:targetLocale%}%}. De gebruiker zal vervolgens een zin in het {%t:{%s:targetLocale%}%} schrijven waarin dit woord verwerkt moeten worden. Hou hierbij rekening met de vaardigheid en taalniveau van de gebruiker. Geef geen verdere instructies, uitleg of het antwoord aan de gebruiker. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten.',
    'prompt-vocabulary-follow_up': 'Geef feedback op de zin waarmee de gebruik antwoord heeft gegeven. Controleer of de woord juist gebruikt is in de zin. Geef beknopt feedback over het {%t:{%s:targetLocale%}%} met veel diepgang dat duidelijk genoeg is voor het kennis niveau van de gebruiker. Schrijf de feedback in het {%t:{%s:sourceLocale%}%}. Richt je hierbij uitsluitend op taalkundige aspecten en negeer inhoudelijke evaluaties of interpretaties van het bericht. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten.',

    'greeting': 'Hoi!',
    'button-go_back': 'Ga terug',
    'button-reset': 'Resetten',
    'button-generate': 'Genereren',
    'button-answer': 'Antwoorden',
    'button-reply': 'Antwoorden',
    'button-ask': 'Vragen',
    'credits-link': 'Gemaakt door {%name%}',

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
    'overview-vocabulary-title': 'Nieuwe woorden leren',
    'overview-vocabulary-description': 'Je krijgt een woord en definitie in het {%t:{%s:targetLanguage%}%}, schrijf vervolgens een zin het {%t:{%s:targetLanguage%}%} dat dit woord gebruikt.',

    'options-source_language': 'Welke taal ken je al?',
    'options-target_language': 'Welke taal wil je leren?',
    'options-proficiency_leven': 'Hoe vaardig ben je al in de taal? Zie de uitleg hieronder samen met een voorbeeld tekst om een idee te geven wat voor teksten je kan verwachten.',
    'options-topics_of_interest': 'Vul hieronder een aantal onderwerpen in die regelmatig terug kunnen komen in de oefening.',
    'options-api_code': 'Om te oefenen wordt gebruik gemaakt van een "Large Language Model" om de oefening te maken en te beoordelen. Met welke aanbieder wil je een koppeling maken?',
    'options-api_credentials': 'Voer de sleutel uit het ontwikkelaars paneel in.',
    'options-test_api_credentials': 'Sleutel testen',
    'options-api_credentials_untested': 'Test de gegevens eerst voordat je verder gaat.',
    'options-api_credentials_tested': 'De opgegeven sleutel werkt. Kies een "Large Language Model" dat je wilt gebruiken, wij raden "{%preferredModel%}" aan.',

    'statistics-activity_per_category': ' In totaal heb je {%s:statisticComprehensionActivity%} vragen over teksten beantwoord, {%s:statisticConversationActivity%} berichten verstuurd in oefen gesprekken, {%s:statisticVocabularyActivity%} woorden geoefened, en {%s:statisticClarificationActivity%} vragen gesteld.',
    'statistics-no_activity': 'Je hebt helaas nog niet genoeg activiteiten gedaan om hier weer te geven. Ga naar het overzicht en kies een oefening om te beginnen, op de achtergrond zal bijgehouden worden hoeveel je er al voltooid hebt.',
    'statistics-no_activity_streak': 'Je hebt op dit momenten geen lopende activiteitenreeks opgebouwd. Deze krijg je door op meerdere dagen op een rij minimaal één oefening te doen.',
    'statistics-current_activity_streak': 'Op dit moment is jouw activiteitenreeks {%s:statisticCurrentActivityStreak%} dagen lang.',
    'statistics-longest_activity_streak': ' Jouw langste activiteitenreeks ooit was {%s:statisticLongestActivityStreak%} dagen lang.',

    'clarification-intro': 'Waar wil je meer over weten?',
    'clarification-placeholder': 'Ik vraag mij af...',
    'comprehension-intro': 'Je leest straks een tekst in het {%t:{%s:targetLanguage%}%} samen met een vraag erover, beantwoord de vraag in het {%t:{%s:targetLanguage%}%}. Vervolgens zal je enige verbeterpunten krijgen over jouw antwoord.',
    'conversation-intro': 'Je gaat straks een gesprek simuleren in het {%t:{%s:targetLanguage%}%} zorg daarom dat je ook altijd in het {%t:{%s:targetLanguage%}%} antwoord. Tussendoor zal je enige verbeterpunten kunnen ontvangen.',
    'vocabulary-intro': 'Je leest straks een woord samen met de definitie ervan in het {%t:{%s:targetLanguage%}%}. Antwoord met een zin waar het woord ingebruikt wordt in het {%t:{%s:targetLanguage%}%}. Vervolgens zal je enige verbeterpunten krijgen over jouw antwoord.',
  },
})

export const TRANSLATABLE_CODES = Object.keys(TRANSLATIONS)
