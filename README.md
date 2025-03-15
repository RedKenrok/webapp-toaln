# Toaln

*Toaln* is a simple language learning app which utilises the power of Large Language Models to practise.

Try the app out at [https://redkenrok.github.io/webapp-toaln/index.html](https://redkenrok.github.io/webapp-toaln/index.html). In order to use it you do need to specify an API key. You can use either an Anthropic or OpenAI key.

## Running

In order to build and use the app you need to have `Node.JS` installed. You can then run `bash run_install.sh` and after that `bash run_develop.sh`. It will then tell you which port on localhost to go to in your browser to load the app. Be sure to navigate to `localhost:<port>/develop.html` to view the not yet minified development version.

## Made with

- *[staark](https://github.com/doars/staark/tree/main/packages/staark#readme)* a teensy-tiny library for for building web apps.
- *[vroagn](https://github.com/doars/staark/tree/main/packages/vroagn#readme)* a teensy-tiny library for managing network requests.

## Future ideas

- Split translations up in separate CSV files so not all are added into the JS bundle.
- Add a screen for translate a text from one language into another language.
- Allow the LLM to generate a text based on an input where every paragraph in the target language is followed by the same paragraph in the source language.
- Have any more suggestions? Feel free to create a pull request.

## Scrapped ideas

| Idea                                                                                                                                                               | Reason                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Generate a word and definition and the user has to write down an antonym or synonym.                                                                               | Too short and relies on the fact that the user already knows the antonym or synonym.         |
| Generate a paragraph and the user has to fill in a missing sentence in between.                                                                                    | User will probably draw a blank on what to respond.                                          |
| Generate a sentence with a mistake the user has to correct them.                                                                                                   | Nice role reversal, but the user might just not simply know enough to point out the mistake. |
| Generate a word and definition and the user has to play a game of word association where they answer with a thematically similar word and definition of their own. | Already have a similar option for practising vocabulary. Perhaps this can be added later.    |
