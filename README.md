# heartburn-checker
This app is developed with js framework vue and vuex, and css framework bulma.
Ironically I spent most of the time to figure out vue (first time user) instead of focusing on the design - which is the part that I am most interested in.
So bear with me, this is not beautiful.

Below I have presented the parts that need changes.

# Todo improvements: 
Style:
* Options buttons not selectable
* Next button not disabled when no answer is selected
* No loading bar below the Header

Html:
* Move template to separate file (have not found a solution for this in vue??) or index.html

JS: 
* Split into different Vue components: header, question and a next controller
* No going back functionality

Overall functionality: 
* The outcome does not show - it is correclty calculated tho.
* Add a server so that it can manage CORS and imports
* Run with npm so that vuex can use mapState and mapMutations etc
