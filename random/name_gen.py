#!/usr/bin/python3

def main():
    noun_in = open("noun-in.txt", "r")
    noun_out = open("noun-output.txt", "w")
    noun_out.write("[\n")
    ni = list(noun_in)
    for i in range(len(ni)):
        l = ni[i]
        if len(l) > 9 or l.find("-") != -1 or l.find(" ") != -1:
            continue
        else:
            noun_out.write("\""+l[:len(l) - 1].lower() + "\"" + ("," if i < len(ni) - 1 else "") + "\n")
    noun_out.write("]")

    adj_in = open("adj-in.txt", "r")
    adj_out = open("adj-output.txt", "w")
    adj_out.write("[\n")
    ai = list(adj_in)
    for i in range(len(ai)):
        l = ai[i]
        if len(l) > 9 or l.find("-") != -1 or l.find(" ") != -1:
            continue
        else:
            adj_out.write("\""+l[:len(l) - 1].lower() + "\"" + ("," if i < len(ai) - 1 else "") + "\n")
    adj_out.write("]")


main()
