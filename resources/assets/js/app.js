
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

    const app = new Vue({
        el: '#main',

        data: {
                updates,
                game,
                pendingUpdate: {
                    minute: '',
                    type: '',
                    description: ''
                }
        },

        methods: {
            updateGame(event) {
                event.preventDefault();
                axios.post(`/games/${this.game.id}`, this.pendingUpdate)
                    .then(response => {
                        console.log(response);
                        this.updates.unshift(response.data);
                        this.pendingUpdate = {};
                    });
            },

            updateScore() {
                const data = {
                    first_team_score: this.game.first_team_score,
                    second_team_score: this.game.second_team_score,
                };
                axios.post(`/games/${this.game.id}/score`, data)
                    .then(response => {
                        console.log(response)
                    });
            },

            updateFirstTeamScore(event) {
                this.game.first_team_score = event.target.innerText;
                this.updateScore();
            },

            updateSecondTeamScore(event) {
                this.game.second_team_score = event.target.innerText;
                this.updateScore();
            }
        }
    });

        window.Pusher = require('pusher-js');
    Pusher.logToConsole = true;

    const pusher = new Pusher(process.env.MIX_PUSHER_APP_KEY, {
        cluster: process.env.MIX_PUSHER_APP_CLUSTER
    });

    pusher.subscribe(`game-updates-${app.game.id}`)
        .bind('event', (data) => {
            app.updates.unshift(data);
        })
        .bind('score', (data) => {
            app.game.first_team_score = data.first_team_score;
            app.game.second_team_score = data.second_team_score;
        });