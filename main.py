import json

HISTORY_FILE = 'history.csv'
STATS_FILE = 'stats.json'
COMBO_FILE = 'combo.csv'
PLAY_FILE = 'play.csv'

def get_winning():
    # ask the user to enter the winning combination
    combo = input('>>> enter the winning combination: ')

    # if the user press enter
    if combo == '':
        # get the last combination from the history
        with open(HISTORY_FILE, 'r') as f:
            combo = f.readlines()[-1]

    else:
        # else write the combination to the history
        with open(HISTORY_FILE, 'a') as f:
            f.write(f'{combo}\n')

    return combo

def verify(combo):
    with open(PLAY_FILE, 'r') as f:
        plays = f.readlines()

    # init matches counter from 1 to 6
    matches = {i: 0 for i in range(1, 7)}

    # convert combo to numbers
    combo = [int(number) for number in combo.split(',')]

    for play in plays:
        # convert play to numbers
        play = [int(number) for number in play.split(',')]

        this = 0
        # count the number of matches
        for p in play:
            if p in combo:
                this += 1

        # increment the counter
        if this > 0:
            matches[this] += 1

    return {k: v for k, v in matches.items() if v > 0}

def main():
    # get the last winning combination
    win_combo = get_winning()
    print(f'>   winning combination: {win_combo}')

    # verify if the winning combination has been played
    verification = verify(win_combo)

    # print the matches else no matches
    if verification:
        print('>>  matches:')
        for k, v in verification.items():
            print(f'>   {v} matches for {k}')
    else:
        print('>>  no matches')

    # get the stats from the file
    with open(STATS_FILE, 'r') as f:
        stats = json.load(f)
        print(f'\n>>  stats: {stats}')

main()