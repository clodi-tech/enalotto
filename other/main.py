import json
import statistics

HISTORY_FILE = 'history.csv'
STATS_FILE = 'stats.json'
COMBO_FILE = 'combo.csv'
PLAY_FILE = 'play.csv'

def get_winning():
    # ask the user to enter the winning combination
    combo = input('>>> enter the winning combination: ')

    # open the history file
    with open(HISTORY_FILE, 'a+') as f:
        # write the combination to the history
        if combo:
            f.write(f'{combo}\n')
        # get the last combination from the history
        else:
            f.seek(0)
            combo = f.readlines()[-1]

    return combo

def verify(combo):
    with open(PLAY_FILE, 'r') as f:
        # convert each line into a list of integers
        plays = [list(map(int, play.split(','))) for play in f.readlines()]

    # init matches
    matches = {i: 0 for i in range(1, 7)}

    for play in plays:
        # count the number of matching numbers
        match_count = len(set(play) & set(combo))

        # increment if there is a match
        if match_count > 0:
            matches[match_count] += 1

    return {k: v for k, v in matches.items() if v > 0}

def reset_stats(max):
    # init stats
    stats = {
        'count': {i: 0 for i in range(1, max + 1)},
        'delay': {i: 0 for i in range(1, max + 1)},
        'max': {'count': 0, 'delay': 0},
        'min': {'count': 0, 'delay': 0},
        'avg': {'count': 0, 'delay': 0},
        'median': {'count': 0, 'delay': 0},
        'mode': {'count': 0, 'delay': 0},
    }

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

    # update count and delay stats
    for key in ['count', 'delay']:
        stats['max'][key] = max(stats[key].values())
        stats['min'][key] = min(stats[key].values())
        stats['avg'][key] = statistics.mean(stats[key].values())
        stats['median'][key] = statistics.median(stats[key].values())
        stats['mode'][key] = statistics.mode(stats[key].values())

    print('\n>>  stats:', json.dumps(stats, indent=4))

    with open(STATS_FILE, 'w') as f:
        json.dump(stats, f)

def main():
    # get the last winning combination
    win_combo = [int(number) for number in get_winning().split(',')]
    print(f'>   winning combination: {win_combo}')

    # verify if the winning combination has been played
    verification = verify(win_combo)

    # print the matches else no matches
    print('\n>>  matches:' if verification else '\n>>  no matches')
    print('\n'.join(f'>   {v} matches for {k}' for k, v in verification.items()) if verification else '')

    # update statistics
    update_stats(win_combo)

# reset stats for x numbers
# reset_stats(10)

# run main function
main()