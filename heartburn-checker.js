
// Set up state store
const store = new Vuex.Store({
    state: {
        patientScore: 0,
        questionNr: 0,
        outcomeNr: 0,
        leftButtonToggled: false,
        rightButtonToggled: false,
        answer: {
            score: 0,
            id: ''
        },
        outcome: {
            id: ''
        }
    },
    mutations: {
        next (state, indexOfNextQuestion) {
            if(indexOfNextQuestion) {
                state.questionNr = indexOfNextQuestion;
            }
            else {
                state.questionNr++;
            }

            //Reset states
            state.leftButtonToggled = false;
            state.rightButtonToggled = false;
                
        },
        back (state) {
            state.questionNr--;
        },

        setAnswer(state, answered) {
            state.answer.id = answered.id;
            state.answer.score = answered.score;
        },

        increasePatientScore (state, patientScore) {
            state.patientScore += patientScore;
        },

        setOutcome (state, outcome) {
            state.outcome.id = outcome.id;
        },

        // Toggle buttons should be improved
        toggleLeftButton (state) {
            state.leftButtonToggled = !state.leftButtonToggled;
            if(state.rightButtonToggled && state.leftButtonToggled) {
                state.rightButtonToggled = !state.leftButtonToggled;
            }
        },
        toggleRightButton (state) {
            state.rightButtonToggled = !state.rightButtonToggled;
            if(state.leftButtonToggled && state.rightButtonToggled) {
                state.leftButtonToggled = !state.rightButtonToggled;
            }
        }
    }
})


const heartburnApp = new Vue({
    el: '#heartburn-checker-app', // DOM element
    data: { 
        questions: [],
        outcomes: []
     },
     store,
     components: 'heartburn-questions',
    created () { // fetch data from json
        fetch('https://gist.githubusercontent.com/jakber/458d168c83ff8797219a1b8f7db1cfab/raw/e0161e2127ead0d65ffe98ffaa3386274cc2858c/heartburn.json')
        .then(response => response.json())
        .then(json => {
            this.questions = json.questions,
            this.outcomes = json.outcomes
        })
    }
});

// Component for the Questions
Vue.component('heartburn-questions', {
    props: {
    question: Array,
    outcome: Array,
    showQuestion: Boolean,
    buttonToggled: Boolean
    },
    template:
    '<div class="heartburn-question"><div v-if:showQuestion><span class="question">{{ question[questionNr].question_text }}</span></div>' + 
    '<span v-else>{{ outcome[outcomeNr].text }}</span>' +
    '<div class="buttons">'+
    '<span class="button is-selected" id="leftButton" v-on:click="toggleLeftButton()">{{ question[questionNr].answers[0].label}}</span>' +
    '<span class="button" id="rightButton" v-on:click="toggleRightButton()">{{ question[questionNr].answers[1].label}}</span>' +
    '<span class="button next" v-on:click="goNext()">Next</span></div>',
    methods: {

        toggleLeftButton() {
            store.commit('toggleLeftButton');
        },

        toggleRightButton() {
            store.commit('toggleRightButton');
        },
        next() {
            return store._mutations.next;
        },
        
        getAnswer() {
            this.answer.id = this.leftButtonToggled ? 
                this.question[this.questionNr].answers[0].id : 
                this.question[this.questionNr].answers[1].id;
            this.answer.score = this.leftButtonToggled ? 
                this.question[this.questionNr].answers[0].score : 
                this.question[this.questionNr].answers[1].score;
            
            store.commit('setAnswer', this.answer);
            store.commit('increasePatientScore', this.answer.score);
            
        },

        // room for improvement
        getOutcome() {
            this.showQuestion = false;
            const minimumScore = this.question[this.questionNr].next[0].max_score;
            const maximumScore = this.question[this.questionNr].next[1].max_score;
            this.outcome.id = this.patientScore <= minimumScore ? 
                this.question[this.questionNr].next[0].outcome :
                this.patientScore <= maximumScore && this.patientScore > minimumScore ? 
                this.question[this.questionNr].next[1].outcome :
                this.question[this.questionNr].next[2].outcome;
            store.commit('setOutcome', this.outcome);
        },
        
        goNext() {
            this.getAnswer();
            if(this.questionNr === 0) {
                const answered = this.question[0].next.find(item => item.answered === this.answer.id);
                const nextQuestion = this.question.find(item => item.id === answered.next_question);
                const indexOfNextQuestion = this.question.findIndex(item => item.id === nextQuestion.id);
                store.commit('next', indexOfNextQuestion);
            }
            else {
                if(this.question[this.questionNr].next.find(item => item.max_score) 
                    || this.question[this.questionNr].next.find(item => item.outcome)) {
                    this.getOutcome();
                    const outComeResult = this.question[this.questionNr].next.find(item => item.outcome === this.outcome.id);
                    console.log(this.showQuestion);
                    return;
                };
                store.commit('next');
            }
            this.buttonToggled = this.leftButtonToggled || this.rightButtonToggled;
        }
    },
    computed: {
        // Better solution: mapState

        answer() {
            return store.state.answer;
        },

        outcome() {
            return store.state.outcome;
        },

        leftButtonToggled () {
            return store.state.leftButtonToggled;
        },
        rightButtonToggled () {
            return store.state.rightButtonToggled;
        },

        questionNr () {
            return store.state.questionNr
        },

        outcomeNr () {
            return store.state.outcomeNr;
        },
        patientScore () {
            return store.state.patientScore
        }
    }

})
