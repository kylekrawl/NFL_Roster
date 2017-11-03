var PlayersService = function (callback) {
    var playersData = [];
    var userTeam = [];
    var service = this

    this.getAvailablePlayers = function getAvailablePlayers() {
        return JSON.parse(JSON.stringify(playersData))
    }

    this.getUserTeam = function getUserTeam() {
        return JSON.parse(JSON.stringify(userTeam))
    }

    this.getTeams = function getTeams() {
        var out = []
        for (i in playersData) {
            var player = playersData[i]
            if (!out.includes(player.teamName)) {
                out.push(player.teamName)
            }
        }
        return JSON.parse(JSON.stringify(out))
    }

    this.getPlayersByTeam = function getPlayersByTeam(teamName) {
        return playersData.filter(function (player) {
            if (player.teamName === teamName) {
                return true;
            }
        });
    }

    this.getPlayersByPosition = function getPlayersByPosition(position) {
        return playersData.filter(function (player) {
            if (player.position === position) {
                return true;
            }
        });
    }

    this.getPlayersByFirstName = function getPlayersByFirstName(firstName) {
        return playersData.filter(function (player) {
            if (player.firstName === firstName) {
                return true;
            }
        });
    }

    this.getPlayersByLastName = function getPlayersByLastName(lastName) {
        return playersData.filter(function (player) {
            if (player.lastName === lastName) {
                return true;
            }
        });
    }

    this.addToUserTeam = function (id) {
        for (i in playersData) {
            var player = playersData[i]
            if (player.id === id && !userTeam.includes(player)) {
                userTeam.push(player)
                playersData.splice(playersData.indexOf(player), 1)
                break
            }
        }
        console.log(userTeam)
    }

    this.removeFromUserTeam = function (id) {
        for (i in userTeam) {
            var player = userTeam[i]
            if (player.id === id) {
                playersData.push(player)
                userTeam.splice(userTeam.indexOf(player), 1)
                break
            }
        }
        console.log(userTeam)
    }

    function loadPlayersData() {

        //Lets check the localstorage for the data before making the call.
        //Ideally if a user has already used your site 
        //we can cut down on the load time by saving and pulling from localstorage 

        var localData = localStorage.getItem('playersData');
        if (localData) {
            playersData = JSON.parse(localData);
            console.log('player data: ', playersData)
            return callback(service) 
            // Have to pass service instance to callback or service will 
            // be inaccessible when loading from localStorage (not yet instantiated)
            //return will short-circuit the loadPlayersData function
            //this will prevent the code below from ever executing
        }

        var url = "https://bcw-getter.herokuapp.com/?url=";
        var endpointUri = "http://api.cbssports.com/fantasy/players/list?version=3.0&SPORT=football&response_format=json";
        var apiUrl = url + encodeURIComponent(endpointUri);

        $.getJSON(apiUrl, function (data) {
            //playersData = data.body.players

            playersData = data.body.players.slice(0, 30).map(function (player) {
                return {
                    firstName: player.firstname,
                    lastName: player.lastname,
                    teamName: player.pro_team,
                    position: player.position,
                    imagePath: player.photo,
                    id: player.id
                }
            });

            console.log('Player Data Ready')
            console.log('Writing Player Data to localStorage')
            localStorage.setItem('playersData', JSON.stringify(playersData))
            console.log('Finished Writing Player Data to localStorage')
            console.log('player data: ', playersData)
            callback(service)
        });
    }
    loadPlayersData(); //call the function above every time we create a new service
}