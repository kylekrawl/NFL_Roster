var PlayersController = function () {

    var loading = true; //Start the spinner
    var conversionDict = {
        teamName: {
            ARI: 'Arizona Cardinals',
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
            GB: 'Green Bay Packers',
            HOO: 'Houston Oilers',
            HOU: 'Houston Texans',
            IND: 'Indianapolis Colts',
            JAC: 'Jacksonville Jaguars',
            KC: 'Kansas City Chiefs',
            LAC: 'Los Angeles Chargers',
            LAI: 'Los Angeles Raiders',
            LAR: 'Los Angeles Rams',
            MIA: 'Miami Dolphins',
            MIN: 'Minnesota Vikings',
            NE: 'New England Patriots',
            NO: 'New Orleans Saints',
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
            WAS: 'Washington Redskins',
            FA: 'Free Agent',
            DRF: 'Unsigned'
        },
        position: {
            QB: 'Quarterback',
            RB: 'Running Back',
            FB: 'Fullback',
            WR: 'Wide Receiver',
            TE: 'Tight End',
            OL: 'Offensive Lineman',
            C: 'Center',
            G: 'Guard',
            LG: 'Left Guard',
            RG: 'Right Guard',
            T: 'Tackle',
            LT: 'Left Tackle',
            RT: 'Right Tackle',
            K: 'Kicker',
            KR: 'Kick Returner',
            DL: 'Defensive Lineman',
            DE: 'Defensive End',
            DT: 'Defensive Tackle',
            NT: 'Nose Tackle',
            LB: 'Linebacker',
            ILB: 'Inside Linebacker',
            OLB: 'Outside Linebacker',
            MLB: 'Middle Linebacker',
            DB: 'Defensive Back',
            CB: 'Cornerback',
            FS: 'Free Safety',
            SS: 'Strong Safety',
            S: 'Safety',
            P: 'Punter',
            PR: 'Punt Returner'
        }
    }
    var playersService = new PlayersService(ready);

    function ready(service) {
        loading = false; //stop the spinner
        //Now that all of our player data is back we can safely setup our bindings for the rest of the view.
        updateAvailablePlayers(service.getCurrentPlayerPage())
        updateTeamSelect(service.getTeams())
        updatePositionSelect(service.getPositions())
    }

    this.add = function add(id) {
        playersService.addToUserTeam(id)
        playersService.setPlayerPages()
        updateAvailablePlayers(playersService.getCurrentPlayerPage())
        updateUserTeam(playersService.getUserTeam())
        console.log('All Players: ', playersService.getAvailablePlayers())
        console.log('Filtered Players: ', playersService.getFilteredPlayers())
        console.log('User Team: ', playersService.getUserTeam())
    }

    this.remove = function remove(id) {
        playersService.removeFromUserTeam(id)
        playersService.setPlayerPages()
        updateAvailablePlayers(playersService.getCurrentPlayerPage())
        updateUserTeam(playersService.getUserTeam())
        console.log('All Players: ', playersService.getAvailablePlayers())
        console.log('Filtered Players: ', playersService.getFilteredPlayers())
        console.log('User Team: ', playersService.getUserTeam())
    }

    this.setCurrentPlayerPage = function setCurrentPlayerPage(mode) {
        var currentPageIndex = playersService.getCurrentPlayerPageIndex()
        if (mode === 'first') {
            playersService.setCurrentPlayerPageIndex(0)
        }
        if (mode === 'next') {
            if (currentPageIndex >= playersService.getPlayerPages().length - 1) {
                playersService.setCurrentPlayerPageIndex(0)
            } else {
                playersService.setCurrentPlayerPageIndex(currentPageIndex + 1)
            }
        }
        if (mode === 'prev') {
            if (currentPageIndex <= 0) {
                playersService.setCurrentPlayerPageIndex(playersService.getPlayerPages().length - 1)
            } else {
                playersService.setCurrentPlayerPageIndex(currentPageIndex - 1)
            }
        }
        updateAvailablePlayers(playersService.getCurrentPlayerPage())
    }

    this.filterAvailablePlayers = function filterAvailablePlayers() {
        var fieldData = {
            firstName: {
                id: 'first-name',
                value: '',
                type: 'input'
            },
            lastName: {
                id: 'last-name',
                value: '',
                type: 'input'
            },
            teamName: {
                id: 'team-name',
                value: '',
                type: 'select'
            },
            position: {
                id: 'position',
                value: '',
                type: 'select'
            }
        }
        for (var field in fieldData) {
            var elem = document.getElementById(fieldData[field].id)
            console.log(elem)
            if (fieldData[field].type === 'input') {
                var val = elem.value
            }
            if (fieldData[field].type === 'select') {
                var val = elem.options[elem.selectedIndex].value
            }
            if (val) {
                fieldData[field].value = val
            } else {
                delete fieldData[field]
            }
        }
        console.log(fieldData)
        playersService.filterPlayers(fieldData)
        playersService.setPlayerPages()
        updateAvailablePlayers(playersService.getCurrentPlayerPage())
    }

    function updateTeamSelect(list) {
        var elem = document.getElementById('team-select')
        elem.innerHTML = ''
        var template = `<select id="team-name" type="text" name="team-name">
                            <option value='' selected>Team Name</option>`
        for (var i in list) {
            var teamName = list[i]
            console.log(teamName)
            template += `<option value="${teamName}">${conversionDict.teamName[teamName]}</option>`
        }
        template += `</select>`
        elem.innerHTML = template
    }

    function updatePositionSelect(list) {
        var elem = document.getElementById('position-select')
        elem.innerHTML = ''
        var template = `<select id="position" type="text" name="position">
                            <option value='' selected>Position</option>`
        for (var i in list) {
            var position = list[i]
            console.log(position)
            template += `<option value="${position}">${conversionDict.position[position]}</option>`
        }
        template += `</select>`
        elem.innerHTML = template
    }

    function updateAvailablePlayers(list) {
        var elem = document.getElementById('available-players')
        elem.innerHTML = ''
        var template = ''
        for (var i in list) {
            var player = list[i];
            var team = !(conversionDict.teamName[player.teamName] === undefined) ?
                conversionDict.teamName[player.teamName] : player.teamName
            template += `
                <div class="col-sm-4 text-center flex v-center h-center">
                    <div class="player-wrapper">
                        <img class="player-image" src="${player.imagePath}">
                        <h3>${player.firstName} ${player.lastName}</h3>
                        <p>${team}</p>
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

    function updateUserTeam(list) {
        var elem = document.getElementById('user-team')
        elem.innerHTML = ''
        var template = ''
        for (var i in list) {
            var player = list[i];
            var team = !(conversionDict.teamName[player.teamName] === undefined) ?
                conversionDict.teamName[player.teamName] : player.teamName
            template += `
                <div class="col-sm-4 text-center flex v-center h-center">
                    <div class="player-wrapper">
                        <img class="player-image" src="${player.imagePath}">
                        <h3>${player.firstName} ${player.lastName}</h3>
                        <p>${team}</p>
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