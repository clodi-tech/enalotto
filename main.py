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

def reset_stats(max):
    stats = {}

    # build layers
    stats['count'] = {'max': 0, 'min': 0, 'avg': 0, 'median': 0, 'mode': 0}
    stats['delay'] = {'max': 0, 'min': 0, 'avg': 0, 'median': 0, 'mode': 0}

    # init to 0 for all numbers
    for i in range(1, max + 1):
        stats['count'][i] = 0
        stats['delay'][i] = 0

    # write the stats to the file
    with open(STATS_FILE, 'w') as f:
        json.dump(stats, f)

def update_stats(combo):
    with open(STATS_FILE, 'r') as f:
        stats = json.load(f)

    # convert keys to int and increase delay
    for key in ['count', 'delay']:
        stats[key] = {int(k): (v+1 if key == 'delay' and int(k) not in combo else v) for k, v in stats[key].items()}

    # increment the count and reset the delay
    for number in combo:
        stats['count'][number] += 1
        stats['delay'][number] = 0

    print('\n>>  stats:', json.dumps(stats, indent=4))

    with open(STATS_FILE, 'w') as f:
        json.dump(stats, f)

def main():
    # get the last winning combination
    win_combo = get_winning()
    win_combo = [int(number) for number in win_combo.split(',')]
    print(f'>   winning combination: {win_combo}')

    # verify if the winning combination has been played
    verification = verify(win_combo)

    # print the matches else no matches
    if verification:
        print('\n>>  matches:')
        for k, v in verification.items():
            print(f'>   {v} matches for {k}')
    else:
        print('\n>>  no matches')

    # update statistics
    update_stats(win_combo)

# reset stats for x numbers
# reset_stats(10)

# run main function
main()