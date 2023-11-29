HISTORY_FILE = 'history.csv'
STATS_FILE = 'stats.csv'
COMBO_FILE = 'combo.csv'

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

def main():
    # get the last winning combination
    win_combo = get_winning()
    print(f'>   winning combination: {win_combo}')

main()