# 1. enter the last combination of numbers, from 1 to 90, separated by commas
def enter_last_combo():
    print('1.\n>> enter last combo: 1,2,3,4,5,6\n>> press enter to continue')
    last_combo = input()

    if last_combo == '':
        with open('python/history.csv', 'r') as f:
            # read last line
            last_combo = f.readlines()[-1]
            print('last combo from file: ' + last_combo)
    else:
        # split by comma
        last_combo = last_combo.split(',')

        # check if there are 6 numbers between 1 and 90
        if len(last_combo) != 6:
            print('error: six numbers required')
            return

        for i in last_combo:
            if int(i) < 1 or int(i) > 90:
                print('error: numbers must be between 1 and 90')
                return

        with open('python/history.csv', 'a') as f:
            # write as a new line
            last_combo = last_combo[0] + ',' + last_combo[1] + ',' + last_combo[2] + ',' + last_combo[3] + ',' + last_combo[4] + ',' + last_combo[5]
            f.write(last_combo + '\n')

    return last_combo

def main():

    enter_last_combo()
    print('\n2. calculate best weights')
    print('\n3. build stats')
    print('\n4. assign scores to single numbers with weights')
    print('\n5. assign scores to combos')
    print('\n6. rank combos')

main()