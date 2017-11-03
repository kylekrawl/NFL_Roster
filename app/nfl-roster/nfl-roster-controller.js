var PlayersController = function () {

    var loading = true; //Start the spinner
    var playersService = new PlayersService(ready);

    function ready(service) {
        loading = false; //stop the spinner
        //Now that all of our player data is back we can safely setup our bindings for the rest of the view.
        console.log('players service: ', service)

        updateAvailablePlayers(service.getFilteredPlayers())

        /*
        $('some-button').on('click',function(){
          var teamSF = playerService.getPlayersByTeam("SF");
        }
        /*/

    }

    this.add = function add(id) {
        playersService.addToUserTeam(id)
        updateAvailablePlayers(playersService.getFilteredPlayers())
        updateUserTeam(playersService.getUserTeam())
        console.log('all players: ', playersService.getAvailablePlayers())
        console.log('filtered players: ', playersService.getFilteredPlayers())
        console.log('user team: ', playersService.getUserTeam())
    }

    this.remove = function remove(id) {
        playersService.removeFromUserTeam(id)
        updateAvailablePlayers(playersService.getFilteredPlayers())
        updateUserTeam(playersService.getUserTeam())
        console.log('all players: ', playersService.getAvailablePlayers())
        console.log('filtered players: ', playersService.getFilteredPlayers())
        console.log('user team: ', playersService.getUserTeam())
    }

    this.filterAvailablePlayers = function filterAvailablePlayers() {
        var fieldData = {
            firstName: {
                id: 'first-name',
                value: ''
            },
            lastName: {
                id: 'last-name',
                value: ''
            },
            teamName: {
                id: 'team-name',
                value: ''
            },
            position: {
                id: 'position',
                value: ''
            }
        }
        for (var field in fieldData) {
            console.log(fieldData[field].id)
            var val = document.getElementById(fieldData[field].id).value
            if (val) {
                fieldData[field].value = val
            } else {
                delete fieldData[field]
            }
        }
        console.log(fieldData)
        playersService.filterPlayers(fieldData)
        updateAvailablePlayers(playersService.getFilteredPlayers())
    }

    // fxn update available players display

    function updateAvailablePlayers(list) {
        var elem = document.getElementById('available-players')
        elem.innerHTML = ''
        var template = ''
        for (var i in list) {
            var player = list[i];
            template += `
          <div class="col-sm-3 text-center">
            <img src="${player.imagePath}">
            <h3>${player.firstName} ${player.lastName}</h3>
            <p>${player.teamName}</p>
            <p>${player.position}</p>
              <div>
                <button class="btn-success" id="${player.id}" onclick="app.controllers.playersController.add('${player.id}')">Add to Team</button>
              </div>
          </div>
          `
            elem.innerHTML = template
        }

    }

    // fxn update player roster

    function updateUserTeam(list) {
        var elem = document.getElementById('user-team')
        elem.innerHTML = ''
        var template = ''
        for (var i in list) {
            var player = list[i];
            template += `
          <div class="col-sm-3 text-center">
            <img src="${player.imagePath}">
            <h3>${player.firstName} ${player.lastName}</h3>
            <p>${player.teamName}</p>
            <p>${player.position}</p>
              <div>
                <button class="btn-danger" id="${player.id}" onclick="app.controllers.playersController.remove('${player.id}')">Remove from Team</button>
              </div>
          </div>
          `
            elem.innerHTML = template
        }

    }

}