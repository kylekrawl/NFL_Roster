var PlayersController = function () {

    var loading = true; //Start the spinner
    var conversionDict = {
        teamName: {
            ARZ: 'Arizona Cardinals',
            ATL: 'Atlanta Falcons',
            BAC: 'Baltimore Colts',
            BAL: 'Baltimore Ravens',
            BOB: 'Boston Braves',
            BOR: 'Boston Redskins',
            BOS: 'Boston Patriots',
            BUF: 'Buffalo Bills',
            CAR: 'Carolina Panthers',
            CHC: 'Chicago Cardinals',
            CHI: 'Chicago Bears',
            CHS: 'Chicago Staleys',
            CIN: 'Cincinnati Bengals',
            CLE: 'Cleveland Browns',
            CLR: 'Cleveland Rams',
            DAL: 'Dallas Cowboys',
            DAT: 'Dallas Texans',
            DEC: 'Decatur Staleys',
            DEN: 'Denver Broncos',
            DET: 'Detroit Lions',
            GBY: 'Green Bay Packers',
            HOO: 'Houston Oilers',
            HOU: 'Houston Texans',
            IND: 'Indianapolis Colts',
            JAC: 'Jacksonville Jaguars',
            KCY: 'Kansas City Chiefs',
            LAC: 'Los Angeles Chargers',
            LAI: 'Los Angeles Raiders',
            LAM: 'Los Angeles Rams',
            MIA: 'Miami Dolphins',
            MIN: 'Minnesota Vikings',
            NWE: 'New England Patriots',
            NOR: 'New Orleans Saints',
            NYG: 'New York Giants',
            NYJ: 'New York Jets',
            NYT: 'New York Titans',
            OAK: 'Oakland Raiders',
            PHI: 'Philadelphia Eagles',
            PHX: 'Phoenix Cardinals',
            PIP: 'Pittsburgh Pirates',
            PIT: 'Pittsburgh Steelers',
            POR: 'Portsmouth Spartans',
            SDO: 'San Diego Chargers',
            SEA: 'Seattle Seahawks',
            SF: 'San Francisco 49ers',
            SLC: 'St. Louis Cardinals',
            STL: 'St. Louis Rams',
            TB: 'Tampa Bay Buccaneers',
            TEN: 'Tennessee Titans',
            TNO: 'Tennessee Oilers',
            WAS: 'Washington Redskins'
        },
        position: {
            QB: 'Quarterback',
            RB:	'Running Back',
            FB:	'Fullback',
            WR:	'Wide Receiver',
            TE:	'Tight End',
            OL:	'Offensive Lineman',
            C:	'Center',
            G:	'Guard',
            LG:	'Left Guard',
            RG:	'Right Guard',
            T:	'Tackle',
            LT:	'Left Tackle',
            RT:	'Right Tackle',
            K:	'Kicker',
            KR:	'Kick Returner',
            DL:	'Defensive Lineman',
            DE:	'Defensive End',
            DT:	'Defensive Tackle',
            NT:	'Nose Tackle',
            LB:	'Linebacker',
            ILB: 'Inside Linebacker',
            OLB: 'Outside Linebacker',
            MLB: 'Middle Linebacker',
            DB:	'Defensive Back',
            CB:	'Cornerback',
            FS:	'Free Safety',
            SS:	'Strong Safety',
            S:	'Safety',
            P:	'Punter',
            PR:	'Punt Returner'
        }
    }
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
              <div class="col-sm-4 text-center">
                <div class="player-wrapper">
                    <img src="${player.imagePath}">
                    <h3>${player.firstName} ${player.lastName}</h3>
                    <p>${conversionDict.teamName[player.teamName]}</p>
                    <p>${conversionDict.position[player.position]}</p>
                    <div>
                        <button class="btn-success" id="${player.id}" onclick="app.controllers.playersController.add('${player.id}')">Add to Team</button>
                    </div>
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
              <div class="col-sm-4 text-center">
                <div class="player-wrapper">
                    <img src="${player.imagePath}">
                    <h3>${player.firstName} ${player.lastName}</h3>
                    <p>${conversionDict.teamName[player.teamName]}</p>
                    <p>${conversionDict.position[player.position]}</p>
                    <div>
                        <button class="btn-danger" id="${player.id}" onclick="app.controllers.playersController.remove('${player.id}')">Remove from Team</button>
                    </div>
                  </div>
              </div>
              `
            elem.innerHTML = template
        }

    }

}