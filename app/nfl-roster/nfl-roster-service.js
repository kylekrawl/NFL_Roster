var PlayersService = function (callback) {
    var playersData = [];
    var filteredPlayers = [];
    var playerPages = [];
    var currentPlayerPageIndex = [];
    var userTeam = [];
    var service = this

    this.getAvailablePlayers = function getAvailablePlayers() {
        return JSON.parse(JSON.stringify(playersData))
    }

    this.getFilteredPlayers = function getFilteredPlayers() {
        return JSON.parse(JSON.stringify(filteredPlayers))
    }

    this.getUserTeam = function getUserTeam() {
        return JSON.parse(JSON.stringify(userTeam))
    }

    this.getTeams = function getTeams() {
        var out = []
        for (var i in playersData) {
            var player = playersData[i]
            if (!out.includes(player.teamName)) {
                out.push(player.teamName)
            }
        }
        return JSON.parse(JSON.stringify(out))
    }
 
    getPlayersByProp = function getPlayersByLastName(list, prop, propValue) {
        return list.filter(function (player) {
            if (player[prop].toLowerCase() === propValue.toLowerCase()) {
                return true;
            }
        });
    }

    this.filterPlayers = function filterPlayers(fieldData) {
        filteredPlayers = JSON.parse(JSON.stringify(playersData))
        for (var i in playersData) {
            var player = playersData[i]
            for (var field in fieldData) {
                filteredPlayers = getPlayersByProp(filteredPlayers, field, fieldData[field].value)
            }
        }
        console.log('Filtered Players: ', filteredPlayers)
    }

    this.addToUserTeam = function (id) {
        for (var i in playerPages[currentPlayerPageIndex]) {
            var player = playerPages[currentPlayerPageIndex][i]
            if (player.id === id && !userTeam.includes(player)) {
                userTeam.push(player)
                break
            }
        }
        console.log(userTeam)
    }

    this.removeFromUserTeam = function (id) {
        for (var i in userTeam) {
            var player = userTeam[i]
            if (player.id === id) {
                userTeam.splice(userTeam.indexOf(player), 1)
                break
            }
        }
        console.log(userTeam)
    }

    function preFilterPlayersData() {
        //Filter out team objects:
        for (var i = 0; i < playersData.length; i++) {
            var player = playersData[i]
            if (!player.firstName) {
                playersData.splice(i, 1)
                i-- //decrement i to account for removed item
            }
        }
    }

   this.setPlayerPages = function setPlayerPages(playersPerPage=30) {
        playerPages = []
        for (var i = 0; i < filteredPlayers.length; i+=playersPerPage) {
            var endIndex = i + playersPerPage
            playerPages.push(filteredPlayers.slice(i, i + playersPerPage))
        }
        console.log('Pages: ', playerPages)
    }

    this.getPlayerPages = function getPlayerPages() {
        return JSON.parse(JSON.stringify(playerPages))
    }

    this.getCurrentPlayerPageIndex = function getCurrentPlayerPageIndex() {
        return JSON.parse(JSON.stringify(currentPlayerPageIndex))
    }

    this.setCurrentPlayerPageIndex = function setCurrentPlayerPageIndex(i=0) {
        currentPlayerPageIndex = i
        console.log('page index set to ', i)
    }

    this.getCurrentPlayerPage = function getCurrentPlayerPage() {
        console.log(currentPlayerPageIndex)
        console.log(playerPages[currentPlayerPageIndex])
        return JSON.parse(JSON.stringify(playerPages[currentPlayerPageIndex]))
    }

    function loadPlayersData() {

        //Lets check the localstorage for the data before making the call.
        //Ideally if a user has already used your site 
        //we can cut down on the load time by saving and pulling from localstorage 

        var localData = localStorage.getItem('playersData');
        if (localData) {
            playersData = JSON.parse(localData);
            preFilterPlayersData()
            filteredPlayers = playersData;
            service.setPlayerPages()
            service.setCurrentPlayerPageIndex()
            console.log('Player Data: ', playersData)
            return callback(service)

            //Have to pass service instance to callback or service will 
            //be inaccessible when loading from localStorage

            //return will short-circuit the loadPlayersData function
            //this will prevent the code below from ever executing
        }

        var url = "https://bcw-getter.herokuapp.com/?url=";
        var endpointUri = "http://api.cbssports.com/fantasy/players/list?version=3.0&SPORT=football&response_format=json";
        var apiUrl = url + encodeURIComponent(endpointUri);

        $.getJSON(apiUrl, function (data) {
            playersData = data.body.players.map(function (player) {
                return {
                    firstName: player.firstname,
                    lastName: player.lastname,
                    teamName: player.pro_team,
                    position: player.position,
                    imagePath: player.photo,
                    id: player.id
                }
            });
            preFilterPlayersData()
            console.log('Player Data Ready')
            console.log('Writing Player Data to localStorage')
            localStorage.setItem('playersData', JSON.stringify(playersData))
            console.log('Finished Writing Player Data to localStorage')
            console.log('Player Data: ', playersData)
            filteredPlayers = JSON.parse(JSON.stringify(playersData));
            service.setPlayerPages()
            service.setCurrentPlayerPageIndex()
            callback(service)
        });
    }
    loadPlayersData(); //call the function above every time we create a new service
}