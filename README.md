# Toaln

*Toaln* is a simple language learning app which utilises the power of Large Language Models to practise.

Try the app out at [https://redkenrok.github.io/webapp-toaln/index.html](https://redkenrok.github.io/webapp-toaln/index.html). In order to use it you do need to specify an API key. You can use either an Anthropic or OpenAI key.

## Running

In order to build and use the app you need to have `Node.JS` installed. You can then run `bash run_install.sh` and after that `bash run_develop.sh`. It will then tell you which port on localhost to go to in your browser to load the app.

## Translations

The Dutch and English translations are written and checked by [myself](https://github.com/redkenrok/). However the Danish and German translations are translated by computer and I do not feel confident enough in my proficiency to make verify its accuracy. If you are a native or professional speaker I would like to hear about any mistakes in the translations so it can be improved.

## Made with

- *[staark](https://github.com/doars/staark/tree/main/packages/staark#readme)* a teensy-tiny library for for building web apps.
- *[vroagn](https://github.com/doars/staark/tree/main/packages/vroagn#readme)* a teensy-tiny library for managing network requests.

## Future ideas

- Add an interactive narrative story where the LLM and user go back and forth adding parts to the story.

## Scrapped ideas

| Idea                                                                                                                                                               | Reason                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Generate a word and definition and the user has to write down an antonym or synonym.                                                                               | Too short and relies on the fact that the user already knows the antonym or synonym.         |
| Generate a paragraph and the user has to fill in a missing sentence in between.                                                                                    | User will probably draw a blank on what to respond.                                          |
| Generate a sentence with a mistake the user has to correct them.                                                                                                   | Nice role reversal, but the user might just not simply know enough to point out the mistake. |
| Generate a word and definition and the user has to play a game of word association where they answer with a thematically similar word and definition of their own. | Already have a similar option for practising vocabulary. Perhaps this can be added later.    |