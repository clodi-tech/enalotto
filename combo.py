# generate all possible combinations of six numbers from 1 to 90
# one combination cannot have the same number
# write the combination in a csv file

import csv

def main():
    with open('combo.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        for i in range(1, 86):
            for j in range(i + 1, 87):
                for k in range(j + 1, 88):
                    for l in range(k + 1, 89):
                        for m in range(l + 1, 90):
                            for n in range(m + 1, 91):
                                writer.writerow([i, j, k, l, m, n])

main()