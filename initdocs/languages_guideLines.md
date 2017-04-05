# BeLL Apps languages_guideLines.md

## About
BeLL Apps is offering multi-Lingual interface. For this purpose, it uses some documents that consist of **KEYS** that represent the literals against which we are going to provide their corresponding _translations_ in the form of **VALUES**. This document intends to provide guidelines to make legal changes in order to make fruitful additions in any particular language file.

##Guidelines
To successfully update any particular language's document located in [BeLL-Apps/init_docs](https://github.com/open-learning-exchange/BeLL-Apps/tree/dev/init_docs) follow the below mentioned guidelines.

[Textjson]: https://github.com/open-learning-exchange/BeLL-Apps/tree/dev/init_docs/Text.json
[CrowdinUrl]: https://crowdin.com/project/open-learning-exchange
[CrowdinBranch]: https://github.com/open-learning-exchange/BeLL-Apps/tree/l10n_dev

> Recently [Crowdin][CrowdinUrl] integration has been done so you only need to update one source file [BeLL-Apps/init_docs/Text.json][Textjson]. 

> Other language translation are done through [Crowdin][CrowdinUrl] 
> and synced with the code repository [l10n_dev][CrowdinBranch] 
> which will be placed under [BeLL-Apps/init_docs/languages](https://github.com/open-learning-exchange/BeLL-Apps/tree/l10n_dev/init_docs/languages) folder.

** It is important to follow the below mentioned guidelines for source file ** [Text.json][Textjson] ** and it also need to be retained on translated files.**

1) All of the keys and corresponding values (translations) are going to be surrounded by inverted commas.
     ![Use Commas](../images/pic1.png)

2) Make sure that each key and value pair is separated by a colon.
     ![Use Colon](../images/pic2.png)

3) Watch out for the commas.
     ![Watch Out for Commas](../images/pic3.png)

4) In order, to separate more than one records, again use single comma.
     ![Use Comma](../images/pic4.png)

5) While updating the document for language, please make sure that the nameOfLanguage attribute is not written in any native/local language. We assume that the **nameOfLanguage** attribute is always going to be in **English**
     ![nameOfLanguage Attribute](../images/pic5.png)

6) Also, keep the numbers to be in Cardinal form used in English. Avoid changing numbers in particular language's native style.
      ![Use Cardinal Numbers](../images/pic6.png)

7) In case of replacement of literals please make sure that you only replace the translations and don't change the formatting otherwise, it will result in an illegal JSON object.

8) Don't miss the brackets. If there is one opening then their ought to be one ending as well as soon as the scope that object ends.
      ![Watch Out for Brackets](../images/pic7.png)

9) Make sure that there is a **directionOfLang** attribute in the language document you are about to add in Languages database. Its value can either be **Left** or **Right**. If a language is read from
left-to-right then  it should be like **"directionOfLang" : "Left"** and if it is read from right-to-left then it should be like **"directionOfLang" : "Right"**. We follow the convention that the words "left" and "right" are always going to be in *English* for every document to serve as direction indicator.
       ![Watch Out for directionOfLang](../images/pic9.png)

10) The name of the language in its native language should also be provided as a value of attribute *nameInNativeLang*. For example **"nameInNativeLang":"العربية"** for Arabic document.

*Note that in order to verify your json document, please visit this link [json validator](https://jsonformatter.curiousconcept.com/)*
