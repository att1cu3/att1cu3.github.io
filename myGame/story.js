/* global game phaser game_state */

game_state.story = function() {};

game_state.story.prototype={

    preload: function(){

    },


    create: function(){

    },


    update: function(){
    
    }
};
game.state.add('story', game_state.story);
game.state.start('story');